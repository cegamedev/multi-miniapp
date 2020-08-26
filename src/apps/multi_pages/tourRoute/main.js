import Vue from 'vue';
import App from './App';
import TourRoute from './TourRoute';

Vue.component('tour-route',TourRoute);

Vue.config.productionTip = false;

const app = new Vue({
  render: h => h(App),
}).$mount('#app');

export default app;
