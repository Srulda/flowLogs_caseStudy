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

module.exports = {
    addItem,
    getItem
};
