const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const downloader = require('./controllers/videoDownload');

const port = 3002;

app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', downloader);

// Start the server
app.listen(port, () => {
  console.log('Current environment:', process.env.NODE_ENV);
  console.log(`Server is running at http://localhost:${port}`);
});