# -*- coding: utf-8 -*-
import os
import json
import random

from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

from kafka import KafkaProducer


"""
The streaming api is quite different from the REST api because the REST api 
is used to pull data from twitter but the streaming api pushes messages to a 
persistent session. This allows the streaming api to download more data in 
real time than could be done using the REST API.

An instance of tweepy.Stream establishes a streaming session and routes 
messages to StreamListener instance. The on_data method of a stream listener 
receives all messages and calls functions according to the message type. 
The default StreamListener can classify most common twitter messages and 
routes them to appropriately named methods, but these methods are only stubs.
"""

# Get env variables - DOCKER
API_KEY = os.environ.get("API_KEY")
API_SECRET_KEY = os.environ.get("API_SECRET_KEY")
ACCESS_TOKEN = os.environ.get("ACCESS_TOKEN")
ACCESS_TOKEN_SECRET = os.environ.get("ACCESS_TOKEN_SECRET")
KAFKA_BROKER_URL = os.environ.get('KAFKA_BROKER_URL')
TWT_GENERAL_TOPIC = os.environ.get('TWT_GENERAL_TOPIC')
TWT_COORD_TOPIC = os.environ.get('TWT_COORD_TOPIC')

# Producer
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER_URL,
    # Encode all values as JSON
    value_serializer=lambda value: json.dumps(value).encode(),
)


# Extract information
def _build_coord(data):
    """
    Function to build a diccionary with the data from tweets
    :return:
    """
    coord = data['place']['bounding_box']['coordinates']

    longitude = coord[0][0][0]
    latitude = coord[0][0][1]
    username = data['user']['name']
    followers = data['user']['followers_count']
    following = data['user']['friends_count']
    tweet = data['text']
    img_profile = data['user']['profile_image_url']

    dict_coord = {'lat': latitude,
                  'long': longitude,
                  'user': username,
                  'followers': followers,
                  'following': following,
                  'twt': tweet,
                  'img': img_profile}

    return dict_coord


# Create StreamClass
class StdOutListener(StreamListener):
    def on_data(self, data):
        message = json.loads(data)
        producer.send("queueing.twt_general", value={'twt': message['text']})
        try:
            if message['place']:
                filter_msg = _build_coord(message)
                print(filter_msg)
                producer.send("queueing.twt_coord", value=filter_msg)
            # producer.send("test", value=message)
        except Exception:
            pass
        return True

    def on_error(self, status):
        print('Error: ', status)


if __name__ == "__main__":
    # Auth
    auth = OAuthHandler(API_KEY, API_SECRET_KEY)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

    # Stream
    listener = StdOutListener()
    Stream = Stream(auth, listener)
    # Get message with this word
    Stream.filter(track=['coronavirus'])
