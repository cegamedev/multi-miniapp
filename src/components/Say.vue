<template>
  <div>
    <p>
      This is: {{content}}
    </p>
  </div>
</template>

<script>

export default {
  props: {
    content: {
      default: ""
    }
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style scoped>
</style>