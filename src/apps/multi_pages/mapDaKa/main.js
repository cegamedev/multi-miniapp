import Vue from 'vue';
import App from './App';
import MapDaKa from './MapDaKa';

Vue.component('map-daka',MapDaKa);

Vue.config.productionTip = false;


const app = new Vue({
  render: h => h(App),
}).$mount('#app');

export default app;