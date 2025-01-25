## Install

Apache Maven 3.5.2
psql (PostgreSQL) 13.3
Java 1.8.0

#Docker Build Guide

This guide explains how to build the Core application for development purpose. Mainly focused Ubuntu operating system.


## Install docker

If you don't have the docker already, Install the docker by referring below link. Chose the appropriate Ubuntu version.

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04

## Install docker compose

If you don't have the docker-compose already, Install the docker-compose by referring below link. Chose the appropriate Ubuntu version.

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04


## Start the application by using docker 

 Run the commands from the project root directory.

 1. Build the application by using maven
 
   > mvn clean install
 
 2. Build the docker image - petcare-core
 
   > docker-compose build
   
   To check the built image
   
   > docker images
   
 3. Create the container and run the application using docker-compose
 
   > docker-compose up
   
   Use parameter -d to run the application in background
   
   > docker-compose up -d
   
   To tail the logs
   
   > docker-compose logs -f -t
   
   To start existing containers 
   
   > docker-compose start
  
   To stop the running application 
   
   > docker-compose stop
   
   Remove the containers
   
   > docker-compose down
   
## Publish the image to docker repository

 1. Login to docker
 
    > docker login -u docker-registry-mobile
    
 2. Push the image
 
    > docker push <mobile>/petcare-core
    