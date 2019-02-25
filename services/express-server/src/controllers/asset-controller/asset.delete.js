const Asset = require('../../models').Asset;

function assetDelete(req, res){
    console.log(`assetDelete:: ${req.params.id}`)
    const query = {name: req.params.id};
    Asset.deleteOne(query)
        .then(ok => {
            res.status(204).json();
        })
        .catch(err => res.status(400).json(err))
}

module.exports = assetDelete;
