# Coronavirus Real-time using Kafka and Twitter

This project was developed using Twitter API, Google Cloud and Apache Kafka to 
view the messages related to Coronavirus in real-time. I started this project 
since I thought that it would be interesting to analyze how people are talking 
about the Coronavirus Crisis on Twitter.

The producer tracks, gets and sends tweets about Coronavirus to the Kafka 
Cluster that I deployed on Google Cloud. The consumer pulls and processes the 
messages from Kafka. At the end, the front-end represents this data in a map. 
The project was deployed on Google Cloud and it was programmed using Python and
Javascript.

This is one of my last side projects and I am constantly implementing
new features. I would like to implement a sentimental analysis
and a named entity recognition to extract relevant tokens to analyze
these messages. This project can be adapted to any topic that you would 
like to track from Twitter.

You can visit the website here: https://coronavirus.twitter-realtime.com

**Important:** The website is currently down for maintenance. I am trying to redefine the architecture
of the application to deploy it in a best way in Google Cloud.

### Table of Contents  

[Installation](#Installation) 

[Run App](#Deploy)  

[Examples](#Examples)  

<a name="Installation"></a>
#### Installation

1.- Clone the repository in your local machine:
```
git clone git@github.com:alejandrods/kafka-twitter-mapbox.git
```

2.- [Install Docker](https://docs.docker.com/get-docker/) in your machine. In case that
you are using Windows, you will need Windows Professional to install Docker Desktop.

3.- [Login in the Twitter Developer site](https://developer.twitter.com/en). Create a new 
application to get the credentials for the use Twitter API.

4.- [Sign up at Mapbox](https://account.mapbox.com/auth/signup/) to get your 
Access tokens.

5.- Environment variables required. There are 2 files with environment variables: `.env` and 
`./src/front_end/static/resources/conf/env.json`. The first one contains the variables for the 
`Producer` and `Consumer`:

```
API_KEY="API_KEY for Twitter API"
API_SECRET_KEY="API_SECRET_KEY for Twitter API"
ACCESS_TOKEN="ACCESS_TOKEN for Twitter API"
ACCESS_TOKEN_SECRET="ACCESS_TOKEN for Twitter API"
KAFKA_BROKER_URL="URL for Kafka Broker - (i.e broker:9092 or 35.200.100.100:9092)
TWT_GENERAL_TOPIC="TOPIC NAME for general tweets - (i.e queueing.twt_general)"
TWT_COORD_TOPIC="TOPIC NAME for the coordinates tweets - (i.e queueing.twt_coord)
```

The file `./src/front_end/static/resources/conf/env.json` contains the variables for 
the `Front-end` service:

```
MAPBOX_TOKEN: "TOKEN for mapbox",
GENERAL_URL: "URL for consumer, general topic - (i.e http://localhost:7000/topic/streaming.twitter.general)",
COORD_URL: "URL for consumer, coordinates topic - (i.e http://localhost:7000/topic/streaming.twitter.coord)",
N_MARKERS: "Max markers at the same time - (i.e 120)"
```

<a name="Deploy"></a>
#### Run
First of all, we need to start the `Kafka` server. Then, we could start the `producer`, `consumer` and
 `front-end`.
 
1.- Start `kafka` server:
`docker-compose -f docker-compose.kafka.yml up`

2.- Start application:
`docker-compose up --build`

3.- Access to `http://localhost:8080` to check the app.

#### Run
I am constantly implementing new features to this project. For instance, I would like to implement 
a sentimental analysis and a named entity recognition to extract relevant tokens to analyze
these messages. Feel free to open pull request to implement new features or fix bugs.