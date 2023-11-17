'use strict';

const BME280 = require('bme280-sensor');

const options = {
    i2cBusNo: 1,
    i2cAddress: BME280.BME280_DEFAULT_I2C_ADDRESS() // ハード側で SDO 端子を Vio に繋いで、デフォルトの 0x77 にしておくと何かと楽。
};
const sensor = new BME280(options);

exports.name = () => 'BME280';

exports.initialize = () => {
    return sensor.init();
}

exports.read = () => {
    return sensor.readSensorData()
        .then(data => {
            const record = {
                datetime: new Date(),
                device: `${Number(options.i2cAddress).toString(16)}`,
                values: {
                    temperature: data.temperature_C,
                    humidity: data.humidity,
                    pressure: data.pressure_hPa
                }
            };

            return [record];
        });
};
