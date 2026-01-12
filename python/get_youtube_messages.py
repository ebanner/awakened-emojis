#!/usr/bin/env ipython

import json

import pandas as pd
from tqdm import tqdm


def get_youtube_messages():
    def _get_youtube_messages(path):
        messages = json.load(open(path))
        _youtube_messages = [message for message in messages if 'youtube' in message.get('text', '')]
        return _youtube_messages

    paths = get_ipython().getoutput('ls data/awakened_zip/music/*')
    youtube_messages = []
    for path in tqdm(paths):
        _youtube_messages = _get_youtube_messages(path)
        youtube_messages.extend(_youtube_messages)

    return youtube_messages


if __name__ == '__main__':
    youtube_messages = get_youtube_messages()

    df = pd.DataFrame((youtube_message['user'], youtube_message['text']) for youtube_message in youtube_messages)

    print(df)

