// API URLs
const geonamesURL = 'http://api.geonames.org/searchJSON?q=';
const weatherbitURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const pixabayURL = 'https://pixabay.com/api/?q=';

// API Keys
const geonamesUsername = ""
const weatherbitKey = ''
const pixabayKey = ''

export const getCityData = async (city) => {
  // obtain data from the geonamesAPI
  const data = await fetch(geonamesURL + city + '&maxRows=5&' + 'username=' + geonamesUsername);
  try {
      // parse json response
      const cityData = await data.json();
      const { lat, lng } = cityData.geonames[0];
      return { lat, lng };
  } catch (error) {
      console.log("error", error);
  }
};

export const getWeatherData = async (cityLatitude, cityLongitude) => {
  // obtain data from the weatherbitAPI
  const res = await fetch(weatherbitURL + 'lat=' + cityLatitude + "&lon=" + cityLongitude + "&key=" + weatherbitKey);
  try {
      // parse json response
      const weatherData = await res.json();
      return weatherData.data[0];
  } catch (error) {
    console.log("error", error);
  }
}

export const getImage = async (city) => {
  // obtain data from the pixabayAPI
  const response = await fetch(`${pixabayURL}${city}&key=${pixabayKey}`);

  try {
      // parse json response
      const data = await response.json();
      return data.hits[0].webformatURL;
  }
  catch (error) {
      console.log('error', error);
  }}

export const getHotels = async (city) => {
  // obtain hotels data
  const response = await fetch(`http://localhost:8000/api/hotels?city=${city}`);

  try {
    // parse json response
    const data = await response.json();
    return data.businesses;
  }
  catch (error) {
      console.log('error', error);
  }}

export const getRestaurants = async (city) => {
  // obtain restaurants data
  const response = await fetch(`http://localhost:8000/api/restaurants?city=${city}`);

  try {
    // parse json response
    const data = await response.json();
    return data.businesses;
  }
  catch (error) {
      console.log('error', error);
  }}

export const showTripCard = async (tripData) => {
  // update UI
  const tripCard = document.getElementById("tripCardSection");
    tripCard.style.display = 'block';
    document.querySelector("#destination-image").setAttribute('src', tripData.imageURL);
    document.getElementById('destination').textContent = `Destination City: ${tripData.city}`;
    document.getElementById('tripDate').textContent = `Dates: ${tripData.departureDate} - ${tripData.returnDate}`;
    document.getElementById('tripDays').textContent = `Your trip is ${tripData.daysAway} days away and ${tripData.tripLength} days long`
    document.getElementById('averageTemperature').textContent = `Average temperature on first day: ${tripData.averageTemp}`;
    document.getElementById('weatherDescription').textContent = `Weather description for first day: ${tripData.weatherDescription}`;

    const HotelList = document.getElementById('hotel-list');
    HotelList.innerHTML = '';

    tripData.hotels.forEach(hotel => {
      var li = document.createElement('li');
      li.textContent = `${hotel.name} - Rating: ${hotel.rating}`;
      HotelList.appendChild(li);
    })

    const restaurantList = document.getElementById('restaurant-list');
    restaurantList.innerHTML = '';

    tripData.restaurants.forEach(restaurant => {
      var li = document.createElement('li');
      li.textContent = `${restaurant.name} - Rating: ${restaurant.rating}`;
      restaurantList.appendChild(li);
  })
}

export function calculateDaysAway(tripDate) {
  // calculate days away
  const tripDateTime = new Date(tripDate);
  const today = new Date();
  const timeDiff = tripDateTime.getTime() - today.getTime();
  const daysAway = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysAway;
}

export function calculateTripLength(startDate, endDate) {
  // calculate trip length
  const start = new Date(startDate);
  const end = new Date(endDate);
  const difference = end - start;
  const daysDifference = difference / (1000 * 60 * 60 * 24);
  return daysDifference;
}

export async function handleSubmit(event) {
    event.preventDefault();
    const city = document.getElementById("city").value;
    const departureDate = document.getElementById("departure_date").value;
    const returnDate = document.getElementById("departure_date").value;

    let tripData = {};

    tripData.city = city;
    tripData.departureDate = departureDate;
    tripData.returnDate = returnDate;

    tripData.daysAway = calculateDaysAway(departureDate);
    tripData.tripLength = calculateTripLength(departureDate, returnDate);

    const { lat, lng } = await getCityData(city);

    const weatherData = await getWeatherData(lat, lng);

    tripData.averageTemp = ((weatherData.max_temp + weatherData.min_temp)/2).toFixed(1);

    tripData.weatherDescription = weatherData.weather.description;

    tripData.imageURL = await getImage(city);
    tripData.hotels = await getHotels(city);
    tripData.restaurants = await getRestaurants(city);

    showTripCard(tripData);
    }

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("tripForm").addEventListener("submit", handleSubmit)
    })
