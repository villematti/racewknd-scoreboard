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
    this.$socket.on("ping", () => {
      console.log("ping!");
      this.$socket.emit("PING");
    });
  },
  render: h => h(App),
})
