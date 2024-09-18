


### docker image buil and run and file pass 

**for docker image build** 
```
docker-compose build
```
**To run**
```
docker-compose up
```
or 

```
docker run  -d -p 3000:3000 abaybank/ips:1.0
```
**To save image locally**
```
docker save abaybank/ips:1.0 > abayIps.tar
```
**To load images locally**
```
docker load -i  "/path/to/your/abayIps.tar"
```
**run mysql image**
```
 docker run -d --name ips-mysql -e MYSQL_ROOT_PASSWORD=example -e MYSQL_DATABASE=testdb -p 3306:3306 mysql:8.0
```
**run app image**
```
docker run -d --name my-app -p 3000:3000 -e DB_HOST=10.1.3.53 -e DB_USER=abay -e DB_PASS=PassWord.1 -e DB_NAME=IPS abaybank/ips:1.0
```

version: '3.8'

services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: testdb
    ports:
      - "3306:3306"

  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: abaybank/ips:1.0
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - DB_HOST=10.1.3.53
      - DB_USER=abay
      - DB_PASS=PassWord.1
      - DB_NAME=IPS
