const AWS = require('aws-sdk');
const cloudwatchlogs = new AWS.CloudWatchLogs();

const getLogEvents = (logGroupName, size) => {
    return new Promise((resolve, reject) => {
        cloudwatchlogs.getLogEvents(
            {
                logGroupName: logGroupName,
                logStreamName: 'eni-0c527db942849058b-all',
                limit: size,
                startFromHead: true
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
