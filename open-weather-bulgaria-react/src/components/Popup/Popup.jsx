import React from 'react';

import styles from './Popup.module.scss';

class Popup extends React.Component {
    render() {
        const clickedCityInfo = this.props.cityInfo;
        const currentWeatherData = clickedCityInfo?.weatherData[this.props.dayIndex];
        const visualSettings = this.props.visualSettings;

        return (
            <div className={styles['popup'] + (visualSettings.visible ? '' : ' ' + styles['hidden'])} style={{ top: visualSettings.top, left: visualSettings.left }}>
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
}

export default Popup;