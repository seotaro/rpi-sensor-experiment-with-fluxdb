# ラズパイでセンサーの値を取得する

## インストール

```bash
yarn install
```

## 設定

カレントディレクトリの .env に定義する。

|  項目  |  値  |  意味  |
| ---- | ---- | ---- |
|  INTERVAL  |  整数  |  取得間隔 [ms]  |
|  BME280  |  on\|off  |  BME280 から取得する\|しない  |
|  SHT31  |  on\|off  |  SHT31 から取得する\|しない  |
|  DS18B20  |  on\|off  |  DS18B20 から取得する\|しない  |
|  SCD4x  |  on\|off  |  SCD4x から取得する\|しない  |
|  NatureRemo  |  on\|off  |  NatureRemo から取得する\|しない  |
|  NatureRemoToken  |  文字列  |  API のトークン  |

.env 例）

```text
INTERVAL=60000

DS18B20=on
SHT31=on
BME280=on
SCD4x=on

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
