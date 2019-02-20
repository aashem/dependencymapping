const assert = require('assert').assert;
const {expect, should} = require('chai');
const Asset = require('../src/models').Asset;
const Connection = require('../src/models').Connection;
const path = require('path');

const initDatabaseConnection = require('../src/database');
const {resetModels, loadDataToDB, clearDB} = require('../src/utils/testHandlers');


try {
    initDatabaseConnection({database: "unit-tests", env: "tests"});
} catch (err) {
    console.log("error with db connection")
}


describe('Asset model tests', function () {

    before(async function () {
        await resetModels();
    });

    after(async function () {
        // await clearDB();
    });

    beforeEach(async function () {
        //await resetModels();
        //console.log('before each load data to db')
    });

    afterEach(async function () {
        //await clearDB();
        //console.log('after each clear data from db')
    });

    it('should be invalid if name is empty', function (done) {

        const a = new Asset();

        a.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });


    it('should be invalid if name is not unique', function (done) {

        const a = new Asset({name: "named asset"});
        const b = new Asset({name: "named asset"});

        const aPromise = a.save();
        const bPromise = b.save();

        aPromise
            .then(aAsset => {
                //console.log(aAsset);

                bPromise
                    .then(bAsset => {
                        //console.log(bAsset)
                        //expect(false).is.ok;

                        done();
                    })
                    .catch(err => done(err))
            })
    });


    it('Asset should save without error', function (done) {
        const asset = new Asset({name: "test asset"});
        asset.save(done);
    });

    it('Asset should save with defaults', function (done) {

        const a = new Asset({name: "test asset"});

        const assetPromise = a.save();

        assetPromise
            .then(asset => {
                expect(asset).to.have.property('_id');
                expect(asset).to.have.property('name');
                expect(asset).to.have.property('connected_to');
                expect(asset).to.have.property('tags');
                expect(asset).to.have.property('nodeShape');
                expect(asset).to.have.property('nodeColor');
                //expect(asset).to.have.any.keys(
                //    '_id', 'name', 'connected_to',
                //    'tags', 'nodeShape', 'nodeColor'
                //);
                done()
            })
            .catch(err => done(err))
    });

    it('Asset should save with proper values', function (done) {
        const expectedValues = {
            name: "test asset",
            connected_to: ["test asset two", "test asset three"],
            tags: ["tag one", "tag two"],
            description: "describing test asset",
            nodeShape: "triangle",
            nodeColor: "blue"

        };

        const a = new Asset(expectedValues);

        const assetPromise = a.save();

        assetPromise
            .then(asset => {
                // name saves correctly
                expect(asset.name).to.equal("test asset");

                // connected_to saves correctly
                expect(asset.connected_to).to
                    .include.members(
                    ["test asset two", "test asset three"]
                );

                // connected_to saves correctly
                expect(asset.tags).to
                    .include.members(
                    ["tag one", "tag two"]
                );

                // description saves correctly
                expect(asset.description).to
                    .equal(expectedValues.description);


                // description saves correctly
                expect(asset.nodeShape).to
                    .equal(expectedValues.nodeShape);


                // description saves correctly
                expect(asset.nodeColor).to
                    .equal(expectedValues.nodeColor);

                done()
            })
            .catch(err => done(err))
    });

    it('On asset save the connections should be created', function (done) {

        const expectedValues = {
            name: "source asset",
            connected_to: ["foo", "bar"]
        };

        const a = new Asset(expectedValues);

        const assetPromise = a.save();

        assetPromise
            .then(asset => {
                Connection.find({source: expectedValues.name})
                    .then(connections => {
                        // debug
                        connections.forEach(c => {
                            console.log(`source: ${c.source}, target: ${c.target}`)
                        });

                        // expect to find two connections where
                        // expectedValues.name is the source
                        expect(connections.length).to.equal(2);

                        const sourceTargetArray = connections.map(c => ({
                            source: c.source, target: c.target
                        }));

                        console.log(sourceTargetArray)

                        expect(sourceTargetArray)
                            .to.have.deep.members([
                            {source: "source asset", target: "foo"},
                            {source: "source asset", target: "bar"},
                        ]);

                        done();
                    })
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    });

    it('Delete asset should remove asset', function (done) {

        const expectedValues = {
            name: "asset to delete",
            connected_to: ["random asset"]
        };

        const a = new Asset(expectedValues);
        const assetPromise = a.save();


        assetPromise.then(asset => {

            const removePromise = Asset.remove({_id: asset._id});

            // At this point the asset exists
            //
            // Asset.findOne({_id:asset._id})
            //     .then(result => {
            //         console.log('did we find it?')
            //         console.log(result)
            //     }).catch(err => console.warn(err))

                Asset.findOne({_id: asset._id})
                    .then(result => {

                        expect(result).to.be.null;
                        console.log(result)
                    })
                    .catch(err => console.warn(err))
            removePromise.then(response => {

                Asset.findOne({_id: asset._id})
                    .then(result => {
                        console.log(result)
                        expect(result).to.be.null;

                        done();
                    })
                    .catch(err => console.warn(err))
            })

        });


    });

});
/*
    it('On asset delete connection should be deleted.', async function (done) {

        const expectedValues = {
            name: "asset to delete",
            connected_to: ["source asset"]
        };

        const a = new Asset(expectedValues);

        const asset = await a.save();

        // this should be deleted after asset deletion
        const connectionsBeforeDeletion = await Connection.find({source: asset.name})

        const deleteResponse = await Asset.remove({_id: asset._id});


        const connectionsAfterDeletion = await Connection.find({source: asset.name})

        console.log(deleteResponse)
        //console.log(connectionsBeforeDeletion)
        //console.log(connectionsAfterDeletion)

        expect(connectionsBeforeDeletion.length).to.equal(1);
        expect(connectionsAfterDeletion.length).to.equal(1);

        done();


    });
});
Connection.find({source: expectedValues.name})
    .then(connections => {
    // debug
    connections.forEach(c => {
        console.log(`source: ${c.source}, target: ${c.target}`)
    });

    // expect to find two connections where
    // expectedValues.name is the source
    expect(connections.length).to.equal(2);

    const sourceTargetArray = connections.map(c => ({
        source: c.source, target: c.target
    }));

    console.log(sourceTargetArray)

    expect(sourceTargetArray)
        .to.have.deep.members([
        {source: "source asset", target: "foo"},
        {source: "source asset", target: "bar"},
    ]);

    done();
    })
    .catch(err => done(err))
*/
