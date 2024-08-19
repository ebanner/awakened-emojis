CREATE TABLE emoji_timestamps (
    user TEXT,
    channel TEXT,
    emoji TEXT,
    ts TEXT
);

CREATE INDEX idx_emoji ON emoji_timestamps (emoji);
