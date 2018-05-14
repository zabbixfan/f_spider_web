<template>
    <div class="panel" style="padding:10px">
        <panel-title title="知识管理">
            <el-button @click="toCreate" type="success"  v-if="actionShow()" size="small">添加文章</el-button>
        </panel-title>
        <div class="panel-body">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item  label="关键字">
                    <el-input size=18 v-model="formInline.keyword" placeholder="标题或者内容"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                        <category-select v-model="formInline.category"></category-select>
                </el-form-item>
                <el-form-item label="作者">
                        <el-select v-model="formInline.author" placeholder="请选择" >
                        <el-option
                            v-for="item in authors"
                            :key="item.id"
                            :label="item.user_name"
                            :value="item.id">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否对外">
                    <el-select v-model="formInline.is_public"  placeholder="默认全部">
                        <el-option label="否" value=0></el-option>
                        <el-option label="是" value=1></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-select v-model="formInline.is_active"  placeholder="默认全部">
                        <el-option label="否" value=0 key=0></el-option>
                        <el-option label="是" value=1 key=1></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间范围">
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
                <el-form-item label="状态" v-if="show_all">
                    <el-select v-model="formInline.status" placeholder="默认全部" :disabled="!show_all">
                    <el-option label="待发布" value="1"></el-option>
                    <el-option label="已发布" value="2"></el-option>
                    <el-option label="驳回" value="0"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getArticles">查询</el-button>
                    <el-button type="primary" @click="clearSearchData">重置</el-button>
                </el-form-item>
            </el-form>
            <el-tabs v-model="activeName" @tab-click="handleClickTab">
                <el-tab-pane label="全部列表" name="second">
                    <el-table :data="tableData" 
                                stripe 
                                @row-click="ViewArticle" 
                                v-loading="tableLoading"
                                element-loading-text="数据加载中">
                        <el-table-column  prop="title" label="标题" min-width="100px"></el-table-column>
                        <el-table-column prop="category" label="分类"></el-table-column>
                        <el-table-column prop="author" label="作者" :width="tableWidth"></el-table-column>
                        <el-table-column label="状态" sortable :width="tableWidth">
                            <template slot-scope="scope" >
                                <article-status-tag :value="scope.row.status"></article-status-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="is_public" label="是否对外" sortable :width="tableWidth"> 
                            <template slot-scope="scope" >
                                <el-tag type="success" close-transition v-if="scope.row.is_public === true">对外</el-tag>
                                <el-tag close-transitfion v-else>对内</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="is_active" label="是否启用" sortable :width="tableWidth"> 
                            <template slot-scope="scope" >
                                <el-tag type="success" close-transition v-if="scope.row.is_active === true">启用</el-tag>
                                <el-tag close-transition v-else>禁用</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="创建时间" min-width="80px"></el-table-column>
                        <el-table-column label="操作" v-if="actionShow()" min-width="30px">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="handleCommand([scope.row.id,'update_article'])">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="pagination-right"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.index"
                        :page-sizes="[1,10, 15, 25, 50]"
                        :page-size="page.size"
                        layout="total, sizes, prev, pager, next"
                        :total="page.total">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="待审核列表" name="first">
                    <el-table :data="tableData" 
                                stripe 
                                @row-click="ViewArticle" 
                                v-loading="tableLoading"
                                element-loading-text="数据加载中">
                        <el-table-column  prop="title" label="标题" min-width="100px"></el-table-column>
                        <el-table-column prop="category" label="分类"></el-table-column>
                        <el-table-column prop="author" label="作者" :width="tableWidth"></el-table-column>
                        <el-table-column label="状态" :width="tableWidth" sortable>
                            <template slot-scope="scope" >
                                <article-status-tag :value="scope.row.status"></article-status-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="is_public" label="是否对外" :width="tableWidth" sortable> 
                            <template slot-scope="scope" >
                                <el-tag type="success" close-transition v-if="scope.row.is_public === true">对外</el-tag>
                                <el-tag close-transitfion v-else>对内</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="is_active" label="是否启用" :width="tableWidth" sortable> 
                            <template slot-scope="scope" >
                                <el-tag type="success" close-transition v-if="scope.row.is_active === true">启用</el-tag>
                                <el-tag close-transition v-else>禁用</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="创建时间" min-width="80px"></el-table-column>
                        <el-table-column label="操作" v-if="actionShow()" min-width="30px">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="handleCommand([scope.row.id,'update_article'])">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="pagination-right"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.index"
                        :page-sizes="[1,10, 15, 25, 50]"
                        :page-size="page.size"
                        layout="total, sizes, prev, pager, next"
                        :total="page.total">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import panelTitle from '@/components/panelTitle'
    import bottomToolBar from '@/components/bottomToolBar'
    import categorySelect from '@/components/categorySelect'
    import checkRole from '@/assets/js/checkRole'
    import api from '@/api'
    import * as http from '@/http'
    import articleStatusTag from '@/components/articleStatusTag'
    import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                authors: [],
                tableWidth: '100px',
                page: {
                    index: 1,
                    size: 10,
                    total: 0
                },
                formInline: {
                    title: '',
                    category: '',
                    author: '',
                    is_public: '',
                    is_active: '',
                    keyword: '',
                    rangeDate: ''
                },
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
                    },
                tableData: [],
                activeName: 'first',
                show_all: false,
                tableLoading: true
            }
        },
        components: {
            panelTitle,
            bottomToolBar,
            categorySelect,
            articleStatusTag
        },
        computed: {
            ...mapGetters(['userRole'])
        },
        methods: {
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
            searchForm() {
                for (var key in this.formInline) {
                    if (this.formInline[key]) {
                        return true
                    }
                }
                return false
            },
            ViewArticle(row, event, column) {
                if (column.property) {
                    this.$router.push('/article/' + row.id)
                }
            },
            handleCommand(command) {
                switch (command[1]) {
                    case 'view_article':
                        this.$router.push('/article/' + command[0])
                        break
                    case 'update_article':
                        this.$router.push('/article/update/' + command[0])
                        break
                }
            },
            getArticles() {
                let skip = (this.page.index - 1) * this.page.size
                let searchData = {}
                if (this.searchForm()) {
                    searchData = Object.assign(searchData, this.formInline)
                }
                if (this.searchForm()) {
                    searchData = this.formInline
                    searchData.limit = this.page.size
                    searchData.offset = skip
                } else {
                    searchData = {
                        'limit': this.page.size,
                        'offset': skip
                    }
                }
                if (this.activeName === 'first') {
                    searchData.status = '1'
                }
                http.fetch(api.getArticleList, searchData).then(res => {
                    this.tableLoading = false
                    this.tableData = res.data
                    this.page.total = res.total
                })
            },
            getUsers() {
                http.fetch(api.users).then(res => {
                    this.authors = res.data
                })
            },
            clearSearchData() {
                this.formInline = {
                    title: '',
                    category: '',
                    author: '',
                    is_public: '',
                    is_active: '',
                    keyword: '',
                    rangeDate: '',
                    status: ''
                }
            },
            toCreate() {
                // 跳转到文章添加页
                this.$router.push('/article/create')
            },
            actionShow() {
                if (this.userRole.length === 1 && this.userRole.indexOf('auditor') > -1) {
                    return false
                } else {
                    return true
                }
            },
            handleClickTab(tab, event) {
                this.clearSearchData()
                this.tableLoading = true
                if (this.activeName === 'second') {
                    this.show_all = true
                } else {
                    this.show_all = false
                }
                this.getArticles()
            }
        },
        created() {
            if (checkRole.check(this.userRole, ['superadmin', 'admin', 'auditor'])) {
                if (this.userRole.indexOf('auditor') === -1) {
                    this.activeName = 'second'
                    this.show_all = true
                }
                this.getArticles()
            } else {
                this.$router.push({'path': '/404'})
            }
            this.getUsers()
        }
    }
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
