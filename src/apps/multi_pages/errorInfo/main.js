import Vue from 'vue';
import App from './App';
import errorInfo from './errorInfo';

Vue.component('error-Info',errorInfo);

Vue.config.productionTip = false;


const app = new Vue({
  render: h => h(App),
}).$mount('#app');

export default app;
