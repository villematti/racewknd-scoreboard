<template>
    <div :class="positionClass" class="result-row">
        <div class="row position">{{ driver.position }}</div>
        <div class="row number">{{ driver.number }}</div>
        <div class="row name">{{ dr.firstName }} {{ dr.lastName }}</div>
        <div class="row last-lap">{{ createTimeString(driver.lastLapTime) }}</div>
        <div class="row best-lap">{{ calculateTotalTime(driver) }}</div>
    </div>
</template>

<script>

export default {
  name: 'TimeTrialResultRow',
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
        const minTime = mins ? `${mins}min.` : "";
        return `${minTime} ${secs}sek. ${ms}ms.`;
      },
      calculateTotalTime(driver) {
          if (driver.position === 1) {
              return this.createTimeString(driver.currentTime || 0);
          } else {
              if (driver.timeBehind === "Na") {
                  return "Na";
              }
              return `+ ${this.createTimeString(driver.timeBehind)}`;
          }
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
        margin: 10px;
    }

    .position, .number {
        width: 50px;
        justify-content: center;
        align-items: center;
        flex: 1;
    }

    .last-lap, .current-time {
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

    @media screen and (max-width: 850px) {
        .row {
            font-size: 10px;
        }
    }
</style>
