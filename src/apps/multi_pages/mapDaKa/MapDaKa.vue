<template>
  <div>
    <!--地图-->
    <div id="map-box">
      <!--地图容器    -->
      <div id="container"></div>

      <div class="top-box">
        <div class="t">
          <p>你好，我是大明宫第 {{sitesMinderNum}} 号</p>
          <p>遗址守护人</p>
        </div>
        <div class="b">标志景点打卡，点亮属于你和大明宫的故事</div>
      </div>

      <div class="right-box">
        <p @click="jumpIndex">景区门票</p>
        <p @click="jumpSpotPage">热游榜单</p>
        <p @click="jumpRoute">游览路线</p>
        <p v-if="showVideoSlide" @click="jumpVideo">影像明宫</p>
      </div>

    </div>

    <!-- 公告栏 -->
    <div class="tip-box">
      <img class="icon" mode="widthFix" src="../assets/mapDaKa/gg2.png" />
      <div class="item-box">
        <div class="gundongBox">
          <div class="gundongList" :style="gundongAni">
            {{notice}}
          </div>
        </div>
      </div>
    </div>

    <!--弹幕    -->
    <div class="barrage_area">
      <!-- 弹幕 -->
      <div class="bulletList">
        <div class="bulletList-box" id="rollCon">
          <div class="topcover"></div>

          <div id="wrapper">
            <div id="scroller">
              <div class="bulletList-l">
                <div class="bullet-item" style="background: rgba(218, 56, 28, 0.6)">
                  <div class="bullet-item-top">
                    <span style="font-wight: bold;">公告：</text>各位大明宫遗址守护人，欢迎来到大明宫打卡寻宝之旅。我们在景区挑选了9个标志景点，赶快开启定位，前往景点打卡吧~</span>
                  </div>
                </div>
                <div class="bullet-item" v-for="item in barrageData">
                  <div class="bullet-item-l" :style="{color:item.colorSty}">
                    {{item.nickName | nickNameFile}}
                  </div>
                  <div class="bullet-item-r">{{item.userOptMsg}}</div>
                </div>
                <div class="rollbottom" style="height: 1px;"></div>
              </div>
            </div>
          </div>

        </div>
        <div class="bulletList-r" :style="{marginBottom: blrbottom+'rem'}">
          <img @click="jumpMyClock()" class="bullet-img" src="https://fileshop.zhiyousx.com/dkzs.png"
               alt="">
        </div>
      </div>

      <div class="bulletFoot">
        <img src="https://fileshop.zhiyousx.com/myclock-9.png" alt="" @click="jumpIndex">
        <div class="bulletIssue">
          <input placeholder="说点什么呢？" v-model="barrageContent" type="text" class="inputIssue">
          <img @click="subMsg()" class="input-sub" src="https://fileshop.zhiyousx.com/myclock-10.png" alt="">
        </div>
      </div>

    </div>

    <!-- 打卡弹窗 -->
    <div class="bottom-box" v-if="curSpotInfo.showOverLayBox">
      <div class="t">
        <div class="l">
          <div class="l-name" :class="curSpotInfo.overLayBoxInfo.signTag == 1 ? 'active':''">
            {{curSpotInfo.overLayBoxInfo.sitesName}}
          </div>
          <img class="l-img" v-if="curSpotInfo.targetDistance"
               src="https://fileshop.zhiyousx.com/dakaMap1.png" />
          <div class="l-distance" v-if="curSpotInfo.targetDistance">距你{{curSpotInfo.targetDistance}}</div>
        </div>
        <div class="r" v-if="curSpotInfo.overLayBoxInfo.signTag != 1">
          今日已打卡{{curSpotInfo.overLayBoxInfo.signNum}}次</div>
      </div>
      <div class="nav">
                <span v-if="curSpotInfo.overLayBoxInfo.hisRealIndex">历史真实指数
                    {{curSpotInfo.overLayBoxInfo.hisRealIndex}}分</span>
        <span
          v-if="curSpotInfo.overLayBoxInfo.hisRealIndex && (curSpotInfo.overLayBoxInfo.useTechIndex || curSpotInfo.overLayBoxInfo.interactExpcIndex || curSpotInfo.overLayBoxInfo.experienceIndex)">
                    | </span>
        <span v-if="curSpotInfo.overLayBoxInfo.useTechIndex">运用科技指数
                    {{curSpotInfo.overLayBoxInfo.useTechIndex}}分</span>
        <span
          v-if="curSpotInfo.overLayBoxInfo.useTechIndex && (curSpotInfo.overLayBoxInfo.interactExpcIndex || curSpotInfo.overLayBoxInfo.experienceIndex)">
                    | </span>
        <span v-if="curSpotInfo.overLayBoxInfo.interactExpcIndex">互动体验指数
                    {{curSpotInfo.overLayBoxInfo.interactExpcIndex}}分</span>
        <span v-if="curSpotInfo.overLayBoxInfo.interactExpcIndex && curSpotInfo.overLayBoxInfo.experienceIndex">
                    | </span>
        <span v-if="curSpotInfo.overLayBoxInfo.experienceIndex">体验指数
                    {{curSpotInfo.overLayBoxInfo.experienceIndex}}分</span>
      </div>
      <div class="content">{{curSpotInfo.overLayBoxInfo.introduce}}</div>
      <div class="b">
        <div v-if="curSpotInfo.overLayBoxInfo.signTag != 1" class="btn1"
             @click="jumpScenicDetail(curSpotInfo.overLayBoxInfo.id)">景点历史</div>
        <div v-if="curSpotInfo.overLayBoxInfo.signTag != 1" class="btn"
             @click="dakaHandle(curSpotInfo.overLayBoxInfo)">
          <img src="../assets/mapDaKa/daka.png" />
          <span>打卡</span>
        </div>
        <div v-if="curSpotInfo.overLayBoxInfo.signTag == 1" class="btn1" style="width:6.2rem"
             @click="jumpScenicDetail(curSpotInfo.overLayBoxInfo.id)">景点历史</div>
      </div>
    </div>

  </div>
</template>

<script>
  var yidaIcon = new AMap.Icon({
    image: require("../assets/mapDaKa/yida.png"), // Icon的图像
    imageSize: new AMap.Size(30, 35), // 根据所设置的大小拉伸或压缩图片
  });
  var weidaIcon = new AMap.Icon({
    image: require("../assets/mapDaKa/weida.png"), // Icon的图像
    imageSize: new AMap.Size(30, 35), // 根据所设置的大小拉伸或压缩图片
  });
  var undaIcon = new AMap.Icon({
    image: require("../assets/mapDaKa/dakaMap4.png"), // Icon的图像
    imageSize: new AMap.Size(20, 23), // 根据所设置的大小拉伸或压缩图片
  });

  // 已选择
  var yidabgIcon = new AMap.Icon({
    image: require("../assets/mapDaKa/yidabg.png"), // Icon的图像
    imageSize: new AMap.Size(52, 52), // 根据所设置的大小拉伸或压缩图片
  });
  var weidabgIcon = new AMap.Icon({
    image: require("../assets/mapDaKa/weidabg.png"), // Icon的图像
    imageSize: new AMap.Size(52, 52), // 根据所设置的大小拉伸或压缩图片
  });
  var undabgIcon = new AMap.Icon({
    image: require("../assets/mapDaKa/dakaMapbg4.png"), // Icon的图像
    imageSize: new AMap.Size(52, 52), // 根据所设置的大小拉伸或压缩图片
  });

  export default {
    data: function () {
      return {
        sitesMinderNum: "",
        spotArr: [], //景点数组
        markerArr: [],
        curPosition: {},
        // 弹框
        curSpotInfo: {
          showOverLayBox: false,
          overLayBoxInfo: {},
        },
        showVideoSlide: false, //视频开关
        // 弹幕
        barrageData: [], //弹幕数据
        barrageContent: "", //输入的弹幕内容
        colorArr: ['#a4ffd1','#ffcbcb','#f6a2f3','#ffa42f','#e35e5e','#a5fcff','#c3ff9b','#fff887','#a4ffd1'],

        notice: "", //公告
        aspeed: 10,
        perspeed: 0.01557632398753894, // aspeed/(rect.width*2+418)
        gundongAni: {},

        //我的打卡
        blrbottom: 0,
      }
    },
    filters: {
      nickNameFile(val) {
        if (val.length > 5) {
          val = val.substring(5, 0) + "*";
          return val;
        } else {
          return val;
        }
      },
    },
    created() { },
    mounted: function () {
      this._paramObj = JSON.parse(decodeURIComponent(getRequestValue("obj")));
      this._mchId = this._paramObj.mchId || 28; //商户id
      this._shareUserId = this._paramObj.shareUserId || "";
      this._token = this._paramObj.token || "";

      this._mapObj; //地图对象
      this._geolocation; //位置插件
      this.initMap();
      this.showVideo(); //视频开关
      this.getSitesMinder();
      this.getVisit();
      // 弹幕相关
      this._myScroll;
      this._animatFg = true;
      this._maxLen = 20; // 默认消息最大长度20条
      this.initScroll();
      this._socket = new WsSocket({
        url: `${SocketHost}/signLayer/${this._mchId}`,
        onMessage: this.onMessage,
      });
      this._socket.connect();
      //公告
      this.getAdvertisement();
    },
    beforeDestroy() {
      this._socket.close();
    },
    methods: {
      initScroll() {
        var that = this;
        this._myScroll = new IScroll("#wrapper", {
          scrollY: true,
          freeScroll: true,
        });
        this._myScroll.on("scrollStart", function () {
          that.bulletScroll({ type: "start", obj: this }, that);
        });
        this._myScroll.on("scrollEnd", function () {
          that.bulletScroll({ type: "end", obj: this }, that);
        });
      },
      initMap() {
        // 高德地图
        var imageLayer = new AMap.ImageLayer({
          url: require("../assets/mapDaKa/bg.png"),
          bounds: new AMap.Bounds(
            [108.955493, 34.304414], ////左上角
            [108.971329, 34.280304] ////右上角
          ),
        });
        this._mapObj = new AMap.Map("container", {
          resizeEnable: true,
          center: [108.964119, 34.292467],
          zoom: 15,
          layers: [new AMap.TileLayer(), imageLayer],
        });
        this._mapObj.on("click", (e) => {
          this.setSpotIcon();
          this._mapObj.panTo([108.964119, 34.292467]); //该景点设为中心
          this._mapObj.setZoom(15); //放大
          this.curSpotInfo.showOverLayBox = false;
          this.blrbottom = 0;
        });

        //获取地图里景点的信息
        this.getSpotInfo();
      },
      // 视频开关
      showVideo() {
        _AJAX({
          url: AJAX_URL_USER + "/api/manager/app/scenicSpot/getVideoOnOff",
          success: (res) => {
            this.showVideoSlide = res.data;
          },
        });
      },
      //获取地图里景点的信息
      getSpotInfo() {
        _AJAX({
          headers: {
            Authorization: this._token,
          },
          url: AJAX_URL_USER + "/api/sign/app/sites/list/" + this._mchId,
          success: (res) => {
            if (res.code === 0) {
              this.spotArr = res.data;
              this.initGeolocationObj();
              this.addMarkerIntoMap();
            } else {
              layer.msg(res.msg);
            }
          },
        });
      },
      //初始化定位功能 监听位置
      initGeolocationObj() {
        var that = this;

        this._mapObj.plugin("AMap.Geolocation", function () {
          that._geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            // noIpLocate: 0,
            // noGeoLocation: 3,
            maximumAge: 0, //定位结果缓存0毫秒，默认：0
            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: false, //显示定位按钮，默认：true
            buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: false, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: false, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          that._mapObj.addControl(that._geolocation);
          that._geolocation.getCurrentPosition(function (status, data) {
            if (status == "complete") {
              var lat = data.position.getLat();
              var lng = data.position.getLng();

              // var gpsPoint = GPS.gcj_encrypt(lat, lng);
              // console.log('gpsPoint', gpsPoint);
              // lat = gpsPoint.lat || lat;
              // lng = gpsPoint.lon || lng;

              that.curPosition = { lat, lng };
              //查找落在哪个景点范围
              let spotArrFilter = []; //当前位置同时落在多个景点的数组
              that.spotArr.forEach((item) => {
                var latMin = Number(item.latRange.split("-")[0]);
                var latMax = Number(item.latRange.split("-")[1]);
                var lngMin = Number(item.lngRange.split("-")[0]);
                var lngMax = Number(item.lngRange.split("-")[1]);
                if (
                  lat > latMin &&
                  lat < latMax &&
                  lng > lngMin &&
                  lng < lngMax
                ) {
                  //落在某个景点范围了
                  item.lat = item.coordinate.split(",")[0]; //某个景点纬度
                  item.lng = item.coordinate.split(",")[1]; //某个景点经度
                  spotArrFilter.push(item);
                }
                //找出距离最近的景点进行弹窗展示
                if (spotArrFilter.length > 0) {
                  let spotObj = ""; //距离最近的景点
                  spotArrFilter.forEach((item) => {
                    //用户位置距离景点的距离
                    item.distance = that.GetDistance(
                      lat,
                      lng,
                      item.lat,
                      item.lng
                    );

                    if (spotObj) {
                      if (item.distance < spotObj.distance) {
                        spotObj = item;
                      }
                    } else {
                      spotObj = item;
                    }
                  });

                  that._mapObj.panTo([spotObj.lng, spotObj.lat]); //该景点设为中心
                  that._mapObj.setZoom(17); //放大

                  that.setSpotIcon(spotObj.id);
                  that.getScenicData(spotObj.id);
                }
              });
            }
          });
        });
      },

      //获取第几位守护人
      getSitesMinder() {
        _AJAX({
          headers: {
            Authorization: this._token,
          },
          url: AJAX_URL_USER + "/api/sign/app/signShare/sitesMinder",
          type: "post",
          contentType: "application/json;charset=utf-8", //设置请求头信息
          data: JSON.stringify({
            mchId: this._mchId,
          }),
          success: (res) => {
            if (res.code === 0) {
              this.sitesMinderNum = res.data;
            } else {
              layer.msg(res.msg);
            }
          },
        });
      },
      //分享访问者明细  统计
      getVisit() {
        _AJAX({
          headers: {
            Authorization: this._token,
          },
          url: AJAX_URL_USER + "/api/sign/app/signShare/visit",
          type: "post",
          contentType: "application/json;charset=utf-8", //设置请求头信息
          data: JSON.stringify({
            mchId: this._mchId,
            shareUserId: this._shareUserId,
          }),
          success: (res) => { },
        });
      },
      //景点标记在地图里
      addMarkerIntoMap() {
        let that = this;

        this.spotArr.forEach((item) => {
          let lat = item.coordinate.split(",")[0]; //纬度
          let lng = item.coordinate.split(",")[1]; //经度
          item.lat = lat;
          item.lng = lng;

          var marker = new AMap.Marker({
            position: new AMap.LngLat(lng, lat),
          });
          if (item.signTag == 0) {
            //已打卡
            marker.setIcon(yidaIcon);
          } else if (item.signTag == 1) {
            //未打卡
            marker.setIcon(weidaIcon);
          } else {
            //不能打卡
            marker.setIcon(undaIcon);
          }
          //显示标注
          marker.setLabel({ content: item.sitesName, direction: "bottom" });
          marker.spotInfoObj = item;
          this.markerArr.push(marker);
          this._mapObj.add(marker);

          AMap.Event.addListener(marker, "click", function (e) {
            var spotInfoObj = e.target.spotInfoObj;

            that._mapObj.panTo([spotInfoObj.lng, spotInfoObj.lat]); //该景点设为中心
            that._mapObj.setZoom(17); //放大

            that.setSpotIcon(spotInfoObj.id);
            that.getScenicData(spotInfoObj.id);

          });
        });
      },
      setSpotIcon(markerId) {
        this.markerArr.forEach((item) => {
          if (item.spotInfoObj.signTag == 0) {
            //已打卡
            item.setIcon(yidaIcon);
          } else if (item.spotInfoObj.signTag == 1) {
            //未打卡
            item.setIcon(weidaIcon);
          } else {
            //不能打卡
            item.setIcon(undaIcon);
          }

          if (item.spotInfoObj.id == markerId) {
            if (item.spotInfoObj.signTag == 0) {
              //已打卡
              item.setIcon(yidabgIcon);
            } else if (item.spotInfoObj.signTag == 1) {
              //未打卡
              item.setIcon(weidabgIcon);
            } else {
              //不能打卡
              item.setIcon(undabgIcon);
            }
          }
        });
      },
      getScenicData(id) {
        var that = this;
        //获取点击景点的打卡次数 经纬度范围信息
        _AJAX({
          headers: {
            Authorization: that._token,
          },
          url: AJAX_URL_USER + "/api/sign/app/sites/detail/" + id,
          success: (res) => {
            if (res.code === 0) {
              if (res.data.introduce) {
                var str = res.data.introduce.replace(/<\/?[^>]*>/g, ""); //去除HTML
                str = str.replace(/\n[\s| | ]*\r/g, "\n"); //去除多余空行
                res.data.introduce = str;
              }

              that.curSpotInfo.showOverLayBox = true;
              that.curSpotInfo.overLayBoxInfo = res.data;
              that.blrbottom = 2;

              //获取当前位置 计算当前位置距离目标景点的距离
              var tpos = that.curSpotInfo.overLayBoxInfo.coordinate.split(",");
              var targetPos = {
                lat: tpos[0],
                lng: tpos[1],
              };

              let distance = 0;
              distance = that.GetDistance(
                that.curPosition.lat,
                that.curPosition.lng,
                targetPos.lat,
                targetPos.lng
              );
              if (distance == 0) {
                distance = "0m"; //保留一位位小数
              } else if (distance > 0 && distance < 1) {
                distance = (distance * 1000).toFixed(1) + "m"; //保留一位位小数
              } else if (distance >= 1) {
                distance = distance.toFixed(1) + "km"; //保留一位小数
              }
              that.curSpotInfo.targetDistance = distance;
            } else {
              layer.msg(res.msg);
            }
          },
        });
      },
      //跳转热游榜单
      jumpSpotPage() {
        wx.miniProgram.navigateTo({
          url: "/pages/hotTourList/hotTourList?mchId=" + this._mchId,
        });
      },
      //跳转游览线路
      jumpRoute() {
        wx.miniProgram.navigateTo({
          url:
            "/pages/tourRouteH5/tourRouteH5?url=" +
            encodeURIComponent(HOST_URL + "/dataStatistics/tourRoute.html") +
            "&obj=" +
            encodeURIComponent(JSON.stringify(this._paramObj)),
        });
      },
      //跳转景点详情页
      jumpScenicDetail(id) {
        // this.closeOverLay();
        wx.miniProgram.navigateTo({
          url:
            "/pages/dakaScenicDetail/dakaScenicDetail?id=" +
            id +
            "&targetDistance=" +
            this.curSpotInfo.targetDistance +
            "&mchId=" +
            this._mchId,
        });
      },
      //跳转视频页面
      jumpVideo() {
        // this.closeOverLay();
        wx.miniProgram.navigateTo({
          url: "/pages/sceneryVideo/sceneryVideo?mchId=" + this._mchId,
        });
      },
      //进行经纬度转换为距离的计算
      Rad(d) {
        return (d * Math.PI) / 180.0; //经纬度转换成三角函数中度分表形式。
      },
      //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
      GetDistance(lat1, lng1, lat2, lng2) {
        var radLat1 = this.Rad(lat1);
        var radLat2 = this.Rad(lat2);
        var a = radLat1 - radLat2;
        var b = this.Rad(lng1) - this.Rad(lng2);
        var s =
          2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
              Math.cos(radLat2) *
              Math.pow(Math.sin(b / 2), 2)
            )
          );
        s = s * 6378.137; // EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000; //输出为公里
        //s=s.toFixed(4);
        return s;
      },
      //点击打卡按钮触发
      dakaHandle(node) {
        let that = this;
        //景点经纬度范围等信息
        let spotInfoObj = node;
        let latMin = Number(spotInfoObj.latRange.split("-")[0]);
        let latMax = Number(spotInfoObj.latRange.split("-")[1]);
        let lngMin = Number(spotInfoObj.lngRange.split("-")[0]);
        let lngMax = Number(spotInfoObj.lngRange.split("-")[1]);

        //获取当前位置 判断是否落在景点经纬度范围内
        this._geolocation.getCurrentPosition(function (status, data) {
          if (status == "complete") {
            var lat = data.position.getLat();
            var lng = data.position.getLng();

            // var gpsPoint = GPS.gcj_encrypt(lat, lng);
            // console.log('gpsPoint', gpsPoint);
            // lat = gpsPoint.lat || lat;
            // lng = gpsPoint.lon || lng;

            if (lat > latMin && lat < latMax && lng > lngMin && lng < lngMax) {
              //进行打卡操作
              _AJAX({
                headers: {
                  Authorization: that._token,
                },
                url: AJAX_URL_USER + "/api/sign/app/sites/sign",
                type: "post",
                contentType: "application/json;charset=utf-8", //设置请求头信息
                data: JSON.stringify({
                  sitesId: spotInfoObj.id,
                }),
                success: (res) => {
                  if (res.code === 0) {
                    wx.miniProgram.navigateTo({
                      url:
                        "/pages/dakaDetail/dakaDetail?mchId=" +
                        that._mchId +
                        "&sitesId=" +
                        spotInfoObj.id +
                        "&signId=" +
                        res.data +
                        "&backType=1",
                    });
                  } else {
                    layer.msg(res.msg);
                  }
                },
              });
            } else {
              layer.msg("您暂不在打卡范围内，可先查看景点热度");
            }
          }
        });
      },

      //弹幕————————————————开始
      bulletScroll(p1, p2) {
        p2._myScroll.refresh();
        let { type, obj } = p1;
        if (type === "start") {
          p2._animatFg = false;
        }
        if (type === "end" && obj.y <= obj.maxScrollY + 24) {
          p2._animatFg = true;
        }
      },
      // 获取弹幕数据
      onMessage(datastr) {
        try {
          let obj = JSON.parse(datastr);
          this.setBarrage(obj);
          console.info("onMessage-parse-success", obj);
        } catch (err) {
          console.error("onMessage-parse-error", datastr);
        }
      },

      setBarrage(data) {
        let barrageData = this.barrageData;
        data.colorSty = this.getRandomColor();
        barrageData.push(data);
        if (barrageData.length > this._maxLen) {
          barrageData = barrageData.slice(1);
        }
        this.barrageData = barrageData;

        this.$nextTick(()=>{
          if (this._myScroll && this._animatFg) {
            this._myScroll.refresh();
            this._myScroll.scrollToElement(document.querySelector(".rollbottom"));
          }
        });
      },
      //随机取颜色深色
      getRandomColor() {
        var index = Math.floor(Math.random() * (this.colorArr.length-1));
        return this.colorArr[index];
      },
      //发布弹幕
      subMsg() {
        if (!this.barrageContent) {
          layer.msg("请输入内容后，再进行提交");
          return;
        }
        let data = {
          content: this.barrageContent,
          mchId: this._mchId,
        };
        _AJAX({
          headers: {
            Authorization: this._token,
          },
          url: AJAX_URL_USER + "/api/sign/app/layer/sign/edit",
          type: "post",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify(data),
          success: (res) => {
            if (res.code === 0) {
              this.barrageContent = "";
            } else {
              layer.msg(res.msg);
            }
          },
        });
      },
      // 跳转我的打卡页
      jumpMyClock() {
        wx.miniProgram.navigateTo({
          url: "/pages/myClock/myClock?id=" + this._mchId,
        });
      },
      // 跳转首页
      jumpIndex() {
        wx.miniProgram.redirectTo({
          url: '/pages/empty/empty?jumpto=index',
        });
      },
      //弹幕————————————————结束
      // 获取公告
      getAdvertisement() {
        _AJAX({
          headers: {
            Authorization: this._token,
          },
          url: AJAX_URL_USER + "/api/manager/app/scenicSpot/getAdvertisement/" + this._mchId,
          success: (res) => {
            if (res.code === 0) {
              this.notice = res.data;
              this.$nextTick(() => {
                var gundongListDom = document.querySelector('.gundongList');
                var aspeed = this.perspeed * (gundongListDom.clientWidth * 2 + 418);
                this.aspeed = aspeed;
                this.gundongAni = {animation: `geiwogun ${aspeed}s linear infinite`};
              });
            } else {
              layer.msg(res.msg);
            }
          },
        });
      },
    },
  };
</script>

<style lang="less">
  @import url('./MapDaKa');
</style>
