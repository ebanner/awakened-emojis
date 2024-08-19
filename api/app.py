from flask import Flask, jsonify
from flask_cors import CORS

import sqlite3

import json

import pandas as pd


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

import time

start = time.time()
data = json.load(open('emojis-to-channels-and-users-with-upload-info-and-popularity-and-related.json'))
end = time.time()
print(end-start, 'emojis-to-channels-and-users-with-upload-info-and-popularity-and-related.json')


import copy


def get_metadata(emoji):
    metadata = copy.deepcopy(data[emoji])

    related = []
    for emoji in data[emoji]['related'][:6]:
        related.append({
            'name': emoji,
            'type': data[emoji]['type'],
            'url': data[emoji]['url'],
            'emoji': data[emoji]['emoji'],
        })

    metadata['related'] = related

    return metadata


def get_usage(emoji):
    df.ts = pd.to_datetime(df.ts, unit='s')
    emoji_df = df[df.emoji == emoji].reset_index(drop=True)
    count_df = emoji_df[['emoji', 'ts']].set_index('ts').resample('M').count()
    count_df = count_df.rename(columns={'emoji': 'count'})
    count_df = count_df.reset_index()
    count_df.ts = count_df.ts.map(lambda ts: int(ts.timestamp()))
    usage = count_df.to_dict(orient='records')
    return usage


def get_usage_sqlite(emoji):
    conn = sqlite3.connect('mydatabase.db')

    query = f"""

SELECT
    strftime('%Y-%m', datetime(ts, 'unixepoch')) AS month,
    COUNT(*) AS count
FROM emoji_timestamps
WHERE emoji = ?
GROUP BY month
ORDER BY month;

    """

    df = pd.read_sql_query(query, conn, params=(emoji,))

    df['ts'] = df['month'].apply(lambda ts: int(pd.to_datetime(ts).timestamp()))

    df.drop('month', axis=1, inplace=True)

    usage = df.to_dict(orient='records')
    conn.close()
    return usage


@app.route('/<emoji>')
def get_emoji_metadata(emoji):
    if emoji == 'favicon.ico':
        return jsonify({})
    start = time.time()
    metadata = get_metadata(emoji)
    end = time.time()
    print(end-start, 'get_metadata')

    start = time.time()
    usage = get_usage_sqlite(emoji)
    end = time.time()
    print(end-start, 'get_usage_sqlite3')

    metadata['name'] = emoji
    metadata['usage'] = usage
    return jsonify(metadata)







if __name__ == '__main__':
    app.run(debug=True, port=5001)

