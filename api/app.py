from flask import Flask, jsonify
from flask_cors import CORS

import json

import pandas as pd


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

data = json.load(open('emojis-to-channels-and-users-with-upload-info-and-popularity-and-related.json'))

df = pd.read_csv('emoji_timestamps.csv')


@app.route('/')
def hello_world():
    return jsonify(data)


@app.route('/usage')
def get_usage():
    emoji_name = 'agontfhi'

    df.ts = pd.to_datetime(df.ts, unit='s')
    emoji_df = df[df.emoji == emoji_name].reset_index(drop=True)
    count_df = emoji_df[['emoji', 'ts']].set_index('ts').resample('M').count()
    count_df = count_df.rename(columns={'emoji': 'count'})
    count_df = count_df.reset_index()
    count_df.ts = count_df.ts.map(lambda ts: int(ts.timestamp()))
    usage = count_df.to_dict(orient='records')
    payload = {
        'emoji': emoji_name,
        'usage': usage,
    }
    return jsonify(payload)


if __name__ == '__main__':
    app.run(debug=True, port=5001)

