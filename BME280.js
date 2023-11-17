'use strict';

const os = require('os');
const BME280 = require('bme280-sensor');

const SENSOR_NAME = 'BME280';

const options = {
    i2cBusNo: 1,
    i2cAddress: BME280.BME280_DEFAULT_I2C_ADDRESS() // ハード側で SDO 端子を Vio に繋いで、デフォルトの 0x77 にしておくと何かと楽。
};
const sensor = new BME280(options);

exports.name = () => SENSOR_NAME;

exports.initialize = () => {
    return sensor.init();
}

exports.read = () => {
    return sensor.readSensorData()
        .then(data => {
            const record = {
                time: (new Date()).toISOString(),
                id: `${os.hostname()}-${Number(options.i2cAddress).toString(16)}`,
                sensor: SENSOR_NAME,
                temperature: data.temperature_C,
                humidity: data.humidity,
                pressure: data.pressure_hPa,
            };

            return [record];
        });
};
