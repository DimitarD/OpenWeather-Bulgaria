const cityInfo = {
    733191: { name: 'Blagoevgrad', top: 282, left: 73, weatherData: [] },
    732770: { name: 'Burgas', top: 211, left: 493, weatherData: [] },
    726418: { name: 'Dobrich', top: 77, left: 518, weatherData: [] },
    731549: { name: 'Gabrovo', top: 172, left: 293, weatherData: [] },
    730435: { name: 'Haskovo', top: 292, left: 309, weatherData: [] },
    729794: { name: 'Kardzhali', top: 331, left: 292, weatherData: [] },
    729730: { name: 'Kyustendil', top: 247, left: 36, weatherData: [] },
    729559: { name: 'Lovech', top: 136, left: 227, weatherData: [] },
    729114: { name: 'Montana', top: 104, left: 87, weatherData: [] },
    728378: { name: 'Pazardzhik', top: 259, left: 193, weatherData: [] },
    728330: { name: 'Pernik', top: 205, left: 71, weatherData: [] },
    728203: { name: 'Pleven', top: 103, left: 219, weatherData: [] },
    728193: { name: 'Plovdiv', top: 266, left: 233, weatherData: [] },
    727696: { name: 'Razgrad', top: 88, left: 398, weatherData: [] },
    727523: { name: 'Ruse', top: 47, left: 344, weatherData: [] },
    727233: { name: 'Shumen', top: 116, left: 436, weatherData: [] },
    727221: { name: 'Silistra', top: 8, left: 464, weatherData: [] },
    727079: { name: 'Sliven', top: 196, left: 381, weatherData: [] },
    727030: { name: 'Smolyan', top: 338, left: 230, weatherData: [] },
    727011: { name: 'Sofia', top: 196, left: 98, weatherData: [] },
    726848: { name: 'Stara Zagora', top: 229, left: 313, weatherData: [] },
    726174: { name: 'Targovishte', top: 122, left: 403, weatherData: [] },
    864561: { name: 'Veliko Tarnovo', top: 146, left: 314, weatherData: [] },
    725905: { name: 'Vidin', top: 30, left: 52, weatherData: [] },
    725712: { name: 'Vratsa', top: 130, left: 118, weatherData: [] },
    726050: { name: 'Varna', top: 122, left: 533, weatherData: [] },
    725578: { name: 'Yambol', top: 218, left: 399, weatherData: [] }
}; // codes retrieved from http://bulk.openweathermap.org/sample/city.list.json.gz

const today = new Date();

let dayIndex = 0;
let mapContainer;

function getForecast() {
    Object.keys(cityInfo).forEach((currentCityId) => {
        // OpenWeather API allows getting forecast for only one city at a time
        fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${currentCityId}&appid=a75e518090b847d8cb624cff50f81d54&units=metric`)
            .then(response => response.json())
            .then(data => {
                const cityId = data.city.id;

                data.list.forEach((dataPoint, index) => {
                    const date = new Date(dataPoint.dt_txt);

                    if (date.getDate() !== today.getDate()
                        && (date.getHours() === 12
                            || index === data.list.length - 1
                            && cityInfo[cityId].weatherData.length === 5)) {
                        // cache only the forecast for 12:00 of each of the next five days
                        cityInfo[cityId].weatherData.push(dataPoint);
                    }
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}

function createIcons(data) {
    data.list.forEach((cityData) => {
        const cityId = cityData.id;
        const iconElement = document.createElement('div');
        const { top, left } = cityInfo[cityId];

        iconElement.id = 'icon' + cityId;
        iconElement.className = 'weather-icon';
        iconElement.style.backgroundImage = `url("http://openweathermap.org/img/wn/${cityData.weather[0].icon}.png")`;
        iconElement.style.left = left + 'px';
        iconElement.style.top = top + 'px';

        iconElement.cityId = cityId;

        mapContainer.appendChild(iconElement);

        cityInfo[cityId].weatherData.push(cityData);
    });
}

function getCurrentWeather() {
    const allCityIds = Object.keys(cityInfo);

    // fetching in two groups due to OpenWeather API restrictions for free accounts
    for (let i = 0; i <= 1; i++) {
        fetch(`https://api.openweathermap.org/data/2.5/group?id=${allCityIds.slice(i * 14, (i + 1) * 14).join(',')}&appid=a75e518090b847d8cb624cff50f81d54&units=metric`)
            .then(response => response.json())
            .then(data => {
                createIcons(data);

                if (i === 1) {
                    getForecast();
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

window.onload = function () {
    const dateLabel = document.getElementById('dateLabel');
    const popup = document.getElementById('popup');
    const popupHeader = document.getElementById('popupHeader');
    const popupTemperature = document.getElementById('popupTemperature');
    const popupHumidity = document.getElementById('popupHumidity');
    const popupPrecipitation = document.getElementById('popupPrecipitation');
    const todayString = today.toDateString();
    const endDateString = (new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)).toDateString();

    mapContainer = document.getElementById('mapContainer');

    dateLabel.textContent = todayString;
    document.getElementById('startDate').textContent = todayString;
    document.getElementById('endDate').textContent = endDateString;
    requestAnimationFrame(() => popup.classList.add('transition'));

    getCurrentWeather();

    document.addEventListener('pointerdown', (event) => {
        const clickedIcon = event.target.closest('.weather-icon');

        if (!clickedIcon) {
            if (!popup.contains(event.target)) {
                popup.classList.add('hidden');
            }

            return;
        }

        const clickedCityInfo = cityInfo[clickedIcon.cityId];
        const currentWeatherData = clickedCityInfo.weatherData[dayIndex];

        popupHeader.textContent = clickedCityInfo.name;
        popupTemperature.textContent = currentWeatherData.main.temp + '°C';
        popupHumidity.textContent = currentWeatherData.main.humidity + '%';
        popupPrecipitation.textContent = currentWeatherData.rain ? 'rain' : (currentWeatherData.snow ? 'snow' : 'no');

        popup.style.left = clickedIcon.style.left;
        popup.style.top = clickedIcon.style.top;
        popup.classList.remove('hidden');
    });

    document.getElementById('forecastSlider').addEventListener('change', function (event) {
        dayIndex = parseFloat(this.value);

        dateLabel.textContent = (new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayIndex)).toDateString();

        // updates icons for weather on selected day
        Object.keys(cityInfo).forEach((currentCityId) => {
            const icon = document.getElementById('icon' + currentCityId);

            icon.style.backgroundImage = `url("http://openweathermap.org/img/wn/${cityInfo[currentCityId].weatherData[dayIndex].weather[0].icon}.png")`;
        });
    });
}