<template>
  <div id="app">

    <div class="title">
      <h1>{{newHeading}}</h1>
    </div>
    <div class="bodyContent">
      <p style="font-size:90%;">
        From Wikipedia, the free encyclopedia
      </p>
      <p style="padding-left: 1.6em">
        For the original article, see <a v-bind:href="'https://en.wikipedia.org/wiki/' + heading">{{heading}}.</a>
      </p>
      <p>
        {{body}}
      </p>
    </div>

  </div>
</template>

<script>
import entities from './entities.json';
import traceryLines from './tracery.json';
import tracery from 'tracery-grammar';

export default {
  name: 'App',
  data: function() {
    return {
      random: Math.floor(Math.random() * 467) + 1,
      newHeading: "",
      heading: "",
      body: ""
    }
  },
  mounted: function() {
    /*eslint-disable */
    console.log(entities);
    console.log(traceryLines);

    let mergedSentences = "";

    let headingFirstPart = ["Battle of", "Siege of", "Raid on", "Action of", "Second occupation of", "First Battle of", "Second Battle of", "Skirmish of", "Second Skirmish of", "Revolt of", "Fall of"]

    this.newHeading = `${headingFirstPart[Math.floor(Math.random() * 10) + 1]} ${entities.LOCATION[Math.floor(Math.random() * 2000) + 1]}`
    this.heading = traceryLines[this.random].title;

    traceryLines[this.random].tracerySentences.forEach((el) => {
      mergedSentences+= el + ". ";
    })

    var grammar = tracery.createGrammar({
      'LOCATION': entities.LOCATION,
      'EVENT': entities.EVENT,
      'COMMERCIAL_ITEM': entities.COMMERCIAL_ITEM,
      'DATE': entities.DATE,
      'ORGANIZATION': entities.ORGANIZATION,
      'OTHER': entities.OTHER,
      'PERSON': entities.PERSON,
      'QUANTITY': entities.QUANTITY,
      'TITLE': entities.TITLE,
      'origin': [mergedSentences],
    });

    grammar.addModifiers(tracery.baseEngModifiers); 

    this.body = grammar.flatten('#origin#');

    console.log(grammar.flatten('#origin#'));

  }
}
</script>

<style>
body {
  color: #000;
  padding: 24px;
  margin:0
  
}

.title {
  font-family: 'Linux Libertine','Georgia','Times',serif;
  padding: 0;
  border-bottom: 1px solid #a2a9b1;
}

.bodyContent {
  margin-bottom: 24px;
  font-family: sans-serif;
  font-size: 0.875em;
  line-height: 1.6;
  color: #222;
}

a {
  color: blue;
  text-decoration: none;
}

h1 {
  font-size: 1.8em;
  margin: 0.25em;
  font-weight: normal;
}

h2 {
  font-size: 1.5em;
  margin: 0.25em;
  font-weight: normal;
}

img {
  width: 100%;
}

</style>
