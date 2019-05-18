<template>
  <div id="app">
    <iframe width="100%" height="315" src="https://www.youtube.com/embed/3-0TkT6CvgE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <Home
      v-for="start in starts"
      v-bind:key="start.id"
      v-bind:start="start"
    />
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'app',
  data() {
    return {
      raceId: "ac10e5e7-e981-46bd-8a00-aba54294f551",
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

</style>
