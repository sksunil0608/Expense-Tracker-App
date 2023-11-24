const AWS = require('aws-sdk')
const uploadtoS3 = function uploadtoS3(data, fileName) {
    const BUCKET_NAME = process.env.BUCKET_NAME
    const IAM_USER_KEY = process.env.IAM_USER_KEY
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET

    let S3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })
    var params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        S3bucket.upload(params, (err, S3Response) => {
            if (err) {
                console.log(err)
                reject(err)
            }
            else {
                resolve(S3Response.Location);
            }
        })
    })
}

module.exports = {
    uploadtoS3
}