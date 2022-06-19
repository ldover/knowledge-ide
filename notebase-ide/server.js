const express = require('express')
const bodyParser = require("body-parser");


const fs = require("fs")
const path = require("path")

const app = express()


const getAllFiles = function (dirPath) {
  const files = fs.readdirSync(dirPath).map(file => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      return getAllFiles(dirPath + "/" + file)
    } else {
      return {
        type: 'file',
        name: path.parse(file).base,
        path: path.join(__dirname, dirPath, "/", file),
      }
    }
  })

  return {
    type: 'folder',
    name: path.parse(dirPath).base,
    path: dirPath,
    files
  }
}

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5433');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  let allFiles = getAllFiles('../src');

  res.json(allFiles)
})


// respond with "hello world" when a GET request is made to the homepage
app.get('/file/:filePath', (req, res) => {
  const path = req.params['filePath']
  console.log('reading file', path)
  const file =  fs.readFileSync(path, {encoding: 'utf-8'});

  res.json({
    content: file,
    path,
  })
});

app.post('/file/:filePath', (req, res) => {
  const path = req.params['filePath']
  const content = req.body.content;
  console.log('writing file', path)
  try {
    fs.writeFileSync(path, content, {encoding: 'utf-8'});
    res.json({
      content,
      path,
    })
  } catch (err) {
    res.json({
      status: 'error',
      path,
    })
  }
})


app.listen(8080)