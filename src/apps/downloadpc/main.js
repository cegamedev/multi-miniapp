import Vue from 'vue';

import App from './App';
import DIndex from './DIndex';

Vue.component('d-index',DIndex);


Vue.config.productionTip = false;


const app = new Vue({
  render: h => h(App),
}).$mount('#app');

export default app;