<template>
    <div>
        <h2>{{ start.className }} - {{ start.startName }}</h2>
        <div class="result-table">
            <div class="result-row laps-row">
                <div class="laps">Laps: {{ currentLap }} / {{ laps }}</div>
            </div>
            <div class="result-row title">
                <div class="row position">Pos</div>
                <div class="row number">Nro.</div>
                <div class="row lap">Lap</div>
                <div class="row name">Name</div>
                <div class="row last-lap">Last lap</div>
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
  name: 'Home',
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
        this.competitors = res;
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
                this.competitors = response;
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
        font-size: 15px;
        background-color: red;
        color: white;
    }

    .row {
        display: flex;
        margin: 10px;
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
