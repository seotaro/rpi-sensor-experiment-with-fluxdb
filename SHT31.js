'use strict';

const { SHT31 } = require('sht31-node')

const sensor = new SHT31()

const SENSOR_NAME = 'SHT31';

exports.name = () => SENSOR_NAME;

exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        resolve();
    })
}

exports.read = () => {
    return sensor.readSensorData()
        .then(data => {
            const record = {
                time: (new Date()).toISOString(),
                id: `${Number(sensor.address).toString(16)}`,
                sensor: SENSOR_NAME,
                temperature: data.temperature,
                humidity: data.humidity,
            };

            return [record];
        });
};
