import Vue from 'vue'
//import Router from 'vue-router'
import App from './App.vue'
import router from "../src/router";
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
