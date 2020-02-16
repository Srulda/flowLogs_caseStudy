const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const addItem = (tableName, item) => {
    const params = {
        TableName: tableName,
        Item: item
    };

    return dynamoDb.put(params).promise();
};

const getItem = (tableName, id) => {
    const params = {
        TableName: tableName,
        Key: {
            id: id
        }
    };
    return dynamoDb.get(params).promise();
};

const updateItem = (tableName, id, timeStamp) => {
    const params = {
        TableName: tableName,
        Key: {
            id: id
        },
        AttributeUpdates: {
            newestLogTime: {
                Action: 'PUT',
                Value: timeStamp
            }
        }
    };
    return dynamoDb.update(params).promise();
};

// const createTimeStamp = await addItem(tableName, { id : 'NEWEST_TIME_STAMP_LOG' , newestLogTime });

module.exports = {
    addItem,
    getItem,
    updateItem
};
