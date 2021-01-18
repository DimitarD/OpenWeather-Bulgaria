import React from 'react';
import styles from './WeatherIcon.module.scss';

function WeatherIcon(props) {
    return (
        <div
            className={styles['weather-icon']}
            style={{
                backgroundImage: `url("http://openweathermap.org/img/wn/${props.image}.png")`,
                top: props.top,
                left: props.left,
            }}
            cityid={props.cityId}
        />
    );
}

export default WeatherIcon;