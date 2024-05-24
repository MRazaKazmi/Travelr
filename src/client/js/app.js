document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("tripForm").addEventListener("submit", handleSubmit)
})

export const getCityData = async (city) => {
  // fetch the data from the geonamesAPI
  const geonamesApiURL = 'http://api.geonames.org/searchJSON?q=';
  const geonamesApiUsername = "mohammad.r.kazmi";
  const data = await fetch(geonamesApiURL + city + '&maxRows=5&' + 'username=' + geonamesApiUsername);
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
  // fetch the data from the weatherbitAPI
  const weatherbitApiURL = 'https://api.weatherbit.io/v2.0/forecast/daily?'
  const weatherbitKey = '1832698fc62340c9960811091a5d29c1'
  const res = await fetch(weatherbitApiURL + 'lat=' + cityLatitude + "&lon=" + cityLongitude + "&key=" + weatherbitKey);
  try {
      // parse json response
      const weatherData = await res.json();
      return weatherData.data[0];
  } catch (error) {
    console.log("error", error);
  }
}

export const getImage = async (city) => {
  const response = await fetch(`https://pixabay.com/api/?q=${city}&key=44028546-0d7c6f6a9bf062b356bc2a4e2`);

  try {
      //Transform into JSON
      const data = await response.json();
      return data.hits[0].webformatURL;
  }
  catch (error) {
      console.log('error', error);
  }}

  export const getRestaurants = async (city) => {
    const response = await fetch(`http://localhost:8000/api/restaurants?city=${city}`);

    try {
        //Transform into JSON
        const data = await response.json();
        return data.businesses;
    }
    catch (error) {
        console.log('error', error);
    }}


const showTripCard = async (tripData) => {
    var tripCard = document.getElementById("tripCardSection");
    // resultSection.scrollIntoView({ behavior: "smooth" });
    tripCard.style.display = 'block';
    console.log(tripData.imageURL)
    document.querySelector("#destination-image").setAttribute('src', tripData.imageURL);

    document.getElementById('destination').textContent = `Destination: ${tripData.city}`;
    document.getElementById('tripDate').textContent = `Date: ${tripData.date}`;
    document.getElementById('daysAway').textContent = `Your trip is ${tripData.daysAway} days away.`
    document.getElementById('averageTemperature').textContent = `Average temperature: ${tripData.averageTemperature}`;
    document.getElementById('weatherDescription').textContent = `Weather description: ${tripData.weatherDescription}`;

    var restaurantList = document.getElementById('restaurant-list');
    restaurantList.innerHTML = '';

    tripData.restaurants.forEach(restaurant => {
      var li = document.createElement('li');
      li.textContent = `${restaurant.name} - Rating: ${restaurant.rating}`;
      restaurantList.appendChild(li);
  })
}

function calculateDaysAway(tripDate) {
  const tripDateTime = new Date(tripDate);
  const today = new Date();
  const timeDiff = tripDateTime.getTime() - today.getTime();
  const daysAway = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysAway;
}

async function handleSubmit(event) {
    event.preventDefault();
    let city = document.getElementById("city").value;
    let date = document.getElementById("departure_date").value;

    let tripData = {}
    tripData.city = city
    tripData.date = date

    tripData.daysAway = calculateDaysAway(date);

    const { lat, lng } = await getCityData(city);

    const weatherData = await getWeatherData(lat, lng);
    console.log(weatherData)

    tripData.maxTemp = weatherData.max_temp;
    tripData.minTemp = weatherData.min_temp;

    tripData.weatherDescription = weatherData.weather.description;


    tripData.imageURL = await getImage(city)

    tripData.restaurants = await getRestaurants(city)

    showTripCard(tripData)
    }


export { handleSubmit };

