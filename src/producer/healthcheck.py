import os
from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/health_liveness')
def health_liveness():
    result = {'Service': 'Producer',
              'Status': 'OK',
              'Version': '1.0.1'}
    return jsonify(result), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0',
            debug=True,
            port=6000)
