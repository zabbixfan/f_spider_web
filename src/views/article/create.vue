<template>
  
<div class="panel" style="padding:10px">
    <panel-title title="添加文章">
    </panel-title>
    <div class="panel-body">
         <el-row style="padding-left:20px;padding-right:120px;">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="文章标题"  prop="title">
                
                        <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
            
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <div>
                        <tinymce :height="300" v-model="form.content"></tinymce>
                    </div>
                </el-form-item>
                <el-form-item label="附件">
                    <el-col :span="8">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        :action="Host"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="form.attachment"
                        :beforeUpload="beforeAvatarUpload"
                        :on-success="handleSuccess"
                        :headers="headers"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary" >选取文件</el-button>
                         <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                        <div slot="tip" class="el-upload__tip">附件支持办公文档和压缩文件，大小不超过10M</div>
                        </el-upload>
                    </el-col>
            
                </el-form-item>
                <el-form-item label="文章分类">
                    <category-select v-model="form.category"></category-select>
                </el-form-item>
                <el-form-item label="文章可见度">
                    <el-switch
                    v-model="form.is_public"
                    active-text="外部"
                    inactive-text="内部">
                    </el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="buttonDisable" @click="saveContent('form')">创建文章</el-button>
                    <el-button @click="goToIndex()">返回</el-button> 
                </el-form-item>
            </el-form>
         </el-row>
    </div>
    <bottom-tool-bar></bottom-tool-bar>
</div>

</template>
<script>
    import panelTitle from '@/components/panelTitle'
    import bottomToolBar from '@/components/bottomToolBar'
    import { VueEditor } from 'vue2-quill-editor'
    import categorySelect from '@/components/categorySelect'
    import api from '@/api'
    import * as http from '@/http'
    import Tinymce from '@/components/Tinymce'
    export default {
        data() {
            return {
                Host: process.env.API_HOST + '/article/',
                buttonDisable: false,
                form: {
                    title: '',
                    content: '',
                    category: '',
                    is_active: true,
                    attachment: [],
                    is_publick: false,
                    is_checked_idea: ''
                },
                rules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'},
                        {min: 4, max: 128, message: '长度在 4 到 128 个字符', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '请输入内容', trigger: 'blur'},
                        {min: 4, message: '不能少于8个字符', trigger: 'blur'}
                    ],
                    category: [
                        {required: true, message: '请选择分类', trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {
            headers() {
                return {
                    'Authorization': this.$store.state.account.token
                }
            }
        },
        components: {
            panelTitle,
            bottomToolBar,
            VueEditor,
            categorySelect,
            Tinymce
        },
        methods: {
            saveContent(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$refs.upload.submit()
                        this.form.status = 1
                        this.form.is_checked_idea = ''
                        http.post(api.getArticleList, this.form).then(res => {
                            this.$message({
                                showClose: true,
                                duration: 15000,
                                message: '文章添加成功',
                                type: 'success'
                            })
                            this.$refs[formName].resetFields()
                        })
                    } else {
                        return false
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields()
            },
            submitUpload() {
                this.buttonDisable = true
                this.$refs.upload.submit()
            },
            handleRemove(file, fileList) {
                let formData = {
                    name: file.name,
                    article_id: this.id
                }
                http.post(api.deleteFile, formData).then(res => {
                    let atts = this.form.attachment
                    let newAtts = []
                    for (var index = 0; index < atts.length; index++) {
                        var att = atts[index]
                        if (att.name !== file.name) {
                            newAtts.push(att)
                        }
                    }
                    this.form.attachment = newAtts
                })
                // console.log(file, fileList)
            },
            handlePreview(file) {
                console.log(file)
            },
            handleSuccess(response) {
                if (response) {
                    this.form.attachment.push(response.data)
                    this.buttonDisable = false
                }
            },
            beforeAvatarUpload(file) {
                var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
                // const fileType = ['xls','xlsx','doc','docx','ppt','pptx','zip','tar','rar','txt']
                const extension = testmsg === 'xls'
                const extension2 = testmsg === 'xlsx'
                const extension3 = testmsg === 'doc'
                const extension4 = testmsg === 'docx'
                const extension5 = testmsg === 'ppt'
                const extension6 = testmsg === 'pptx'
                const extension7 = testmsg === 'zip'
                const extension8 = testmsg === 'tar'
                const extension9 = testmsg === 'rar'
                const extension10 = testmsg === 'txt'
                const isLt2M = file.size / 1024 / 1024 < 10
                if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8 && !extension9 && !extension10) {
                    this.$message({
                        message: '上传文件只能是(xlsx,xls,doc,docx,ppt,pptx,zip,tar)!',
                        type: 'warning'
                    })
                }
                if (!isLt2M) {
                    this.$message({
                        message: '上传文件大小不能超过 10MB!',
                        type: 'warning'
                    })
                }
                return extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8 || extension9 || extension10 && isLt2M
            },
            goToIndex() {
                this.$router.push({'path': '/article'})
            }
        }
    }
</script>
<style scoped>
    .vue-editor {
        white-space: normal!important;
    }
</style>
