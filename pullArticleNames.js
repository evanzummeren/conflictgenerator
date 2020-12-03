const axios = require('axios');
const fs = require('fs');

let arr = [];
let yearSpan = [2000, 2020]

module.exports = {
  range: (start, end) => { // https://stackoverflow.com/a/33457557/4647541
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  },
  pullCategoryData: () => {
    let conflictYears = [];

    module.exports.range(yearSpan[0], yearSpan[1]).forEach(function(e) {
      conflictYears.push(
        axios.get(`https://en.wikipedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:Conflicts_in_${
        e}&prop=categories&cllimit=max&gcmlimit=max&format=json`
      ))
    })

    axios.all(conflictYears)
    .then(responses => {
      responses.forEach(function(response) {
        module.exports.parseData(response.data.query.pages)
      })
    });
  },
  parseData: (obj) => {
    Object.keys(obj).forEach(function(e) {
      arr.push(obj[e].title);
    });
    module.exports.saveData(arr);
  },
  saveData: (arr) => {
    arr = arr.sort()
    fs.writeFile(`${yearSpan[0]}.json`, JSON.stringify(arr), function (err) {
      if (err) return console.log(err);
      console.log('Saved');
    });
  }
}

module.exports.pullCategoryData();

// https://en.wikipedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:Conflicts_in_1874&prop=categories&cllimit=max&gcmlimit=max