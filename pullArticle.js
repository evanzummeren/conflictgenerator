const axios = require('axios');
const fs = require('fs');

let arr = [];
let range = [0, 1000]

module.exports = {
  retrieveSelection: () => {
    fs.readFile('./data/selection.json', function read(err, data) {
      if (err) {
          throw err;
      }
      const parsedData = JSON.parse(data);
      module.exports.pullCategoryData(parsedData.slice(range[0], range[1]));
      // processFile(content);   // Or put the next step in a function and invoke it
    });
  },
  pullCategoryData: (arr) => {
    let articleList = [];  

    arr.forEach((el) => {
      if (el.includes('–') || el.includes('ó') || el.includes('ç') || el.includes('ñ')) {
        console.log('hebbens, ' + el)

      } else {
        console.log(el);
        articleList.push(
          axios.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${encodeURIComponent(el)}`
        ))
      }
      // const search = ' ';
      // const replaceWith = '_';

      // const result = el.split(search).join(replaceWith)

    })

    console.log(articleList)

    axios.all(articleList)
    .then(responses => {
      responses.forEach(function(response) {
        module.exports.parseData(response.data.query.pages[Object.keys(response.data.query.pages)])
      })
    })
    .catch((err) => {
      console.log(err)
    });
  },
  parseData: (obj) => {
    let conflict = {};

    conflict.title = obj.title;
    conflict.sentences = obj.extract.split(". ");

    arr.push(conflict)
    
    // Object.keys(obj).forEach(function(e) {
    //   arr.push(obj[e].title);
    // });
    module.exports.saveData(arr);
  },
  saveData: (arr) => {
    arr = arr.sort()
    fs.writeFile(`${range[0]}.json`, JSON.stringify(arr), function (err) {
      if (err) return console.log(err);
      console.log('Saved');
    });
  }
}

module.exports.retrieveSelection();

// https://en.wikipedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:Conflicts_in_1874&prop=categories&cllimit=max&gcmlimit=max