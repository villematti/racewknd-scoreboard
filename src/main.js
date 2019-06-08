import Vue from 'vue'
import App from './App.vue'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-141660770-1'
})

Vue.config.productionTip = false

new Vue({
  el: "racewknd-standings",
  render: h => h(App),
})
