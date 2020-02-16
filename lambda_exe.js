var AWS = require('aws-sdk');

var lambda = new AWS.Lambda({
    accessKeyId: 'your_Access_Key_Id',
    secretAccessKey: 'your_Secret_Access_Key',
    region: 'your_Region'
});

var params = {
    FunctionName: 'FunctionName' /* required */,
    Payload: JSON.stringify({
        size: 'how_many_logs_do_you_want_to_pass',
        logGroupName: 'your_Log_Group_Name',
        s3Bucket: 'bucket_Name',
        tableName: 'table_Name'
        
    })
};

lambda.invoke(params, function(err, data) {
    if (err)
        console.log('EEEEEEEEERRRRRRRROOOOOOOOOORRRRRRRRR', err, err.stack);
    // an error occurred
    else {
        console.log(data);
    }
});