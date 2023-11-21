'use strict';

require('dotenv').config();

const WAIT = 5000;  // 読み込み始めるまでの待ち時間 [ms]

let sensors = [];
if (process.env.BME280 && (process.env.BME280 === 'on')) {
    const BME280 = require('./BME280');
    sensors.push(BME280);
}
if (process.env.SHT31 && (process.env.SHT31 === 'on')) {
    const SHT31 = require('./SHT31');
    sensors.push(SHT31);
}
if (process.env.DS18B20 && (process.env.DS18B20 === 'on')) {
    const DS18B20 = require('./DS18B20');
    sensors.push(DS18B20);
}
if (process.env.SCD4X && (process.env.SCD4X === 'on')) {
    const SCD4X = require('./SCD4X');
    sensors.push(SCD4X);
}

const initialize = (sensors) => {
    return Promise.allSettled(sensors.map((sensor) => { return sensor.initialize() }))
        .then(results => {
            const errors = [];
            results.forEach((result, i) => {
                if (result.status !== 'fulfilled') {
                    errors.push({ status: `${sensors[i].name()} initialization failed ${result.reason}` });
                }
            });
            if (0 < errors.length) {
                console.error(JSON.stringify(errors))
            }
        });

};

const read = (sensors) => {
    return Promise.allSettled(sensors.map((sensor) => { return sensor.read() }))
        .then(results => {
            const records = [];
            results.forEach((result, i) => {
                if (result.status === 'fulfilled') {
                    records.push(...result.value);
                }
            });

            return records;
        });
};

(async () => {
    await initialize(sensors);

    // SCD4X は計測するのに初期化から 5[s] 待つ必要がある。
    setTimeout(async () => {
        const records = await read(sensors)
        console.log(JSON.stringify(records))
    }, WAIT);
})();
