<template>
    <div class="panel">
        <panel-title title="日志查看"></panel-title>
        <div class="panel-body">
            <el-row>
                <el-form :model="searchForm" :inline="true">
                        <el-form-item label="关键字">
                            <el-input v-model="searchForm.keyword" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="操作人">
                            <user-select v-model="searchForm.user"></user-select>
                        </el-form-item>
                        <el-form-item label="日志类别">
                            <el-select v-model="searchForm.type">
                                <el-option v-for="item in typeOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="search()">确定</el-button>
                        <el-button type="primary" icon="el-icon-delete" @click="reset()">重置</el-button>
                </el-form>
            </el-row>
            <el-row>
                <el-table :data="logList" v-if="logShow" border fit highlight-current-row>
                    <el-table-column prop="create_time" label="操作时间" width="150px"> </el-table-column>
                    <el-table-column prop="operator" label="操作人" width="150px"> </el-table-column>
                    <el-table-column label="操作内容">
                        <template slot-scope="scope">
                            <el-tag type="warning" size="small">{{transferAction(scope.row.action)}}</el-tag> 了 <el-tag size="small">{{transferType(scope.row.type)}}</el-tag> {{scope.row.content}}
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
            </el-row>
        </div>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import panelTitle from '@/components/panelTitle'
    import bottomToolBar from '@/components/bottomToolBar'
    import * as http from '@/http'
    import api from '@/api'
    import checkRole from '@/assets/js/checkRole'
    import userSelect from '@/components/userSelect'
    import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                searchForm: {
                    keyword: '',
                    user: '',
                    type: ''
                },
                logList: [],
                typeOptions: [{
                    value: 'userprofile',
                    label: '用户'
                }, {
                    value: 'jobs',
                    label: '岗位'
                }, {
                    value: 'category',
                    label: '知识库类别'
                }, {
                    value: 'article',
                    label: '知识库文章'
                }],
                logShow: true,
                page: {
                    index: 1,
                    size: 10,
                    total: 100
                }
            }
        },
        components: {
            panelTitle,
            bottomToolBar,
            userSelect
        },
        computed: {
            ...mapGetters(['userRole'])
        },
        methods: {
            search() {
                this.getLogs()
            },
            reset() {
                this.searchForm = {
                    keyword: '',
                    user: '',
                    type: ''
                }
            },
            getLogs() {
                let skip = (this.page.index - 1) * this.page.size
                this.searchForm.limit = this.page.size
                this.searchForm.offset = skip
                http.fetch(api.logs, this.searchForm).then(res => {
                    this.logList = res.data
                    this.page.total = res.totalCount
                })
            },
            handleCurrentChange: function (val) {
                this.page.index = val
                this.getLogs()
            },
            handleSizeChange(val) {
                this.page.size = val
                this.getLogs()
            },
            transferType(name) {
                switch (name) {
                    case 'userprofile':
                        return '用户'
                    case 'jobs':
                        return '岗位'
                    case 'category':
                        return '知识库类别'
                    case 'article':
                        return '知识库文章'
                    default :
                        return '未知'
                }
            },
            transferAction(name) {
                switch (name) {
                    case 'create':
                        return '创建'
                    case 'modify':
                        return '修改'
                    case 'delete':
                        return '删除'
                    case 'agree':
                        return '通过发布'
                    case 'disagree':
                        return '驳回发布'
                    default :
                        return '未知'
                }
            }
        },
        created() {
            if (checkRole.check(this.userRole, ['superadmin'])) {
                this.getLogs()
            } else {
                this.$router.push({'path': '/404'})
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

</style>
