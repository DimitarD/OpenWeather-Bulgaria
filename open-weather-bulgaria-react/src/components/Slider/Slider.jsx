import React, { useState } from 'react';

import styles from './Slider.module.scss';

const TODAY = new Date();

function Slider(props) {
    const [datalistId] = useState('tickmarks' + Math.round(Math.random() * 100));
    const { min, max, value } = props;
    const options = [];

    for (let i = 0; i <= max; i++) {
        options.push(<option key={i} value={i} />);
    }

    return (
        <div>
            <div className={styles['forecast-slider-label']}>Slide to view weather forecast:</div>
            <div className={styles['forecast-slider-container']}>
                <input type="range" className={styles['forecast-slider']} min={min} max={max} value={value} list={datalistId} onChange={props.onChange} />
                <div className={styles['forecast-slider-labels-container']}>
                    <div>{TODAY.toDateString()}</div>
                    <div>{(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 5)).toDateString()}</div>
                </div>
            </div>

            <datalist id={datalistId}>{options}</datalist>
        </div>
    );
}

export default Slider;