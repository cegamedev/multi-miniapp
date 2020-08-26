import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const routes = [
  {
    path: '/home',
    component: resolve => require(['../pages/home/HomeCtnr'], resolve),
  },
];

const router = new VueRouter({
  mode: 'history',
  // mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    if (from.name) {
      next({
        name: from.name,
      });
    } else {
      next('/home');
    }
  } else {
    next(); // 如果匹配到正确跳转
  }
});

export default router;
