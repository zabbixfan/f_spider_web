<template>
<div>
    <div class="panel" style="padding:10px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="当前版本" name="first">
                <panel-title :title="article.category.name">
                    <article-status-tag :value="article.status"></article-status-tag>
                    <el-tag type="success" v-if="article.is_public === true">对外</el-tag>
                    <el-tag type="danger" v-else>对内</el-tag>
                    <el-tag type="success" v-if="article.is_active === true">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </panel-title>
                <div class="panel-body">
                    <el-row style="padding-left:80px;padding-right:80px;">
                        <el-col :span="24">
                            <div class="grid-content " style="text-align:center">
                                <h3>{{article.title}}</h3>
                            </div>
                        </el-col>
                        <el-col :span="24" style="text-align:center;color:#A8A8A8">
                            <div class="grid-content">
                                作者:{{article.author.name}}  创建时间:{{article.create_time | dateFrm}} 更新:{{article.update_time | dateFrm}}
                            </div>
                            
                        </el-col>
                        <el-col :span="24" style="font-size:15px">
                            <div class="grid-content" v-html="article.content">
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <panel-title title="附件"></panel-title>
                <div class="panel-body">
                <el-row style="padding-left:50px;padding-right:50px;">
                    <el-col style="text-align:left;" v-for="file in article.attachment" :key="file.name">
                            <div class="grid-content">
                                <a :href="file.url">
                                    <img  style="height:40px" target="_blank" v-lazy="'/static/txt.png'" alt="">
                                    {{file.name}}
                                </a>
                            </div>
                            <div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已发布版本" name="second">
                <div v-if="previous_show">
                    <panel-title :title="previous_article.category.name">
                        <article-status-tag :value="previous_article.status"></article-status-tag>
                        <el-tag type="success" v-if="previous_article.is_public === true">对外</el-tag>
                        <el-tag type="danger" v-else>对内</el-tag>
                        <el-tag type="success" v-if="previous_article.is_active === true">启用</el-tag>
                        <el-tag type="danger" v-else>禁用</el-tag>
                    </panel-title>
                    <div class="panel-body">
                        <el-row style="padding-left:80px;padding-right:80px;">
                            <el-col :span="24">
                                <div class="grid-content " style="text-align:center">
                                    <h3>{{previous_article.title}}</h3>
                                </div>
                            </el-col>
                            
                            <el-col :span="24" style="text-align:center;color:#A8A8A8">
                                <div class="grid-content">
                                    作者:{{previous_article.author.name}}  创建时间:{{previous_article.create_time | dateFrm}} 更新:{{previous_article.update_time | dateFrm}}
                                </div>
                            </el-col>
                            <el-col :span="24" style="font-size:15px">
                                <div class="grid-content" v-html="previous_article.content">
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <panel-title title="附件"></panel-title>
                    <div class="panel-body">
                    <el-row style="padding-left:50px;padding-right:50px;">
                        <el-col style="text-align:left;" v-for="file in previous_article.attachment" :key="file.name">
                                <div class="grid-content">
                                    <a :href="file.url">
                                        <img  style="height:40px" target="_blank" v-lazy="'/static/txt.png'" alt="">
                                        {{file.name}}
                                    </a>
                                </div>
                                <div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div v-else><p class="no_content">暂无数据</p></div>
            </el-tab-pane>
        </el-tabs>
    </div>

    <div class="panel" style="padding:10px">
        <panel-title title="审批信息---已审批文件这里显示建议评论回复"></panel-title>
        <div class="panel-body">
            <el-row style="padding-left:80px;padding-right:80px;">
                <div class="grid-content">
                <el-input
                    type="textarea"
                    placeholder="请输入审批意见"
                    v-model="article.is_checked_idea">
                    </el-input>
                </div>
           </el-row>
           <el-row style="padding-left:80px;padding-right:80px;" v-if="auditorShow()">
                <el-button type="success"  @click="checkAllow()">通过</el-button>
                <el-button type="danger"  @click="checkDeny()">不通过</el-button>
           </el-row>
           
        </div>

    </div>
</div>
</template>

<script>
    import panelTitle from '@/components/panelTitle'
    import bottomToolBar from '@/components/bottomToolBar'
    import articleStatusTag from '@/components/articleStatusTag'
    import api from '@/api'
    import * as http from '@/http'
    import moment from 'moment'
        import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                article: {
                    title: '',
                    category: {
                        id: '',
                        name: ''
                    },
                    author: '',
                    create_time: '',
                    content: '',
                    update_time: '',
                    attachment: [],
                    is_checked_idea: '',
                    is_public: false,
                    is_active: true,
                    status: 1
                },
                previous_article: {
                    title: '',
                    category: {
                        id: '',
                        name: ''
                    },
                    author: '',
                    create_time: '',
                    content: '',
                    update_time: '',
                    attachment: [],
                    is_checked_idea: '',
                    is_public: false,
                    is_active: true
                },
                activeName: 'first',
                id: this.$route.params.id,
                get_previous: true,
                previous_show: false
            }
        },
        filters: {
           dateFrm: function(el) {
               return moment(el).format('YYYY-MM-DD HH:mm:ss')
           }
        },
        computed: {
            ...mapGetters(['userRole', 'userLoginName'])
        },
        components: {
            panelTitle,
            bottomToolBar,
            articleStatusTag
        },
        methods: {
            checkAllow() {
                http.put(api.CheckArticle(this.id), { 'is_checked_idea': this.article.is_checked_idea, 'status': 2 }).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            showClose: true,
                            message: '审核通过',
                            type: 'success'
                        })
                        this.$router.push({'path': '/article'})
                    }
                })
            },
            checkDeny() {
                http.put(api.CheckArticle(this.id), { 'is_checked_idea': this.article.is_checked_idea, 'status': 0 }).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            showClose: true,
                            message: '拒绝发布成功',
                            type: 'warning'
                        })
                        this.$router.push({'path': '/article'})
                    }
                })
            },
            auditorShow() {
                var res = this.userRole.find((value, index, arr) => {
                if (value === 'auditor') {
                    if (this.article.status === 1) {
                        return true
                    } else {
                        return false
                    }
                } else {
                        return false
                    }
                })
                    return res
            },
            handleClick() {
                if (this.get_previous) {
                    this.get_previous = false
                    http.fetch(api.getPreviousArticleById(this.id)).then(res => {
                        if (res.data) {
                            this.previous_article = res.data
                            this.previous_show = true
                        }
                    })
                }
            }
         },
        created() {
            // console.log(this.id)
            http.fetch(api.getArticleDetail(this.id)).then(res => {
                    this.article = res
            })
        }
    }
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  
  .no_content {
      text-align: center;
      margin: 100px;
      color: #99a9bf;
      font-size: 25px
  }
</style>
