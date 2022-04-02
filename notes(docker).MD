
**Note about docker terminal commands**
*docker compose*  <br/>
(to run multi-container Docker applications) <br/>
Go to directory of app with docker-compose.yml
- To build images: `$ docker compose up --build`
- To build and run a container in *detached mode* `$ docker compose up -d`
    
*images*
Go to directory of with Dockerfile
- To build an image from a Dockerfile: `$ docker build .` (must with a dot in the end)
    - To build with tag: `$ docker build -t name:tag .`  or `$ docker build --tag name:tag .`
    - Must add a dot, which means to use the Dockerfile in the local directory.
- To check exisiting docker image: `$ docker images`
- To run an image: `$ docker run IMAGE_ID`
    - To run the container in *detached mode*: `$ docker run -d IMAGE_ID`
    - To connect to the app from the host
        1. In *Dockerfile*, add *EXPOSE* to the port of app e.g. 8080, so the docker daemon can map the app:
        2. `$ docker run -p <host_port>:8080 -d IMAGE_ID` or `$ docker run -p <host_port>:8080 -d IMAGE_NAME:tag`
    - To run with the *host network*: `$ docker run -d --network=host my-IMAGE_NAME:latest`
    - To remove the container once it exits/stops. `$ docker run --rm -d --network host IMAGE_ID`
- To remove images behind a *stopped* container: `$ docker rmi [IMAGE_ID]`

*container*
- To check all containers: `$ docker ps -a` or `$ docker ps --all`
- To check all *running* container: `$ docker ps`
- To check all *stopped* container: `$ docker ps -f "status=exited"` or `$docker ps --filter "status=exited"`
- To copy files/folders between a container and the local filesystem: `$ docker cp <containerId>:/file_path /host/path`

- To run the *stopped* containers: `$ docker start -ai <container_name>`
- To interact with a *running* container:
`$ docker exec -it <container_name> "bash"`
- To remove *stopped* container: `$ docker rm [CONTAINER_ID]`
- To stop all runing containers, and then remove containers:
`$ docker stop $(docker ps -a -q) docker rm $(docker ps --no-trunc -aq)`

*Clean up commands*
-  To remove all unused containers, images, networks and volumes: `$ docker system prune`
-  individually:  `$ docker container prune`, `$ docker image prune`, `$ docker network prune`, `$ docker volume prune`