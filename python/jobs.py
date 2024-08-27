import pandas as pd

from tables import get_emojis_table, get_emoji_timestamps_table, get_emoji_timestamps_messages_table, get_reactions_table

from tqdm import tqdm

import json


def get_related_emojis():
    emoji_timestamps_messages_df = get_emoji_timestamps_messages_table()
    reactions_df = get_reactions_table()
    emojis_df = get_emojis_table()

    emojis = emojis_df.name
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


if __name__ == '__main__':
    # users_and_channels = get_users_and_channels()
    # json.dump(users_and_channels, open('users_and_channels.json', 'w'))

    # emoji_upload_data = get_emoji_upload_data()
    # json.dump(emoji_upload_data, open('emoji_upload_data.json', 'w'))

    related_emojis = get_related_emojis()
    json.dump(related_emojis, open('related_emojis.json', 'w'))

