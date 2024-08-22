import pandas as pd

from tables import get_emoji_timestamps_table

from tqdm import tqdm

import json


def get_emoji_upload_data():
    with open('emojis.txt') as f:
        lines = [line.strip() for line in f.readlines()]

    emojis = []
    for i in range(len(lines)):
        if lines[i].startswith(':') and lines[i].endswith(':'):
            emoji = lines[i]
            i += 1
            date = lines[i]
            i += 1
            while lines[i] == '':
                i += 1
            user = lines[i]
            i += 1
            while i < len(lines) and lines[i] == '':
                i += 1
            if i < len(lines):
                assert not lines[i].startswith(':')
            i += 1

            emojis.append({
                'name': emoji,
                'upload_date': date,
                'user': user
            })
    return emojis


def get_users_and_channels():
    df = get_emoji_timestamps_table()

    metadata = {}
    for emoji, group in tqdm(df.groupby('emoji')):
        channels = group.groupby('channel').count()[['emoji']].rename(columns={'emoji': 'count'}).reset_index().to_dict(orient='records')
        users = group.groupby('user').count()[['emoji']].rename(columns={'emoji': 'count'}).reset_index().to_dict(orient='records')
        metadata[emoji] = {
            'channels': channels,
            'users': users
        }

    return metadata


if __name__ == '__main__':
    # users_and_channels = get_users_and_channels()
    # json.dump(users_and_channels, open('users_and_channels.json', 'w'))

    emoji_upload_data = get_emoji_upload_data()
    json.dump(emoji_upload_data, open('emoji_upload_data.json', 'w'))
