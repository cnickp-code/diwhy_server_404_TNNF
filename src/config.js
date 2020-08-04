module.exports = {
    PORT: process.env.PORT || 8000,
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/diwhy',
    TEST_DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/diwhy_test',
    NODE_ENV: process.env.NODE_ENV || 'development',
}