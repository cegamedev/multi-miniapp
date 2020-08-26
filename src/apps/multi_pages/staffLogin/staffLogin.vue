<template>
  <div>
    <div class="login">
      <h3 class="login__title">登录</h3>
      <div class="login__form">
        <div class="form__account">
          <input type="text" v-model="loginForm.userName" placeholder="商家账号"/>
        </div>
        <div class="form__pwd">
          <input type="password" v-model="loginForm.userPwd" placeholder="商家密码"/>
        </div>
      </div>
      <div class="login__btn">
        <button class="login-btn" type="submit" @click="login">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "staffLogin",
      data(){
          return{
            loginForm: {
              // userName: 'ycll',
              // userPwd: '123456'
              userName: '',
              userPwd: ''
            },
            showDialog: false
          }
      },
      mounted: function () {

      },
      methods: {
        handleToRegister() {
          this.showDialog = true
        },
        login() {
          if (this.loginForm.userName == "") {
            layer.msg("请输入商家账号")
            return false
          } else if (this.loginForm.userName && this.loginForm.userName.length > 50) {
            layer.msg("商家账号字符过长")
            return false
          } else if (this.loginForm.userPwd == "") {
            layer.msg("请输入密码")
            return false
          } else if (this.loginForm.userPwd && this.loginForm.userPwd.length > 50) {
            layer.msg("密码字符过长")
            return false
          }
          let pwd = hex_md5(this.loginForm.userName + this.loginForm.userPwd)
          let data={
            userName: this.loginForm.userName,
            userPwd: pwd, // this.loginForm.userPwd // pwd
            backstageType:1,
            channel:3,
          }
          _AJAX({
            url: AJAX_URL_USER + '/api/platform/auth',
            type:'post',
            contentType: 'application/json;charset=utf-8', //设置请求头信息
            data: JSON.stringify(data),
            dataType: 'JSON',
            dredge: false,
            success: (data) => {
              if(data.code == 0){
                location.href = 'dataIndex.html?token='+encodeURIComponent(data.data);
              }else{
                layer.msg(data.msg)
              }
            }
          })

        },


      }
    }
</script>

<style scoped>
@import url("staffLogin.less");
</style>
