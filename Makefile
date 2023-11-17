NODE_MAJOR:=18

setup-node:
	sudo apt-get update
	sudo apt-get install -y ca-certificates curl gnupg
	sudo mkdir -p /etc/apt/keyrings
	curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

	echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$(NODE_MAJOR).x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

	sudo apt-get update
	sudo apt-get install nodejs -y
	sudo npm install --global yarn

setup-i2c:
	sudo apt-get install i2c-tools

setup-telegraf:
	wget -q https://repos.influxdata.com/influxdata-archive_compat.key
	echo '393e8779c89ac8d958f81f942f9ad7fb82a25e133faddaf92e15b16e6ac9ce4c influxdata-archive_compat.key' | sha256sum -c && cat influxdata-archive_compat.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg > /dev/null
	echo 'deb [signed-by=/etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg] https://repos.influxdata.com/debian stable main' | sudo tee /etc/apt/sources.list.d/influxdata.list
	sudo apt-get update && sudo apt-get install telegraf

enable-1-wire:
	echo "dtoverlay=w1-gpio" | sudo tee -a /boot/config.txt

deploy:
	sudo mkdir -p /usr/local/bin/rpi-sensor-experiment-with-fluxdb
	sudo cp *.js /usr/local/bin/rpi-sensor-experiment-with-fluxdb
	sudo cp package.json /usr/local/bin/rpi-sensor-experiment-with-fluxdb
	sudo cp yarn.lock /usr/local/bin/rpi-sensor-experiment-with-fluxdb
	cd /usr/local/bin/rpi-sensor-experiment-with-fluxdb && sudo yarn


