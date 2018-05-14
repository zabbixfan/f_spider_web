<template>
    <div class="panel">
        <panel-title title="岗位管理"></panel-title>
        <div class="panel-body">
            <div class="table-container">
                <el-row  type="flex" justify="end">
                    <el-col :span="20"></el-col>
                    <el-col :span="4">
                        <el-button type="primary" size="small" @click="createJob()">创建岗位</el-button>
                    </el-col>
                </el-row>
                <el-table :data="jobs">
                    <el-table-column label="岗位名称" prop="name"></el-table-column>
                    <el-table-column label="对应角色">
                        <template slot-scope="scope">
                            <el-tag class="role_tag" v-for="item of scope.row.role_name" :key="item"  :type="getTagClass(item)">{{transJob(item)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="create_time"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                             <el-button type="primary" size="small" icon="el-icon-edit" @click="editJob(scope.$index)">修改</el-button>
                             <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteJob(scope.row.id)">删除</el-button>                           
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="岗位信息" :visible.sync="jobVisible">
                    <el-form :model="editJobForm" :label-width="formLabelWidth">
                        <el-form-item label="岗位名称">
                            <el-col :span="12"><el-input v-model="editJobForm.name"></el-input></el-col>
                        </el-form-item>
                        <el-form-item label="对应角色">
                            <el-select v-model="editJobForm.role_name" placeholder="请选择" multiple >
                                <el-option v-for="item in jobOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="jobVisible=false">取 消</el-button>
                        <el-button type="primary" @click="submitJob()">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
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
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import panelTitle from '@/components/panelTitle'
    import bottomToolBar from '@/components/bottomToolBar'
    import * as http from '@/http'
    import checkRole from '@/assets/js/checkRole'
    import api from '@/api'
    import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                jobs: [],
                jobVisible: false,
                formLabelWidth: '100px',
                editJobForm: {
                    name: '',
                    role_name: [],
                    creator: ''
                },
                jobOptions: [{
                    value: 'admin',
                    label: '管理员'
                }, {
                    value: 'user',
                    label: '普通用户'
                }, {
                    value: 'auditor',
                    label: '审核员'
                }],
                page: {
                    index: 1,
                    size: 10,
                    total: 100
                }
            }
        },
        components: {
            panelTitle,
            bottomToolBar
        },
        computed: {
            ...mapGetters(['userRole', 'userLoginName'])
        },
        methods: {
            getJobs() {
                let skip = (this.page.index - 1) * this.page.size
                http.fetch(api.jobs, {
                    'limit': this.page.size,
                    'offset': skip
                }).then(res => {
                    this.jobs = res.data
                    this.page.total = res.totalCount
                })
            },
            editJob(index) {
                this.editJobForm = JSON.parse(JSON.stringify(this.jobs[index]))
                this.jobVisible = true
            },
            getTagClass(roleName) {
                switch (roleName) {
                    case 'admin':
                        return 'primary'
                    case 'superadmin':
                        return 'danger'
                    case 'user':
                        return 'success'
                    default:
                        return 'warning'
                }
            },
            transJob(name) {
                switch (name) {
                    case 'admin':
                        return '管理员'
                    case 'superadmin':
                        return '超级管理员'
                    case 'user':
                        return '普通用户'
                    case 'auditor':
                        return '审核员'
                    default:
                        return 'primary'
                }
            },
            deleteJob(id) {
                http.del(api.job(id)).then(res => {
                    this.getJobs()
                    this.$message.success('删除成功')
                })
            },
            createJob() {
                this.editJobForm = {
                    name: '',
                    role_name: [],
                    creator: ''
                }
                this.jobVisible = true
            },
            submitJob() {
                this.editJobForm.creator = this.userLoginName
                if (this.editJobForm.id) {
                    http.put(api.job(this.editJobForm.id), this.editJobForm).then(res => {
                        this.jobVisible = false
                        this.$message.success('修改成功')
                        this.getJobs()
                    })
                } else {
                    http.post(api.jobs, this.editJobForm).then(res => {
                        this.jobVisible = false
                        this.$message.success('添加成功')
                        this.getJobs()
                    })
                }
            },
            handleCurrentChange: function (val) {
                this.page.index = val
                this.getJobs()
            },
            handleSizeChange(val) {
                this.page.size = val
                this.getJobs()
            }
        },
        created() {
            if (checkRole.check(this.userRole, ['superadmin'])) {
                this.getJobs()
            } else {
                this.$router.push({'path': '/404'})
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .table-container {
        margin: 10px 0;
    }
    .pagination-right{
        padding: 10px 0px 0px;
        float: right;
    }
    .role_tag {
        margin-right: 5px
    }
</style>
