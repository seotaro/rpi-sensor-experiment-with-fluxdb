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

console.log(`interval: ${process.env.INTERVAL} [ms]`);
sensors.forEach(x => {
    console.log(`${x.name()}: use`);
})

const initialize = async (sensors) => {
    for (const sensor of sensors) {
        await sensor.initialize()
            .then(() => {
                console.log(`${sensor.name()}: initialization succeeded`);
            })
            .catch(err => console.error(`${sensor.name()}: initialization failed: ${err} `));
    }
};

const read = async (sensors) => {
    for (const sensor of sensors) {
        await sensor.read()
            .then(records => {
                console.log(`${sensor.name()}: read\n`, records, '\n');
            })
            .catch(err => {
                console.log(`${sensor.name()}: read error ${err}`);
            });
    }
};

initialize(sensors);
setInterval(() => { read(sensors) }, process.env.INTERVAL);
