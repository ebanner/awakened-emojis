import pandas as pd
from tqdm import tqdm

import json

from main import get_channels, get_emoji_files, get_messages, get_emojis_from_message, get_reactions


id_to_user = { 
    'U246YJFFA': 'david',
    'U01EKNT75EZ': 'Grant',
    'U3U2ALLC8': 'Scott',
    'U1GPCQ5DK': 'ohz',
    'U0XQBERD0': 'joshua',
    'U01ENEUQMMZ': 'yodabaoth',
    'U012JP811UJ': 'B the Mystic',
    'U0Y09EKFF': 'Teemu',
    'U0109C2DTFH': 'Entward',
    'U0XU2VD8X': 'oliver',
    'U0XSZH4FK': 'Leo Pokatu',
    'UEH585CJE': 'Katherine',
    'U0XTHU2LR': 'abhay',
    'U778VCCTS': 'Rui',
    'UHQMJE5A6': 'jaykob',
    'U2J7PUNBF': 'ego-check',
    'U7KNELLJG': '匚ㄚ乃乇尺匚卂ㄒ (Jason)',
    'U02780B5563': 'Eddie',
}


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


def get_messages_table():
    all_channels = get_channels()
    all_messages = []
    num_errors = 0
    for channel in tqdm(all_channels, desc='messages', unit='channel'):
        for emoji_file in get_emoji_files(channel):
            messages = get_messages(emoji_file)
            for message in messages:
                user = message['user']
                try:
                    all_messages.append({
                        'user': id_to_user.get(user, user),
                        'channel': channel,
                        'ts': message['ts'],
                        'message': message['text']
                    })
                except Exception as e:
                    num_errors += 1

    print('num errors:', num_errors)
    df = pd.DataFrame(all_messages)
    return df


def get_emoji_timestamps_messages_table():
    all_channels = get_channels()
    emoji_timestamps = []
    num_errors = 0
    for channel in tqdm(all_channels, desc='messages', unit='channel'):
        for emoji_file in get_emoji_files(channel):
            messages = get_messages(emoji_file)
            for message in messages:
                user = message['user']
                try:
                    emojis = get_emojis_from_message(message)
                except Exception as e:
                    num_errors += 1
                    continue
                for emoji in emojis:
                    emoji_timestamps.append({
                        'user': id_to_user.get(user, user),
                        'channel': channel,
                        'ts': message['ts'],
                        'message': message['text'],
                        'emoji': emoji,
                    })

    print('num errors:', num_errors)
    df = pd.DataFrame(emoji_timestamps)
    return df


def get_reactions_table():
    all_channels = get_channels()
    reaction_timestamps = []
    for channel in tqdm(all_channels, desc='messages', unit='channel'):
        for emoji_file in get_emoji_files(channel):
            messages = get_messages(emoji_file)
            for message in messages:
                reactions = get_reactions(message)
                for reaction in reactions:
                    emoji = reaction['name']
                    for user in reaction['users']:
                        reaction_timestamps.append({
                            'message_user': id_to_user.get(message['user'], message['user']),
                            'reaction_user': id_to_user.get(user, user),
                            'channel': channel,
                            'ts': message['ts'],
                            'message': message['text'],
                            'emoji': emoji,
                        })

    df = pd.DataFrame(reaction_timestamps)
    return df


def get_emoji_timestamps_table():
    reactions_df = get_reactions_table()
    emoji_timestamps_messages_df = get_emoji_timestamps_messages_table()

    records = []

    for record in reactions_df.to_dict(orient='records'):
        records.append({
            'user': record['reaction_user'],
            'channel': record['channel'],
            'emoji': record['emoji'],
            'ts': record['ts'],
        })

    for record in emoji_timestamps_messages_df.to_dict(orient='records'):
        records.append({
            'user': record['user'],
            'channel': record['channel'],
            'emoji': record['emoji'],
            'ts': record['ts'],
        })

    df = pd.DataFrame(records)
    return df


def get_custom_emoji_table():
    """Need to run slackEmojis.js first in a web browser and paste in
    emojis.json"""
    emojis = json.load(open('custom_emojis.json'))
    df = pd.DataFrame(emojis)[['name', 'date_added', 'added_by', 'url']]
    return df


def get_slack_emoji_table():
    """Need to download slack emoji.json from this repo:

    https://github.com/iamcal/emoji-data/blob/master/emoji.json

    first"""
    def get_emoji(code_point):
        code_points = code_point.split('-')
        emoji = ''.join(chr(int(cp, 16)) for cp in code_points)
        return emoji

    emojis = json.load(open('emoji.json'))
    for emoji in emojis:
        code_point = emoji['unified']
        emoji['emoji'] = get_emoji(code_point)

    slack_emoji_df = pd.DataFrame({'name': emoji['short_name'], 'emoji': emoji['emoji']} for emoji in emojis)
    return slack_emoji_df


if __name__ == '__main__':
    # emoji_timestamps_df = get_emoji_timestamps_table()
    # emoji_timestamps_df.to_csv('emoji_timestamps.csv', index=False)
    # print(emoji_timestamps_df.head())

    print(emojis_df.head())


