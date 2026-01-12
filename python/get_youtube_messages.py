#!/usr/bin/env ipython

import json

import pandas as pd
from tqdm import tqdm


def get_youtube_messages():
    def _get_youtube_messages(path):
        messages = json.load(open(path))
        _youtube_messages = [message for message in messages if 'attachments' in message and any(attachment.get('service_name') == 'YouTube' for attachment in message['attachments'])]
        return _youtube_messages

    paths = get_ipython().getoutput('ls data/awakened_zip/music/*')
    youtube_messages = []
    for path in tqdm(paths):
        _youtube_messages = _get_youtube_messages(path)
        youtube_messages.extend(_youtube_messages)

    return youtube_messages


if __name__ == '__main__':
    youtube_messages = get_youtube_messages()

    songs = []
    for youtube_message in youtube_messages:
        song = [
            (
                youtube_message['user'],
                attachment['title'],
                attachment['title_link']
            ) for attachment in youtube_message['attachments']
        ]
        songs.extend(song)

    df = pd.DataFrame(songs, columns=['user', 'title', 'link'])

    print(df)

