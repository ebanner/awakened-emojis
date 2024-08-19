SELECT 
    strftime('%Y-%m', datetime(ts, 'unixepoch')) AS month,
    COUNT(*) AS event_count
FROM emoji_timestamps
WHERE emoji = 'agontfhi'
GROUP BY month
ORDER BY month;
