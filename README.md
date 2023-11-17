# ラズパイでセンサーの値を取得する

## インストール

```bash
yarn install
```

## 設定

カレントディレクトリの .env に定義する。

|  項目  |  値  |  意味  |
| ---- | ---- | ---- |
|  BME280  |  on\|off  |  BME280 から取得する\|しない  |
|  SHT31  |  on\|off  |  SHT31 から取得する\|しない  |
|  DS18B20  |  on\|off  |  DS18B20 から取得する\|しない  |
|  SCD4x  |  on\|off  |  SCD4x から取得する\|しない  |
|  NatureRemo  |  on\|off  |  NatureRemo から取得する\|しない  |
|  NatureRemoToken  |  文字列  |  API のトークン  |

.env 例）

```text
DS18B20=on
SHT31=on
BME280=on
SCD4X=on

NatureRemo=on
NatureRemoToken=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 実行

```bash
node index.js
```

## その他

I2C デバイスの確認

```bash
sudo apt install i2c-tools
i2cdetect -y 1
```

## 参考

- BME280
  - [data sheet](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf)
- DS18B20
  - [data sheet](https://datasheets.maximintegrated.com/en/ds/DS18B20.pdf)
- Nature Remo
  - [NATURE](https://nature.global/)
  - [Nature Remo Cloud API](https://developer.nature.global/)
- SHT31
  - [data sheet](https://sensirion.com/media/documents/213E6A3B/61641DC3/Sensirion_Humidity_Sensors_SHT3x_Datasheet_digital.pdf)
- SCD4X
  - [data sheet](https://d2air1d4eqhwg2.cloudfront.net/media/files/262fda6e-3a57-4326-b93d-a9d627defdc4.pdf)
  - [Sensirion/raspberry-pi-i2c-scd4x](https://github.com/Sensirion/raspberry-pi-i2c-scd4x#connecting-the-sensor)


## telegraf
/etc/telegraf/telegraf.conf

```conf
[agent]
  interval = "30s"
  flush_interval = "30s"

[[outputs.influxdb_v2]]
  urls = ["http://{アドレス}:8086"]
  token = "{token}"
  organization = "{organization}"
  bucket = "{bucket}"


# Read metrics from one or more commands that can output to stdout
[[inputs.exec]]
  ## Commands array
  commands = [
    "node /usr/local/bin/rpi-sensor-experiment-with-fluxdb/index.js"
  ]

  ## Environment variables
  ## Array of "key=value" pairs to pass as environment variables
  ## e.g. "KEY=value", "USERNAME=John Doe",
  ## "LD_LIBRARY_PATH=/opt/custom/lib64:/usr/local/libs"
  environment = [
    "DS18B20=on",
    "SHT31=off",
    "BME280=off",
    "SCD4X=on",
    "NatureRemo=on",
    "NatureRemoToken={トークン}"
  ]

  ## Timeout for each command to complete.
  timeout = "30s"

  ## measurement name suffix (for separating different commands)
  #name_suffix = "_mycollector"

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "json"
  json_time_key = "time"
  json_time_format = "2006-01-02T15:04:05Z07:00"
  tag_keys = ["id", "sensor"]

```

```bash
sudo nano /etc/telegraf/telegraf.conf
sudo systemctl restart telegraf.service
sudo journalctl -u telegraf.service -f
```