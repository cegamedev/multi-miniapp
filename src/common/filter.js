import Vue from 'vue';

Vue.filter('emptyFill', value => ((!value && value !== 0) ? '--' : value));
