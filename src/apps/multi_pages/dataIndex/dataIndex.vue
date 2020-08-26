<template>
  <div>
    <div class="my-app" >
      <div class="refresh-moudle" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)" :style="{transform: 'translate3d(0,' + top + 'px, 0)'}">
        <header class="pull-refresh">
          <slot name="pull-refresh">
            <div class="down-tip" v-if="dropDownState==1">
              <span class="down-text">{{dropDownInfo.downText}}</span>
            </div>
            <div class="up-tip" v-if="dropDownState==2">
              <span class="up-text">{{dropDownInfo.upText}}</span>
            </div>
            <div class="refresh-tip" v-if="dropDownState==3">
              <span class="refresh-text">{{dropDownInfo.refreshText}}</span>
            </div>
          </slot>
        </header>
        <!--行程信息-->
        <div class="tourtop" >
          <div class="tour" >
            <div class="tourList">
              <p class="tit" style="border-top-left-radius:0.2rem;" :class="{ active: isActive == '0'}" @click="changeNav('0')">核销统计</p>
              <p class="tit" :class="{ active: isActive == '1'}" @click="changeNav('1')">订单统计</p>
              <p class="tit" :class="{ active: isActive == '2'}" @click="changeNav('2')">交易额统计</p>
              <p class="tit" :class="{ active: isActive == '3'}" @click="changeNav('3')">访问数据</p>
              <p class="tit" style=" border-top-right-radius:0.2rem;" :class="{ active: isActive == '4'}" @click="changeNav('4')">游客统计</p>
            </div>
          </div>
          <!--核销模块--浩祝-->
          <div class="verify" v-show="isActive == 0">
            <!--class命名以verify为前缀开头-->
            <!--普通的-->
            <div class="general" v-show="isVIPGroup == 1">
              <div class="verify_top">
                <div class="verify_topTitle">
                  <span class="verify_topTitle-1">核销情况</span>
                  <span class="verify_topTitle-2">截止{{verify_Time}}</span>
                </div>
                <div class="verify_topBox">
                  <div class="verify_item">
                    <div class="verify_item-1">{{verify_verifyNum}}</div>
                    <div class="verify_item-2">今日已核销</div>
                  </div>
                  <div class="verify_item">
                    <div class="verify_item-1">{{verify_productNum}}</div>
                    <div class="verify_item-2">今日已预定</div>
                  </div>
                </div>
                <div class="verify_topBox">
                  <div class="verify_item">
                    <div class="verify_item-1">{{verify_validPlanVerifyNum}}</div>
                    <div class="verify_item-2">有效期待核销</div>
                  </div>
                  <div class="verify_item">
                    <div class="verify_item-1">{{verify_totalVerifyNum}}</div>
                    <div class="verify_item-2">累计已核销</div>
                  </div>
                </div>
                <div class="verify_topBox" v-if=" accumulativeEnterCar > 0 ">
                  <div class="verify_item">
                    <div class="verify_item-1">{{todayEnterCar}}</div>
                    <div class="verify_item-2">今日入园车辆</div>
                  </div>
                  <div class="verify_item">
                    <div class="verify_item-1">{{accumulativeEnterCar}}</div>
                    <div class="verify_item-2">累计入园车辆</div>
                  </div>
                </div>
                <div class="verify_topBoxFoot">
                  <div>*今日已核销：统计包含购票核销票数及免票核销票数</div>
                  <div>*今日已预定：仅统计指定今日出游的票数（不含有效期模式）</div>
                  <div>*有效期待核销：仅统计“有效期模式”的产品待核销票数</div>
                </div>
              </div>
              <div class="verify_box">
                <div class="verify_boxTitle">
                  <div class="verify_boxTitle-1">数据详情</div>
                  <div class="selectTap">
                    <div class="selectTap-item" :class="{ active: selectTap_active == 0}" @click="select_Change(0)">日核销统计</div>
                    <div class="selectTap-item" :class="{ active: selectTap_active == 1}" @click="select_Change(1)">产品核销统计</div>
                    <div class="selectTap-item" :class="{ active: selectTap_active == 2}" @click="select_Change(2)">核销预约比</div>
                  </div>
                  <div class="selectTap-info" v-if="selectTap_active == 2">*核销比：仅统计“使用日期模式”产品的核销数和预订数</div>
                  <div class="verify_boxTitle-2" v-if="selectTap_active != 1">
                    <div class="verify_boxButton" :class="{ active: isVerify_active == 'day7'}" @click="verify_Change('day7')">近7日</div>
                    <div class="verify_boxButton" :class="{ active: isVerify_active == 'day30'}" @click="verify_Change('day30')">近30日</div>
                    <div class="verify_boxButton" v-if="selectTap_active != 0" :class="{ active: isVerify_active == 'day7After'}" @click="verify_Change('day7After')">未来7日</div>
                  </div>
                  <div class="verify-inputDate" v-if="selectTap_active != 1">
                    <input readonly type="text" class="verify_inp" @click="changeStartTime" id="verify_Start" :value="verify_startTime">
                    <span class="verify-text">-</span>
                    <input readonly type="text" class="verify_inp" @click="changeEndTime" id="verify_End" :value="verify_endTime">
                  </div>
                </div>
                <table class="verify_table" v-if="selectTap_active == 0">
                  <tr class="verify_th">
                    <th>日期</th>
                    <th>免购票核销</th>
                    <th>购票核销</th>
                    <th>当日总核销</th>
                  </tr>
                  <tbody>
                  <template v-for="(item,index) in verify_tableDayVerify">
                    <tr class="verify_tbody">
                      <td>{{item.verifyDate}}</td>
                      <td>{{item.freeVerifyNum}}</td>
                      <td>{{item.buyVerifyNum}}</td>
                      <td>{{item.totalVerifyNum}}</td>
                    </tr>
                  </template>
                  </tbody>
                </table>
                <template v-if="selectTap_active == 1">
                  <div class="table-title">
                    <div class="color"></div>
                    <div class="title">购票入园</div>
                  </div>
                  <table class="verify_table" style="margin-bottom: .64rem;letter-spacing: .01rem">
                    <tr class="verify_th">
                      <th style="width: 30%">产品名称</th>
                      <th style="width: 34%">日期模式</th>
                      <th style="width: 18%">今日核销</th>
                      <th style="width: 18%">待核销</th>
                    </tr>
                    <tbody>
                    <template v-for="(item,index) in verify_tableProduct">
                      <tr class="verify_tbody product">
                        <td v-if="(item.productName.replace(/\s+/g,'').length)>7" @click="isShowAllName(index)">
                          <p v-if="!isShowAllNameList[index].isShowOrNot">{{item.productName | productNameFilter}}</p>
                          <p v-else style="line-height: .35rem;margin-top: .12rem;margin-bottom: .12rem">{{item.productName}}</p>
                        </td>
                        <td v-else>{{item.productName}}</td>
                        <td>
                          <p>{{item.dataType | dataTypeFilter}}</p>
                          <p v-if="item.dataType === 1" style="margin-top: 0.08rem">
                            {{item.validityDateDtart}}-{{item.validityDateEnd}}
                          </p>
                        </td>
                        <td>{{item.verifyNum}}</td>
                        <td>{{item.planVerifyNum}}</td>
                      </tr>
                    </template>
                    <tr v-if="verify_tableProduct" class="verify_tbody">
                      <td>合计</td>
                      <td></td>
                      <td>{{totalVerifyNum}}</td>
                      <td>{{totalPlanVerifyNum}}</td>
                    </tr>
                    </tbody>
                  </table>
                  <div class="table-title">
                    <div class="color"></div>
                    <div class="title">免票入园</div>
                  </div>
                  <table class="verify_table">
                    <tr class="verify_th">
                      <th>免票入园条件</th>
                      <th>今日核销</th>
                    </tr>
                    <tbody>
                    <template v-for="(item,index) in verify_tableFreeProduct">
                      <tr class="verify_tbody">
                        <td>{{item.freeTypeName}}</td>
                        <td>{{item.verifyNum}}</td>
                      </tr>
                    </template>
                    <tr v-if="verify_tableFreeProduct" class="verify_tbody">
                      <td>合计</td>
                      <td>{{totalFreeNum}}</td>
                    </tr>
                    </tbody>
                  </table>
                </template>
                <table class="verify_table" v-if="selectTap_active == 2">
                  <tr class="verify_th">
                    <th>日期</th>
                    <th>已核销</th>
                    <th>预约数</th>
                    <th>核销比</th>
                  </tr>
                  <tbody>
                  <template v-for="(item,index) in verify_tableData">
                    <tr class="verify_tbody">
                      <td>{{item.verifyDate}}</td>
                      <td>{{item.verifyNum}}</td>
                      <td>{{item.reservationNum}}</td>
                      <td v-if="item.verifyRadio == '--'">{{item.verifyRadio}}%</td>
                      <td v-else>{{item.verifyRadio}}</td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
            </div>
            <!--VIP团的时候显示-->
            <div class="tcVip">
              <div class="verify_top" v-show="isVIPGroup == 0">
                <div class="selectTap1">
                  <div class="selectTap-item" :class="{ active: ticorVIP_active == 0}" @click="ticorVIP(0)">门票</div>
                  <div class="selectTap-item" :class="{ active: ticorVIP_active == 1}" @click="ticorVIP(1)">VIP团</div>
                </div>
                <!--VIP团的时候显示-->
                <div class="verify_boxTitle-vip" v-show="ticorVIP_active == 1">
                  <div class="verify_boxButton" :class="{ active: isTeamOrvip_active == '0'}"  @click="isTeamOrvip(0)">按团统计</div>
                  <div class="verify_boxButton" :class="{ active: isTeamOrvip_active == '1'}"  @click="isTeamOrvip(1)">按人数统计</div>
                </div>
                <!--VIP团的时候显示-->
                <div class="verify_topBoxFoot1" style="margin-bottom: 0"  v-show="ticorVIP_active == 1">
                  <div>*按团：以下核销及预约数据按团数进行统计，如1团5人，统计数量加1</div>
                  <div>*按人数：以下核销及预约数据按人数进行统计，如1团5人，统计数量加5</div>
                </div>
                <div class="verify_topTitle" >
                  <span class="verify_topTitle-1">核销情况</span>
                  <span class="verify_topTitle-2">截止{{verify_Time}}</span>
                </div>
                <div class="verify_topBox">
                  <div class="verify_item">
                    <div class="verify_item-1">{{verify_verifyNum}}</div>
                    <div class="verify_item-2">今日已核销</div>
                  </div>
                  <div class="verify_item">
                    <div class="verify_item-1">{{verify_productNum}}</div>
                    <div class="verify_item-2">今日已预定</div>
                  </div>
                </div>
                <!--门票的时候才显示-->
                <div class="verify_topBox"  v-show="ticorVIP_active == 0">
                  <div class="verify_item">
                    <div class="verify_item-1">{{verify_validPlanVerifyNum}}</div>
                    <div class="verify_item-2">有效期待核销</div>
                  </div>
                  <div class="verify_item"  v-show="ticorVIP_active == 0">
                    <div class="verify_item-1">{{verify_totalVerifyNum}}</div>
                    <div class="verify_item-2">累计已核销</div>
                  </div>
                </div>
                <div class="verify_topBox" v-if="ticorVIP_active == 0 && accumulativeEnterCar > 0 ">
                  <div class="verify_item">
                    <div class="verify_item-1">{{todayEnterCar}}</div>
                    <div class="verify_item-2">今日入园车辆</div>
                  </div>
                  <div class="verify_item">
                    <div class="verify_item-1">{{accumulativeEnterCar}}</div>
                    <div class="verify_item-2">累计入园车辆</div>
                  </div>
                </div>
                <!--VIP团的时候显示-->
                <div class="verify_topBox"  v-show="ticorVIP_active == 1">
                  <div class="verify_item">
                    <div class="verify_item-1">{{todayEnterCar}}</div>
                    <div class="verify_item-2">今日入园车辆</div>
                  </div>
                  <div class="verify_item"  v-show="ticorVIP_active == 1">
                    <div class="verify_item-1">{{todayDestineEnterCar}}</div>
                    <div class="verify_item-2">今日预订车辆</div>
                  </div>
                </div>
                <!--门票的时候显示-->
                <div class="verify_topBoxFoot1" v-show="ticorVIP_active == 0">
                  <div>*今日已核销：统计包含购票核销票数及免票核销票数</div>
                  <div>*今日已预订：仅统计指定今日出游的票数（不含有效期模式）</div>
                  <div>*有效期待核销：仅统计“有效期模式”的产品待核销票数</div>
                </div>
                <!--VIP团的时候显示-->
                <div class="verify_topBoxFoot1" v-show="ticorVIP_active == 1">
                  <div>*今日已核销：统计包含已核销VIP团数量</div>
                  <div>*今日已预订：统计包含预订今日VIP团总数</div>
                </div>
              </div>
              <!--VIP团的时候显示-->
              <div class="verify_box"  v-show="ticorVIP_active == 1">
                <div class="verify_boxTitle">
                  <div class="verify_boxTitle-1">数据详情</div>
                  <div class="selectTap-vip">
                    <div class="selectTap-item" :class="{ active: hxOrCP_active == 2}" @click="hxOrCP_Change(2)">核销预约比</div>
                    <div class="selectTap-item" :class="{ active: hxOrCP_active == 1}" @click="hxOrCP_Change(1)">产品核销统计</div>
                  </div>
                  <div class="selectTap-info" v-if="hxOrCP_active == 2">*核销比：仅统计“使用日期模式”产品的核销数和预订数</div>
                  <div class="verify_boxTitle-vip" v-if="hxOrCP_active != 1">
                    <div class="verify_boxButton" :class="{ active: isVerify_active == 'day7'}" @click="verify_Change('day7')">近7日</div>
                    <div class="verify_boxButton" :class="{ active: isVerify_active == 'day30'}" @click="verify_Change('day30')">近30日</div>
                    <div class="verify_boxButton" v-if="hxOrCP_active != 0" :class="{ active: isVerify_active == 'day7After'}" @click="verify_Change('day7After')">未来7日</div>
                  </div>
                  <div class="verify-inputDate" v-if="hxOrCP_active != 1">
                    <input readonly type="text" class="verify_inp" @click="changeStartTime" id="verify_Start" :value="verify_startTime">
                    <span class="verify-text">-</span>
                    <input readonly type="text" class="verify_inp" @click="changeEndTime" id="verify_End" :value="verify_endTime">
                  </div>
                </div>

                <template v-if="hxOrCP_active == 1">
                  <div class="table-title">
                    <div class="color"></div>
                    <div class="title">购票入园</div>
                  </div>
                  <table class="verify_table" style="margin-bottom: .64rem;letter-spacing: .01rem">
                    <tr class="verify_th">
                      <th style="width: 30%">产品名称</th>
                      <th style="width: 34%">日期模式</th>
                      <th style="width: 18%">今日核销</th>
                      <th style="width: 18%">待核销</th>
                    </tr>
                    <tbody>
                    <template v-for="(item,index) in verify_tableProduct">
                      <tr class="verify_tbody product">
                        <td v-if="(item.productName.replace(/\s+/g,'').length)>7" @click="isShowAllName(index)">
                          <p v-if="!isShowAllNameList[index].isShowOrNot">{{item.productName | productNameFilter}}</p>
                          <p v-else style="line-height: .35rem;margin-top: .12rem;margin-bottom: .12rem">{{item.productName}}</p>
                        </td>
                        <td v-else>{{item.productName}}</td>
                        <td>
                          <p>{{item.dataType | dataTypeFilter}}</p>
                          <p v-if="item.dataType === 1" style="margin-top: 0.08rem">
                            {{item.validityDateDtart}}-{{item.validityDateEnd}}
                          </p>
                        </td>
                        <td>{{item.verifyNum}}</td>
                        <td>{{item.planVerifyNum}}</td>
                      </tr>
                    </template>
                    <tr v-if="verify_tableProduct" class="verify_tbody">
                      <td>合计</td>
                      <td></td>
                      <td>{{totalVerifyNum}}</td>
                      <td>{{totalPlanVerifyNum}}</td>
                    </tr>
                    </tbody>
                  </table>
                </template>
                <table class="verify_table" v-if="hxOrCP_active == 2">
                  <tr class="verify_th">
                    <th>日期</th>
                    <th>已核销</th>
                    <th>预约数</th>
                    <th>核销比</th>
                  </tr>
                  <tbody>
                  <template v-for="(item,index) in verify_tableData">
                    <tr class="verify_tbody">
                      <td>{{item.verifyDate}}</td>
                      <td>{{item.verifyNum}}</td>
                      <td>{{item.reservationNum}}</td>
                      <td v-if="item.verifyRadio == '--'">{{item.verifyRadio}}%</td>
                      <td v-else>{{item.verifyRadio}}</td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
          <!--订单模块--晓彤-->
          <div class="order" v-show="isActive == 1">
            <div class="order-box1">
              <div class="t"><span>订单概况</span>截止{{verify_Time}}</div>
              <div class="b">
                <div class="item">
                  <p class="p1">{{orderSurveyObj.todayPayOrders}}</p>
                  <p class="p2">今日付款订单</p>
                  <p class="p3">
                    <span>日环比</span>
                    <template v-if="orderSurveyObj.payDayRate === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{orderSurveyObj.payDayRate}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="orderSurveyObj.payDayRate > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="orderSurveyObj.payDayRate == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: orderSurveyObj.payDayRate > 0,yellow: orderSurveyObj.payDayRate == 0 ,green: orderSurveyObj.payDayRate < 0 }">{{orderSurveyObj.payDayRate | nameFilter}}%</span>
                    </template>
                  </p>
                  <p class="p3">
                    <span>周同比</span>
                    <template v-if="orderSurveyObj.payWeekRate === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{orderSurveyObj.payWeekRate}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="orderSurveyObj.payWeekRate > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="orderSurveyObj.payWeekRate == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: orderSurveyObj.payWeekRate > 0, yellow: orderSurveyObj.payWeekRate == 0 ,green: orderSurveyObj.payWeekRate < 0}">{{orderSurveyObj.payWeekRate | nameFilter}}%</span>
                    </template>
                  </p>
                </div>
                <div class="item">
                  <p class="p1">{{orderSurveyObj.todayRefundOrders}}</p>
                  <p class="p2">今日退款订单</p>
                  <p class="p3">
                    <span>日环比</span>
                    <template v-if="orderSurveyObj.refundDayRate === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{orderSurveyObj.refundDayRate}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="orderSurveyObj.refundDayRate > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="orderSurveyObj.refundDayRate == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: orderSurveyObj.refundDayRate > 0, yellow: orderSurveyObj.refundDayRate == 0 ,green: orderSurveyObj.refundDayRate < 0}">{{orderSurveyObj.refundDayRate | nameFilter}}%</span>
                    </template>
                  </p>
                  <p class="p3">
                    <span>周同比</span>
                    <template v-if="orderSurveyObj.refundWeekRate === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{orderSurveyObj.refundWeekRate}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="orderSurveyObj.refundWeekRate > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="orderSurveyObj.refundWeekRate == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: orderSurveyObj.refundWeekRate > 0, yellow: orderSurveyObj.refundWeekRate == 0 ,green: orderSurveyObj.refundWeekRate < 0}">{{orderSurveyObj.refundWeekRate | nameFilter}}%</span>
                    </template>
                  </p>
                </div>
                <div class="item">
                  <p class="p1">{{orderSurveyObj.todayOrders}}</p>
                  <p class="p2">今日总订单</p>
                  <p class="p3">
                    <span>日环比</span>
                    <template v-if="orderSurveyObj.totalDayRate === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{orderSurveyObj.totalDayRate}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="orderSurveyObj.totalDayRate > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="orderSurveyObj.totalDayRate == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: orderSurveyObj.totalDayRate > 0,yellow: orderSurveyObj.totalDayRate == 0 , green: orderSurveyObj.totalDayRate < 0}">{{orderSurveyObj.totalDayRate | nameFilter}}%</span>
                    </template>
                  </p>
                  <p class="p3">
                    <span>周同比</span>
                    <template v-if="orderSurveyObj.totalWeekRate === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{orderSurveyObj.totalWeekRate}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="orderSurveyObj.totalWeekRate > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="orderSurveyObj.totalWeekRate == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: orderSurveyObj.totalWeekRate > 0, yellow: orderSurveyObj.totalWeekRate == 0 ,green: orderSurveyObj.totalWeekRate < 0}">{{orderSurveyObj.totalWeekRate | nameFilter}}%</span>
                    </template>
                  </p>
                </div>
              </div>
              <div class="b">
                <div class="item">
                  <p class="p1">{{orderSurveyObj.totalPayOrders}}</p>
                  <p class="p2">累计付款订单</p>
                </div>
                <div class="item">
                  <p class="p1">{{orderSurveyObj.totalRefundOrders}}</p>
                  <p class="p2">累计退款订单</p>
                </div>
                <div class="item">
                  <p class="p1">{{orderSurveyObj.totalOrders}}</p>
                  <p class="p2">累计总订单</p>
                </div>
              </div>
              <div class="c" style="padding-bottom: 0.1rem">
                *今日退款订单：包含退款中、部分退款、退款完成的订单
              </div>
              <div class="c">
                *今日总订单：包含未支付、已支付、退款的订单
              </div>

            </div>
            <div class="order-box2">
              <div class="option-box" v-show="orderShowMoreMask">
                <div class="item" @click="orderChangeOrderType(1)">全部订单</div>
                <div class="item" @click="orderChangeOrderType(2)">付款订单</div>
                <div class="item" @click="orderChangeOrderType(3)">退款订单</div>
              </div>
              <div class="t-box">
                <div class="title">{{orderType | orderTypeFilter}}</div>
                <img src="../assets/dataIndex/more.png" alt="" class="more" @click="orderShowMore">
              </div>
              <div class="b-box">
                <div class="filter-box">
                  <div class="tour-btn">
                    <div class="tourDate" :class="{active: orderTimeType == 'day7'}" @click="orderChangeTime('day7')">近7日</div>
                    <div class="tourDate" :class="{active: orderTimeType == 'day30'}" @click="orderChangeTime('day30')">近30日</div>
                  </div>
                  <div class="line"></div>
                  <div class="tour-inputDate">
                    <input readonly type="text" class="tour-inp" id="order-picker1" @click="orderInitPicker1" :value="orderPickerObj.start">
                    <span class="tour-text">-</span>
                    <input readonly type="text" class="tour-inp" id="order-picker2" @click="orderInitPicker2" :value="orderPickerObj.end">
                  </div>
                </div>

                <div class="chart-box" id="order-chart">
                  折线图
                </div>
              </div>
            </div>
            <div class="order-box3">
              <div class="title">数据详情</div>
              <table>
                <thead>
                <tr>
                  <td>日期</td>
                  <td>当日付款</td>
                  <td>当日退款</td>
                  <td>当日订单</td>
                  <!--                        <td>累计订单</td>-->
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in orderDataTableArr">
                  <td>{{item.date}}</td>
                  <td>{{item.payOrders}}</td>
                  <td>{{item.refundOrders}}</td>
                  <td>{{item.totalOrders}}</td>
                  <!--                        <td>{{item.allOrders}}</td>-->
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!--交易额模块--阿童-->
          <div class="sum_box" v-show="isActive == 2">
            <div class="order-box1">
              <div class="t"><span>交易额概况</span>截止{{sumSurveyObj.deadline}}</div>
              <div class="b">
                <div class="item">
                  <p class="p1">{{sumSurveyObj.transactionAmount}}</p>
                  <p class="p2">今日交易额 (元)</p>
                  <p class="p3">
                    <span>日环比</span>
                    <template v-if="sumSurveyObj.transactionDayOnMonth === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{sumSurveyObj.transactionDayOnMonth}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="sumSurveyObj.transactionDayOnMonth > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="sumSurveyObj.transactionDayOnMonth == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: sumSurveyObj.transactionDayOnMonth > 0,yellow: sumSurveyObj.transactionDayOnMonth == 0 , green: sumSurveyObj.transactionDayOnMonth < 0}">{{sumSurveyObj.transactionDayOnMonth | nameFilter}}%</span>
                    </template>
                  </p>
                  <p class="p3">
                    <span>周同比</span>
                    <template v-if="sumSurveyObj.transactionWeekOnYear === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{sumSurveyObj.transactionWeekOnYear}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="sumSurveyObj.transactionWeekOnYear > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="sumSurveyObj.transactionWeekOnYear == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: sumSurveyObj.transactionWeekOnYear > 0, yellow: sumSurveyObj.transactionWeekOnYear == 0 ,green: sumSurveyObj.transactionWeekOnYear < 0}">{{sumSurveyObj.transactionWeekOnYear | nameFilter}}%</span>
                    </template>
                  </p>
                </div>
                <div class="item">
                  <p class="p1">{{sumSurveyObj.refoundAmount}}</p>
                  <p class="p2">今日退款 (元)</p>
                  <p class="p3">
                    <span>日环比</span>
                    <template v-if="sumSurveyObj.refoundDayOnMonth === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{sumSurveyObj.refoundDayOnMonth}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="sumSurveyObj.refoundDayOnMonth > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="sumSurveyObj.refoundDayOnMonth == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: sumSurveyObj.refoundDayOnMonth > 0, yellow: sumSurveyObj.refoundDayOnMonth == 0 ,green: sumSurveyObj.refoundDayOnMonth < 0}">{{sumSurveyObj.refoundDayOnMonth | nameFilter}}%</span>
                    </template>
                  </p>
                  <p class="p3">
                    <span>周同比</span>
                    <template v-if="sumSurveyObj.refoundWeekOnYear === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{sumSurveyObj.refoundWeekOnYear}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="sumSurveyObj.refoundWeekOnYear > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="sumSurveyObj.refoundWeekOnYear == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: sumSurveyObj.refoundWeekOnYear > 0, yellow: sumSurveyObj.refoundWeekOnYear == 0 ,green: sumSurveyObj.refoundWeekOnYear < 0}">{{sumSurveyObj.refoundWeekOnYear | nameFilter}}%</span>
                    </template>
                  </p>
                </div>
              </div>
              <div class="b" style="padding-bottom: .50rem;">
                <div class="item">
                  <p class="p1">{{sumSurveyObj.cumulativeTransactionAmount}}</p>
                  <p class="p2" style="margin-bottom:0">累计交易额 (元)</p>
                </div>
                <div class="item">
                  <p class="p1">{{sumSurveyObj.cumulativeRefund}}</p>
                  <p class="p2" style="margin-bottom:0">累计退款 (元)</p>
                </div>
              </div>
              <div class="c">*今日退款/累计退款：仅统计已完成退款的金额</div>
            </div>
            <div class="order-box2">
              <div class="option-box" v-show="sumShowMoreMask">
                <div class="item" @click="sumChangeOrderType(1)">交易额</div>
                <div class="item" @click="sumChangeOrderType(2)">退款</div>
              </div>
              <div class="t-box">
                <div class="title">{{sumType | sumTypeFilter}}</div>
                <img src="../assets/dataIndex/more.png" alt="" class="more" @click="sumShowMore">
              </div>
              <div class="b-box">
                <div class="filter-box">
                  <div class="tour-btn">
                    <div class="tourDate" :class="{active: sumTimeType == 'day7'}" @click="sumChangeTime('day7')">近7日</div>
                    <div class="tourDate" :class="{active: sumTimeType == 'day30'}" @click="sumChangeTime('day30')">近30日</div>
                  </div>
                  <div class="line"></div>
                  <div class="tour-inputDate">
                    <input readonly type="text" class="tour-inp" id="sum-picker1" @click="sumInitPicker1" :value="sumPickerObj.start">
                    <span class="tour-text">-</span>
                    <input readonly type="text" class="tour-inp" id="sum-picker2" @click="sumInitPicker2" :value="sumPickerObj.end">
                  </div>
                </div>

                <div class="chart-box" id="sum-chart">

                </div>
              </div>
            </div>
            <div class="order-box3">
              <div class="title">数据详情</div>
              <table>
                <thead>
                <tr>
                  <td>日期</td>
                  <td>当日交易额</td>
                  <td>当日退款</td>
                  <!--<td>累计交易额</td>-->
                  <!--<td>累计退款</td>-->
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in sumDataTableArr">
                  <td>{{item.transactionDate | setdate}}</td>
                  <td>{{item.transactionAmount}}</td>
                  <td>{{item.refoundAmount}}</td>
                  <!--<td>{{item.cumulativeTransactionAmount|moneyFilter}}</td>-->
                  <!--<td>{{item.cumulativeRefund|moneyFilter}}</td>-->
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!--访问数据--马浩祝-->
          <div class="deal" v-show="isActive == 3">
            <div class="deal_top">
              <div class="deal_topTitle">
                <span class="deal_topTitle-1">昨日概况</span>
                <span class="deal_topTitle-2">数据更新至{{_dateObj.yesterday}}</span>
              </div>
              <div class="deal_topBox">
                <div class="deal_item">
                  <div class="deal_item-1">{{dealData.viewCount}}</div>
                  <div class="deal_item-2">访问次数</div>
                  <div class="deal_item-3">日环比
                    <template v-if="dealData.viewDailyRatio === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{dealData.viewDailyRatio}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="dealData.viewDailyRatio > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="dealData.viewDailyRatio == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: dealData.viewDailyRatio > 0,yellow: dealData.viewDailyRatio == 0 , green: dealData.viewDailyRatio < 0}">{{dealData.viewDailyRatio | nameFilter}}%</span>
                    </template>
                  </div>
                  <div class="deal_item-4">周同比
                    <template v-if="dealData.viewWeeklyRatio === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{dealData.viewWeeklyRatio}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="dealData.viewWeeklyRatio > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="dealData.viewWeeklyRatio == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: dealData.viewWeeklyRatio > 0,yellow: dealData.viewWeeklyRatio == 0 , green: dealData.viewWeeklyRatio < 0}">{{dealData.viewWeeklyRatio | nameFilter}}%</span>
                    </template>
                  </div>
                </div>
                <div class="deal_item">
                  <div class="deal_item-1">{{dealData.viewerCount}}</div>
                  <div class="deal_item-2">访问人数</div>
                  <div class="deal_item-3">日环比
                    <template v-if="dealData.viewerDailyRatio === '--'">
                      <div style="width: .15rem;margin: 0 .08rem;"></div>
                      <span>{{dealData.viewerDailyRatio}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="dealData.viewerDailyRatio > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="dealData.viewerDailyRatio == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: dealData.viewerDailyRatio > 0,yellow: dealData.viewerDailyRatio == 0 , green: dealData.viewerDailyRatio < 0}">{{dealData.viewerDailyRatio | nameFilter}}%</span>
                    </template>
                  </div>
                  <div class="deal_item-4">周同比
                    <template v-if="dealData.viewerWeeklyRatio === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{dealData.viewerWeeklyRatio}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="dealData.viewerWeeklyRatio > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="dealData.viewerWeeklyRatio == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: dealData.viewerWeeklyRatio > 0,yellow: dealData.viewerWeeklyRatio == 0 , green: dealData.viewerWeeklyRatio < 0}">{{dealData.viewerWeeklyRatio}}%</span>
                    </template>
                  </div>
                </div>
                <div class="deal_item">
                  <div class="deal_item-1">{{dealData.firstViewerCount}}</div>
                  <div class="deal_item-2">新访问人数</div>
                  <div class="deal_item-3">日环比
                    <template v-if="dealData.newViewerDailyRatio === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{dealData.newViewerDailyRatio}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="dealData.newViewerDailyRatio > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="dealData.newViewerDailyRatio == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: dealData.newViewerDailyRatio > 0, yellow: dealData.newViewerDailyRatio == 0 ,green: dealData.newViewerDailyRatio < 0}">{{dealData.newViewerDailyRatio}}%</span>
                    </template>
                  </div>
                  <div class="deal_item-4">周同比
                    <template v-if="dealData.newViewerWeeklyRatio === '--'">
                      <div style="width: .18rem;margin: 0 .08rem;"></div>
                      <span>{{dealData.newViewerWeeklyRatio}}%</span>
                    </template>
                    <template v-else>
                      <img src="../assets/dataIndex/sub.png" alt="" v-if="dealData.newViewerWeeklyRatio > 0">
                      <img src="../assets/dataIndex/equal.png" alt="" v-else-if="dealData.newViewerWeeklyRatio == 0">
                      <img src="../assets/dataIndex/add.png" alt="" v-else>
                      <span :class="{red: dealData.newViewerWeeklyRatio > 0,yellow: dealData.newViewerWeeklyRatio == 0 , green: dealData.newViewerWeeklyRatio < 0}">{{dealData.newViewerWeeklyRatio}}%</span>
                    </template>
                  </div>
                </div>
              </div>
              <div class="deal_trend">
                <div class="deal_trendTitle">今日趋势</div>
                <div class="deal_trendTag">
                  <div class="deal_trendTagI" style="background-color: #FF6F48;"></div>
                  <div class="deal_trendTagT">当前访问次数</div>
                  <div class="deal_trendTagI" style="background-color: #1CB2FF" @click="isShowYesterday" v-if="showYesterday"></div>
                  <div class="deal_trendTagI" style="background-color: rgba(203,203,203,1)" @click="isShowYesterday" v-if="!showYesterday"></div>
                  <div class="deal_trendTagT" @click="isShowYesterday">昨日</div>
                  <div class="deal_trendTagI" style="background-color: #BC6AFC" @click="isShow7day" v-if="show7day"></div>
                  <div class="deal_trendTagI" style="background-color: rgba(203,203,203,1)" @click="isShow7day" v-if="!show7day"></div>
                  <div class="deal_trendTagT" @click="isShow7day">7天前</div>
                </div>
                <div id="line" style="width: 6rem;height:2.85rem;"></div>

              </div>
            </div>
            <div class="deal_box">
              <div class="deal_boxTitle">
                <div class="deal_boxTitle-1">访问次数趋势</div>
                <div class="deal_boxTitle-2">
                  <div class="deal-btn">
                    <div class="deal_boxButton" :class="{active: isDeal_active == 'day7'}" @click="deal_Change('day7')">近7日</div>
                    <div class="deal_boxButton" :class="{active: isDeal_active == 'day30'}" @click="deal_Change('day30')">近30日</div>
                  </div>
                  <div class="deal_line"></div>
                  <div class="deal-inputDate">
                    <input readonly type="text" class="deal_boxTime" id="deal_startTime" @click="changeStart">
                    <span class="deal-text">-</span>
                    <input readonly type="text" class="deal_boxTime" id="deal_endTime" @click="changeEnd">
                  </div>
                </div>
              </div>
              <div class="deal_boxLine" id="line1"></div>
            </div>
            <div class="deal_detail">
              <div class="deal_detailTitle">详细数据</div>
              <table class="deal_table">
                <tr class="deal_th">
                  <th style="width: 50%">日期</th>
                  <th>访问次数</th>
                </tr>
                <tbody>
                <template v-for="(item,index) in tableList">
                  <tr class="deal_tbody">
                    <td>{{item.viewDay}}</td>
                    <td>{{item.viewCount}}</td>
                  </tr>
                </template>
                </tbody>
              </table>
            </div>
          </div>
          <!--游客--阿童-->
          <div class="tourist" v-show="isActive == 4">
            <p class="tour-tit">截止{{_dateObj.yesterday}} 23:59</p>
            <div class="tour-btn">
              <div class="tourDate" :class="{ dateActive: touristActive == 1}"  @click="tourChangeNav(1)">昨天</div>
              <div class="tourDate" :class="{ dateActive: touristActive == 2}"  @click="tourChangeNav(2)">近7日</div>
              <div class="tourDate" :class="{ dateActive: touristActive == 3}"  @click="tourChangeNav(3)">近30日</div>
            </div>
            <div class="tour-inputDate">
              <input readonly type="text" class="tour-inp" id="tour_start" @click="tourstaPicker">
              <span class="tour-text">-</span>
              <input readonly type="text" class="tour-inp" id="tour_end" @click="tourendPicker">
            </div>
            <div class="tour-gender">
              <p class="gender">游客性别</p>
              <div class="gender-pie" id="tour_chart1" style="width:6.4rem;height: 5rem"></div>
            </div>
            <div class="tour-gender">
              <p class="gender">客源地 <span>展示前10名客源地城市</span></p>
              <div class="gender-pie" id="tour_chart2" style="width:6.4rem;height: 7rem"></div>
            </div>
            <div class="tour-gender">
              <p class="gender">游客年龄</p>
              <div class="gender-pie" id="tour_chart3" style="width:6.4rem;height: 5rem"></div>
            </div>

          </div>


        </div>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
        name: "dataIndex",
      data(){
        return{
          // 数据命名以verify为前缀开头-----浩祝
          //核销数据开始
          isVerify_active: 'day7',
          selectTap_active: 0,
          verify_productNum: 0,
          verify_verifyNum: 0,
          verify_validPlanVerifyNum: 0, //有效期待核销
          verify_totalVerifyNum: 0,
          todayEnterCar: 0,
          accumulativeEnterCar: 0,
          verify_startTime: '',
          verify_endTime: '',
          totalVerifyNum: 0,
          totalPlanVerifyNum: 0,
          totalFreeNum: 0,
          showAllName: true,
          isShowAllNameList: [],
          verify_tableDayVerify: [],//日核销
          verify_tableProduct: [],//购票产品核销比
          verify_tableFreeProduct: [],//免票产品核销比
          verify_tableData: [], //预约核销比
          verify_Time: DateFormat.format(new Date(), 'yyyy-MM-dd hh:mm'),
          isVIPGroup:'',//是不是唐村的
          ticorVIP_active:0,//切换门票还是VIP团
          isTeamOrvip_active:0,//按团还是按人
          hxOrCP_active:2,//数据详情的选中
          todayDestineEnterCar:'',//今日预订车辆
          //核销数据结束

          //访问数据开始
          dealData:{
            viewCount: 0,
            viewDailyRatio: '',  //日
            viewWeeklyRatio: '', //周
            viewerCount: 0,
            viewerDailyRatio: '',
            viewerWeeklyRatio: '',
            firstViewerCount: 0,
            newViewerDailyRatio: '',
            newViewerWeeklyRatio: '',
            //访问次数趋势折线图数据
            todayView: '',
            yesterdayView: '',
            lastWeekDayView: '',
          },
          tableList:[],
          isDeal_active: 'day7',
          showYesterday: true,
          show7day: false,
          //访问数据结束

          // 数据命名以order为前缀开头-----晓彤
          isActive:0,
          // 阿童定义的数据
          touristActive:1,
          //订单统计 开始===================
          orderSurveyObj: {},
          orderTimeType: 'day7',
          orderPickerObj: {
            start: '',
            end: '',
          },
          orderShowMoreMask: false,
          orderType: 1,
          orderDataTableArr: [],
          //订单统计 结束===================
          //交易额统计 开始===================
          sumSurveyObj: {},
          sumTimeType: 'day7',
          sumPickerObj: {
            start: '',
            end: '',
          },
          sumShowMoreMask: false,
          sumType:1,
          sumDataTableArr: [],
          //交易额统计 结束===================
          defaultOffset: 50, // 默认高度, 相应的修改.releshMoudle的margin-top和.down-tip, .up-tip, .refresh-tip的height
          top: 0,
          scrollIsToTop: 0,
          startY: 0,
          isDropDown: false, // 是否下拉
          isRefreshing: false, // 是否正在刷新
          dropDownState: 1, // 显示1:下拉可以刷新, 2:松开立即刷新, 3:正在刷新数据中...
          dropDownInfo: {
            downText: '下拉可以刷新',
            upText: '松开立即刷新',
            refreshText: '正在刷新数据...',
          }
        }
      },
      filters: {
        orderTypeFilter(val){
          return {
            1: '全部订单',
            2: '付款订单',
            3: '退款订单',
          }[val]
        },
        sumTypeFilter(val){
          return {
            1: '交易额',
            2: '退款',
          }[val]
        },
        setdate(val) {
          let dateTime = val.slice(5);
          return dateTime;
        },
        moneyFilter(val) {
          let num = Math.floor(val);
          return num;
        },
        dataTypeFilter(val) {
          return {
            1: '有效期模式',
            2: '使用日期模式',
          }[val]
        },
        nameFilter(val) {
          let name;
          if(val){
            // console.log(val.length)
            if(val.length > 7){
              name = val.split('.')[0]
            }else{
              name = val
            }
            return name;
          }
        },
        productNameFilter(val) {
          let that = this;
          let name;
          if(val){
            let productName = val.replace(/\s+/g,"");
            // console.log(productName.length)
            if(productName.length > 7){
              that.isShowAll = false;
              name = productName.slice(0, 7)+'->'
            }else{
              that.isShowAll = true;
              name = val
            }
            return name;
          }
        },
      },
      created() {
        // 今天、昨天、近七天，近30天
        this._dateObj = {
          today: DateFormat.format(new Date(), 'yyyy-MM-dd'),
          yesterday: DateFormat.format(DateFormat.reduceDay(new Date(), 1), 'yyyy-MM-dd'),
          day7: DateFormat.format(DateFormat.reduceDay(new Date(), 6), 'yyyy-MM-dd'),//7天之前
          day7After: DateFormat.format(DateFormat.addDay(new Date(), 6), 'yyyy-MM-dd'),//7天之后
          day30: DateFormat.format(DateFormat.reduceDay(new Date(), 30), 'yyyy-MM-dd'),//30天之前
        };
        if (document.querySelector('.down-tip')) {
          // 获取不同手机的物理像素（dpr）,以便适配rem
          this.defaultOffset = document.querySelector('.down-tip').clientHeight || this.defaultOffset
          console.log(this.defaultOffset)
        }
      },
      mounted: function () {
        this.getVerifyData();
      },
      methods: {
        /**
         * 触摸开始，手指点击屏幕时
         * @param {object} e Touch 对象包含的属性
         */
        touchStart (e) {
          this.startY = e.targetTouches[0].pageY
        },
        /**
         * 接触点改变，滑动时
         * @param {object} e Touch 对象包含的属性
         */
        touchMove (e) {
          this.scrollIsToTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop // safari 获取scrollTop用window.pageYOffset
          if (e.targetTouches[0].pageY > this.startY) {
            // 下拉
            this.isDropDown = true
            if (this.scrollIsToTop === 0 && !this.isRefreshing) {
              // 拉动的距离
              let diff = e.targetTouches[0].pageY - this.startY - this.scrollIsToTop
              this.top = Math.pow(diff, 0.8) + (this.dropDownState === 3 ? this.defaultOffset : 0)
              if (this.top >= this.defaultOffset) {
                this.dropDownState = 2
                e.preventDefault()
              } else {
                this.dropDownState = 1
                // 去掉会导致ios无法刷新
                e.preventDefault()
              }
            }
          } else {
            this.isDropDown = false
            this.dropDownState = 1
          }
        },
        /**
         * 触摸结束，手指离开屏幕时
         * @param {object} e Touch 对象包含的属性
         */
        touchEnd (e) {
          if (this.isDropDown && !this.isRefreshing) {
            if (this.top >= this.defaultOffset) {
              // do refresh
              this.refresh()
              this.isRefreshing = true
            } else {
              // cancel refresh
              this.isRefreshing = false
              this.isDropDown = false
              this.dropDownState = 1
              this.top = 0
            }
          }
        },

        /**
         * 刷新
         */
        refresh () {
          this.dropDownState = 3
          this.top = this.defaultOffset
          // 这是全是静态数据,延时1200毫秒，给用户一个刷新的感觉，如果是接口数据的话，直接调接口即可
          setTimeout(() => {
            if(this.isActive == 0){
              this.getVerifyData();
            }else if(this.isActive == 1){
              this.orderTimeType = 'day7'
              this.orderChangeTime('day7')
              this.orderSurvey();
              /*this.orderTrend();
              this.orderTableData();*/
            }else if(this.isActive == 2){
              this.sumTimeType = 'day7'
              this.sumChangeTime('day7')
              this.sumSurvey();
              /*this.orderTrend();
              this.orderTableData();*/
            }else if(this.isActive == 3){
              this.showYesterday = true;
              this.show7day = false;
              this.getdealData();
            }else if(this.isActive == 4){
              this.touristActive = 1;
              this.tourInitChart();
              this.tourGetgender();
              this.tourGetcity();
              this.tourGetage();
            }
            this.refreshDone();
          }, 1200)
        },
        /**
         * 刷新完成
         */
        refreshDone () {
          this.isRefreshing = false
          this.isDropDown = false
          this.dropDownState = 1
          this.top = 0
        },

        //切换导航
        changeNav: function (val) {
          this.isActive = val;
          this.verify_Time = DateFormat.format(new Date(), 'yyyy-MM-dd hh:mm');

          if(val == 0){
            this.getVerifyData();
          }else if(val == 1){
            this.orderTimeType = 'day7'
            this.orderChangeTime('day7')
            this.orderSurvey();
            /*this.orderTrend();
            this.orderTableData();*/
          }else if(val == 2){
            this.sumTimeType = 'day7'
            this.sumChangeTime('day7')
            this.sumSurvey();
            /*this.orderTrend();
            this.orderTableData();*/
          }else if(val == 3){
            this.showYesterday = true;
            this.show7day = false;
            this.getdealData();
          }else if(val == 4){
            this.touristActive = 1;
            this.tourInitChart();
            this.tourGetgender();
            this.tourGetcity();
            this.tourGetage();
          }

        },


        //切换统计方式
        select_Change(val){
          this.selectTap_active = val;
          this.isVerify_active = 'day7';
          this.verify_Change('day7')
        },
        // 函数命名以verify为前缀开头-----浩祝
        verify_Change:function(val){
          this.isVerify_active = val;
          if(val == 'day7After'){
            this.verify_startTime = this._dateObj.today;
            this.verify_endTime = this._dateObj[this.isVerify_active];
          }else{
            this.verify_startTime = this._dateObj[this.isVerify_active];
            this.verify_endTime = this._dateObj.today;
          }
          // console.log(this.verify_endTime);
          if(this.selectTap_active === 0){
            this.getEveryDayVerifyNum();
          }else if(this.selectTap_active === 1){
            this.productVerifyNum();
          }else if(this.selectTap_active === 2) {
            this.verifyReservationRadio();
          }
          this.verifyNumBytoday();
        },
        isShowAllName(index){
          this.isShowAllNameList[index].isShowOrNot = (this.isShowAllNameList[index].isShowOrNot === false ? true : false);
          // console.log(index)
        },
        getVerifyData:function(){
          _AJAX({
            url: AJAX_URL_USER + "/api/manager/scenicSpot/getScenicName",
            type: 'get',
            success: (res) => {
              if (res.code === 0) {
                this.isVIPGroup = res.data.isVIPGroup;
              }else{
                layer.msg(res.msg);
              }
            }
          });
          this.ticorVIP_active = 0
          this.verifyNumBytoday();
          this.selectTap_active = 0;
          this.isVerify_active = 'day7';
          this.verify_Change('day7')
        },
        // 门票还是vip团的btn切换
        ticorVIP(type){
          this.ticorVIP_active = type;
          if(this.ticorVIP_active == 0){
            //普通的门票
            this.verifyNumBytoday();
            this.selectTap_active = 0;
            this.isVerify_active = 'day7';
            this.verify_Change('day7')
          }else {
            this.hxOrCP_active = 2;
            this.vip_verify_Change('day7');

          }
        },
        vip_verify_Change:function(val){
          this.isVerify_active = val;
          if(val == 'day7After'){
            this.verify_startTime = this._dateObj.today;
            this.verify_endTime = this._dateObj[this.isVerify_active];
          }else{
            this.verify_startTime = this._dateObj[this.isVerify_active];
            this.verify_endTime = this._dateObj.today;
          }
          if(this.isTeamOrvip_active == 0){
            this.viptBytoday();
            if(this.hxOrCP_active == 2){
              this.vipTverifyReservation();
            }else if(this.hxOrCP_active == 1){
              this.vipTproductVerifyNum();
            }
          }else {
            this.viprBytoday();
            if(this.hxOrCP_active == 2){
              this.vipRverifyReservation();
            }else if(this.hxOrCP_active == 1){
              this.vipRproductVerifyNum();
            }
          }
        },
        // 按团统计还是按人数统计的btn切换
        isTeamOrvip(type){
          this.isTeamOrvip_active = type;
          if(this.isTeamOrvip_active == 0){
            this.viptBytoday();
            if(this.hxOrCP_active == 2){
              this.vipTverifyReservation();
            }else if(this.hxOrCP_active == 1){
              this.vipTproductVerifyNum();
            }
          }else {
            this.viprBytoday();
            if(this.hxOrCP_active == 2){
              this.vipRverifyReservation();
            }else if(this.hxOrCP_active == 1){
              this.vipRproductVerifyNum();
            }
          }
        },
        // 核销预约比还是产品的btn切换
        hxOrCP_Change(type){
          this.hxOrCP_active = type;
          if(this.isTeamOrvip_active == 0){
            this.viptBytoday();
            if(this.hxOrCP_active == 2){
              this.vipTverifyReservation();
            }else if(this.hxOrCP_active == 1){
              this.vipTproductVerifyNum();
            }
          }else {
            this.viprBytoday();
            if(this.hxOrCP_active == 2){
              this.vipRverifyReservation();
            }else if(this.hxOrCP_active == 1){
              this.vipRproductVerifyNum();
            }
          }

        },
        //获取vip按团今日已核销与预定
        viptBytoday:function(){
          _AJAX({
            url: AJAX_URL_USER + "/api/report/verify/verifyVIPOrderNumBytoday",
            type: 'get',
            success: (res) => {
              if (res.code === 0) {
                if(res.data != null){
                  this.verify_productNum = res.data.productNum;
                  this.verify_verifyNum =  res.data.verifyNum;
                  this.verify_validPlanVerifyNum =  res.data.validPlanVerifyNum;
                  this.verify_totalVerifyNum =  res.data.totalVerifyNum;
                  this.todayEnterCar =  res.data.todayEnterCar;
                  this.accumulativeEnterCar =  res.data.accumulativeEnterCar;
                  this.todayDestineEnterCar = res.data.todayDestineEnterCar;

                }
              }else{
                layer.msg(res.msg);
              }
            }
          });
        },
        //获取vip按人今日已核销与预定
        viprBytoday:function(){
          _AJAX({
            url: AJAX_URL_USER + "/api/report/verify/verifyVIPPeopleNumBytoday",
            type: 'get',
            success: (res) => {
              if (res.code === 0) {
                if(res.data != null){
                  this.verify_productNum = res.data.productNum;
                  this.verify_verifyNum =  res.data.verifyNum;
                  this.verify_validPlanVerifyNum =  res.data.validPlanVerifyNum;
                  this.verify_totalVerifyNum =  res.data.totalVerifyNum;
                  this.todayEnterCar =  res.data.todayEnterCar;
                  this.accumulativeEnterCar =  res.data.accumulativeEnterCar;
                  this.todayDestineEnterCar = res.data.todayDestineEnterCar;

                }
              }else{
                layer.msg(res.msg);
              }
            }
          });
        },
        //按团统计的核销预约比
        vipTverifyReservation:function(){
          let data  = {
            startTime:this.verify_startTime,
            endTime:this.verify_endTime
          }
          _AJAX({
            url: AJAX_URL_USER + "/api/report/verify/verifyVIPReservationRadio",
            type: 'post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: (res) => {
              if (res.code === 0) {
                this.verify_tableData = res.data
              }else{
                layer.msg(res.msg);
              }
            }
          });
        },
        //按人数统计的核销预约比
        vipRverifyReservation:function(){
          let data  = {
            startTime:this.verify_startTime,
            endTime:this.verify_endTime
          }
          _AJAX({
            url: AJAX_URL_USER + "/api/report/verify/verifyVIPPeopleReservationRadio",
            type: 'post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: (res) => {
              if (res.code === 0) {
                this.verify_tableData = res.data
              }else{
                layer.msg(res.msg);
              }
            }
          });
        },
        //按团进行产品核销统计
        vipTproductVerifyNum:function(){
          _AJAX({
            url: AJAX_URL_USER + "/api/report/verify/productVerifyOrderNum",
            type: 'post',
            contentType: "application/json; charset=utf-8",
            success: (res) => {
              if (res.code === 0) {
                this.verify_tableProduct = res.data.ticketVerifyNumVOS;
                this.totalVerifyNum = 0;
                this.totalPlanVerifyNum = 0;
                this.verify_tableProduct.forEach((item)=>{
                  if((item.productName.replace(/\s+/g,'').length)>7){
                    this.isShowAllNameList.push({
                      isShowOrNot:false
                    })
                  }else{
                    this.isShowAllNameList.push({
                      isShowOrNot:true
                    })
                  }
                  this.totalVerifyNum = this.totalVerifyNum + item.verifyNum;
                  this.totalPlanVerifyNum = this.totalPlanVerifyNum + item.planVerifyNum;
                })
                this.totalFreeNum = 0;

              }else{
                layer.msg(res.msg);
              }
            }
          });
        },
        //按人数进行产品核销统计
        vipRproductVerifyNum:function(){
          _AJAX({
            url: AJAX_URL_USER + "/api/report/verify/productVerifyPeopleNum",
            type: 'post',
            contentType: "application/json; charset=utf-8",
            success: (res) => {
              if (res.code === 0) {
                this.verify_tableProduct = res.data.ticketVerifyNumVOS;
                this.totalVerifyNum = 0;
                this.totalPlanVerifyNum = 0;
                this.verify_tableProduct.forEach((item)=>{
                  if((item.productName.replace(/\s+/g,'').length)>7){
                    this.isShowAllNameList.push({
                      isShowOrNot:false
                    })
                  }else{
                    this.isShowAllNameList.push({
                      isShowOrNot:true
                    })
                  }
                  this.totalVerifyNum = this.totalVerifyNum + item.verifyNum;
                  this.totalPlanVerifyNum = this.totalPlanVerifyNum + item.planVerifyNum;
                })
                this.totalFreeNum = 0;

              }else{
                layer.msg(res.msg);
              }
            }
          });
        },
        changeStartTime:function(){
          this.isVerify_active = ''
          let that = this;
          weui.datePicker({
            end: that.verify_endTime,
            onChange: function(result){
              console.log(result);
            },
            onConfirm: function(result){
              that.verify_startTime = DateFormat.format(new Date(result[0].value + '/'+result[1].value + '/'+result[2].value), 'yyyy-MM-dd');
              if(that.selectTap_active === 0){
                that.getEveryDayVerifyNum();
              }else if(that.selectTap_active === 1){
                // that.productVerifyNum();
              }else if(that.selectTap_active === 2) {
                that.verifyReservationRadio();
              }
            },
            id: 'verify_Start'
          });
        },
        changeEndTime:function(){
          this.isVerify_active = ''
          let that = this;
          weui.datePicker({
            start: that.verify_startTime,
            onChange: function(result){
              console.log(result);
            },
            onConfirm: function(result){
              that.verify_endTime = DateFormat.format(new Date(result[0].value + '/'+result[1].value + '/'+result[2].value), 'yyyy-MM-dd');
              if(that.selectTap_active === 0){
                that.getEveryDayVerifyNum();
              }else if(that.selectTap_active === 1){
                // that.productVerifyNum();
              }else if(that.selectTap_active === 2) {
                that.verifyReservationRadio();
              }
            },
            id: 'verify_End'
          });
        },
        //获取今日已核销与预定
        verifyNumBytoday:function(){
          _AJAX({
            url: AJAX_URL_USER + "/api/report/verify/verifyNumBytoday",
            type: 'get',
            success: (res) => {
              if (res.code === 0) {
                if(res.data != null){
                  this.verify_productNum = res.data.productNum;
                  this.verify_verifyNum =  res.data.verifyNum;
                  this.verify_validPlanVerifyNum =  res.data.validPlanVerifyNum;
                  this.verify_totalVerifyNum =  res.data.totalVerifyNum;
                  this.todayEnterCar =  res.data.todayEnterCar;
                  this.accumulativeEnterCar =  res.data.accumulativeEnterCar;

                }
              }else{
                layer.msg(res.msg);
              }
            }
          });
        },
        //日核销统计
        getEveryDayVerifyNum:function(){
          let data  = {
            startTime:this.verify_startTime,
            endTime:this.verify_endTime
          }
          _AJAX({
            url: AJAX_URL_USER + "/api/report/verify/getEveryDayVerifyNum",
            type: 'post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: (res) => {
              if (res.code === 0) {
                this.verify_tableDayVerify = res.data
              }else{
                layer.msg(res.msg);
              }
            }
          });
        },
        //产品核销统计
        productVerifyNum:function(){
          _AJAX({
            url: AJAX_URL_USER + "/api/report/verify/productVerifyNum",
            type: 'post',
            contentType: "application/json; charset=utf-8",
            success: (res) => {
              if (res.code === 0) {
                this.verify_tableProduct = res.data.ticketVerifyNumVOS;
                this.verify_tableFreeProduct = res.data.freeVerifyNums;
                this.totalVerifyNum = 0;
                this.totalPlanVerifyNum = 0;
                this.verify_tableProduct.forEach((item)=>{
                  if((item.productName.replace(/\s+/g,'').length)>7){
                    this.isShowAllNameList.push({
                      isShowOrNot:false
                    })
                  }else{
                    this.isShowAllNameList.push({
                      isShowOrNot:true
                    })
                  }
                  this.totalVerifyNum = this.totalVerifyNum + item.verifyNum;
                  this.totalPlanVerifyNum = this.totalPlanVerifyNum + item.planVerifyNum;
                })
                this.totalFreeNum = 0;
                this.verify_tableFreeProduct.forEach((item)=>{
                  this.totalFreeNum = this.totalFreeNum + item.verifyNum;
                })
              }else{
                layer.msg(res.msg);
              }
            }
          });
        },
        //核销预约比统计
        verifyReservationRadio:function(){
          let data  = {
            startTime:this.verify_startTime,
            endTime:this.verify_endTime
          }
          _AJAX({
            url: AJAX_URL_USER + "/api/report/verify/verifyReservationRadio",
            type: 'post',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: (res) => {
              if (res.code === 0) {
                this.verify_tableData = res.data
              }else{
                layer.msg(res.msg);
              }
            }
          });
        },



        //访问统计相关 开始============================
        //函数命名以deal为前缀开头-----浩祝
        deal_Change:function(val){
          this.isDeal_active = val;
          if(val == 'day7'){
            $('#deal_startTime').val(this._dateObj.day7);
            $('#deal_endTime').val(this._dateObj.today);
          }else if(val == 'day30'){
            $('#deal_startTime').val(this._dateObj.day30);
            $('#deal_endTime').val(this._dateObj.today);
          }
          this.dealGetList();
        },
        getdealData:function(){
          this.dealGetStatisInfo();
          this.isDeal_active = 'day7';
          $('#deal_startTime').val(this._dateObj.day7);
          $('#deal_endTime').val(this._dateObj.today);
          this.dealGetList();
        },
        changeStart:function(){
          this.isDeal_active = '';
          let that = this;
          weui.datePicker({
            end: $('#deal_endTime').val(),
            onChange: function(result){
              console.log(result);
            },
            onConfirm: function(result){
              $('#deal_startTime').val(DateFormat.format(new Date(result[0].value + '/'+result[1].value + '/'+result[2].value), 'yyyy-MM-dd'));
              that.dealGetList();
            },
            id: 'deal_startTime'
          });
        },
        changeEnd:function(){
          this.isDeal_active = '';
          let that = this;
          weui.datePicker({
            start: $('#deal_startTime').val(),
            onChange: function(result){
              console.log(result);
            },
            onConfirm: function(result){
              $('#deal_endTime').val(DateFormat.format(new Date(result[0].value + '/'+result[1].value + '/'+result[2].value), 'yyyy-MM-dd'));
              that.dealGetList();
            },
            id: 'deal_endTime'
          });
        },
        isShowYesterday:function(){
          if(this.showYesterday === true){
            this.showYesterday = false
          }else if(this.showYesterday === false){
            this.showYesterday = true
          }
          this.dealGetStatisInfo()
        },
        isShow7day:function(){
          if(this.show7day === true){
            this.show7day = false
          }else if(this.show7day === false){
            this.show7day = true
          }
          this.dealGetStatisInfo()
        },
        //获取访问数据
        dealGetStatisInfo:function(){
          _AJAX({
            url: AJAX_URL_USER + "/api/report/stat/view/getStatisInfo",
            type: 'get',
            success: (res) => {
              if (res.code === 0) {
                this.dealData = res.data
                let todayView = res.data.todayView;
                let yesterdayView = [];
                let lastWeekDayView = res.data.lastWeekDayView;
                if(this.showYesterday === true){
                  yesterdayView = res.data.yesterdayView;
                }else{
                  yesterdayView = [];
                }
                if(this.show7day === true){
                  lastWeekDayView = res.data.lastWeekDayView;
                }else{
                  lastWeekDayView = [];
                }
                this.deal_drawLine(todayView,yesterdayView,lastWeekDayView)
              }else{
                layer.msg(res.msg);
              }
            }
          });
        },
        //按照日期查找相关列表
        dealGetList:function(){
          let viewDayBegin = $('#deal_startTime').val();
          let viewDayEnd =  $('#deal_endTime').val();
          _AJAX({
            url: AJAX_URL_USER + "/api/report/stat/view/getList?viewDayBegin=" + viewDayBegin + '&viewDayEnd='+ viewDayEnd,
            type: 'get',
            success: (res) => {
              if (res.code === 0) {
                this.tableList = res.data.desc;
                // console.log(this.tableList)
                let list = res.data.asc;
                let CountList = [];
                let DayList = [];
                list.forEach((item)=>{
                  DayList.push(item.viewDay);
                  CountList.push(item.viewCount)
                })
                this.deal_drawLine1(DayList,CountList)
              }else{
                layer.msg(res.msg);
              }
            }
          });
        },
        //今日趋势折线图
        deal_drawLine:function(todayView,yesterdayView,lastWeekDayView){
          let myChart = echarts.init(document.getElementById('line'));
          let myOption = {
            tooltip : {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                //xy轴十字架指示数值背景区域色
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            textStyle: {
              color: '#466293'
            },
            legend: {
              top: 0
            },
            //简单说grid是控制边距的
            grid: {
              top:'4%',
              left: '0%',
              right: '5%',
              bottom: '0',
              containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                boundaryGap : false,
                data : ['0时','1时','2时','3时','4时','5时','6时','7时','8时','9时','10时','11时',
                  '12时','13时','14时','15时','16时','17时','18时','19时','20时','21时','22时','23时'],
                axisLabel: {
                  show: true,
                  textStyle: {
                    fontSize: '.24rem',
                    color: '#7E7F81',
                    fontFamily: 'Source Han Sans CN'
                  },
                  interval: 2
                },
                axisTick: {
                  show: false,
                  lineStyle: {
                    color: '#00345c',
                  }
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#00A795',
                  }
                }
              }
            ],
            yAxis : [
              {
                type : 'value',
                //y轴文字属性设置
                axisLabel: {
                  textStyle: {
                    fontSize: '.24rem',
                    color: '#7E7F81',
                    fontFamily: 'Source Han Sans CN'
                  },
                  formatter: '{value}'
                },
                //y轴横向分割线颜色
                splitLine: {
                  show: true,
                  lineStyle: {
                    type:'dashed',
                    color: '#EAEAEA'
                  }
                },
                //y轴刻度线颜色
                axisTick: {
                  show: false,
                },
                //y轴边框颜色
                axisLine: {
                  show: false,
                }
              }
            ],
            series : [
              {
                name:'当前访问次数',
                type:'line',
                symbol: 'circle',
                areaStyle: {
                  normal:{
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#FF6F48'
                    }, {
                      offset: 1,
                      color: '#FFFFFF'
                    }]),
                    opacity: 0.5,
                  }
                },
                itemStyle: {
                  normal:{
                    color: '#FF6F48'
                  }
                },
                // data:[120, 400, 350, 134, 90, 230, 210,110]
                data:todayView
              },
              {
                name:'昨日',
                type:'line',
                symbol: 'circle',
                areaStyle: {
                  normal:{
                    // color: '#BC6AFC',
                    opacity: 0.5,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#1CB2FF'
                    }, {
                      offset: 1,
                      color: '#FFFFFF'
                    }])
                  }
                },
                itemStyle: {
                  normal:{
                    color: '#1CB2FF'
                  }
                },
                // data:[220, 182, 191, 234, 290, 330, 310,440]
                data:yesterdayView
              },
              {
                name:'7天前',
                type:'line',
                symbol: 'circle',
                areaStyle: {
                  normal:{
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#BC6AFC'
                    }, {
                      offset: 1,
                      color: '#FFFFFF'
                    }]),
                    opacity: 0.5,
                  }

                },
                itemStyle: {
                  normal:{
                    color: '#BC6AFC'
                  }
                },
                // data:[150, 232, 201, 154, 190, 330, 410,550]
                data:lastWeekDayView
              },
            ]
          };
          myChart.setOption(myOption);
        },

        deal_drawLine1:function(DayList,CountList){
          let myChart = echarts.init(document.getElementById('line1'));
          let myOption1 = {
            tooltip : {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                //xy轴十字架指示数值背景区域色
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            textStyle: {
              color: '#466293'
            },
            legend: {
              top: 0
            },
            //简单说grid是控制边距的
            grid: {
              top:'4%',
              left: '4%',
              right: '10%',
              bottom: '0',
              containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                boundaryGap : false,
                data : DayList,
                // data:['2020-03-02','2020-03-02'],
                axisLabel: {
                  show: true,
                  textStyle: {
                    fontSize: '.24rem',
                    color: '#7E7F81',
                    fontFamily: 'Source Han Sans CN'
                  }
                },
                axisTick: {
                  show: false,
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#00A795',
                  }
                }
              }
            ],
            yAxis : [
              {
                type : 'value',
                //y轴文字属性设置
                axisLabel: {
                  textStyle: {
                    fontSize: '.24rem',
                    color: '#7E7F81',
                    fontFamily: 'Source Han Sans CN'
                  },
                  formatter: '{value}'
                },
                //y轴横向分割线颜色
                splitLine: {
                  show: true,
                  lineStyle: {
                    type:'dashed',
                    color: '#EAEAEA'
                  }
                },
                //y轴刻度线颜色
                axisTick: {
                  show: false,
                },
                //y轴边框颜色
                axisLine: {
                  show: false,
                }
              }
            ],
            series : [
              {
                name:'当前访问次数',
                type:'line',
                symbol: 'circle',
                itemStyle: {
                  normal:{
                    color: '#00A795',
                  }
                },
                data:CountList
                // data:[158,153]
              },
            ]
          };
          myChart.setOption(myOption1);
        },


        //订单统计相关 开始============================
        //概况
        orderSurvey(){
          _AJAX({
            url: AJAX_URL_USER + '/api/report/order/survey',
            success: (data) => {
              this.orderSurveyObj = data.data;
            }
          })
        },
        //折线图
        orderTrend(){
          if (!this.orderPickerObj.start) {
            this.orderPickerObj.start = this._dateObj.day7
          }
          if (!this.orderPickerObj.end) {
            this.orderPickerObj.end = this._dateObj.today
          }
          _AJAX({
            url: AJAX_URL_USER + '/api/report/order/trend',
            data: {
              startDate: this.orderPickerObj.start,
              endDate: this.orderPickerObj.end,
              orderType: this.orderType,
            },
            success: (data) => {
              let dataObj = data.data;
              this._orderChart = echarts.init(document.getElementById('order-chart'));
              var option = {
                tooltip: {
                  trigger: 'axis',
                  formatter: '{b}: {c}单'
                },
                textStyle: {
                  color: '#7E7F81'
                },
                xAxis: {
                  type: 'category',
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#00A795'
                    }
                  },
                  boundaryGap: false,
                  data: dataObj.times
                },
                yAxis: {
                  // name: '(人)',
                  nameGap: 8,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    show: false
                  },
                  nameTextStyle: {
                    fontSize: 10
                  },
                  type: 'value',
                  splitLine: {
                    show: false,
                  }
                },
                grid: {left: '12%', top: "8%", bottom: "18%", right: "12%"},
                series: [{
                  data: dataObj.count,
                  type: 'line',
                  smooth: true,
                  symbol: 'circle',
                  // showSymbol: false,
                  itemStyle: {
                    normal: {
                      color: '#00A795'
                    }
                  }

                }]
              };
              this._orderChart.setOption(option);
            }
          })
        },
        //数据详情
        orderTableData(){
          if (!this.orderPickerObj.start) {
            this.orderPickerObj.start = this._dateObj.day7
          }
          if (!this.orderPickerObj.end) {
            this.orderPickerObj.end = this._dateObj.today
          }
          _AJAX({
            url: AJAX_URL_USER + '/api/report/order/data',
            data: {
              startDate: this.orderPickerObj.start,
              endDate: this.orderPickerObj.end,
            },
            success: (data) => {
              this.orderDataTableArr = data.data
            }
          })
        },
        orderChangeTime(type){
          this.orderTimeType = type;
          this.orderPickerObj.start = this._dateObj[this.orderTimeType];
          this.orderPickerObj.end = this._dateObj.today;
          this.orderTrend();
          this.orderTableData()
        },
        orderInitPicker1(){
          this.orderTimeType = 0
          let that = this;
          weui.datePicker({
            onConfirm: function(result){
              that.orderPickerObj.start = DateFormat.format(new Date(result[0].value + '/' + result[1].value + '/' + result[2].value), 'yyyy-MM-dd')
              that.orderTrend();
              that.orderTableData();
            },
            id: 'order-picker1'
          });
        },
        orderInitPicker2(){
          this.orderTimeType = 0
          let that = this;
          weui.datePicker({
            onConfirm: function(result){
              that.orderPickerObj.end = DateFormat.format(new Date(result[0].value + '/' + result[1].value + '/' + result[2].value), 'yyyy-MM-dd')
              that.orderTrend();
              that.orderTableData();
            },
            id: 'order-picker2'
          });
        },
        //显示订单选项
        orderShowMore(){
          this.orderShowMoreMask = true
        },
        //改变订单类型
        orderChangeOrderType(orderType){
          this.orderShowMoreMask = false;
          this.orderType = orderType;
          this.orderTrend();
        },
        //订单统计相关 结束============================
        // 交易额统计  开始======================
        //概况
        sumSurvey(){
          _AJAX({
            url: AJAX_URL_USER + '/api/report/transaction/transactionCountToday',
            type:'post',
            success: (data) => {
              this.sumSurveyObj = data.data;
            }
          })
        },
        //折线图及数据表格
        sumTrend(){
          if (!this.sumPickerObj.start) {
            this.sumPickerObj.start = this._dateObj.day7
          }
          if (!this.sumPickerObj.end) {
            this.sumPickerObj.end = this._dateObj.today
          }
          _AJAX({
            url: AJAX_URL_USER + '/api/report/transaction/transactionCountHistory',
            data: JSON.stringify({
              startTime: this.sumPickerObj.start,
              endTime: this.sumPickerObj.end,
            }),
            contentType: "application/json; charset=utf-8",
            type:'post',
            success: (data) => {
              this.sumDataTableArr = data.data;
              let date = [];
              let amount = [];
              let refound = [];
              let yData;
              for(var i = 0; i<this.sumDataTableArr.length;i++){
                let dateTime = this.sumDataTableArr[i].transactionDate.slice(5);
                date.unshift(dateTime);
                amount.unshift(this.sumDataTableArr[i].transactionAmount);
                refound.unshift(this.sumDataTableArr[i].refoundAmount);
              }
              if(this.sumType == 1){
                yData = amount;
              }else {
                yData = refound;
              }
              // console.log(date);
              // console.log(amount);
              // console.log(refound);
              this._sumChart = echarts.init(document.getElementById('sum-chart'));
              var option = {
                tooltip: {
                  trigger: 'axis',
                  formatter: '{b}: {c}元'
                },
                textStyle: {
                  color: '#7E7F81'
                },
                xAxis: {
                  type: 'category',
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#00A795'
                    }
                  },
                  boundaryGap: false,
                  data: date,
                },
                yAxis: {
                  // name: '(人)',
                  nameGap: 8,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    show: false
                  },
                  nameTextStyle: {
                    fontSize: 10
                  },
                  type: 'value',
                  splitLine: {
                    show: false,
                  }
                },
                grid: {left: '17%', top: "8%", bottom: "18%", right: "9%"},
                series: [{
                  data: yData,
                  type: 'line',
                  smooth: true,
                  symbol: 'circle',
                  // showSymbol: false,
                  itemStyle: {
                    normal: {
                      color: '#00A795'
                    }
                  }

                }]
              };
              this._sumChart.setOption(option);
            }
          })
        },

        sumChangeTime(type){
          this.sumTimeType = type;
          this.sumPickerObj.start = this._dateObj[this.sumTimeType];
          this.sumPickerObj.end = this._dateObj.today;
          this.sumTrend();
        },
        sumInitPicker1(){
          this.sumTimeType = 0
          let that = this;
          weui.datePicker({
            end: that.sumPickerObj.end,
            onConfirm: function(result){
              that.sumPickerObj.start = DateFormat.format(new Date(result[0].value + '/' + result[1].value + '/' + result[2].value), 'yyyy-MM-dd')
              that.sumTrend();
            },
            id: 'sum-picker1'
          });
        },
        sumInitPicker2(){
          this.sumTimeType = 0
          let that = this;
          weui.datePicker({
            start: that.sumPickerObj.start,
            onConfirm: function(result){
              that.sumPickerObj.end = DateFormat.format(new Date(result[0].value + '/' + result[1].value + '/' + result[2].value), 'yyyy-MM-dd')
              that.sumTrend();
            },
            id: 'sum-picker2'
          });
        },
        //显示订单选项
        sumShowMore(){
          this.sumShowMoreMask = true
        },
        //改变订单类型
        sumChangeOrderType(orderType){
          this.sumShowMoreMask = false;
          this.sumType = orderType;
          this.sumTrend();
        },

        // 交易额统计  结束======================

        // 阿童定义的函数
        // 游客统计
        tourChangeNav:function (val) {
          this.touristActive = val;
          if(val==1){
            $('#tour_start').val(this._dateObj.yesterday);
            $('#tour_end').val(this._dateObj.yesterday);
          }else if(val==2){
            $('#tour_start').val(this._dateObj.day7);
            $('#tour_end').val(this._dateObj.today);
          }else {
            $('#tour_start').val(this._dateObj.day30);
            $('#tour_end').val(this._dateObj.today);
          }
          this.tourGetgender();
          this.tourGetcity();
          this.tourGetage();
        },
        tourInitChart() {
          this.tour_chart1 = echarts.init(document.getElementById('tour_chart1'));
          this.tour_chart2 = echarts.init(document.getElementById('tour_chart2'));
          this.tour_chart3 = echarts.init(document.getElementById('tour_chart3'));
          $('#tour_start').val(this._dateObj.yesterday);
          $('#tour_end').val(this._dateObj.yesterday);
        },
        // 初始化时间
        tourstaPicker:function(){
          let that = this;
          weui.datePicker({
            end: $('#tour_end').val(),
            onChange: function(result){
              that.touristActive = 0;
            },
            onConfirm: function(result){
              $('#tour_start').val(DateFormat.format(new Date(result[0].value + '/'+result[1].value + '/'+result[2].value), 'yyyy-MM-dd'));
              that.tourGetgender();
              that.tourGetcity();
              that.tourGetage();
            },
            id: 'tour_start'
          });
        },
        tourendPicker:function(){
          let that = this;
          weui.datePicker({
            start: $('#tour_start').val(),
            onChange: function(result){
              that.touristActive = 0;
            },
            onConfirm: function(result){
              $('#tour_end').val(DateFormat.format(new Date(result[0].value + '/'+result[1].value + '/'+result[2].value), 'yyyy-MM-dd'));
              that.tourGetgender();
              that.tourGetcity();
              that.tourGetage();
            },
            id: 'tour_end'
          });
        },
        // 性别分布
        tourGetgender:function () {
          let data = {
            startDate:$('#tour_start').val(),
            endDate:$('#tour_end').val(),
          }
          _AJAX({
            url: AJAX_URL_USER + "/api/report/vistor/gender",
            type: 'get',
            data:data,
            success: (res) => {
              if (res.code === 0) {
                var option = {
                  tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                  },
                  legend: {
                    orient: 'vertical',
                    left: 10,
                  },
                  grid: {   // 直角坐标系内绘图网格
                    left: '1%',  //grid 组件离容器左侧的距离,
                    //left的值可以是80这样具体像素值，
                    //也可以是'80%'这样相对于容器高度的百分比
                    top: '0',
                    right: '1%',
                    bottom: '0',
                  },
                  series: [
                    {
                      name: '访问来源',
                      type: 'pie',
                      selectedMode: 'single',
                      radius: [0, '30%'],

                      label: {
                        position: 'inner',
                      },
                      labelLine: {
                        show: false
                      },

                    },
                    {
                      name: '游客性别',
                      type: 'pie',
                      radius: ['40%', '55%'],
                      label: {
                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                        backgroundColor: '#eee',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        borderRadius: 4,
                        // shadowBlur:3,
                        // shadowOffsetX: 2,
                        // shadowOffsetY: 2,
                        // shadowColor: '#999',
                        // padding: [0, 7],
                        rich: {
                          a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center'
                          },
                          // abg: {
                          //     backgroundColor: '#333',
                          //     width: '100%',
                          //     align: 'right',
                          //     height: 22,
                          //     borderRadius: [4, 4, 0, 0]
                          // },
                          hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                          },
                          b: {
                            fontSize: 16,
                            lineHeight: 33
                          },
                          per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                          }
                        }
                      },
                      data: res.data,
                      itemStyle:{
                        normal:{
                          label:{
                            show: true,
                            formatter: '{b} : \n{d}%',
                            fontWeight: 550,
                            fontSize:13
                          },
                          labelLine :{show:true}
                        }
                      },

                    }
                  ],
                  color:['#3AD290', '#9A79E8']
                };
                this.tour_chart1.setOption(option);
              }else{
                layer.msg(res.msg);
              }
            }
          });

        },
        //城市分布
        tourGetcity:function(){
          let data = {
            startDate:$('#tour_start').val(),
            endDate:$('#tour_end').val(),
          }
          _AJAX({
            url: AJAX_URL_USER + "/api/report/vistor/area",
            type: 'get',
            data:data,
            success: (res) => {
              if (res.code === 0) {
                var arrCitynum=[];
                var arrCity=[];
                var sumList = [];
                let percentList = res.data.percentList;
                let cityList = res.data.cityList;
                if(!percentList){
                  return;
                }
                for(var i = 0;i<percentList.length;i++){
                  let num = percentList[i]
                  arrCitynum.unshift(num);
                  sumList.push('100');
                }
                for(var i = 0;i<cityList.length;i++){
                  arrCity.unshift(cityList[i]);
                }
                let option = {
                  grid: {   // 直角坐标系内绘图网格
                    left: '0',  //grid 组件离容器左侧的距离,
                    //left的值可以是80这样具体像素值，
                    //也可以是'80%'这样相对于容器高度的百分比
                    top: '10',
                    right: '13%',
                    bottom: '0',
                    containLabel: true   //gid区域是否包含坐标轴的刻度标签。为true的时候，
                    // left/right/top/bottom/width/height决定的是包括了坐标轴标签在内的
                    //所有内容所形成的矩形的位置.常用于【防止标签溢出】的场景
                  },
                  xAxis: {  //直角坐标系grid中的x轴,
                    //一般情况下单个grid组件最多只能放上下两个x轴,
                    //多于两个x轴需要通过配置offset属性防止同个位置多个x轴的重叠。
                    type: 'value',//坐标轴类型,分别有：
                    //'value'-数值轴；'category'-类目轴;
                    //'time'-时间轴;'log'-对数轴
                    splitLine: {show: false},//坐标轴在 grid 区域中的分隔线
                    axisLabel: {show: false},//坐标轴刻度标签
                    axisTick: {show: false},//坐标轴刻度
                    axisLine: {show: false},//坐标轴轴线
                    boundaryGap: true // x轴两边是否留白
                  },
                  yAxis: {
                    type: 'category',
                    axisTick: {show: false},
                    axisLine: {show: false},
                    axisLabel: {
                      color: '#2A2A2A',
                      fontSize: 13,
                    },
                    data:arrCity//类目数据，在类目轴（type: 'category'）中有效。
                    //如果没有设置 type，但是设置了axis.data,则认为type 是 'category'。
                  },
                  series: [//系列列表。每个系列通过 type 决定自己的图表类型
                    {
                      name: '%',//系列名称
                      type: 'bar',//柱状、条形图
                      barWidth: 15,//柱条的宽度,默认自适应
                      data: arrCitynum,//系列中数据内容数组
                      symbolSize:1,
                      label: { //图形上的文本标签
                        show: true,
                        position: 'right',//标签的位置
                        offset: [0,-40],  //标签文字的偏移，此处表示向上偏移40
                        formatter: '{c}{a}',//标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
                        textStyle: {
                          fontFamily : "微软雅黑",
                          fontSize : 12,
                          color: '#688499'

                        }
                      },
                      itemStyle: {//图形样式
                        normal: {  //normal 图形在默认状态下的样式;
                          //emphasis图形在高亮状态下的样式
                          label: {
                            show: true, //开启显示
                            position: 'right', //在上方显示
                            formatter: '{c}%',
                            textStyle: {
                              fontFamily : "微软雅黑",
                              fontSize : 12,
                              color: '#2A2A2A'
                            }
                          },
                          barBorderRadius: 5,//柱条圆角半径,单位px.
                          //此处统一设置4个角的圆角大小;
                          //也可以分开设置[10,10,10,10]顺时针左上、右上、右下、左下
                          color: new echarts.graphic.LinearGradient(
                            0, 0, 1, 0,
                            [{
                              offset: 0,
                              color: '#1FBE79'//柱图渐变色起点颜色
                            },
                              {
                                offset: 1,
                                color: '#9D77EA'//柱图渐变色终点颜色
                              }
                            ]
                          )
                        }
                      },
                      zlevel:1//柱状图所有图形的 zlevel 值,
                              //zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
                    },
                    {
                      name: '进度条背景',
                      type: 'bar',
                      barGap: '-100%',//不同系列的柱间距离，为百分比。
                      // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
                      // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
                      //并且是对此坐标系中所有 'bar' 系列生效。
                      barWidth: 15,
                      data: sumList,
                      itemStyle: {
                        normal: {
                          barBorderRadius: 5,
                          color: '#fff',//柱条颜色
                        }
                      }
                    }
                  ]
                };
                this.tour_chart2.setOption(option);
              }else{
                layer.msg(res.msg);
              }
            }
          });

        },
        // 年龄
        tourGetage:function () {
          let data = {
            startDate:$('#tour_start').val(),
            endDate:$('#tour_end').val(),
          }
          _AJAX({
            url: AJAX_URL_USER + "/api/report/vistor/age",
            type: 'get',
            data:data,
            success: (res) => {
              if (res.code === 0) {
                var option = {
                  tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                      type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                  },
                  grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                  },
                  xAxis : [
                    {
                      type : 'category',
                      data :res.data.ageList,
                      axisTick: {
                        alignWithLabel: true,

                      },
                      axisLabel: {
                        fontSize: 12,
                      },
                    }
                  ],
                  yAxis : [
                    {
                      type : 'value'
                    }
                  ],
                  series: [{
                    name: '人数',
                    type: 'bar',
                    barWidth:20,
                    data: res.data.countList,        //数据
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(
                          0, 0, 0, 1,
                          [
                            {offset: 1, color: '#9D77EA'},                   //柱图渐变色
                            // {offset: 0.5, color: '#71C8B1'},                 //柱图渐变色
                            {offset: 0, color: '#1FBE79'},                   //柱图渐变色
                          ]
                        ),
                        barBorderRadius:5,
                      },
                      // emphasis: {
                      //     color: new echarts.graphic.LinearGradient(
                      //         0, 0, 0, 1,
                      //         [
                      //             {offset: 0, color: '#71C8B1'},                  //柱图高亮渐变色
                      //             {offset: 0.7, color: '#44C0C1'},                //柱图高亮渐变色
                      //             {offset: 1, color: '#06B5D7'}                   //柱图高亮渐变色
                      //         ]
                      //     )
                      // }
                    },
                  }]

                };
                this.tour_chart3.setOption(option);
              }else{
                layer.msg(res.msg);
              }
            }
          });

        },
      }
    }
</script>

<style scoped lang="less">
  @import url("dataIndex.less");
  .refresh-moudle {
    width: 100%;
    margin-top: -100px;
    -webkit-overflow-scrolling: touch; /* ios5+ */
  }

  .pull-refresh {
    width: 100%;
    color: #999;
    transition-duration: 200ms;
    font-size:12px;
  }

  .refresh-moudle .down-tip,
  .up-tip,
  .refresh-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 30px;
    height: 70px;

  }
</style>
