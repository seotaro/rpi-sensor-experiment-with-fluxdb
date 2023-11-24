# ラズパイでセンサーの値を取得して InfluxDB に格納するサンプルコード

Telegraf から一定間隔で計測プログラムが実行され、計測値がサーバーの InfluxDB に格納される。

（計測プログラム） → Telegraf → InfluxDB

## Install

```bash
# Node.js
make setup-node

# Telegraf
make setup-telegraf

# I2C
make setup-i2c

# 1-Wire
make enable-1-wire

# Deploy exec
make deploy
```

## stdout

標準出力に計測値を所定のフォーマットで出力して Telegraf に取得させる。

出力例）

```json
[{"time":"2023-11-21T12:53:55.519Z","id":"rpi4b8g-77","sensor":"BME280","temperature":24.49,"humidity":35.92742318719938,"pressure":1021.6984834213315},{"time":"2023-11-21T12:53:55.517Z","id":"rpi4b8g-44","sensor":"SHT31","temperature":25.39253833829251,"humidity":41.13679713130389},{"time":"2023-11-21T12:53:59.619Z","id":"xx-xxxxxxxxxxxxxxxxxxxxxxxx","sensor":"DS18B20","temperature":25.312},{"time":"2023-11-21T12:53:59.619Z","id":"xx-xxxxxxxxxxxx","sensor":"DS18B20","temperature":25.375},{"time":"2023-11-21T12:53:55.537Z","id":"xxxxxxxxxxxx","sensor":"SCD4X","co2":965,"temperature":29.279403686523438,"humidity":30.2978515625}]
```

## /etc/telegraf/telegraf.conf

設定例）

```conf
[agent]
  interval = "30s"
  flush_interval = "30s"

[[outputs.influxdb_v2]]
  urls = ["http://{アドレス}:8086"]
  token = "{token}"
  organization = "{organization}"
  bucket = "{bucket}"


[[inputs.exec]]
  commands = [
    "node /usr/local/bin/rpi-sensor-experiment-with-fluxdb/index.js"
  ]

  environment = [
    "DS18B20={on|off}",
    "SHT31={on|off}",
    "BME280={on|off}",
    "SCD4X={on|off}"
  ]

  timeout = "30s"

  data_format = "json"
  json_time_key = "time"
  json_time_format = "2006-01-02T15:04:05Z07:00"
  tag_keys = ["id", "sensor"]
```

SCD4X は計測に10秒程度かかるのでタイムアウトに注意すること。

変更したら Telegraf を再起動する。

```bash
sudo systemctl restart telegraf.service
```

## data-explorer

![image](https://github.com/seotaro/rpi-sensor-experiment-with-fluxdb/assets/46148606/599b95d7-716f-4c7d-b505-3a38af62653e)

## 参考

I2C デバイスの確認

```bash
sudo apt install i2c-tools
i2cdetect -y 1
```

データシート

- BME280
  - [data sheet](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf)
- DS18B20
  - [data sheet](https://datasheets.maximintegrated.com/en/ds/DS18B20.pdf)
- SHT31
  - [data sheet](https://sensirion.com/media/documents/213E6A3B/61641DC3/Sensirion_Humidity_Sensors_SHT3x_Datasheet_digital.pdf)
- SCD4X
  - [data sheet](https://d2air1d4eqhwg2.cloudfront.net/media/files/262fda6e-3a57-4326-b93d-a9d627defdc4.pdf)
  - [Sensirion/raspberry-pi-i2c-scd4x](https://github.com/Sensirion/raspberry-pi-i2c-scd4x#connecting-the-sensor)
