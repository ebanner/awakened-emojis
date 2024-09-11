import json

import pandas as pd

import copy

import sqlite3

import time

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
}

data = json.load(open('emojis-to-channels-and-users-with-upload-info-and-popularity-and-related.json'))
data_json = json.dumps(data)

users_and_channels = json.load(open('users_and_channels.json'))

emoji_data = json.load(open('emojis.json'))

EMOJIS = json.load(open('emojis.json'))

related_emojis = json.load(open('related_emojis.json'))

emoji_upload_data = json.load(open('emoji_upload_data.json'))

emoji_popularity = json.load(open('emoji_popularity.json'))


def get_path(event):
    path = event['requestContext']['http']['path']
    return path
    

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

    print('ADDING RELATED')
    metadata['related'] = related

    print('RETURNING FROM GET_METADATA')

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


def lambda_handler(event, context):
    path = get_path(event)
    if path == '/':
        return {
            'statusCode': 200,
            'body': 'ok',
        }

    _, emoji, action = path.split('/')

    if action == 'usage':
        usage = get_usage_sqlite(emoji)
        usage_payload = {
            'name': emoji,
            'usage': usage
        }
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps(usage_payload),
        }
    elif action == 'users_and_channels':
        result = users_and_channels[emoji]
        payload = {
            'name': emoji,
            'users': result['users'],
            'channels': result['channels'],
        }
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps(payload),
        }
    elif action == 'related':
        related = related_emojis[emoji]
        related = [{**EMOJIS[emoji], 'name': emoji} for emoji in related]
        payload = {
            'name': emoji,
            'related': related,
        }
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps(payload),
        }
    elif action == 'upload_data':
        result = emoji_upload_data[emoji]
        payload = result
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps(payload),
        }
    elif action == 'popularity':
        result = emoji_popularity[emoji]
        payload = {
            'name': emoji,
            'popularity': result
        }
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps(payload),
        }
    elif action == 'basic_info':
        emoji_info = EMOJIS[emoji]
        payload = {
            'name': emoji,
            **emoji_info
        }
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps(payload),
        }
    else:
        assert action == 'metadata'
        metadata = get_metadata(emoji)
        print('RETURNED FROM GET_METADATA')
        metadata['name'] = emoji
        metadata['usage'] = []

        print('METADATA', metadata)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': json.dumps(metadata),
        }
