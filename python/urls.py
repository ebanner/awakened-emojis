import pandas as pd


def add_urls(pop_df, only_custom=False):
    url_df = pd.read_csv('data/emojis-and-url.csv')
    how = 'right' if only_custom else 'outer'
    merged_df = pd.merge(pop_df, url_df, on='emoji_name', how=how)
    merged_df['count'] = merged_df['count'].fillna(-1).astype('int')
    return merged_df