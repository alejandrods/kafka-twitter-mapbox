# -*- coding: utf-8 -*-
import os
import json
import time
import logging
from dotenv import load_dotenv

from flask import Flask, Response, jsonify
from flask_cors import CORS, cross_origin
from kafka import KafkaConsumer

load_dotenv()

logging.basicConfig(level=logging.INFO,
                    format='CONS - %(asctime)s :: %(levelname)s :: %(message)s')


logging.info("Init Flask-App...")
app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/topic/*": {"origins": "https://coronavirus.twitter-realtime.com"}})

logging.info("Flask-App Initialized")


# Get env variables
KAFKA_BROKER_URL = os.environ.get('KAFKA_BROKER_URL')
TWT_GENERAL_TOPIC = os.environ.get('TWT_GENERAL_TOPIC')
TWT_COORD_TOPIC = os.environ.get('TWT_COORD_TOPIC')
PORT = os.environ.get('PORT_CONSUMER')

# Create consumers
logging.info("Create consumers...")
consumer_general = KafkaConsumer(TWT_GENERAL_TOPIC,
                                 bootstrap_servers=KAFKA_BROKER_URL,
                                 value_deserializer=lambda value: json.loads(value)
                                 )

consumer_coord = KafkaConsumer(TWT_COORD_TOPIC,
                               bootstrap_servers=KAFKA_BROKER_URL,
                               value_deserializer=lambda value: json.loads(value)
                               )
logging.info("Consumers created")


@app.route('/topic/streaming.twitter.general')
@cross_origin()
def twt_general():
    """
    Function to get messages from consumer and send to index.html
    :return:
    """
    # Get message from producer of general tweets
    def events():
        try:
            for message in consumer_general:
                # Get value from message
                dict_general = message.value
                logging.info("Reading consumer General: {}".format(dict_general))
                time.sleep(6)
                yield 'data:{0}\n\n'.format(json.dumps(dict_general))
        except ValueError as e:
            logging.error("Error: {}".format(e))

    response = events()
    return Response(response,
                    mimetype="text/event-stream")


@app.route('/topic/streaming.twitter.coord')
@cross_origin()
def twt_coord():
    """
    Function to get messages from consumer and send to index.html
    :return:
    """
    # Get message from producer of coordinates
    def events():
        try:
            for message in consumer_coord:
                # Get value from message
                dict_coord = message.value
                logging.info("Reading consumer Coordinates: {}".format(dict_coord))
                time.sleep(1)
                yield 'data:{0}\n\n'.format(json.dumps(dict_coord))
        except ValueError as e:
            logging.error("Error: {}".format(e))

    response = events()
    return Response(response,
                    mimetype="text/event-stream")


@app.route('/health_liveness')
@cross_origin()
def health_liveness():
    result = {'Service': 'Consumer',
              'Status': 'OK',
              'Version': '1.0.1'}
    return jsonify(result), 200


if __name__ == '__main__':
    logging.info("Launch App")
    app.run(host='0.0.0.0',
            port=7000)
