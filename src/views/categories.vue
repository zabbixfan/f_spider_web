<template>
    <div class="panel">
        <panel-title title="知识库分类"></panel-title>
        <div class="panel-body">
            <el-row :gutter="20">
                <!-- <el-col :span="1"><div></div></el-col> -->
              <el-col :span="8">
                  <p class="title">知识库分类类别</p>
                  <el-tree :data="categorytree" :props="defaultProps" @node-click="handleNodeClick" accordion></el-tree>
              </el-col>
              <el-col :span="16">
                    <el-row class="create">
                            <el-button type="success" size="small" @click="createInit">新增分类</el-button>
                            <el-button type="success" size="small" @click="submitCategory('form')" :disabled="createSubmit">确定</el-button>
                            <el-button type="success" size="small" @click="createCancel" :disabled="createSubmit">取消</el-button>
                    </el-row>
                    <el-form :model="form" label-width="80px" :rules="rules" ref="form">
                        <el-row type="flex" :gutter="10">
                            <el-col :span="9">
                                <el-form-item label="分类名称" prop="name">
                                    <el-input v-model="form.name" placeholder=""></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否启用" prop="status">
                                    <el-select v-model="form.status" placeholder="">
                                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row type="flex" :gutter="10">
                            <el-col :span="9">
                                <el-form-item label="上级分类">
                                    <el-cascader
                                        expand-trigger="click"
                                        :options="categoryOptions"
                                        :props="defaultProps"
                                        :show-all-levels="false"
                                        v-model="form.path"
                                        :change-on-select="true"
                                        >
                                    </el-cascader>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="分类备注"><el-input v-model="form.remark"></el-input></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="9">
                                <el-form-item label="创建时间"><el-input v-model="form.create_time" :disabled="true"></el-input></el-form-item>                                
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="创建人员"><el-input v-model="form.creator" :disabled="true"></el-input></el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-row class="create">
                            <el-button type="primary" size="small" @click="submitVisible=true" :disabled="categorySubmitDisable">修改分类</el-button>
                            <el-button type="danger" size="small" @click="deleteVisible=true" :disabled="categorySubmitDisable">删除分类</el-button>
                    </el-row>
              </el-col>
            </el-row>
        </div>
        <el-dialog
            title="确认"
            :visible.sync="submitVisible"
            width="30%"
            @close="submitCancel()">
            <span>是否确认修改？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="submitCancel()">取 消</el-button>
                <el-button type="primary" @click="submitCategory('form')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="确认"
            :visible.sync="deleteVisible"
            width="30%"
            @close="submitCancel()">
            <span>是否确认删除？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="submitCancel()">取 消</el-button>
                <el-button type="primary" @click="deleteCategory()">确 定</el-button>
            </span>
        </el-dialog>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import panelTitle from '@/components/panelTitle'
    import bottomToolBar from '@/components/bottomToolBar'
    import checkRole from '@/assets/js/checkRole'
    import * as http from '@/http'
    import api from '@/api'
    import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                    categories: [],
                    categorytree: [{
                        name: '知识库总分类',
                        id: '',
                        children: []
                    }],
                    defaultProps: {
                        children: 'children',
                        label: 'name',
                        value: 'id'
                    },
                    form: {
                        name: '',
                        status: '',
                        path: []
                    },
                    rules: {
                        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
                        status: [{ required: true, message: '请选择是否启用', trigger: 'change' }]
                    },
                    categoryOptions: [],
                    statusOptions: [
                        {
                            value: true,
                            label: '是'
                        }, {
                            value: false,
                            label: '否'
                        }],
                    selectId: '',
                    createSubmit: true,
                    categorySubmitDisable: true,
                    submitVisible: false,
                    deleteVisible: false
                }
        },
        computed: {
            ...mapGetters(['userName', 'userRole'])
        },
        methods: {
            handleNodeClick(data) {
                this.selectId = data.id
                if (data.id && this.createSubmit) {
                    http.fetch(api.category(this.selectId)).then(res => {
                        this.form = res.data
                        this.categorySubmitDisable = false
                    })
                } else {
                    this.categorySubmitDisable = true
                }
            },
            loadCategoryTree() {
                http.fetch(api.categoryTree, {
                    show_all: 1
                }).then(res => {
                    this.categorytree[0].children = res.data
                    this.categoryOptions = res.data
                })
            },
            createInit() {
                this.createSubmit = false
                this.categorySubmitDisable = true
                let path = this.form.path
                if (this.selectId) {
                    path.push(this.selectId)
                }
                this.form = {
                    status: true,
                    create_time: this.getNowDate(),
                    creator: this.userName,
                    path: path
                }
            },
            createCancel() {
                this.createSubmit = true
                this.resetForm()
            },
            submitCancel() {
                this.submitVisible = false
                this.deleteVisible = false
                this.categorySubmitDisable = true
                this.resetForm()
            },
            submitCategory(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var requestBody = this.form
                        if (this.form.path.length > 0) {
                            requestBody.parent = this.form.path[this.form.path.length - 1]
                        }
                        if (!this.form.id) {
                            http.post(api.categories, requestBody).then(res => {
                                this.$message.success('添加成功')
                                this.loadCategoryTree()
                                this.resetForm()
                                this.createSubmit = true
                            })
                        } else {
                            this.submitVisible = false
                            http.put(api.category(this.form.id), requestBody).then(res => {
                                this.$message.success('修改成功')
                                this.loadCategoryTree()
                                this.resetForm()
                                this.createSubmit = true
                            })
                        }
                    } else {
                        this.submitVisible = false
                    }
                })
            },
            deleteCategory() {
                // console.log(this.form)
                if (this.form.id) {
                    this.submitVisible = false
                    http.del(api.category(this.form.id)).then(res => {
                        this.$message.success('删除成功')
                        this.loadCategoryTree()
                        this.resetForm()
                        this.createSubmit = true
                        this.deleteVisible = false
                    })
                }
            },
            getNowDate() {
                var date = new Date()
                var seperator1 = '-'
                var year = date.getFullYear()
                var month = date.getMonth() + 1
                var strDate = date.getDate()
                if (month >= 1 && month <= 9) {
                    month = '0' + month
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = '0' + strDate
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate
                return currentdate
            },
            resetForm() {
                this.form = {
                        name: '',
                        status: '',
                        path: []
                    }
            }
        },
        components: {
            panelTitle,
            bottomToolBar
        },
        created() {
            if (checkRole.check(this.userRole, ['superadmin', 'admin'])) {
                this.loadCategoryTree()
            } else {
                this.$router.push({'path': '/404'})
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .title {
        padding: 0 15px;
        color: #535351;
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
    }
    .create {
        margin-bottom: 10px;
    }
</style>
