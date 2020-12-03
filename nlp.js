const AWS = require('aws-sdk');
const comprehend = new AWS.Comprehend({apiVersion: '2017-11-27', region: "us-east-1"});
const fs = require('fs');

let entities = {
  LOCATION: [],
  EVENT: [],
  COMMERCIAL_ITEM: [],
  DATE: [],
  ORGANIZATION: [],
  OTHER: [],
  PERSON: [],
  QUANTITY: [],
  TITLE: []
};
let traceryArticles = [];

module.exports = {
  readData: () => {
    fs.readFile('./2500.json', function read(err, data) {
      if (err) {
          throw err;
      }
      const parsedData = JSON.parse(data);
      parsedData.forEach((el) => {
        module.exports.entityRecognitionApiCall(el)
        // console.log(el);
      })

      // console.log(parsedData);
      // module.exports.pullCategoryData(parsedData.slice(range[0], range[1]));
      // processFile(content);   // Or put the next step in a function and invoke it
    });
  },
  entityRecognitionApiCall: (originalObj) => {
    let newObj = originalObj;
    let str = "";

    newObj.tracerySentences = [];
    console.log(newObj);

    originalObj.sentences.forEach((el) => {
      str+= el + ". "
    })

    console.log(str);
    let newStr = str.replace("..", ".");

    var params = {
      LanguageCode: 'en',
      Text: str.replace("..", ".")
    };
  
    comprehend.detectEntities(params, function(err, data) {
      if (err) { console.log(err, err.stack) } 
      else {
        data.Entities.slice().reverse().forEach((el) => {
          let newS = newStr.substring(0, el.BeginOffset) + "#" + el.Type + "#" + newStr.substring(el.EndOffset); 
          console.log(newS);
          newStr = newS;
        })

        let tempObj = {
          title: originalObj.title,
          sentences: originalObj.sentences,
          tracerySentences: newStr.split(". ")
        }

        traceryArticles.push(tempObj);

        fs.writeFile(`tracery.json`, JSON.stringify(traceryArticles), function (err) {
          if (err) return console.log(err);
          console.log('Saved');
        });

        module.exports.processResult(data);
      }
    });
  },
  processResult: (arr) => {
    arr.Entities.forEach((el) => {
      entities[el.Type].push(el.Text);
      console.log(el)
    })

    fs.writeFile(`entities.json`, JSON.stringify(entities), function (err) {
      if (err) return console.log(err);
      console.log('Saved');
    });

    // console.log(entities)
  }
}

module.exports.readData();
// module.exports.entityRecognitionApiCall();
