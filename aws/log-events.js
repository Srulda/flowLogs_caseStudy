const AWS = require('aws-sdk');
const cloudwatchlogs = new AWS.CloudWatchLogs();

const getLogEvents = (logGroupName, size, startTime) => {
    return new Promise((resolve, reject) => {
        cloudwatchlogs.getLogEvents(
            {
                logGroupName,
                logStreamName: 'eni-0c527db942849058b-all',
                limit: size,
                startFromHead: true,
                startTime

            },
            function(err, data) {
                if (err) reject(err);
                else {
                    resolve(data);
                }
            }
        );
    });
};

module.exports = {
    getLogEvents
};
