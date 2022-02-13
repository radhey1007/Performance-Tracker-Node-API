module.exports = {
    db: 'mongodb+srv://admin:' + process.env.MONGO_ATLAS_PWD +
    '@performance-tracker.t9oqt.mongodb.net/'+ process.env.DATABASE_NAME + '?retryWrites=true&w=majority'
}


