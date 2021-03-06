const expect = require('chai').expect;
const Mapping = require('../src/models').Mapping;

const initDatabaseConnection = require('../src/database');
const { resetModels } = require('../src/utils/testHandlers');


try {
    initDatabaseConnection({database: "unit-tests", env: "tests"});
} catch (err) {
    console.log("error with db connection")
}


describe('Tag model tests', function () {

    before(async function () {
        try {
            await resetModels();
            console.log(`\n"Database has been reset for tests reset!\n`)
        } catch (err) {
            console.error(err);
        }
    });

    it('should be invalid if name is empty', function (done) {

        const a = new Mapping();

        a.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});