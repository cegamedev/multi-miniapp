<template>
  <div class="item-box">
    <div class="item">
      <div class="l bold">异常ID:</div>
      <div class="r">{{obj.errorId}}</div>
    </div>
    <div class="item">
      <div class="l bold">异常级别:</div>
      <div class="r red">{{obj.level}}</div>
    </div>
    <div class="item">
      <div class="l">异常code:</div>
      <div class="r">{{obj.code}}</div>
    </div>
    <div class="item">
      <div class="l">异常信息:</div>
      <div class="r">{{obj.content}}</div>
    </div>
    <div class="item">
      <div class="l">异常类别:</div>
      <div class="r">{{obj.errorType}}</div>
    </div>
    <div class="item">
      <div class="l">第三方系统:</div>
      <div class="r">{{obj.platformName}}</div>
    </div>
    <div class="item">
      <div class="l">订单编号:</div>
      <div class="r">{{obj.orderSn}}</div>
    </div>
    <div class="item">
      <div class="l">产品ID:</div>
      <div class="r">{{obj.productId}}</div>
    </div>
    <div class="item">
      <div class="l">产品名称:</div>
      <div class="r">{{obj.productName}}</div>
    </div>
    <div class="item">
      <div class="l">下单时间:</div>
      <div class="r">{{obj.placeOrderTime}}</div>
    </div>
    <div class="item">
      <div class="l">订单状态:</div>
      <div class="r">{{obj.orderStatus | orderStatusFilter}}</div>
    </div>
    <div class="item">
      <div class="l">景区名称:</div>
      <div class="r">{{obj.scenicSpotName}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: '',
    };
  },
  filters: {
    orderStatusFilter(num) {
      let data = {
        1: '待支付',
        2: '出票中',
        3: '已出票',
        4: '出票失败',
        5: '退款中',
        6: '部分退款',
        7: '退款完成',
        8: '订单关闭',
        9: '订单完成',
        10: '已过期',
      };
      return data[num];
    },
    stateFilter2(val) {
      let data = {
        1: '未消费',
        2: '已消费',
        3: '部分消费',
      };
      return data[val];
    },
  },
  created: function () {
    this.init();
  },
  methods: {
    init() {
      let id = getRequestValue('errorInfoId');
      _AJAX({
        url: AJAX_URL_USER + '/api/manager/app/errorInfo/detail/' + id,
        type: 'get',
        success: (data) => {
          if (data.code !== 0) {
            alert(data.msg);
            return;
          }

          this.obj = data.data;
        }
      });
    },
  }
}
</script>
<style scoped lang="less">
@import "./css/errorInfo.less";
</style>
