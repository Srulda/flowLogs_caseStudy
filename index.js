const shortid = require('shortid');
const { getLogEvents } = require('./aws/log-events');
const { uploadS3Zip, getS3Size, uploadMetaDataToS3 } = require('./aws/s3');
const { addItem, getItem } = require('./aws/dynamo');

exports.handler = async event => {
    const { size, logGroupName, s3Bucket, tableName } = event;

    try {
        const id = shortid.generate();

        const data = await getLogEvents(logGroupName, size);
        const { events } = data || [];
        const s3FileName = `flow-logs-${id}.zip`;
        const bucketData = await uploadS3Zip(s3Bucket, s3FileName, events);
        const fileSize = await getS3Size(s3Bucket, s3FileName);

        const metadata = {
            logCounter: events.length,
            logSize: fileSize,
            oldestLogTime: events[0].timestamp,
            newestLogTime: events[events.length - 1].timestamp
        };

        await uploadMetaDataToS3(
            s3Bucket,
            `metaData-${id}.json`,
            JSON.stringify(metadata)
        );
        const res = await addItem(tableName, { id, ...metadata });
        const objFromDb = await getItem(tableName, id);
        const startTime = objFromDb.Item.newestLogTime;
        return {
            success: true,
            startTime
        };
    } catch (ex) {
        throw ex;
    }
};
