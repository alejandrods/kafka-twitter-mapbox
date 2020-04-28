# -*- coding: utf-8 -*-
import os

from flask import Flask, render_template, jsonify
from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app)


@app.route('/')
@cross_origin()
def index():
    """
    Function to render main template
    :return:
    """

    return render_template('index.html')


@app.route('/mobile')
@cross_origin()
def index_mobile():
    """
    Function to render mobile template
    :return:
    """

    return render_template('mobile.html')


@app.route('/update')
@cross_origin()
def index_update():
    """
    Function to render update template
    :return:
    """

    return render_template('update.html')


@app.route('/health_liveness')
def health_liveness():
    result = {'Service': 'Front',
              'Status': 'OK',
              'Version': '1.0.1'}
    return jsonify(result), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0',
            debug=True,
            port=8080)
