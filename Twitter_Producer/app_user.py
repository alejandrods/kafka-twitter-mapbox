# -*- coding: utf-8 -*-
import os
import json
import random

from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

from flask import Flask, render_template, Response
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


API_KEY="tcgU7rcsrQRABBsYVAp5p2IA2"
API_SECRET_KEY="GDTXSZVDdwPy9lCJdnyTmrQJbRTP8KLIOLzU4EzqC8iJ2eIJIR"
ACCESS_TOKEN="2858863787-Xmo78pC5wfYO9ghCcaActOX81VKcL4HCqzchUEk"
ACCESS_TOKEN_SECRET="JCNPyfATyDAX8OIetFc2MI7teVuS24Ks3AyAJt2SqYxOC"
KAFKA_BROKER_URL="broker:9092"


# # Get env variables - DOCKER
# API_KEY = os.environ.get("API_KEY")
# API_SECRET_KEY = os.environ.get("API_SECRET_KEY")
# ACCESS_TOKEN = os.environ.get("ACCESS_TOKEN")
# ACCESS_TOKEN_SECRET = os.environ.get("ACCESS_TOKEN_SECRET")
# KAFKA_BROKER_URL = os.environ.get('KAFKA_BROKER_URL')


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
    tweet = data['text']
    img_profile = data['user']['profile_image_url']

    ## DELETE
    value = random.randint(1, 10)
    ## DELETE

    dict_coord = {'lat': latitude,
                  'long': longitude,
                  'user': username,
                  'twt': tweet,
                  'img': img_profile,
                  'pred': value}

    return dict_coord


# # Init Producer
# producer = KafkaProducer(
#     bootstrap_servers=KAFKA_BROKER_URL,
#     # Encode all values as JSON
#     value_serializer=lambda value: json.dumps(value).encode(),
# )


# Create
class StdOutListener(StreamListener):
    def on_data(self, data):
        message = json.loads(data)
        # print(message)
        if message['place']:
            filter_msg = _build_coord(message)
            print(filter_msg)
            # producer.send("test", value=filter_msg)
        # producer.send("test", value=message)
        return True

    def on_error(self, status):
        print('Error: ', status)


# Init app and auth tweepy
app = Flask(__name__)
# auth = OAuthHandler(API_KEY, API_SECRET_KEY)
# auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
#
# # Stream
# listener = StdOutListener()
# Stream = Stream(auth, listener)
#

# Function to receive filter and send message
@app.route('/filter=<filter_twt>')
def map_stations(filter_twt):
    """
    Function to get messages from consumer and send to index.html
    :return:
    """
    from tweepy import Stream

    auth = OAuthHandler(API_KEY, API_SECRET_KEY)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

    listener = StdOutListener()
    Stream = Stream(auth, listener)

    print("filter_twt: ", filter_twt)
    Stream.filter(track=[filter_twt])
    return

    # # Get message from producer
    # def events():
    #     for message in consumer:
    #         # Get value from message
    #         dict_coord = message.value
    #         # Create dict_coord
    #         # dict_coord = _build_coord(data_prod)
    #         yield 'data:{0}\n\n'.format(json.dumps(dict_coord))
    # return Response(events(), mimetype="text/event-stream")


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=9000)
    # # Auth
    # auth = OAuthHandler(API_KEY, API_SECRET_KEY)
    # auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
    #
    # # Stream
    # listener = StdOutListener()
    # Stream = Stream(auth, listener)
    # # Get message with this word
    # Stream.filter(track=['coronavirus'])
    # # GEOBOX_GERMANY = [5.0770049095, 47.2982950435, 15.0403900146,
    #                   # 54.9039819757]
    #
    # # Stream.filter(locations=GEOBOX_GERMANY)
    #
    # # Follow User
    # # Stream.filter(follow=["2211149702"])

