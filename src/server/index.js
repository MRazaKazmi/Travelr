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

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
});

app.get('/api/hotels', async (req, res) => {
    const city = req.query.city;
    const url = `https://api.yelp.com/v3/businesses/search?location=${city}&categories=hotels&sort_by=rating&limit=5`;
    try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': 'Bearer ' + apiKey,
          }
        });

      res.send(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).send({ error: 'An error occurred while fetching hotels' });
    }
  });

  app.get('/api/restaurants', async (req, res) => {
    const city = req.query.city;
    const url = `https://api.yelp.com/v3/businesses/search?location=${city}&categories=restaurants&sort_by=rating&limit=5`;
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

// Designates what port the app will listen to for incoming requests
app.listen(8000, () => {
    console.log('Example app listening on port 8000!');
});

module.exports = app;





