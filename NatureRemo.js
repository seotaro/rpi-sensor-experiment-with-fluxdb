'use strict';

const os = require('os');
const fetch = require('node-fetch');

exports.name = () => 'NatureRemo';

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
            const record = { datetime: new Date(), devices: [] };

            // API から返ってきた時刻にしているが、実際の計測時刻は各要素の created_at であることに注意。ハンドリングしづらい。
            json.forEach(device => {
                const value = { id: `${device.id}` }
                if (device.newest_events.te) {
                    value.temperature = device.newest_events.te.val + device.temperature_offset;
                }
                if (device.newest_events.hu) {
                    value.humidity = device.newest_events.hu.val + device.humidity_offset;
                }
                if (device.newest_events.il) {
                    value.illumination = device.newest_events.il.val;
                }
                if (device.newest_events.mo) {
                    value.movement = device.newest_events.mo.val;
                }
                record.devices.push(value)
            })
            return record;
        });
};
