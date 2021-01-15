import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const today = new Date();

class Popup extends React.Component {
    render() {
        const clickedCityInfo = this.props.cityInfo;
        const currentWeatherData = clickedCityInfo?.weatherData[this.props.dayIndex];
        const visualSettings = this.props.visualSettings;

        return (
            <div id="popup" className={visualSettings.visible ? '' : 'hidden'} style={{ top: visualSettings.top, left: visualSettings.left }}>
                <div id="popupHeader">{clickedCityInfo?.name}</div>
                <div>
                    <div>Temperature</div>
                    <div id="popupTemperature">{currentWeatherData?.main.temp}°C</div>
                    <div>Humidity</div>
                    <div id="popupHumidity">{currentWeatherData?.main.humidity}%</div>
                    <div>Precipitation</div>
                    <div id="popupPrecipitation">{currentWeatherData ? (currentWeatherData.rain ? 'rain' : (currentWeatherData.snow ? 'snow' : 'no')) : null}</div>
                </div>
            </div >
        );
    }
}

class WeatherIcon extends React.Component {
    render() {
        return (
            <div
                className="weather-icon"
                style={{
                    backgroundImage: `url("http://openweathermap.org/img/wn/${this.props.image}.png")`,
                    top: this.props.top,
                    left: this.props.left,
                }}
                cityid={this.props.cityId}
            />
        )
    }
}

class Slider extends React.Component {
    render() {
        const min = this.props.min;
        const max = this.props.max;
        const value = this.props.value;
        const options = [];

        for (let i = 0; i <= max; i++) {
            options.push(<option key={i} value={i} />);
        }

        return (
            <div>
                <label htmlFor="forecastSlider" id="forecastSliderLabel">Slide to view weather forecast:</label>
                <div id="forecastSliderContainer">
                    <input type="range" id="forecastSlider" min={min} max={max} value={value} list="tickmarks" onChange={this.props.onChange} />
                    <div id="forecastSliderLabelsContainer">
                        <div id="startDate">{today.toDateString()}</div>
                        <div id="endDate">{(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)).toDateString()}</div>
                    </div>
                </div>

                <datalist id="tickmarks">{options}</datalist>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dayIndex: 0,
            cityInfo: null,
            popupSettings: {
                left: 0,
                top: 0,
                visible: false
            },
            icons: []
        };
    }

    componentDidMount() {
        this.getCurrentWeather();

        document.addEventListener('pointerdown', this.documentPointerdownHandler);
    }

    componentWillUnmount() {
        document.removeEventListener('pointerdown', this.documentPointerdownHandler);
    }

    cityInfo = {
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

    documentPointerdownHandler = (event) => {
        const clickedIcon = event.target.closest('.weather-icon');

        if (!clickedIcon) {
            if (!event.target.closest('#popup')) {
                this.setState({
                    popupSettings: {
                        left: this.state.popupSettings.left,
                        top: this.state.popupSettings.top,
                        visible: false,
                    },
                });
            }

            return;
        }

        this.setState({
            cityInfo: this.cityInfo[clickedIcon.getAttribute('cityid')],
            popupSettings: {
                left: clickedIcon.style.left,
                top: clickedIcon.style.top,
                visible: true,
            },
        });
    }

    sliderChangeHandler(event) {
        const dayIndex = parseFloat(event.target.value);
        const previousIcons = this.state.icons.slice(0);

        this.setState({ dayIndex });

        // updates icons for weather on selected day
        const icons = Object.keys(this.cityInfo).map((currentCityId, index) => {
            const previousIcon = previousIcons[index];

            return (
                <WeatherIcon
                    image={this.cityInfo[currentCityId].weatherData[dayIndex].weather[0].icon}
                    top={previousIcon.props.top + 'px'}
                    left={previousIcon.props.left + 'px'}
                    cityId={currentCityId}
                    key={currentCityId}
                />
            );
        });

        this.setState({ icons });
    }

    getForecast() {
        Object.keys(this.cityInfo).forEach((currentCityId) => {
            // OpenWeather API allows getting forecast for only one city at a time
            fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${currentCityId}&appid=a75e518090b847d8cb624cff50f81d54&units=metric`)
                .then(response => response.json())
                .then(data => {
                    const cityId = data.city.id;

                    data.list.forEach((dataPoint, index) => {
                        const date = new Date(dataPoint.dt_txt);

                        if (date.getDate() !== today.getDate()
                            && (date.getHours() === 12
                                || (index === data.list.length - 1
                                    && this.cityInfo[cityId].weatherData.length === 5))) {
                            // cache only the forecast for 12:00 of each of the next five days
                            this.cityInfo[cityId].weatherData.push(dataPoint);
                        }
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
    }

    createIcons(data) {
        const icons = this.state.icons.concat(data.list.map((cityData) => {
            const cityId = cityData.id;
            const { top, left } = this.cityInfo[cityId];

            this.cityInfo[cityId].weatherData.push(cityData);

            return (
                <WeatherIcon
                    image={cityData.weather[0].icon}
                    top={top + 'px'}
                    left={left + 'px'}
                    cityId={cityId}
                    key={cityId}
                />
            )
        }));

        this.setState({ icons });
    }

    getCurrentWeather() {
        const allCityIds = Object.keys(this.cityInfo);

        // fetching in two groups due to OpenWeather API restrictions for free accounts
        for (let i = 0; i <= 1; i++) {
            fetch(`https://api.openweathermap.org/data/2.5/group?id=${allCityIds.slice(i * 14, (i + 1) * 14).join(',')}&appid=a75e518090b847d8cb624cff50f81d54&units=metric`)
                .then(response => response.json())
                .then(data => {
                    this.createIcons(data);

                    if (i === 1) {
                        this.getForecast();
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    render() {
        const currentDateLabel = (new Date(today.getFullYear(), today.getMonth(), today.getDate() + this.state.dayIndex)).toDateString();

        return (
            <div>
                <h3>Weather in Bulgaria on <span id="dateLabel">{currentDateLabel}</span></h3>

                <div id="mapContainer">
                    <Popup cityInfo={this.state.cityInfo} dayIndex={this.state.dayIndex} visualSettings={this.state.popupSettings} />
                    {this.state.icons}
                </div>

                <Slider min="0" max="5" value={this.state.dayIndex} onChange={(event) => this.sliderChangeHandler(event)} />
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);