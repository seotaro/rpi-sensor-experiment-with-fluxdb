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
[{"time":"2023-11-21T12:53:55.519Z","id":"rpi4b8g-77","sensor":"BME280","temperature":24.49,"humidity":35.92742318719938,"pressure":1021.6984834213315},{"time":"2023-11-21T12:53:55.517Z","id":"rpi4b8g-44","sensor":"SHT31","temperature":25.39253833829251,"humidity":41.13679713130389},{"time":"2023-11-21T12:53:59.619Z","id":"xx-xxxxxxxxxxxxxxxxxxxxxxxx","sensor":"DS18B20","temperature":25.312},{"time":"2023-11-21T12:53:59.619Z","id":"xx-xxxxxxxxxxxx","sensor":"DS18B20","temperature":25.375},{"time":"2023-11-21T12:53:55.521Z","id":"rpi4b8g-76","sensor":"BME688","temperature":24.51,"humidity":36.1,"pressure":1021.68,"gas_resistance":112345.6},{"time":"2023-11-21T12:53:55.537Z","id":"xxxxxxxxxxxx","sensor":"SCD4X","co2":965,"temperature":29.279403686523438,"humidity":30.2978515625}]
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

  # 値が文字列 "on" と完全一致したセンサーだけ読み込む。無効にするなら "off"（"on" 以外なら何でもよい）
  environment = [
    "DS18B20=off",
    "SHT31=off",
    "BME280=on",
    "BME688=off",
    "SCD4X=off"
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

## BME688 のガス抵抗値

`gas_resistance` は 320 ℃ に熱した金属酸化物膜の抵抗値[Ω]。還元性ガス（VOC）が増えると下がるので、**値が大きいほど空気がきれい**という向きになる。扱うときの注意。

- **絶対値に意味は無い。** 校正されておらず個体差が大きいので、同一個体の時間変化だけを見る。IAQ 指数が欲しい場合は Bosch の BSEC ライブラリが必要で、本プログラムでは出せない。
- **湿度に強く依存する。** 湿度が上がると抵抗は下がる。生値だけ見ていると湿度の逆グラフを VOC の増加と誤読するので、`humidity` と重ねて表示する。
- **バーンインで基線が動く。** 通電直後は低く、数十分〜数日かけて上昇する。最初の 24〜48 時間は判断に使わない。
- **間欠動作であることに注意。** Telegraf の実行間隔ごとにプロセスが起動してヒーターを 150[ms] だけ焚いて終了するので、膜は毎回冷える。連続動作前提の値とは比較できない（実行間隔が一定なら相対比較は成立する）。


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
- BME688
  - [data sheet](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme688-ds000.pdf)
- SCD4X
  - [data sheet](https://d2air1d4eqhwg2.cloudfront.net/media/files/262fda6e-3a57-4326-b93d-a9d627defdc4.pdf)
  - [Sensirion/raspberry-pi-i2c-scd4x](https://github.com/Sensirion/raspberry-pi-i2c-scd4x#connecting-the-sensor)

Nature Remo は https://github.com/seotaro/telegraf-natureremo
