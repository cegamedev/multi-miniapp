(function(t){function e(e){for(var r,o,s=e[0],l=e[1],u=e[2],p=0,d=[];p<s.length;p++)o=s[p],Object.prototype.hasOwnProperty.call(n,o)&&n[o]&&d.push(n[o][0]),n[o]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(t[r]=l[r]);c&&c(e);while(d.length)d.shift()();return i.push.apply(i,u||[]),a()}function a(){for(var t,e=0;e<i.length;e++){for(var a=i[e],r=!0,s=1;s<a.length;s++){var l=a[s];0!==n[l]&&(r=!1)}r&&(i.splice(e--,1),t=o(o.s=a[0]))}return t}var r={},n={index2:0},i=[];function o(e){if(r[e])return r[e].exports;var a=r[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.l=!0,a.exports}o.m=t,o.c=r,o.d=function(t,e,a){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(o.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(a,r,function(e){return t[e]}.bind(null,r));return a},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/dataStatistics/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=e,s=s.slice();for(var u=0;u<s.length;u++)e(s[u]);var c=l;i.push([2,"chunk-vendors"]),a()})({2:function(t,e,a){t.exports=a("41ea")},"3d0d":function(t,e,a){t.exports=a.p+"assets/img/kefu2.081a685a.png"},"41ea":function(t,e,a){"use strict";a.r(e);a("e260"),a("e6cf"),a("cca6"),a("a79d");var r=a("2b0e"),n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("kefu")},i=[],o=a("0c7c"),s={},l=Object(o["a"])(s,n,i,!1,null,null,null),u=l.exports,c=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"my-app",attrs:{id:"app"}},[r("div",{staticClass:"scroll-box"},[t._l(t.textArr,(function(e,a){return["right"!=e.type?r("div",{staticClass:"item-box left"},[r("div",{staticClass:"item"},[t._m(0,!0),"text"===e.type?r("div",{staticClass:"txt-box",domProps:{innerHTML:t._s(e.value)}}):t._e(),"url"===e.type?r("div",{staticClass:"txt-box"},[r("img",{attrs:{src:e.value,alt:""}})]):t._e()])]):r("div",{staticClass:"item-box right"},[r("div",{staticClass:"item"},[r("div",{staticClass:"txt-box"},[t._v(t._s(e.value))]),r("div",{staticClass:"avatar-img-box"},[r("img",{staticClass:"avatar-img",attrs:{src:t.avatarUrl}})])])])]}))],2),r("div",{staticClass:"bottom-box"},[r("div",{staticClass:"input-box"},[r("input",{directives:[{name:"model",rawName:"v-model",value:t.inputVal,expression:"inputVal"}],attrs:{placeholder:"请输入聊天内容"},domProps:{value:t.inputVal},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.sendInputVal(e)},input:function(e){e.target.composing||(t.inputVal=e.target.value)}}}),r("img",{staticClass:"send-img",attrs:{src:a("fc38")},on:{click:t.sendInputVal}})])])])},p=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"avatar-img-box"},[r("img",{staticClass:"avatar-img",attrs:{src:a("3d0d")}})])}],d=(a("99af"),a("4160"),a("ac1f"),a("5319"),a("159b"),{data:function(){return{inputVal:"",avatarUrl:"",textArr:[{value:"你好，很高兴为你服务。",type:"text"}]}},mounted:function(){this._paramObj=JSON.parse(decodeURIComponent(getRequestValue("obj"))),this.getAvatarUrl()},methods:{sendInputVal:function(){var t=this;this.inputVal?(this.textArr.push({value:this.inputVal,type:"right"}),this.$nextTick((function(){var t=document.querySelector(".scroll-box");t.scrollTop=t.scrollHeight})),_AJAX({url:AJAX_URL_USER+"/api/manager/app/remote/ask",type:"post",contentType:"application/json",data:JSON.stringify({keyWord:this.inputVal,mchId:this._paramObj.merchantId||28,userId:this._paramObj.openId||null}),success:function(e){t.inputVal="";var a=e.data;a.forEach((function(t){t.value=t.value.replace(/\/adm\//g,"http://bfop.emotibot.com/adm/")})),t.textArr=t.textArr.concat(a),t.$nextTick((function(){var t=document.querySelector(".scroll-box");t.scrollTop=t.scrollHeight}))}})):layer.msg("请输入关键词")},getAvatarUrl:function(){var t=this;_AJAX({url:AJAX_URL_USER+"/api/manager/app/remote/getUser/"+this._paramObj.openId,success:function(e){0===e.code&&e.data&&e.data.headImgUrl?t.avatarUrl=e.data.headImgUrl:t.avatarUrl=a("7efb")}})}}}),f=d,v=(a("9ad2"),Object(o["a"])(f,c,p,!1,null,"ebd9f594",null)),m=v.exports;r["a"].component("kefu",m),r["a"].config.productionTip=!1;var g=new r["a"]({render:function(t){return t(u)}}).$mount("#app");e["default"]=g},"48fd":function(t,e,a){},"7efb":function(t,e,a){t.exports=a.p+"assets/img/kefu3.4c1af661.png"},"9ad2":function(t,e,a){"use strict";var r=a("48fd"),n=a.n(r);n.a},fc38:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAeCAYAAABJ/8wUAAAB8UlEQVRYhd3WQWvUUBAH8EG8WrB4F9GKolSqKAoVF1pQ8OsIXr3pUTMv2V1owYMgXjz2qse6mcnGSqGZSVbLYilVS7F2t6jwPKy12FpNIG8DDvyvw4+BGQbgf6i6xhOoPIdKPRT+gspzRuniUBF+Fk+iUB+F7J70/ZRvDQ2CSm/+gBhEqRdk0bRzRCNrjx2I2M0WalhzCgmUr+aAWBTe9BK+7g6yvHAUhb7lwRihz0aja84wRuhxvqmQRaENLwmvOIF4Oj9ilCg3Rnn9UcqXnGBmuoujRqidF+Ml4adGJ7rgBNNcoWN/XeX9Waunr88f2BA1rKHSfUz5YdEY4acFIBaVVn3hs78B7ll7yAg9KdSonKyYLD69O4mU7lSA2EnXT/nUACIkFUIsKi3j0qsTgELfK4UIWVR+CSikFUO6ntJJMBrdrQ7B7xtZewwAAF5Ye9goPRs+Ilxtvl04s++OmKQ1ZZQeoITN4qHnBSFrRuNzZRzUXzXTXRxF4bgA4mPQ4fFSET/fAS6AWK+/iydKRXg6P2KEWwUQG37SulwqAgDAKM/mRXgSunmOZj8sHUGhrzlXdNPPaLJ0BABA0OHxnNPYCjS64QQBAGA60fEciJ7JoilniJ36xzO0jco3nSMGkLCGQtt7EUao72V0eygIF/UD/105SFYC9VEAAAAASUVORK5CYII="}});
//# sourceMappingURL=index2.fa121bab.js.map