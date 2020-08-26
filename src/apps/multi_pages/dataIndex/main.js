import Vue from 'vue';
import App from './App';
import DataIndex from './dataIndex';

Vue.component('data-index',DataIndex);


Vue.config.productionTip = false;


const app = new Vue({
  render: h => h(App),
}).$mount('#app');

export default app;
