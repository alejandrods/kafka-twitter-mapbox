# -*- coding: utf-8 -*-
import os

from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/topic/*": {
        "origins": "https://coronavirus.twitter-realtime.com"}})


# Get env variables
MAPBOX_TOKEN = os.environ.get('MAPBOX_TOKEN')
N_MARKERS = os.environ.get('N_MARKERS')

data_js = {'mapbox_access_token': MAPBOX_TOKEN,
           'n_markers': N_MARKERS}


@app.route('/')
def index():
    """
    Function to render template
    :return:
    """

    return render_template('index.html',
                           data="alex")


if __name__ == '__main__':
    app.run(host='0.0.0.0',
            debug=True,
            port=int(os.environ.get('PORT', 9000)))
