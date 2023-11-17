'use strict';

const fetch = require('node-fetch');

const SENSOR_NAME = 'NatureRemo';

exports.name = () => SENSOR_NAME;

exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        resolve();
    })
}

exports.read = () => {
    return fetch('https://api.nature.global/1/devices', {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NatureRemoToken}`
        },
    })
        .then(res => {
            if (res.status !== 200) {
                throw new Error(`response status is ${res.status}`);
            }
            return res.text();
        })
        .then(text => {
            return JSON.parse(text);
        })
        .then(json => {
            const records = [];

            json.forEach(device => {
                const record = {
                    time: (new Date()).toISOString(),
                    sensor: SENSOR_NAME,
                    id: device.id,
                };

                if (device.newest_events.te) {
                    record.temperature = device.newest_events.te.val + device.temperature_offset;
                }
                if (device.newest_events.hu) {
                    record.humidity = device.newest_events.hu.val + device.humidity_offset;
                }
                if (device.newest_events.il) {
                    record.illumination = device.newest_events.il.val;
                }
                if (device.newest_events.mo) {
                    record.movement = device.newest_events.mo.val;
                }

                records.push(record)
            })

            return records;
        });
};
