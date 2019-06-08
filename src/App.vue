<template>
  <div id="app">
    <div class="video">
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/kxBfTrdg95c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <div class="results">
      <Home
        v-for="start in starts"
        v-bind:key="start.id"
        v-bind:start="start"
      />
    </div>
  </div>
</template>

<script>
import Home from './components/Home.vue'

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
    Home
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
