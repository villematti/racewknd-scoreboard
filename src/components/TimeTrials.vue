<template>
    <div>
        <h2>{{ start.className }} - {{ start.startName }}</h2>
        <div class="result-table">
            <div class="result-row laps-row">
                <div class="laps">Laps: {{ currentLap }} / {{ laps }}</div>
            </div>
            <div class="result-row title">
                <div class="position">Sija</div>
                <div class="row number">Nro.</div>
                <div class="row lap">Lap</div>
                <div class="row name">Name</div>
                <div class="row best-lap">Best lap</div>
            </div>
            <result-row
                v-for="driver in competitors"
                v-bind:key="driver.id"
                v-bind:driver="driver"
            ></result-row>
        </div>
    </div>
</template>

<script>
import socketio from 'socket.io-client';
import ResultRow from './ResultRow.vue';

const socket = socketio('https://racewkndapp.com');

export default {
  name: 'TimeTrials',
  components: {
      ResultRow
  },
  props: ["start"],
  data: () => {
    return {
        competitors: [],
        laps: 0,
        currentLap: 0,
    }
  },
  mounted: function () {
    socket.on("connect", () => {});
    this.getInitial();

    socket.on(`standings_${this.start.id}`, (res) => {
        this.competitors = this.orderTimetrial(res);
        this.competitors = this.competitors.map((c, i) => {
            c.position = i;
            if (c.bestLapTime === 0) {
                c.position = this.competitors.length;
            }

            return c;
        });
        this.competitors.sort((a, b) => {
            if (a.position < b.position) {
                return -1;
            }

            if (a.position > b.position) {
                return 1;
            }
        });
        this.getCurrentLap();
    });

    setTimeout(() => {
        socket.emit("subscribeToLaptimes", this.start.id);
    }, 500);
    
  },
  methods: {
      getInitial() {
            const url = "https://racewkndapp.com/get-current-standings";
            const data = {startId: this.start.id};

            this.getData(url, data).then(response => {
                this.competitors = this.orderTimetrial(response);
                this.competitors = this.competitors.map((c, i) => {
                    c.position = i - this.getPositionFormIndex() + 1;
                    if (c.bestLapTime === 0) {
                        c.position = this.competitors.length;
                    }

                    return c;
                });
                this.competitors.sort((a, b) => {
                    if (a.position < b.position) {
                        return -1;
                    }

                    if (a.position > b.position) {
                        return 1;
                    }
                });
                this.getCurrentLap();
            })

            const startUrl = "https://racewkndapp.com/get-start-by-id";;
            const startData = {id: this.start.id}
            this.getData(startUrl, startData).then(response => {
                if (!response) {
                    this.laps = 0;
                    return;
                }
                this.laps = response.laps;
            })
      },
      getData(url, data) {
            return fetch(url, {
                method: data ? "POST" : "GET",
                body: JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json'
                }}).then(res => res.json())
                .catch(error => console.error('Error:', error));
      },
      getCurrentLap() {
          this.competitors.forEach(c => {
              if (c.position === 1) {
                  this.currentLap = c.currentLap;
              }
          })
      },
      orderTimetrial(comps) {
          comps.sort((a, b) => {
              if (a.bestLapTime < b.bestLapTime) {
                  return -1;
              }

              if (a.bestLapTime > b.bestLapTime) {
                  return 1;
              }
          });
          return comps;
      },
      getPositionFormIndex() {
          const missing = this.competitors.filter(c => c.bestLapTime === 0);
          return missing.length;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .title {
        color: white;
        background-color: lightcoral;
    }
    .result-table {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    .result-row {
        display: flex;
    }

    .laps {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .laps-row {
        padding-bottom: 15px;
        padding-top: 15px;
        font-size: 20px;
        background-color: red;
        color: white;
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

    .name {
        flex: 5;
    }

    .last-lap {
        display: flex;
        flex: 5;
    }

    .best-lap {
        flex: 5;
    }
</style>
