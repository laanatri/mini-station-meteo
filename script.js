// A toi de jouer pour cette partie :-) Happy coding !
const okButton = document.querySelector("button");
const cityInput = document.querySelector("#cityInput");
const cityContent = document.querySelector("#city");
const gpsContent = document.querySelector("#gps");
const temperatureContent = document.querySelector("#temperature");
const detailsContent = document.querySelector("#details");
const humidityContent = document.querySelector("#humidite");
const precipitationContent = document.querySelector("#precipitation");

const fetchCoordinates = async (city) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1`);
    const data = await response.json();
    return data;
}

const fetchWeather = async (lat, lon) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,relative_humidity_2m`);
    const data = await response.json();
    return data;
}

const displayDatas = async (cityData) => {
    if (cityData.length === 0) {
        cityContent.innerText = "Ville non trouvée";
        detailsContent.innerText = "Vérifiez le nom de la ville";
        gpsContent.innerText = `-`;
        temperatureContent.innerText = `-`;
        humidityContent.innerText = `-`;
        precipitationContent.innerText = `-`;
    } else {
        cityContent.innerText = cityData[0].address.city;
        gpsContent.innerText = `Coordonnées GPS: ${Number.parseFloat(cityData[0].lat).toFixed(7)}, ${Number.parseFloat(cityData[0].lon).toFixed(7)}`;
        const cityMeteoDatas = await fetchWeather(Number.parseFloat(cityData[0].lat).toFixed(2), Number.parseFloat(cityData[0].lon).toFixed(7));
        temperatureContent.innerText = `${cityMeteoDatas.current.temperature_2m}${cityMeteoDatas.current_units.temperature_2m}`;
        detailsContent.innerText = "Température actuelle";
        humidityContent.innerText = `Humidité : ${cityMeteoDatas.current.relative_humidity_2m + cityMeteoDatas.current_units.relative_humidity_2m}`;
        precipitationContent.innerText = `Précipitation : ${cityMeteoDatas.current.precipitation + cityMeteoDatas.current_units.precipitation}`;
    }
}

okButton.addEventListener("click", async () => {
    const datas = await fetchCoordinates(cityInput.value);
    await displayDatas(datas)
})