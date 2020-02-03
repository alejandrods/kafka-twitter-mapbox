# -*- coding: utf-8 -*-
import os
import json
import time

from flask import Flask, render_template, Response
from kafka import KafkaConsumer


app = Flask(__name__)

# Get env variables
KAFKA_BROKER_URL = os.environ.get('KAFKA_BROKER_URL')
MAPBOX_TOKEN = os.environ.get('MAPBOX_TOKEN')
TWT_GENERAL_TOPIC = os.environ.get('TWT_GENERAL_TOPIC')
TWT_COORD_TOPIC = os.environ.get('TWT_COORD_TOPIC')

# Create consumers
consumer_general = KafkaConsumer(TWT_GENERAL_TOPIC,
                                 bootstrap_servers=KAFKA_BROKER_URL,
                                 value_deserializer=lambda value: json.loads(value)
                                 )

consumer_coord = KafkaConsumer(TWT_COORD_TOPIC,
                               bootstrap_servers=KAFKA_BROKER_URL,
                               value_deserializer=lambda value: json.loads(value)
                               )


@app.route('/')
def index():
    """
    Function to render template
    :return:
    """
    return render_template('index.html',
                           mapbox_access_token=MAPBOX_TOKEN)


@app.route('/topic/streaming.twitter.general')
def twt_general():
    """
    Function to get messages from consumer and send to index.html
    :return:
    """
    # Get message from producer of general tweets
    def events():
        for message in consumer_general:
            # Get value from message
            dict_coord = message.value
            print(dict_coord)
            time.sleep(5)
            yield 'data:{0}\n\n'.format(json.dumps(dict_coord))
    time.sleep(10)
    return Response(events(), mimetype="text/event-stream")


@app.route('/topic/streaming.twitter.coord')
def twt_coord():
    """
    Function to get messages from consumer and send to index.html
    :return:
    """
    # Get message from producer of coordinates
    def events():
        for message in consumer_coord:
            # Get value from message
            dict_coord = message.value
            print(dict_coord)
            yield 'data:{0}\n\n'.format(json.dumps(dict_coord))
    return Response(events(), mimetype="text/event-stream")


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=9000)
