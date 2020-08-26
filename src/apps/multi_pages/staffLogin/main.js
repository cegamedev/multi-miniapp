import Vue from 'vue';
import App from './App';
import StaffLogin from './staffLogin';

Vue.component('staff-login',StaffLogin);

Vue.config.productionTip = false;


const app = new Vue({
  render: h => h(App),
}).$mount('#app');

export default app;
