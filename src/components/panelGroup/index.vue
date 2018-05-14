<template>
    <el-row class="panel-group" :gutter="40">
        <el-col :span="6" class="card-panel-col">
            <div class='card-panel'>
                <div class="card-panel-icon-wrapper icon-people">
                    <i class="fa fa-plus-square fa-4x card-panel-icon"></i>
                </div>
                <div class="card-panel-description">
                    <el-button type="text" class="card-panel-text" @click="go_to_global_apply">创建通用工单</el-button>
                </div>
            </div>
        </el-col>
        <el-col :span="6" class="card-panel-col">
            <div class='card-panel'>
                <div class="card-panel-icon-wrapper icon-message">
                    <i class="fa fa-plus-square-o fa-4x card-panel-icon"></i>
                </div>
                <div class="card-panel-description">
                    <el-button type="text" class="card-panel-text" @click="go_to_it_apply">创建IT工单</el-button>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script type="text/javascript">
  export default{
      data() {
          return {}
      },
      methods: {
        go_to_global_apply() {
            this.$store.commit('changeGlobal')
            this.$router.push('/apply')
        },
        go_to_it_apply() {
            this.$store.commit('changeIt')
            this.$router.push('/apply')
        }
      }
  }
</script>
<style rel="stylesheet/scss" lang="scss"  scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      margin-right: 50px;
      .card-panel-text {
        line-height: 18px;
        // color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
