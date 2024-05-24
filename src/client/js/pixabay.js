// GET - get imageURL info from API
export const getImage = async (city) => {
    const response = await fetch(`https://pixabay.com/api/?q=${city}&key=44028546-0d7c6f6a9bf062b356bc2a4e2`);
    const data = await fetch();

    try {
        //Transform into JSON
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log('error', error);
    }}