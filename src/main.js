import Vue from 'vue'
import App from './App.vue'
import VueAnalytics from 'vue-analytics'
import socketio from 'socket.io-client';

Vue.use(VueAnalytics, {
  id: 'UA-141660770-1'
})

const socket = socketio('https://racewkndapp.com');

Vue.prototype.$socket = socket;

Vue.config.productionTip = false

new Vue({
  el: "racewknd-standings",
  mounted() {
    this.$socket.on("connect", () => {
      console.log("Connected");
    })
    this.$socket.on("disconnect", (reason) => {
      console.log("Disconnected: ", reason);
    });
  },
  render: h => h(App),
})
