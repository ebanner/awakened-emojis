from slack_sdk import WebClient


SLACK_BOT_TOKEN = ...

slack_client = WebClient(SLACK_BOT_TOKEN)


if __name__ == '__main__':
    response = slack_client.chat_postMessage(
        channel='general',
        text='Hello!'
    )

    slack_client.reactions_add(
        channel="C04C5AVUMQF",
        timestamp=response['ts'],
        name="thumbsup"
    )
