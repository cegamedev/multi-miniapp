<template>
    <div>
        hello {{msg}}
        <a-button type='primary' @click="jump">跳转</a-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            msg: 'downloadh5'
        };
    },
    methods: {
        jump() {
            this.$router.push({
                path: '/world'
            });
        }
    }
}
</script>