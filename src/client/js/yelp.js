export const getRestaurants = async (city) => {
    const response = await fetch(`http://localhost:8000/api/restaurants?city=${city}`);

    try {
        //Transform into JSON
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log('error', error);
    }}