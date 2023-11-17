'use strict';

const sensor = require('ds18b20-raspi');

const SENSOR_NAME = 'DS18B20';

exports.name = () => SENSOR_NAME;

exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        resolve();
    })
}

exports.read = () => {
    return new Promise(function (resolve, reject) {
        sensor.readAllC((err, temps) => {
            if (err) {
                reject(err);
            } else {
                resolve(temps);
            }
        });
    })
        .then(res => {
            const time = (new Date()).toISOString();

            const records = [];
            for (const device of res) {
                const record = {
                    time,
                    id: device.id,
                    sensor: SENSOR_NAME,
                    temperature: device.t,
                };
                records.push(record);
            }
            return records;
        });
};
