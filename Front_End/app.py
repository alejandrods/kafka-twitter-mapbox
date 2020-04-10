# -*- coding: utf-8 -*-
import os

from flask import Flask, render_template
from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app)


@app.route('/')
@cross_origin()
def index():
    """
    Function to render template
    :return:
    """

    return render_template('index.html')


@app.route('/mobile')
@cross_origin()
def index_mobile():
    """
    Function to render template
    :return:
    """

    return render_template('mobile.html')


@app.route('/update')
@cross_origin()
def index_update():
    """
    Function to render template
    :return:
    """

    return render_template('update.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0',
            debug=True,
            port=int(os.environ.get('PORT', 9000)))
