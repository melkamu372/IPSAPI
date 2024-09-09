
# QUICK TASK FOR YOU

Now setup the following tools using Helm

This section will be quite challenging for you because you will need to spend some time to research the charts, read their 
documentations and understand how to get an application running in your cluster by simply running a helm install command.

1. Artifactory

**Step 1: Add the JFrog Helm Repository**

```
helm repo add jfrog https://charts.jfrog.io
```

```
helm repo update
```

![image](https://github.com/user-attachments/assets/8139a915-0088-4dab-8303-bab1b70fa97e)

**Step 2 install the chart with the release name artifactory**

```
helm upgrade --install artifactory --namespace default jfrog/artifactory
```
![image](https://github.com/user-attachments/assets/f9d05414-ecb8-4ad8-b32e-3324e553261b)

**Step 3: Verify Installation**
Check the status of the Artifactory deployment:
```
helm status artifactory --namespace artifactory
```
**Step 4: Access Artifactory**

Find the service URL:
```
kubectl get svc --namespace artifactory
```
![image](https://github.com/user-attachments/assets/35f1ec6a-5ee8-460e-ab05-adc18e029825)

2. Hashicorp Vault

HashiCorp Vault is a tool for managing secrets and protecting sensitive data.
**Step 1: Add the HashiCorp Helm Repository**
```
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
```


![image](https://github.com/user-attachments/assets/e0893031-7479-4e98-a67e-ee99013afeaf)

Step 2: Install Vault
```
helm install vault hashicorp/vault --namespace vault --create-namespace
```
![image](https://github.com/user-attachments/assets/53b79657-85c7-436f-9e82-a58236d29d1e)



Step 3: Verify Installation
Check the status of the Vault deployment:
```
helm status vault --namespace vault

```
3. Prometheus
**Prometheus is a monitoring and alerting toolkit.**

Step 1: Add the Prometheus Community Helm Repository
```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```
Step 2: Install Prometheus
```
helm install prometheus prometheus-community/prometheus --namespace monitoring --create-namespace
```
Step 3: Verify Installation
Check the status of the Prometheus deployment:
```
helm status prometheus --namespace monitoring
```
Step 4: Access Prometheus
Find the service URL:
```
kubectl get svc --namespace monitoring
```
Use this URL to access the Prometheus UI.

4. Grafana


5. Elasticsearch ELK using ECK




In the next project,

1. You will write custom Helm charts
2. Configure Ingress for all the tools and applications running in the cluster
3. Integrate Secrets management using Hashicorp Vault
4. Integrate Logging with ELK
5. Inetegrate monitoring with Prometheus and Grafana















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
