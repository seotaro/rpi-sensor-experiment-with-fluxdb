'use strict';

const SCD4X = require('./scd4x-sensor');
const scd4x = new SCD4X();

exports.name = () => 'SCD4X';

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
                sensor: 'scd4x',
                co2: data.co2,
                temperature: data.temperature,
                humidity: data.humidity,
            };

            return [record];
        });
};

