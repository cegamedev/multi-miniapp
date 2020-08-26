<template>
  <div class="my-app" id="app" v-cloak>
    <div class="scroll-box">
      <template v-for="(item, index) in textArr" :v-key="index">
        <!-- 客服的消息 -->
        <div class="item-box left" v-if="item.type != 'right'">
          <div class="item">
            <div class="avatar-img-box">
              <img class="avatar-img" src="../assets/kefu/kefu2.png" />
            </div>

            <!-- 显示文本或富文本 -->
            <div class="txt-box" v-if="item.type === 'text'" v-html="item.value"></div>
            <!-- 显示图片 -->
            <div class="txt-box" v-if="item.type === 'url'">
              <img :src="item.value" alt="">
            </div>
          </div>
        </div>
        <!-- 用户的消息 -->
        <div class="item-box right" v-else>
          <div class="item">
            <div class="txt-box">{{item.value}}</div>
            <div class="avatar-img-box">
              <img class="avatar-img" :src="avatarUrl" />
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 底部 -->
    <div class="bottom-box">
      <div class="input-box">
        <input placeholder="请输入聊天内容" v-model="inputVal" @keyup.enter="sendInputVal" />
        <img class="send-img" src="../assets/kefu/kefu1.png" @click="sendInputVal" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        inputVal: '',//输入的关键词
        avatarUrl: '',//用户微信头像
        //消息区的消息
        textArr: [{
          value: '你好，很高兴为你服务。',
          type: 'text'
        }]
      };
    },
    mounted: function () {
      this._paramObj = JSON.parse(decodeURIComponent(getRequestValue('obj')))
      this.getAvatarUrl()
    },
    methods: {
      sendInputVal(){
        if(!this.inputVal){
          layer.msg('请输入关键词');
          return
        }

        //关键词显示在消息区
        this.textArr.push({
          value: this.inputVal,
          type: 'right',
        })
        this.$nextTick(() => {
          var scrollDom = document.querySelector('.scroll-box');
          scrollDom.scrollTop = scrollDom.scrollHeight
        })

        _AJAX({
          url: AJAX_URL_USER + '/api/manager/app/remote/ask',
          type: 'post',
          contentType: 'application/json',
          data: JSON.stringify({
            keyWord: this.inputVal,
            mchId: this._paramObj.merchantId || 28,
            userId: this._paramObj.openId || null,
          }),
          success: (res) => {
            this.inputVal = ''
            //补全图片url左边的域名
            let arr = res.data
            arr.forEach((item) => {
              item.value = item.value.replace(/\/adm\//g, 'http://bfop.emotibot.com'+ /adm/)
            })
            this.textArr = this.textArr.concat(arr)

            this.$nextTick(() => {
              var scrollDom = document.querySelector('.scroll-box');
              scrollDom.scrollTop = scrollDom.scrollHeight
            })
          }
        })
      },
      //获取用户头像
      getAvatarUrl(){
        _AJAX({
          url: AJAX_URL_USER + '/api/manager/app/remote/getUser/' + this._paramObj.openId,
          success: (res) => {
            if(res.code === 0){
              if(res.data && res.data.headImgUrl){
                this.avatarUrl = res.data.headImgUrl
              } else {
                this.avatarUrl = require("../assets/kefu/kefu3.png")
              }
            }else{
              this.avatarUrl = require("../assets/kefu/kefu3.png")
            }
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  @import url('./css/kefu.less');
</style>
