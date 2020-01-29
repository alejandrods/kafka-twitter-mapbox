# -*- coding: utf-8 -*-
import os
import re
import json

from flask import Flask, render_template, Response
from kafka import KafkaConsumer


app = Flask(__name__)

# Get env variables
KAFKA_BROKER_URL = os.environ.get('KAFKA_BROKER_URL')
MAPBOX_TOKEN = os.environ.get('MAPBOX_TOKEN')


# Create consumer
consumer = KafkaConsumer(
        "test",
        bootstrap_servers=KAFKA_BROKER_URL,
        value_deserializer=lambda value: json.loads(value),
        )


def remove_url(txt):
    """Replace URLs found in a text string with nothing
    (i.e. it will remove the URL from the string).
    Parameters
    ----------
    txt : string
        A text string that you want to parse and remove urls.
    Returns
    -------
    The same txt string with url's removed.
    """
    return " ".join(re.sub("([^0-9A-Za-z \t])|(\w+:\/\/\S+)", "", txt).split())


@app.route('/')
def index():
    """
    Function to render template
    :return:
    """
    return render_template('index.html',
                           mapbox_access_token=MAPBOX_TOKEN)


@app.route('/topic/streaming.twitter.coord')
def map_stations():
    """
    Function to get messages from consumer and send to index.html
    :return:
    """
    # Get message from producer
    def events():
        for message in consumer:
            # Get value from message
            dict_coord = message.value
            # Create dict_coord
            # dict_coord = _build_coord(data_prod)
            yield 'data:{0}\n\n'.format(json.dumps(dict_coord))
    return Response(events(), mimetype="text/event-stream")


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=9000)
