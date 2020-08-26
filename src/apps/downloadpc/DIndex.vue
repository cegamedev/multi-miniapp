<template>
  <div class="d-index">
    <div style="height:1px;"></div>
    <div class="head">
      <img class="head_logo" src="./assets/logo.png" />
      <span class="head_text">一部手机游陕西</span>
    </div>
    <img class="imgbk" src="./assets/beijtuzz.jpg" />
    <div class="bt-block" :style="{marginTop:`${bttop}px`}">
      <img class="bt-imgtxt" src="./assets/wenzi.png" />
      <div class="qr-block">
        <img class="bt-img" src="./assets/qrcode.png" />
      <div class="bt-txt">扫码体验</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      bttop: 230,
      _baseTop: 230,
      _baseWidth: 1920,
    };
  },
  mounted() {
    this.resizeWin();
    window.onresize = this.resizeWin;
  },
  methods: {
    resizeWin() {
      let ctWidth = document.querySelector('.d-index').clientWidth;
      this.bttop = this.$data._baseTop*ctWidth/this.$data._baseWidth;
    }
  }
}
</script>

<style scoped>
.d-index {
  position: relative;
}
.imgbk {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
}
.bt-block {
  width: 614px;
  margin: 0 auto;
}
.qr-block {
  width: 200px;
  margin: 0 auto;
  margin-top: 45px;
}
.bt-img {
  width: 100%;
}
.bt-txt {
  width: 100%;
  height: 45px;
  line-height: 45px;
  text-align: center;
  background: rgb(40, 177, 205);
  color: #fff;
  font-size: 18px;
  border-radius: 23px;
  margin-top: 25px;
}
.head {
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 25px;
  padding-top: 15px;
}
.head_logo {
  float: left;
  width: 50px;
}
.head_text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  float: left;
  margin-top: 12px;
  margin-left: 15px;
}
</style>