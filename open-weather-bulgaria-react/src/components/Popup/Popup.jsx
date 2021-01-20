import React from 'react';
import PropTypes from 'prop-types';

import styles from './Popup.module.scss';

function Popup(props) {
    const clickedCityInfo = props.cityInfo;
    const currentWeatherData = clickedCityInfo?.weatherData[props.dayIndex];
    const { visible, top, left } = props.visualSettings;

    return (
        <div className={styles['popup'] + (visible ? '' : ' ' + styles['hidden'])} style={{ top: top, left: left }}>
            <div className={styles['popup-header']}>{clickedCityInfo?.name}</div>
            <div>
                <div>Temperature</div>
                <div className={styles['popup-info-header']}>{currentWeatherData?.main.temp}°C</div>
                <div>Humidity</div>
                <div className={styles['popup-info-header']}>{currentWeatherData?.main.humidity}%</div>
                <div>Precipitation</div>
                <div className={styles['popup-info-header']}>{currentWeatherData ? (currentWeatherData.rain ? 'rain' : (currentWeatherData.snow ? 'snow' : 'no')) : null}</div>
            </div>
        </div >
    );
}

Popup.propTypes = {
    cityInfo: PropTypes.object,
    dayIndex: PropTypes.number,
    visualSettings: PropTypes.shape({
        left: PropTypes.string,
        top: PropTypes.string,
        visible: PropTypes.bool,
    }),
};

export default Popup;