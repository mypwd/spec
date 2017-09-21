#!/bin/sh

echo '{ "sensor":[] }' > cgi/db/sensor.json
echo '{ "housing":[] }' > cgi/db/housing.json
echo '{ "platform":[] }' > cgi/db/platform.json
echo '{ "model":[] }' > cgi/db/model.json
chmod 666 cgi/db/sensor.json cgi/db/model.json cgi/db/platform.json cgi/db/housing.json
