import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const create = () => {
  const state = {
    common: '',
    hello: '',
  };

  return {
    namespaced: true,
    state,
    actions,
    getters,
    mutations,
  };
};

export default {
  create,
};
