
export const generateAwsS3Url = (key) => {
    return 'https://'+ process.env.REACT_APP_AWS_S3_POSTS_BUCKET + '.s3.' + process.env.REACT_APP_AWS_S3_REGION + '.amazonaws.com/' + key
}
