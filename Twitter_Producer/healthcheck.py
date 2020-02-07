import os
from flask import Flask, jsonify

app = Flask(__name__)


# Get message with this word
@app.route('/')
def twitter_stream():
    return jsonify({'Status': 'Success'})


if __name__ == "__main__":
    app.run(host='0.0.0.0',
            debug=True,
            port=int(os.environ.get('PORT', 8000)))
