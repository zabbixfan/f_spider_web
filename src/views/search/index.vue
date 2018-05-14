
<template>
    <div class="panel">
        <panel-title title="房源信息查看"></panel-title>
        <div class="panel-body">
            <el-form :inline="true" :model="searchForm">
                <el-form-item  label="楼盘名">
                    <!-- <el-input size=18 v-model="searchForm.keyword" placeholder=""></el-input> -->
                    <el-select v-model="searchForm.keyword" placeholder="请选择" filterable >
                        <el-option
                            v-for="item in housename"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="楼幢号">
                    <el-input  v-model="searchForm.build_num" placeholder=""></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getHouseInfo">查询</el-button>
                </el-form-item>
            </el-form>
            <div class="table-container">
                <el-table :data="houses" stripe  v-loading="tableLoading" element-loading-text="数据加载中">
                    <el-table-column label="楼盘名" prop="house_name"></el-table-column>
                    <el-table-column label="楼栋" prop="building_num" sortable></el-table-column>
                    <el-table-column label="房号" prop="room_num" sortable></el-table-column>
                    <el-table-column label="建筑面积" sortable prop="floor_area">
                        <template slot-scope="scope">
                            <span>{{scope.row.floor_area}}㎡</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="实际面积" sortable prop="use_area">
                        <template slot-scope="scope">
                            <span>{{scope.row.use_area}}㎡</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="得房率" sortable prop="used_precent">
                         <template slot-scope="scope">
                            <span>{{scope.row.used_precent}}%</span>
                        </template>                       
                    </el-table-column>
                    <el-table-column label="毛坯单价" sortable prop="unit_price">
                        <template slot-scope="scope">
                            <span>{{scope.row.unit_price}}元/㎡</span>
                        </template>                           
                    </el-table-column>
                    <el-table-column label="装修价" sortable prop="decorate_price">
                        <template slot-scope="scope">
                            <span>{{scope.row.decorate_price}}元/㎡</span>
                        </template>  
                    </el-table-column>
                    <el-table-column label="总价" sortable prop="total_price">
                        <template slot-scope="scope">
                            <span>{{scope.row.total_price}}元/㎡</span>
                        </template>  
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination class="pagination-right"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="page.index"
                           :page-sizes="[1,10, 15, 25, 50, 100, 200, 500]"
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
    import api from '@/api'
    import * as http from '@/http'
    export default {
        data() {
            return {
                houses: [],
                page: {
                    index: 1,
                    size: 25,
                    total: 0
                },
                searchForm: {},
                tableLoading: true,
                housename: []
            }
        },
        components: {
            panelTitle,
            bottomToolBar
        },
        methods: {
            getHouseName() {
                http.fetch(api.housename).then(res => {
                    this.housename = res.data.data
                })
            },
            getHouseInfo() {
                let skip = (this.page.index - 1) * this.page.size
                http.fetch(api.houses, {
                    'offset': skip,
                    'limit': this.page.size,
                    'keyword': this.searchForm.keyword,
                    'build_num': this.searchForm.build_num
                }).then(res => {
                    this.tableLoading = false
                    this.houses = res.data.data
                    this.page.total = res.data.totalCount
                })
            },
            handleCurrentChange: function (val) {
                this.page.index = val
                this.getHouseInfo()
            },
            handleSizeChange(val) {
                this.page.size = val
                this.getHouseInfo()
            }
        },
        created () {
            this.getHouseInfo()
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
