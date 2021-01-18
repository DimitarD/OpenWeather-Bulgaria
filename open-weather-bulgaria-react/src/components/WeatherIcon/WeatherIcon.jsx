import React from 'react';
import styles from './WeatherIcon.module.scss';

class WeatherIcon extends React.Component {
    render() {
        return (
            <div
                className={styles['weather-icon']}
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

export default WeatherIcon;