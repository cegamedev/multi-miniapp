<template>
  <div>
    jxx
    <Say :content='homeState.common' />
    <Say :content='homeState.hello' />
  </div>
</template>

<script>
import Say from '@/components/Say';
import store from './_store';

export default {
  name: 'HomeCtnr',
  components: {
    Say,
  },
  computed: {
    commonState() {
      return this.$store.getters.getState;
    },
    homeState() {
      return this.$store.getters[`${this.$storeKeys.HOME_STORE_KEY}/getState`];
    },
  },
  data() {
    return {

    };
  },
  created() {
    // eslint-disable-next-line no-underscore-dangle
    if (
      !(this.$storeKeys.HOME_STORE_KEY in this.$store._modules.root._children)
    ) {
      this.$store.registerModule(
        this.$storeKeys.HOME_STORE_KEY,
        store.create(),
      );
    }
  },
  mounted() {
  },
  methods: {
    commonInfo() {
      this.$store.dispatch(
        `${this.$storeKeys.HOME_STORE_KEY}/commonInfoAction`,
        {},
      );
    },
    helloInfo() {
      this.$store.dispatch(
        `${this.$storeKeys.HOME_STORE_KEY}/helloInfoAction`,
        {},
      );
    },
  },
};
</script>

<style scoped>

</style>
