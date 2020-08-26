import Vue from 'vue';
import App from './App';
import kefu from './kefu';

Vue.component('kefu',kefu);

Vue.config.productionTip = false;


const app = new Vue({
  render: h => h(App),
}).$mount('#app');

export default app;
