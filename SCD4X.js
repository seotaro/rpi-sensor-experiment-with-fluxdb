'use strict';

const SCD4X = require('./scd4x-sensor');
const scd4x = new SCD4X();

const SENSOR_NAME = 'SCD4X';

exports.name = () => SENSOR_NAME;

exports.initialize = () => {
    return scd4x.initialize();
}

exports.read = () => {
    // インターバル 5[s]未満はエラーになることに注意
    return scd4x.readSensorData()
        .then(data => {
            const record = {
                time: (new Date()).toISOString(),
                id: scd4x.serialNumber,
                sensor: SENSOR_NAME,
                co2: data.co2,
                temperature: data.temperature,
                humidity: data.humidity,
            };

            return [record];
        });
};

