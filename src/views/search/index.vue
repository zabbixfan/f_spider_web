
<template>
<div>
    <el-row :gutter="20">
        
        <el-col :span="18">
            <div class="panel" style="padding:10px">
                <div class="panel-body">
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="3">
                                <el-button type="primary" plain icon="el-icon-edit" @click="dialogFormVisible = true" >增加条件</el-button>
                            </el-col>
                            <el-col :span="17" style="padding-left:20px;padding-bottom:25px">
                                    <el-input v-model="keyword"  placeholder="输入关键字进行全文检索" >
                                    </el-input>
                                    <el-tag
                                        type="success"
                                        :key="tag"
                                        v-for="tag in tags"
                                        closable
                                        :disable-transitions="false"
                                        @close="tagClose(tag)">
                                    {{tag}}
                                    </el-tag>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="primary" plain icon="el-icon-search" @click="searchMethod">搜一下</el-button>
                            </el-col>
                        </el-col>
                        <el-col>
                            
                        </el-col>
                        <el-col>
                             <hr style="height:1px;border:none;border-top:1px dashed #CCCCCC;"/>
                                <ul>
                                  <li :key="article.id" v-for="article in articles" style="padding-top:10px;padding-bottom:15px;border-bottom: solid 1px #CCCCCC;">
                                    <div>
                                        <span style="color:#605f5f"><a :href="'#/search/' +  article.id">{{article.title}}</a></span>
                                        <span style="color:green;float:right;font-size:14px">访问量:<b> {{article.page_view}}</b></span>
                                    </div>
                                    <div style="padding-top:10px; color:#5b5b5b; font-size:14px;font-family: 微软雅黑;line-height:22px">
                                        {{article.content | filterHtml}}
                                    </div>
                                    <div style="padding-top:10px; color:#5b5b5b; ">
                                        <el-tag type="success" close-transition size="small" >{{article.author}}</el-tag>
                                        <el-tag type="info" close-transition size="small" >{{article.category}}</el-tag>
                                        <el-tag close-transition size="small" >更新时间:{{article.update_time}}</el-tag>
                                    </div>
                                    
                                </li>
                                </ul>
                        </el-col>
                    </el-row>
                   <el-row style="float:right">
                <div class="block">
                    <el-pagination class="pagination-right"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="page.index"
                           :page-sizes="[1,10, 15, 25, 50]"
                           :page-size="page.size"
                           layout="total, sizes, prev, pager, next"
                           :total="page.total">
                    </el-pagination>
                </div>
            </el-row>
                </div>
            </div>
        </el-col>

        <el-col :span="6">
            <div class="panel" style="padding:5px">
                    <div class="panel-body">
                        <el-tree :data="categorytree" default-expand-all :props="defaultProps" @node-click="handleNodeClick" ></el-tree>
                    </div>
            </div>

            
        </el-col>
    </el-row>
<el-dialog title="多条件查询" :visible.sync="dialogFormVisible">
  <el-form :model="formInline">
    <el-form-item label="文章作者">
        <el-select v-model="formInline.author" placeholder="请选择">
            <el-option label="全部" value=''>全部</el-option>
            <el-option
                v-for="item in authors"
                :key="item.id"
                :label="item.user_name"
                :value="item.id">
                </el-option>
            </el-select>
    </el-form-item>
    <el-form-item label="创建时间">
        <div class="block">
            <el-date-picker
                v-model="formInline.rangeDate"
                type="datetimerange"
                :picker-options="pickerOptions2"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
            </el-date-picker>
        </div>

    </el-form-item>
    <el-form-item label="是否对外">
        <el-select v-model="formInline.is_public" placeholder="请选择">
            <el-option label="全部" value=''>全部</el-option>
            <el-option label="对外" value=1>对外</el-option>
            <el-option label="对内" value=0>对内</el-option>
            </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="info" @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="danger" @click="clearFilter">清除条件</el-button>
    <el-button type="primary" @click="filterSubmit">确 定</el-button>
  </div>
</el-dialog>
</div>

</template>

<script>
    import panelTitle from '@/components/panelTitle'
    import api from '@/api'
    import * as http from '@/http'
    export default {
        data() {
            return {
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
                keyword: '',
                dialogFormVisible: false,
                formLabelWidth: '120px',
                page: {
                    index: 1,
                    size: 10,
                    total: 0
                },
                formInline: {
                    author: '',
                    category: '',
                    rangeDate: '',
                    is_public: ''
                },
                has_attachment: false,
                activeName: 'first',
                articles: [],
                authors: [],
                tags: [
                    // { name: '标签二', type: 'success' }
                ],
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                        }
                    }]
                }
            }
        },
        methods: {
            handleNodeClick(data) {
                console.log(data)
                this.formInline.category = data.id
                this.getArticles()
                // this.selectId = data.id
                // if (data.id && this.createSubmit) {
                //     http.fetch(api.category(this.selectId)).then(res => {
                //         this.form = res.data
                //         this.categorySubmitDisable = false
                //     })
                // } else {
                //     this.categorySubmitDisable = true
                // }
            },
            loadCategoryTree() {
                http.fetch(api.categoryTree).then(res => {
                    this.categorytree[0].children = res.data
                })
            },
            tagClose(tag) {
                console.log(this.tags)
                console.log(tag)
                this.tags.splice(this.tags.indexOf(tag), 1)
                this.formInline.author = ''
                this.getArticles()
            },
            searchMethod() {
                this.getArticles()
                // if (this.searchForm()) {
                //     this.getArticles()
                // } else {
                //     return false
                // }
            },
            clearFilter() {
                this.tags = {}
                this.formInline = {}
            },
            filterSubmit() {
                console.log(this.rangeDate)
                console.log(this.is_public)
                this.dialogFormVisible = false
                if (this.searchForm()) {
                    // http.fetch(api.getUserDetail(this.formInline.author)).then(res => {
                    //     this.tags = [res.data.user_name]
                    // })
                    this.getArticles()
                } else {
                    return false
                }
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath)
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath)
            },
            handleClick(tab, event) {
                console.log(tab, event)
            },
            searchClick() {
                console.log('searchClick')
            },
            handleSizeChange(val) {
                this.page.size = val
                console.log(`每页 ${val} 条`)
                this.getArticles()
            },
            handleCurrentChange(val) {
                this.page.index = val
                console.log(`当前页: ${val}`)
                this.getArticles()
            },
            getUsers() {
                http.fetch(api.users).then(res => {
                    this.authors = res.data
                })
            },
            searchForm() {
                // console.log(this.formInline)
                this.formInline['keyword'] = this.keyword
                for (var key in this.formInline) {
                    if (this.formInline[key]) {
                        return true
                    }
                }
                return false
            },
            getArticles() {
                let skip = (this.page.index - 1) * this.page.size
                let searchData = {
                    'limit': this.page.size,
                    'offset': skip
                }
                if (this.searchForm()) {
                    searchData = Object.assign(searchData, this.formInline)
                }
                http.fetch(api.getSearchList, searchData).then(res => {
                    this.articles = res.data
                    this.page.total = res.total
                })
            }
        },
        components: {
            panelTitle
        },
        filters: {
            filterHtml: function (value) {
                if (!value) return ''

                var content = value.replace(/<[^>]*>|&nbsp/g, '')
                if (content.length > 250) {
                    return content.substr(0, 200) + ' ' + '.....'
                } else {
                    return content
                }
            }
        },
        created () {
            this.getArticles()
            this.getUsers()
            this.loadCategoryTree()
        }
    }
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
span a:link{
    text-decoration: none; color:#605f5f; font-family: 微软雅黑; font-weight: bold;
}
span a:visited{ color:#605f5f;}
span a:hover{text-decoration: underline;}
span a:active{text-decoration: blink; color: #605f5f;}
 .el-select .el-input {
    width: 500px;
  }
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
