import glob
import json
import pandas as pd
import re
import os

from tqdm import tqdm


def get_channels():
    directory = 'awakened_zip'
    dirs = [d for d in os.listdir(directory) if os.path.isdir(os.path.join(directory, d))]
    all_channels = [d.rstrip('/') for d in dirs]
    return all_channels


def get_counts(emoji_list):
    d = {}
    for emoji in emoji_list:
        if emoji in d:
            d[emoji] += 1
        else:
            d[emoji] = 1
    return d


def get_emoji_files(channel):
    dir_path = f'awakened_zip/{channel}'
    files = glob.glob(f"{dir_path}/*.json")
    return files

def get_reactions(message):
    reactions = message.get('reactions', [])
    return reactions

def get_emojis_from_message(message):
    emojis = re.findall(
        r':[a-z0-9_-]+:',
        message['text']
    )
    return emojis

def get_emojis_from_messages(messages):
    all_emojis = []
    for message in messages:
        emojis = get_emojis_from_message(message)
        all_emojis.extend(emojis)
    return all_emojis

def get_emojis_from_reactions(reactions):
    emojis = []
    for reaction in reactions:
        emojis.append(reaction['name'])
    return emojis

def get_messages(emoji_file):
    messages = json.load(open(emoji_file))

    # Filter out messages which don't have a user field
    messages = [message for message in messages if 'user' in message]

    return messages

def get_emojis(messages):
    all_reactions = []
    for message in messages:
        reactions = get_reactions(message)
        all_reactions.extend(reactions)

    message_emojis = get_emojis_from_messages(messages)
    reaction_emojis = get_emojis_from_reactions(all_reactions)

    return message_emojis + reaction_emojis

def get_emoji_counts(channel, head=-1):
    emoji_files = get_emoji_files(channel)
    emoji_list = []
    for emoji_file in emoji_files[:head]:
        messages = get_messages(emoji_file)
        emojis = get_emojis(messages)
        emoji_list.extend(emojis)
    
    emoji_counts = get_counts(emoji_list)
    return emoji_counts


def get_emoji_counts_for_all_channels():
    all_channels = get_channels()
    all_emoji_counts = {}
    for channel in tqdm(all_channels, desc='Channels', unit='channel'):
        emoji_counts = get_emoji_counts(channel)
        all_emoji_counts[channel] = emoji_counts

    # Sum up the counts for each emoji across all channels
    total_emoji_counts = {}
    for channel, emoji_counts in all_emoji_counts.items():
        for emoji, count in emoji_counts.items():
            if emoji in total_emoji_counts:
                total_emoji_counts[emoji] += count
            else:
                total_emoji_counts[emoji] = count

    return total_emoji_counts