# (Alternative) GUI for pact broker
This is a simple alternative GUI for pact broker. It displays:
* environments
* all pacticipants deployed to environment
* pacticipants (all versions)
* pacticipant dependency graph

Note: at this moment GUI server is hardcoded to run on port 5000.

## How to run
### Create a docker bridge network
This step is required because default bridge network does not have DNS capabilities.
```shell
docker network create pact-network
```
### Start pact broker container
```shell
    docker run --name pact-broker --network pact-network -p 9292:9292 -d pact-broker
```

### Start NGINX reverse proxy in docker container
Attempting to send requests to pact broker from a different origin will result in CORS error.
We need to mimic like our requests came from pact-broker origin (localhost:9292 or pact-broker:9292).
That is why we are using NGINX reverse proxy to forward requests from localhost:5000 to localhost:8972 and thus avoid CORS error.
</br>
Go into the config/nginx directory and run:
```shell
docker run --network=pact-network -p 5000:5000 --name pact-broker-proxy -v $PWD/nginx.conf:/etc/nginx/nginx.conf:ro -d nginx
```

### Start GUI server
Go to the project's root directory and run:
```shell
yarn dev
```

## Running GUI in a Docker image

### Build docker image
Go to the project's root directory and run:
```shell
docker build -f config/docker/Dockerfile . -t pact-broker-gui
```

### Run docker image
```shell
docker run --network pact-network -p 5000:5000 -d pact-broker-gui
```