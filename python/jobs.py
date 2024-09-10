import pandas as pd

from tables import get_emoji_timestamps_table, get_emoji_timestamps_messages_table, get_reactions_table, get_slack_emoji_table, get_custom_emoji_table

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


def get_related_emojis():
    emojis = get_emojis()

    emoji_timestamps_messages_df = get_emoji_timestamps_messages_table()
    emoji_timestamps_messages_df = emoji_timestamps_messages_df[emoji_timestamps_messages_df['emoji'].isin(emojis.keys())].reset_index(drop=True)

    reactions_df = get_reactions_table()
    reactions_df = reactions_df[reactions_df['emoji'].isin(emojis.keys())].reset_index(drop=True)

    related = {}
    for emoji in tqdm(emojis, desc='related'):
        # Reactions
        emoji_ts = reactions_df[reactions_df.emoji == emoji].reset_index().ts.drop_duplicates()
        ts_df = reactions_df[reactions_df.ts.isin(emoji_ts)]
        emoji_reactions_counts = ts_df[ts_df.emoji != emoji].reset_index().emoji.value_counts()
        
        # Messages
        emoji_ts = emoji_timestamps_messages_df[emoji_timestamps_messages_df.emoji == emoji].reset_index().ts.drop_duplicates()
        ts_df = emoji_timestamps_messages_df[emoji_timestamps_messages_df.ts.isin(emoji_ts)]
        emoji_messages_counts = ts_df[ts_df.emoji != emoji].reset_index().emoji.value_counts()
        
        related[emoji] = emoji_messages_counts.add(emoji_reactions_counts, fill_value=0).sort_values(ascending=False).keys().to_list()

    return related


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


def get_popularity():
    emoji_timestamps_messages_df = get_emoji_timestamps_messages_table()
    reactions_df = get_reactions_table()
    s = emoji_timestamps_messages_df.emoji.value_counts() + reactions_df.emoji.value_counts()
    sorted_emojis = s.sort_values(ascending=False).keys()
    popularity = dict(zip(sorted_emojis, range(1, len(sorted_emojis)+1)))
    return popularity


def get_emojis():
    slack_emoji_df = get_slack_emoji_table()
    custom_emoji_table = get_custom_emoji_table()

    emojis = {}

    for idx, record in slack_emoji_df.iterrows():
        emojis[record['name']] = {'emoji': record['emoji']}

    for idx, row in custom_emoji_table.iterrows():
        emojis[row['name']] = {'url': row['url']}

    return emojis



if __name__ == '__main__':
    # users_and_channels = get_users_and_channels()
    # json.dump(users_and_channels, open('users_and_channels.json', 'w'))

    # emoji_upload_data = get_emoji_upload_data()
    # json.dump(emoji_upload_data, open('emoji_upload_data.json', 'w'))

    related_emojis = get_related_emojis()
    json.dump(related_emojis, open('related_emojis.json', 'w'))

    # emoji_popularity = get_popularity()
    # json.dump(emoji_popularity, open('emoji_popularity.json', 'w'))

    # emojis = get_emojis()
    # json.dump(emojis, open('emojis.json', 'w'))

