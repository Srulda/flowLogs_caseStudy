const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const addItem = (tableName, item) => {
    const params = {
        TableName: tableName,
        Item: item
    };

    return dynamoDb.put(params).promise();
};

module.exports = {
    addItem,
    
};
