import Vue from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

import App from './App';
import router from './router';

Vue.use(Antd);

Vue.config.productionTip = false;


const app = new Vue({
  router,
  render: h => h(App),
}).$mount('#app');

export default app;
