import Vue from 'vue';
import echarts from 'echarts';

import '@/assets/iconfont.css';
import App from './App';
import router from './router';
import store from './store';
import http from '@/common/http';
import rules from '@/common/rules';
import storeKeys from './common/store-keys';
import '@/common/filter';

Vue.prototype.$http = http;
Vue.prototype.$echarts = echarts;
Vue.prototype.$rules = rules;
Vue.prototype.$storeKeys = storeKeys;

Vue.config.productionTip = false;


const app = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

export default app;
