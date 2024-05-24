export const getCityData = async (city) => {
    // fetch the data from the geonamesAPI
    const geonamesApiURL = 'http://api.geonames.org/searchJSON?q=';
    const geonamesApiUsername = "mohammad.r.kazmi";
    const data = await fetch(geonamesApiURL + city + '&maxRows=5&' + 'username=' + geonamesApiUsername);
    try {
        // parse json response
        const cityData = await data.json();
        return cityData;
    } catch (error) {
        console.log("error", error);
    }
  };