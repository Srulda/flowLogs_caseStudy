const shortid = require('shortid');
const { getLogEvents } = require('./aws/log-events');
const { uploadS3Zip, getS3Size, uploadMetaDataToS3 } = require('./aws/s3');
const { addItem , getItem, updateItem} = require('./aws/dynamo');

exports.handler = async event => {
    const { size, logGroupName, s3Bucket, tableName } = event;
    try {
        const id = shortid.generate();

        const newestTimeFromDB = await getItem(tableName ,'NEWEST_TIME_STAMP_LOG')
        const startTime = newestTimeFromDB.Item.newestLogTime

        const data = await getLogEvents(logGroupName, size, startTime);
        const { events } = data || []

        const oldestLogTime = events[0].timestamp
        const newestLogTime = events[events.length - 1].timestamp
        const saveNewestLogTimeToDB = await updateItem(tableName, 'NEWEST_TIME_STAMP_LOG', newestLogTime)

        const s3FileName = `flow-logs-${id}.zip`;
        const bucketData = await uploadS3Zip(s3Bucket, s3FileName, events);
        const fileSize = await getS3Size(s3Bucket, s3FileName);

        const metadata = {
            logCounter: events.length,
            logSize: fileSize,
            oldestLogTime,
            newestLogTime
        };

        await uploadMetaDataToS3(s3Bucket, `metaData-${id}.json`, JSON.stringify(metadata));
        const res = await addItem(tableName, { id, ...metadata });
        
        return {
            success: true
        };
    } catch (ex) {
        throw ex;
    }
};
