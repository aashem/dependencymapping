const Asset = require('../../models').Asset;
const hal = require('../../utils/hal.utils');

function assetPost(req, res){

    const asset = new Asset(req.body);


    if (!asset.name) {
        console.log(asset)
        res.status(400).json({error: "name is required field"})

    } else {

        Asset.findOne({name: asset.name})
            .then(existing => {
                if (existing) {
                    res.status(409).json({
                        error: `Asset ${existing.name} already exists.`,
                        pathToExisting: `/asset/${existing.name}`
                    });
                } else {
                    asset.save().then(saved => {
                        const halAsset = hal.serializeAsset(`${req.headers.host}`, saved);
                        res.status(201).send(halAsset);
                    }).catch(err => {
                        console.log(err);
                    })
                }
            })
            .catch(err => {
                console.log(`err: ${err}`)
            });
    }
}

module.exports = assetPost;