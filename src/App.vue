<template>
  <div id="app">
    <div class="video">
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/kxBfTrdg95c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <div class="results">
      <TimeTrials
        v-for="start in timeTrialStarts"
        v-bind:key="start.id"
        v-bind:start="start"
      />
      <Home
        v-for="start in heatStarts"
        v-bind:key="start.id"
        v-bind:start="start"
      />
      <TimeTrials
        v-for="start in practiceStarts"
        v-bind:key="start.id"
        v-bind:start="start"
      />
    </div>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import TimeTrials from './components/TimeTrials.vue'

export default {
  name: 'app',
  data() {
    return {
      raceId: "8bf10761-5115-4bdc-8b0b-0f3af4e3b37e",
      starts: [],
      selected: ""
    };
  },
  components: {
    Home,
    TimeTrials
  },
  mounted: function() {
    const raceData = {id: this.raceId}

    fetch("https://racewkndapp.com/get-starts", {
      method: "POST",
      body: JSON.stringify(raceData),
      headers:{
          'Content-Type': 'application/json'
      }}).then(res => res.json())
      .then(result => {
        this.starts = result;
      })
      .catch(error => console.error('Error:', error));
    
  },
  computed: {
    heatStarts() {
      return this.starts
        .filter(s => s.raceType === '7a75ac61-201a-42c0-a39a-9864000e3a3a')
        .sort((a,b) => {
          if (a.classId > b.classId) {
            return -1;
          }

          if (a.classId < b.classId) {
            return 1;
          }

          if (a.classId === b.classId) {
            return 0;
          }
        });
    },
    timeTrialStarts() {
      return this.starts
        .filter(s => s.raceType === 'b4a7d532-127c-4c5c-b5de-a0b77bde83b7')
        .sort((a,b) => {
          if (a.classId > b.classId) {
            return -1;
          }

          if (a.classId < b.classId) {
            return 1;
          }

          if (a.classId === b.classId) {
            return 0;
          }
        });
    },
    practiceStarts() {
      return this.starts
        .filter(s => s.raceType === '71a85952-5096-4001-aff6-1d4c2a935a35')
        .sort((a,b) => {
          if (a.classId > b.classId) {
            return -1;
          }

          if (a.classId < b.classId) {
            return 1;
          }

          if (a.classId === b.classId) {
            return 0;
          }
        });
    }
  }
}
</script>

<style>
  .video {
    display: flex;
    flex: 5;
  }
  .results {
    display: flex;
    flex: 7;
    flex-direction: column;
    overflow-y: scroll;
    height: 500px;
  }

  @media screen and (max-width: 850px) {
      .row {
          font-size: 10px;
      }
  }
</style>
