const AWS = require('aws-sdk');
const archiver = require('archiver');
const { convertTimestampToStrDate } = require('../utils/date');
const s3 = new AWS.S3();

const uploadS3Zip = (bucket, key, events) => {
    return new Promise((resolve, reject) => {
        const stream = require('stream');
        const pass = new stream.PassThrough();
        s3.upload({ Bucket: bucket, Key: key, Body: pass }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        archive.pipe(pass);

        const mapByDay = events.reduce((acc, curr) => {
            const { timestamp, message } = curr;
            const keyDate = convertTimestampToStrDate(timestamp);
            if (!acc[keyDate]) {
                acc[keyDate] = [];
            }
            acc[keyDate].push(message);
            return acc;
        }, {});

        for (const key in mapByDay) {
            const strMessages = mapByDay[key].join('\n');
            archive.append(strMessages, { name: key });
        }

        archive.finalize();
    });
};

const getS3Size = async (bucket, key) => {
    const res = await s3.headObject({ Bucket: bucket, Key: key }).promise();
    return res.ContentLength;
};

const uploadMetaDataToS3 = (bucket, key, str) => {
    const params = {
        Bucket: bucket,
        Key: key,
        Body: str
    };

    s3.upload(params).promise();
};

module.exports = {
    uploadS3Zip,
    getS3Size,
    uploadMetaDataToS3
};
