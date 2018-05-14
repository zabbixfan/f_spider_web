<template>
<div>
    <div class="panel" style="padding:10px">
        <panel-title :title="category.name">
            <el-tag type="success">访问量: {{page_view}}</el-tag>
        </panel-title>
        <div class="panel-body">
            <el-row style="padding-left:80px;padding-right:80px;">
                <el-col :span="24">
                    <div class="grid-content " style="text-align:center; color:#787878">
                        <h3>{{title}}</h3>
                    </div>
                </el-col>
                
                <el-col :span="24" style="text-align:center;color:#A8A8A8">
                    <div class="grid-content">
                        作者:{{author.name}}  创建时间:{{create_time | dateFrm}} 更新:{{update_time | dateFrm}}
                    </div>
                    
                </el-col>
                <el-col :span="24" style="font-size:18px;color:#787878;line-height:30px">
                    <div class="grid-content" v-html="content">
                    </div>
                </el-col>
            </el-row>
            
        </div>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
    <div class="panel" style="padding:10px">
        <panel-title title="附件"></panel-title>
        <div class="panel-body">
           <el-row style="padding-left:50px;padding-right:50px;">
               <el-col style="text-align:left;" v-for="file in attachment" :key="file.name">
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
 </div>
</template>

<script>
    import panelTitle from '@/components/panelTitle'
    import bottomToolBar from '@/components/bottomToolBar'
    import api from '@/api'
    import * as http from '@/http'
    import moment from 'moment'
        import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                id: this.$route.params.id,
                title: '',
                category_id: '',
                category: {
                    id: '',
                    name: ''
                },
                author: '',
                create_time: '',
                content: '',
                page_view: '',
                update_time: '',
                attachment: [],
                is_checked: false,
                is_public: false
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
            bottomToolBar
        },
        methods: {
            checkAllow() {
                http.put(api.CheckArticle(this.id), { 'is_checked_idea': this.is_checked_idea, 'is_checked': true }).then(res => {
                    console.log(res.status)
                    if (res.status === 200) {
                        this.$message({
                            showClose: true,
                            duration: 15000,
                            message: '审核通过',
                            type: 'success'
                        })
                    }
                })
            },
            checkDeny() {
                http.put(api.CheckArticle(this.id), { 'is_checked_idea': this.is_checked_idea, 'is_checked': false }).then(res => {
                    console.log(res.status)
                    if (res.status === 200) {
                        this.$message({
                            showClose: true,
                            duration: 15000,
                            message: '拒绝发布成功',
                            type: 'warning'
                        })
                    }
                })
            },
            auditorShow() {
                // console.log(this.userRole)
                var res = this.userRole.find((value, index, arr) => {
                    if (value === 'auditor') {
                        return true
                    } else {
                        return false
                    }
                })
                    return res
            }
         },
        created() {
            // console.log(this.id)
            http.fetch(api.getSearchDetail(this.id)).then(res => {
                    this.title = res.title
                    this.category = res.category
                    this.author = res.author
                    this.is_checked = res.is_checked
                    this.is_public = res.is_public
                    this.attachment = res.attachment
                    this.create_time = res.create_time
                    this.update_time = res.update_time
                    this.content = res.content
                    this.page_view = res.page_view
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
