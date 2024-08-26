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
    print('IN GET_USAGE')
    df.ts = pd.to_datetime(df.ts, unit='s')
    print('CONVERTED TS')
    emoji_df = df[df.emoji == emoji].reset_index(drop=True)
    print('FILTERED DF')
    count_df = emoji_df[['emoji', 'ts']].set_index('ts').resample('ME').count()
    print('RESAMPLED')
    count_df = count_df.rename(columns={'emoji': 'count'})
    print('RENAMED')
    count_df = count_df.reset_index()
    print('RESET_INDEX')
    count_df.ts = count_df.ts.map(lambda ts: int(ts.timestamp()))
    print('MAPPED TS')
    usage = count_df.to_dict(orient='records')
    print('TO_DICT')
    return usage


def get_usage_sqlite(emoji):
    start = time.time()
    conn = sqlite3.connect('mydatabase.db')
    end = time.time()
    print('sqlite3.connect', end-start)

    query = f"""

SELECT
    strftime('%Y-%m', datetime(ts, 'unixepoch')) AS month,
    COUNT(*) AS count
FROM emoji_timestamps
WHERE emoji = ?
GROUP BY month
ORDER BY month;

    """

    start = time.time()
    df = pd.read_sql_query(query, conn, params=(emoji,))
    end = time.time()
    print('pd.read_sql_query', end-start)

    start = time.time()
    df['ts'] = df['month'].apply(lambda ts: int(pd.to_datetime(ts).timestamp()))
    end = time.time()
    print('pd.to_datetime', end-start)

    start = time.time()
    df.drop('month', axis=1, inplace=True)
    end = time.time()
    print('df.drop', end-start)

    start = time.time()
    usage = df.to_dict(orient='records')
    end = time.time()
    print('df.to_dict', end-start)

    start = time.time()
    conn.close()
    end = time.time()
    print('conn.close', end-start)

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
    elif action == 'data':
        result = emoji_data[emoji]
        payload = result
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
