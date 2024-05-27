# Smartcities Auth Service:earth_americas::city_sunset:
An auth service for users at SmartCities Project "IIC2173 - Software Systems Architecture" course at Pontifical Catholic University of Chile👤


**Notes**

For MacOS users or anyone having the following error:

users-db | /usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/setup.sh
users-db | /usr/local/bin/docker-entrypoint.sh: /docker-entrypoint-initdb.d/setup.sh: /bin/bash: bad interpreter: Permission denied

You must run 

chmod +x db/setup.sh