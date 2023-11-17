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

enable-1-wire:
	echo "dtoverlay=w1-gpio" | sudo tee -a /boot/config.txt

