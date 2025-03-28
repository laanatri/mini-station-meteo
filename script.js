// A toi de jouer pour cette partie :-) Happy coding !
const okButton = document.querySelector("button");
const cityInput = document.querySelector("#cityInput");
const cityContent = document.querySelector("#city");
const gpsContent = document.querySelector("#gps");
const temperatureContent = document.querySelector("#temperature");
const detailsContent = document.querySelector("#details");
const humidityContent = document.querySelector("#humidite");
const precipitationContent = document.querySelector("#precipitation");
const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');

const fetchCoordinates = async (city) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1`);
    const data = await response.json();
    console.log(data)
    return data;
}

const fetchWeather = async (lat, lon) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,relative_humidity_2m`);
    const data = await response.json();
    return data;
}

const fetchWeathersDays = async (lat, lon, nmbDays) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation&past_days=${nmbDays}`);
    const data = await response.json();
    return data;
}

const updateGraph = (graphic, labels, datas) => {
    graphic.data.labels = labels;
    graphic.data.datasets = datas;
    graphic.update();
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
        cityContent.innerText = cityData[0].name;
        gpsContent.innerText = `Coordonnées GPS: ${Number.parseFloat(cityData[0].lat).toFixed(7)}, ${Number.parseFloat(cityData[0].lon).toFixed(7)}`;
        const cityMeteoDatas = await fetchWeather(Number.parseFloat(cityData[0].lat).toFixed(2), Number.parseFloat(cityData[0].lon).toFixed(2));
        const cityMeteoDatasDays = await fetchWeathersDays(Number.parseFloat(cityData[0].lat).toFixed(2), Number.parseFloat(cityData[0].lon).toFixed(2), 2);
        temperatureContent.innerText = `${cityMeteoDatas.current.temperature_2m}${cityMeteoDatas.current_units.temperature_2m}`;
        detailsContent.innerText = "Température actuelle";
        humidityContent.innerText = `Humidité : ${cityMeteoDatas.current.relative_humidity_2m + cityMeteoDatas.current_units.relative_humidity_2m}`;
        precipitationContent.innerText = `Précipitation : ${cityMeteoDatas.current.precipitation + cityMeteoDatas.current_units.precipitation}`;
        const datasets = [
            {
                label: 'Températures en °C',
                data: cityMeteoDatasDays.hourly.temperature_2m.splice(0, 72),
                borderWidth: 0
            },
            {
                label: 'Précipitations en mm',
                data: cityMeteoDatasDays.hourly.precipitation.splice(0, 72),
                borderWidth: 2
            }
        ]
        updateGraph(graph, cityMeteoDatasDays.hourly.time.splice(0, 72), datasets);
    }
}

okButton.addEventListener("click", async () => {
    const datas = await fetchCoordinates(cityInput.value);
    await displayDatas(datas)
})

let config = {
    type: 'bar',
    data: {
      labels: []
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
}

const graph = new Chart(ctx, config);