const mongoose = require('mongoose');

// set defaults for testing if env variables not provided
const MONGO_PATH = process.env.MONGO_PATH || "mongo";
const MONGO_PORT = process.env.MONGO_PORT || "27017";
const DB_NAME = process.env.DB_NAME       || "production";

/**
 *  Database configuration here
 */


const devConfig = () => ({
    onConnected: () => {
        console.log('Mongoose successful connection:');
        console.log(`running in: ${process.env.NODE_ENV} mode`)
        console.log(`using database: ${process.env.DB_NAME}`);
    },
    onError: () => {
        console.log('Mongoose successful connection:');
        console.log(`running in: ${process.env.NODE_ENV} mode`)
        console.log(`using database: ${process.env.DB_NAME}`);
    }
});

const testConfig = () => ({
    onConnected: () => {
    },
    onError: () => {
        console.log('Mongoose successful connection:');
        console.log(`running in: ${process.env.NODE_ENV} mode`)
        console.log(`using database: ${process.env.DB_NAME}`);
    }
});

const productionConfig = () => ({
    onConnected: () => {
        console.log('PRODUCTiON: Mongoose successful connection:');
        console.log(`running in: ${process.env.NODE_ENV} mode`)
        console.log(`using database: ${process.env.DB_NAME}`);
    }
    ,
    onError: () => {
        console.log('Mongoose connection error:');
        console.log(`running in: ${process.env.NODE_ENV} mode`)
        console.log(`using database: ${process.env.DB_NAME}`);
    }
});

const configs = {
    development: devConfig(),
    test: testConfig(),
    production: productionConfig()
};

function getConfig() {
    console.log(`Get config: ${process.env.NODE_ENV}`);
    const config = configs[process.env.NODE_ENV];
    return config;
}

function initDatabaseConnection(props) {

    console.log("initDatabaseConnection");
    console.log(MONGO_PATH);
    console.log(MONGO_PORT);
    console.log(DB_NAME);

    const config = getConfig();

    console.log(`mongodb://${MONGO_PATH}:${MONGO_PORT}/${DB_NAME}`);
    return mongoose.connect(`mongodb://${MONGO_PATH}:${MONGO_PORT}/${DB_NAME}`);

}

module.exports = initDatabaseConnection;

