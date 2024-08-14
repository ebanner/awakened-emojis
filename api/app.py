from flask import Flask, jsonify
from flask_cors import CORS

import json

import pandas as pd


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

data = json.load(open('emojis-to-channels-and-users-with-upload-info-and-popularity-and-related.json'))

df = pd.read_csv('emoji_timestamps.csv')



import copy


def get_metadata(emoji):
    metadata = copy.deepcopy(data[emoji])

    related = []
    print('RELATED', data[emoji]['related'][:6])
    for emoji in data[emoji]['related'][:6]:
        print('EMOJI', emoji)
        print(data[emoji])
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


@app.route('/<emoji>')
def get_emoji_metadata(emoji):
    metadata = get_metadata(emoji)
    usage = get_usage(emoji)
    metadata['name'] = emoji
    metadata['usage'] = usage
    return jsonify(metadata)



if __name__ == '__main__':
    app.run(debug=True, port=5001)

