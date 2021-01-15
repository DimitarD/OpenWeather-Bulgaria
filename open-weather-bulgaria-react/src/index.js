import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const today = new Date();

function Popup(props) {
    return (
        <div id="popup" className="hidden">
            <div id="popupHeader"></div>
            <div>
                <div>Temperature</div>
                <div id="popupTemperature"></div>
                <div>Humidity</div>
                <div id="popupHumidity"></div>
                <div>Precipitation</div>
                <div id="popupPrecipitation"></div>
            </div>
        </div>
    );
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
            dayIndex: 0
        };

        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        /*    const dateLabel = document.getElementById('dateLabel');
           const popup = document.getElementById('popup');
           const popupHeader = document.getElementById('popupHeader');
           const popupTemperature = document.getElementById('popupTemperature');
           const popupHumidity = document.getElementById('popupHumidity');
           const popupPrecipitation = document.getElementById('popupPrecipitation');
   
           mapContainer = document.getElementById('mapContainer');
   
           requestAnimationFrame(() => popup.classList.add('transition')); */

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

    documentPointerdownHandler(event) {

    }

    sliderChangeHandler(event) {
        const dayIndex = parseFloat(event.target.value);

        this.setState({ dayIndex });

        // updates icons for weather on selected day
        Object.keys(this.cityInfo).forEach((currentCityId) => {
            const icon = document.getElementById('icon' + currentCityId);

            icon.style.backgroundImage = `url("http://openweathermap.org/img/wn/${this.cityInfo[currentCityId].weatherData[dayIndex].weather[0].icon}.png")`;
        });
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
        data.list.forEach((cityData) => {
            const cityId = cityData.id;
            const iconElement = document.createElement('div');
            const { top, left } = this.cityInfo[cityId];

            iconElement.id = 'icon' + cityId;
            iconElement.className = 'weather-icon';
            iconElement.style.backgroundImage = `url("http://openweathermap.org/img/wn/${cityData.weather[0].icon}.png")`;
            iconElement.style.left = left + 'px';
            iconElement.style.top = top + 'px';

            iconElement.cityId = cityId;

            this.mapContainer.current.appendChild(iconElement);

            this.cityInfo[cityId].weatherData.push(cityData);
        });
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

                <div id="mapContainer" ref={this.mapContainer}>
                    <Popup />
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


/* function Square(props) {
    return (
      <button
        className={'square' + (props.winning ? ' winning' : '')}
        onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          key={i}
          value={this.props.squares[i].value}
          winning={this.props.squares[i].winning}
          onClick={() => this.props.onClick(i)}
        />
      );
    }

    render() {
      const structure = [];

      for (let i = 0; i < 3; i++) {
        const innerStructure = [];

        for (let j = 0; j < 3; j++) {
          innerStructure.push(this.renderSquare(3 * i + j));
        }

        structure.push(<div key={i} className="board-row">{innerStructure}</div>);
      }

      return (
        <div>{structure}</div>
      );
    }
  }

  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null).map(value => ({ value: value, winning: false })), row: null, col: null
        }],
        stepNumber: 0,
        xIsNext: true,
        order: 'asc',
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = JSON.parse(JSON.stringify(current.squares));
      const { row, col } = this.getColRow(i);

      if (calculateWinner(squares).side || squares[i].value) {
        return;
      }

      squares[i].value = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{ squares, row, col }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }

    getColRow(i) {
      return { col: i % 3 + 1, row: Math.ceil((i + 1) / 3) }
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: step % 2 === 0,
      })
    }

    handleOrderChange() {
      const newOrder = this.state.order === 'asc' ? 'desc' : 'asc';

      this.setState({ order: newOrder });

    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const { col, row } = history[move];

        const desc = move ?
          `Go to move #${move} (col: ${col}, row:${row})` :
          'Go to game start';

        return (
          <li key={move}>
            <button
              className={move === this.state.stepNumber ? 'selected' : ''}
              onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      });

      if (this.state.order === 'desc') {
        moves.reverse();
      }

      let status;

      if (winner.side) {
        status = 'Winner: ' + winner.side;

        winner.combination.map(i => current.squares[i].winning = true);

      } else if (history.length === 10 && this.state.stepNumber === history.length - 1) {
        status = 'Draw';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }


      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.handleOrderChange()}>Moves order: {this.state.order}</button>
            <ol reversed={this.state.order === 'desc'}>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  // ========================================

  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a].value && squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
        return { side: squares[a].value, combination: lines[i] };
      }
    }
    return { side: null, combination: null };
  } */