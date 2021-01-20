import React from 'react';
import PropTypes from 'prop-types';

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

WeatherIcon.propTypes = {
    cityId: PropTypes.number,
    image: PropTypes.string,
    left: PropTypes.string,
    top: PropTypes.string,
};

export default WeatherIcon;