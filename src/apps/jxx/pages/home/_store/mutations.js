import Vue from 'vue';
/* eslint-disable */

const commoninfo_set = (state, data) => {
  state.common = data;
};

const helloinfo_set = (state, data) => {
  state.hello = data;
};

export default {
  commoninfo_set,
  helloinfo_set,
};

/* eslint-enable */
