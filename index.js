'use strict';

require('dotenv').config();

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
if (process.env.NatureRemo && (process.env.NatureRemo === 'on')) {
    const NatureRemo = require('./NatureRemo');
    sensors.push(NatureRemo);
}

const initialize = async (sensors) => {
    for (const sensor of sensors) {
        await sensor.initialize()
            .catch(err => {
                console.error(`{status: ${sensor.name()} initialization failed }`)
            });
    }
};

const read = async (sensors) => {
    const ret = [];
    for (const sensor of sensors) {
        await sensor.read()
            .then(records => {
                ret.push(...records);
            })
    }
    return ret;
};

(async () => {
    await initialize(sensors);
    console.log(JSON.stringify(await read(sensors)));
})();

// console.log((new Date()).toISOString());