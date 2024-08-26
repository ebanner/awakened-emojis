import pandas as pd

from tables import get_emoji_timestamps_table

from tqdm import tqdm

import json


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
