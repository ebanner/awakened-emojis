import pandas as pd

from tables import get_emoji_timestamps_table

from tqdm import tqdm

import json


def get_emoji_upload_data():
    """

    Highlight all the emojis on the customize slack page and copy and paste them
    into a text file called emojis.txt.

    """
    
    with open('emojis.txt') as f:
        lines = [line.strip() for line in f.readlines()]

    emojis = {}
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

            emoji_name = emoji[1:-1] # strip off colons
            emojis[emoji_name] = {
                'date_added': date,
                'added_by': user
            }
    return emojis


def get_users_and_channels():
    df = get_emoji_timestamps_table()

    metadata = {}
    for emoji, group in tqdm(df.groupby('emoji')):
        channels = group.groupby('channel').count()[['emoji']].reset_index().rename(columns={'emoji': 'count', 'channel': 'name'}).to_dict(orient='records')
        users = group.groupby('user').count()[['emoji']].reset_index().rename(columns={'emoji': 'count', 'user': 'name'}).to_dict(orient='records')
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
