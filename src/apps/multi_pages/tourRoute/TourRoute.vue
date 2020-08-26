<template>
  <div>
    <div class="bg-box">
      <!-- 返回打卡 -->
      <div class="backDaka" @click="backDaka">
        <img class="backDaka-img" src="https://fileshop.zhiyousx.com/dakaMap3.png">
        <div class="backDaka-tit">返回打卡</div>
      </div>
      <div class="dinwei" :class="isGrow ? 'grow' : ''">
        <img @click="getLocation" src="https://fileshop.zhiyousx.com/daka/dingwei.png">
      </div>
      <!--地图容器    -->
      <div id="container" style="width: 100%;height: 100%;"></div>

      <div class="bottom-box" :class="isGrow ? 'height' : ''" @click="zoomHandle">
        <div class="swiper-container swiper-top">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, index) in lineArr" :key="item.id">
              <div class="p1">{{item.lineName}}</div>
              <div class="p2">{{item.sitesNum}}个景点 | 预计{{item.timeSpent}}</div>
              <div class="p3 " :class="isGrow ? '' : 'hidden'">{{item.lineDetail}}</div>
            </div>
          </div>
          <!-- 如果需要分页器 -->
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  // 未选择
  var mIcon = new AMap.Icon({
    image: 'https://fileshop.zhiyousx.com/daka/mark.png',  // Icon的图像
    imageSize: new AMap.Size(20, 23)   // 根据所设置的大小拉伸或压缩图片
  });
  export default {
    data: function () {
      return {
        isGrow: true,
        lineObjArr: [],
        lineArr: [],
        setting: {
          scale: 15,
          showLocation: true,
        },
        latitude: 34.286067,
        longitude: 108.964119,
        showOverLayBox: false,
        overLayBoxInfo: '',
        sitesMinderNum: '',
        // spotArr: [],//景点数组
        markerArr: [],
        curPosition: {},
      };
    },
    filters: {
      nickNameFile(val) {
        if (val.length > 5) {
          val = val.substring(5, 0) + '*';
          return val;
        } else {
          return val;
        }

      }
    },
    created() {
    },
    mounted: function () {
      this._paramObj = JSON.parse(decodeURIComponent(getRequestValue('obj')));
      this._mchId = this._paramObj.mchId || 28;//商户id
      this._shareUserId = this._paramObj.shareUserId || '';
      this._token = this._paramObj.token || '';

      this._mapObj = null;//地图对象
      this._geolocation = null; //位置插件
      this.initMap();

      setTimeout(() => {
        this.initswiper();//初始化轮播
      }, 2000);
    },
    methods: {
      initMap() {

        // 高德地图
        var imageLayer = new AMap.ImageLayer({
          url: require('../assets/mapDaKa/bg.png'),
          bounds: new AMap.Bounds(
            [108.955493, 34.304414],   ////左上角
            [108.971329, 34.280304]    ////右上角
          ),
        });
        this._mapObj = new AMap.Map('container', {
          resizeEnable: true,
          center: [this.longitude, this.latitude],
          zoom: 15,
          layers: [
            new AMap.TileLayer(),
            imageLayer
          ]
        });

        //创建定位插件
        this._mapObj.plugin('AMap.Geolocation', () => {
          this._geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            // noIpLocate: 0,
            // noGeoLocation: 3,
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: false,        //显示定位按钮，默认：true
            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          this._mapObj.addControl(this._geolocation);
          // this.getLocation();
        });

        //获取地图里景点的信息
        // this.getSpotInfo();
        this.getLine();

      },
      // 初始化轮播
      initswiper() {
        var that = this;
        this.mySwiper = new Swiper('.swiper-top', {
          loop: true,
          autoplay: false,
          pagination: '.swiper-pagination',
          onSlideChangeEnd: function (e) {
            var index = e.activeIndex;
            if (index > that.lineArr.length) {
              index = 1;
            }
            if (index < 1) {
              index = that.lineArr.length;
            }
            that.swiperChange(index);
          },
        });
      },

      //获取地图里景点的信息
      getLine() {
        _AJAX({
          headers: {
            Authorization: this._token
          },
          url: AJAX_URL_USER + '/api/sign/app/scenic/line/' + this._mchId,
          type: 'get',
          success: (res) => {
            if (res.code === 0) {
              this.lineArr = res.data;
              this.createPolyLines();
            } else {
              layer.msg(res.msg);
            }
          }
        });
      },
      // // //获取地图里景点的信息
      // getSpotInfo() {
      //     $.ajax({
      //         headers: {
      //             Authorization: this._token
      //         },
      //         url: AJAX_URL_USER + "/serv/sites/list/" + this._mchId,
      //     }).then((res) => {
      //         if (res.code === 0) {
      //             this.spotArr = res.data;
      //             this.addMarkerIntoMap();
      //         } else {
      //             layer.msg(res.msg);
      //         }
      //     })
      // },
      //景点标记在地图里
      changeMarkerIntoMap(targetLineObj) {
        this._mapObj.remove(this.markerArr);
        this.markerArr = [];

        targetLineObj.item.lineCoordinate.forEach((coordinate, index) => {
          let lat = coordinate.split(',')[0]; //纬度
          let lng = coordinate.split(',')[1]; //经度

          if (targetLineObj.item.lineSites[index]) {
            var marker = new AMap.Marker({
              position: new AMap.LngLat(lng, lat),
            });
            marker.setIcon(mIcon);
            marker.setLabel({
              content: targetLineObj.item.lineSites[index],
              direction: 'bottom'
            });
            this.markerArr.push(marker);
          }

        });

        if (this.markerArr.length > 0) {
          this._mapObj.add(this.markerArr);
        }

      },
      // 创建路线实例
      createPolyLines() {
        this.lineArr.forEach((item) => {
          var lineObj = {};
          lineObj.id = item.id;
          lineObj.item = item;

          var path = [];
          item.lineCoordinate.forEach((latlng) => {
            var tgarr = latlng.split(',');
            path.push(new AMap.LngLat(tgarr[1], tgarr[0]));
          });
          // 创建折线实例
          var polyline = new AMap.Polyline({
            path: path,
            isOutline: false,
            outlineColor: '#ffeeff',
            borderWeight: 3,
            strokeColor: '#92062B',
            strokeOpacity: 1,
            strokeWeight: 3,
            // 折线样式还支持 'dashed'
            strokeStyle: 'dashed',
            // strokeStyle是dashed时有效
            strokeDasharray: [10, 5],
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 50,
          });

          lineObj.polyline = polyline;
          this.lineObjArr.push(lineObj);
        });
        this.changePolyLine(this.lineArr[0].id);
      },
      // 切换路线
      changePolyLine(ploylineId) {

        var lines = this.lineObjArr.map((item) => {
          return item.polyline;
        });
        var targetLineObj = this.lineObjArr.find((item) => {
          return item.id === ploylineId;
        });
        this._mapObj.remove(lines);
        this._mapObj.add(targetLineObj.polyline);

        this.changeMarkerIntoMap(targetLineObj);

        this.changeMapCenter(targetLineObj);
      },
      changeMapCenter(targetLineObj) {
        console.log(this.lineObjArr, targetLineObj);
        let latlng0 = parseFloat(this.lineObjArr[0].item.lineCoordinate[0].split(',')[0]);
        let latlng1 = parseFloat(targetLineObj.item.lineCoordinate[0].split(',')[0]);
        let latdelta = latlng0 - latlng1;
        console.log(latlng1, latlng0, latdelta);
        let targetLat = this.latitude - latdelta;
        this._mapObj.panTo([this.longitude, targetLat]);
        this._mapObj.setZoom(15); //放大
      },
      //底部改变线路 更新地图轨迹
      swiperChange(index) {
        console.log('swiper-slider actIndex', index);
        this.changePolyLine(this.lineArr[index - 1].id);
      },
      // 获取当前位置 然后设置为地图中心
      getLocation() {
        var that = this;
        that._geolocation.getCurrentPosition(function (status, data) {
          console.log(status, data);
          // alert(status+JSON.stringify(data));
          if (status == 'complete') {
            var lat = data.position.getLat();
            var lng = data.position.getLng();

            // console.log('prePoint',{lat,lng});
            // var gpsPoint = GPS.gcj_encrypt(lat, lng);
            // console.log('gpsPoint', gpsPoint);
            // var lat = gpsPoint.lat || lat;
            // var lng = gpsPoint.lon || lng;

            that._mapObj.panTo([lng, lat]); //该景点设为中心
            that._mapObj.setZoom(17); //放大
          }
        });
      },
      // 返回打卡页面

      backDaka() {
        wx.miniProgram.navigateBack({
          delta: 1
        });
      },
      //点击底部 增加高度
      zoomHandle() {
        // this.isGrow = !this.isGrow
      },
      // 跳转首页
      jumpIndex() {
        wx.miniProgram.switchTab({ url: '/pages/index/index?id=' + this._mchId });
      },
    },
  };
</script>

<style lang="less">
  @import url('./TourRoute');
</style>
