'use strict';

const SCD4X = require('./scd4x-sensor');
const scd4x = new SCD4X();

exports.name = () => 'SCD4X';

exports.initialize = () => {
    return scd4x.initialize();
}

exports.read = async () => {
    // インターバル 5[s]未満はエラーになることに注意
    return scd4x.readSensorData()
        .then(data => {
            const record = {
                datetime: new Date(),
                device: scd4x.serialNumber,
                values: {
                    co2: data.co2,
                    temperature: data.temperature,
                    humidity: data.humidity
                }
            };

            return [record];
        });
};

