<template>
    <div :class="positionClass" class="result-row">
        <div class="position">{{ driver.position }}</div>
        <div class="row number">{{ driver.number }}</div>
        <div class="row lap">{{ driver.currentLap }}</div>
        <div class="row name">{{ dr.firstName }} {{ dr.lastName }}</div>
        <div class="row last-lap">{{ createTimeString(driver.lastLapTime) }}</div>
        <div class="row best-lap">{{ createTimeString(driver.bestLapTime) }}</div>
    </div>
</template>

<script>
import socketio from 'socket.io-client';

var socket = socketio('https://racewkndapp.com');

export default {
  name: 'Home',
  props: ["driver"],
  data: () => {
      return {
          dr: {}
      }
  },
  mounted: function() {
      fetch("https://racewkndapp.com/get-drivers-by-class", {
          method: "POST",
          body: JSON.stringify({classId: this.driver.classId}),
          headers:{
            'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(result => {
        result.forEach(r => {
            if (this.driver.driverId === r.id) {
                this.dr = r;
            }
        });
      })
      .catch(error => console.error('Error:', error));
  },
  methods: {
      createTimeString(value) {
        let s = value;
        const ms = s % 1000;
        s = (s - ms) / 1000;
        const secs = s % 60;
        s = (s - secs) / 60;
        const mins = s % 60;
        return `${mins}min. ${secs}sek. ${ms}ms.`;
      }
  },
  computed: {
      positionClass: {
          get() {
              if (this.driver.position === 1) {
                  return "first";
              }

              if (this.driver.position === 2) {
                  return "second";
              }

              if (this.driver.position === 3) {
                  return "third";
              }
              return "other";
          },
          set() {

          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .result-row {
        display: flex;
    }

    .row {
        display: flex;
        margin: 15px;
    }

    .position, .number, .lap {
        display: flex;
        width: 50px;
        justify-content: center;
        align-items: center;
        flex: 1;
    }

    .last-lap {
        display: flex;
        flex: 5;
    }

    .best-lap {
        flex: 5;
    }

    .name {
        flex: 5;
    }

    .first {
        background-color: gold;
    }
    .second {
        background-color: silver;
    }
    .third {
        background-color: burlywood;
    }
    .other {
        background-color: lightyellow;
    }
</style>
