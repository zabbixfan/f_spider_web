<template>
    <div class="panel">
        <panel-title title="用户管理"></panel-title>
        <div class="panel-body">
            <div class="table-container">
                <el-row  type="flex" justify="end">
                    <el-col :span="22"></el-col>
                    <el-col :span="2">
                        <el-button type="primary" size="small" @click="createUser()">创建用户</el-button>
                    </el-col>
                </el-row>
                <el-table :data="users">
                    <el-table-column label="用户" prop="user_name"></el-table-column>
                    <el-table-column label="所属岗位">
                        <template slot-scope="scope">
                            <el-tag type="primary">{{scope.row.job_name}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="邮箱地址" prop="email"></el-table-column>
                    <el-table-column label="创建时间" prop="date_joined"></el-table-column>
                    <el-table-column label="是否启动">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.is_active==true">{{transStatus(scope.row.is_active)}}</el-tag>
                            <el-tag type="danger" v-if="scope.row.is_active==false">{{transStatus(scope.row.is_active)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                             <el-button type="primary" size="small" icon="el-icon-edit" @click="editUser(scope.$index)">修改</el-button>
                             <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteUser(scope.row.id)">删除</el-button>                           
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="用户信息" :visible.sync="userVisible">
                    <el-form :model="UserForm" :label-width="formLabelWidth">
                        <el-form-item label="用户名称" v-if="userNameShow">
                            <el-col :span="12"><el-input v-model="UserForm.user_name" placeholder="请输入域账户(邮箱前缀)"></el-input></el-col>
                        </el-form-item>
                        <el-form-item label="对应岗位">
                            <el-select v-model="UserForm.job_name" placeholder="请选择" >
                                <el-option v-for="item in jobOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否启用" v-if="userStatusShow">
                            <el-switch
                            v-model="UserForm.is_active"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="启用"
                            inactive-text="禁用">
                            </el-switch>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="userVisible=false">取 消</el-button>
                        <el-button type="primary" @click="submitUser()">确 定</el-button>
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
    import checkRole from '@/assets/js/checkRole'
    import * as http from '@/http'
    import api from '@/api'
    import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                users: [],
                userVisible: false,
                formLabelWidth: '100px',
                UserForm: {
                    user_name: '',
                    job_name: '',
                    is_active: true
                },
                jobOptions: [],
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
            ...mapGetters(['userRole', 'userLoginName']),
            userNameShow() {
                if (this.UserForm.id) {
                    return false
                } else {
                    return true
                }
            },
            userStatusShow() {
                if (this.UserForm.id) {
                    return true
                } else {
                    return false
                }
            }
        },
        methods: {
            getUsers() {
                let skip = (this.page.index - 1) * this.page.size
                http.fetch(api.users, {
                    'limit': this.page.size,
                    'offset': skip
                }).then(res => {
                    this.users = res.data
                    this.page.total = res.totalCount
                })
            },
            getJobs() {
                http.fetch(api.jobs, {
                    'limit': 65535
                }).then(res => {
                    this.jobOptions = res.data.map(item => {
                        return { value: item.name, label: item.name }
                    })
                })
            },
            editUser(index) {
                this.UserForm = JSON.parse(JSON.stringify(this.users[index]))
                this.userVisible = true
            },
            transStatus(status) {
                switch (status) {
                    case true:
                        return '是'
                    case false:
                        return '否'
                }
            },
            deleteUser(id) {
                http.del(api.user(id)).then(res => {
                    this.getUsers()
                    this.$message.success('删除成功')
                })
            },
            createUser() {
                this.UserForm = {
                    user_name: '',
                    job_name: ''
                }
                this.userVisible = true
            },
            submitUser() {
                if (this.UserForm.id) {
                    http.put(api.user(this.UserForm.id), this.UserForm).then(res => {
                        this.userVisible = false
                        this.$message.success('修改成功')
                        this.getUsers()
                    })
                } else {
                    http.post(api.users, this.UserForm).then(res => {
                        this.userVisible = false
                        this.$message.success('添加成功')
                        this.getUsers()
                    })
                }
            },
            handleCurrentChange: function (val) {
                this.page.index = val
                this.getUsers()
            },
            handleSizeChange(val) {
                this.page.size = val
                this.getUsers()
            }
        },
        created() {
            if (checkRole.check(this.userRole, ['superadmin'])) {
                this.getJobs()
                this.getUsers()
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
</style>
