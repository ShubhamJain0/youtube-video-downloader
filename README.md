# Youtube-video-downloader
Download youtube video using video link or bulk videos with channel link.

Built using Django(Python), Selenium, Javascript and Docker.

# PREREQUISITES

[Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine

# INSTALLATION
- # clone the repository to your local machine -

  git clone https://github.com/ShubhamJain0/youtube-video-downloader.git

- # Build image -

  docker-compose build

- # Start container with the built image - 

  docker-compose up



Access application on this URL - 127.0.0.1:8000 
(Note: Alternatively you can use IPV4 of the network you are connected on to access this application from various devices. For this the device should be connected on the same network and you need to add the IPV4 in project -> settings.py -> Allowed Hosts )