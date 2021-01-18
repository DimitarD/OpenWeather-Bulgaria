import React from 'react';

import styles from './Slider.module.scss';

class Slider extends React.Component {
    datalistId = 'tickmarks' + Math.round(Math.random() * 100);

    render() {
        const TODAY = new Date();
        const { min, max, value } = this.props;
        const options = [];

        for (let i = 0; i <= max; i++) {
            options.push(<option key={i} value={i} />);
        }

        return (
            <div>
                <div className={styles['forecast-slider-label']}>Slide to view weather forecast:</div>
                <div className={styles['forecast-slider-container']}>
                    <input type="range" className={styles['forecast-slider']} min={min} max={max} value={value} list={this.datalistId} onChange={this.props.onChange} />
                    <div className={styles['forecast-slider-labels-container']}>
                        <div>{TODAY.toDateString()}</div>
                        <div>{(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 5)).toDateString()}</div>
                    </div>
                </div>

                <datalist id={this.datalistId}>{options}</datalist>
            </div>
        );
    }
}

export default Slider;