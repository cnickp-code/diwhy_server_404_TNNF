module.exports = {
    PORT: process.env.PORT || 8000,
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/diwhy',
    TEST_DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/diwhy_test',
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h'
}