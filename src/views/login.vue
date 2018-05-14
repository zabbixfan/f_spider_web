<template lang="html">
  <div id="login-page" @keyup.enter="login">
    <div class="login-form">
      <div class="input-group">
        <div class="title">连连客服知识库系统</div>
        <el-input
          :autofocus="true"
          placeholder="请输入用户名"
          prefix-icon="el-icon-time"
          v-model="username">
        </el-input>
      </div>
      <div class="input-group">
        <el-input
          placeholder="请输入密码"
          prefix-icon="el-icon-time"
          type="password"
          v-model="password">
        </el-input>
      </div>
      <div class="input-group">
        <!-- <label>记住我？</label>
        <el-switch
          v-model="rememberMe"
          on-text=""
          off-text="">
        </el-switch> -->
      </div>
      <div class="input-group">
        <el-button @click.native="login" type="primary" :loading="isBtnLoading">{{btnText}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import * as http from '@/http'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false,
      isBtnLoading: false
    }
  },
  computed: {
    btnText() {
      if (this.isBtnLoading) return '登录中...'
      return '登录'
    }
  },
  methods: {
    login() {
      process.env.TZ = 'Asia/Shanghai'
      if (!this.username) {
        this.$message.error('请填写用户名！！！')
        return
      }
      if (!this.password) {
        this.$message.error('请填写密码')
        return
      }
      let loginParams = {username: this.username, password: this.password}
      this.isBtnLoading = true
      http.post(api.requestLogin, loginParams).then(res => {
        this.isBtnLoading = false
        if (!res.data.data.access_token) {
            this.$message.error(res.data.data)
        } else {
            this.$message.success('登录成功')
            Cookies.set('token', res.data.data.access_token)
            this.$router.push({path: '/'})
        }
      }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
  #login-page {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #efeeee;

    .login-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 500px;
      height: 400px;
      border-radius: 10px;
      background: white;
      border: 1px #eaeaea solid;
      box-shadow: 0px 0px 25px #cac6c6;

      .title {
        color: #20a0ff;
        font-weight: bold;
        font-size: 40px;
        text-align: center;
        line-height: 2.2;
        font-family: sans-serif;
      }

      .input-group {
        margin-top: 30px;
        width: 80%;
        button {
          width: 100%;
        }
      }
    }
  }
</style>
