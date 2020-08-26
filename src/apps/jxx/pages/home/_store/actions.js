import {
  commonInfoService,
} from '@/services/common';
import {
  helloInfoService,
} from '@/services/jxx.hello';

const commonInfoAction = ({ commit }, data) => new Promise((resolve) => {
  commonInfoService(data).then((res) => {
    if (res.success) {
      commit('commoninfo_set', res.data);
    }
    resolve(res);
  });
});

const helloInfoAction = ({ commit }, data) => new Promise((resolve) => {
  helloInfoService(data).then((res) => {
    if (res.success) {
      commit('helloinfo_set', res.data);
    }
    resolve(res);
  });
});

export default {
  commonInfoAction,
  helloInfoAction,
};
