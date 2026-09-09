'use strict';

const os = require('os');
const { Bme680 } = require('bme680-sensor');

const SENSOR_NAME = 'BME688';

const I2C_BUS_NO = 1;
const I2C_ADDRESS = 0x76;  // BME688 のデフォルト。BME280 が 0x77 なので同じバスに並存できる。

let sensor = null;

exports.name = () => SENSOR_NAME;

exports.initialize = () => {
    // Bme680 のコンストラクターが I2C バスを開くので、ここで生成して失敗を Promise に載せる。
    return Promise.resolve()
        .then(() => {
            sensor = new Bme680(I2C_BUS_NO, I2C_ADDRESS);
            return sensor.initialize();
        });
}

exports.read = () => {
    return sensor.getSensorData()
        .then(res => {
            const data = res.data;
            const record = {
                time: (new Date()).toISOString(),
                id: `${os.hostname()}-${Number(I2C_ADDRESS).toString(16)}`,
                sensor: SENSOR_NAME,
                temperature: data.temperature,        // [°C]
                humidity: data.humidity,              // [%RH]
                pressure: data.pressure,              // [hPa]
                gas_resistance: data.gas_resistance,  // [Ω]
            };

            return [record];
        });
};
