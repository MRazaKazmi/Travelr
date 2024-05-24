var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();

app.use(express.static('dist'))

const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

console.log(__dirname);

// Variables for url and api key
const apiKey = process.env.API_KEY;

projectData={}

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
});

app.get('/api/restaurants', async (req, res) => {
    const city = req.query.city;
    const url = `https://api.yelp.com/v3/businesses/search?location=${city}&categories=restaurants&sort_by=rating&limit=5`;
    const apiKey = '4N7oHW0WTnCcVPIbv2PcT5HMNDTSbI2WBqmZDNTAXH98v32lsdRvraLeelFn7rk2FNdMkXa6vZQKPsIz5PCETOpW_y8R6fLNAI6jvFUHebL5gm0Hp6E-O2FX2DReX3Yx';
    ; // Replace with your Yelp API key

    try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': 'Bearer ' + apiKey,
          }
        });

      res.send(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).send({ error: 'An error occurred while fetching restaurants' });
    }
  });

// POST Route
app.post('/add', function (req, res) {
    let newData = req.body
    projectData['imageURL'] = newData.imageURL;
    // projectData['restaurants'] = newData.restaurants;

    console.log(projectData)
    res.send(projectData)
  })


// Designates what port the app will listen to for incoming requests
app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
});






