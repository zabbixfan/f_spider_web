
<template>
    <div class="panel">
        <panel-title title="房源信息查看"></panel-title>
        <div class="panel-body">
            <el-alert
                title="选择楼盘及楼幢号后点击查询进行搜索"
                type="warning"
                :closable="false">
            </el-alert>
            <el-form :inline="true" :model="searchForm" style="margin-top:10px">
                <el-form-item  label="楼盘名">
                    <el-select v-model="searchForm.keyword" placeholder="请选择" filterable @change="load_build">
                        <el-option
                            v-for="item in housename"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="楼幢号">
                    <el-select v-model="searchForm.build_num" placeholder="请选择" filterable>
                        <el-option
                            v-for="item in buildname"
                            :key="item"
                            :label="item"
                            :value="item"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getHouseInfo" :disabled="buttonDisable">查询</el-button>
                </el-form-item>
            </el-form>
            <div class="table-container">
                <el-table :data="houses" stripe  element-loading-text="数据加载中">
                    <el-table-column v-for="cloumn in cloumns" :key="cloumn"  :label=cloumn :prop=cloumn></el-table-column>
                </el-table>
            </div>
        </div>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import panelTitle from '@/components/panelTitle'
    import bottomToolBar from '@/components/bottomToolBar'
    import api from '@/api'
    import * as http from '@/http'
    export default {
        data() {
            return {
                houses: [],
                searchForm: {},
                housename: [],
                buildname: [],
                cloumns: []
            }
        },
        computed: {
            buttonDisable() {
                if (this.searchForm.keyword && this.searchForm.build_num) {
                    return false
                } else {
                    return true
                }
            }
        },
        components: {
            panelTitle,
            bottomToolBar
        },
        methods: {
            load_build(value) {
                console.log(value)
                http.fetch(api.buildname, {'key': this.searchForm.keyword}).then(res => {
                    this.buildname = res.data.data
                })
            },
            getHouseName() {
                http.fetch(api.housename).then(res => {
                    this.housename = res.data.data
                })
            },
            getHouseInfo() {
                http.fetch(api.searchfilter, {
                    'key': this.searchForm.keyword,
                    'build': this.searchForm.build_num
                }).then(res => {
                    this.houses = res.data.detail
                    this.cloumns = res.data.cloumns
                })
            }
        },
        created () {
            // this.getHouseInfo()
            this.getHouseName()
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
