const Mapping = require('../../models').Mapping;
const hal = require('../../utils/hal.utils');

function mappingPut (req, res) {
    console.log(`mapping.router.putById(${req.params.id})`)
    const query = {_id: req.params.id};
    console.log(query);
    const updatedMapping = req.body;
    Mapping.update(query, {
          name: req.body.name,
            description: req.body.description,
            assets: req.body.assets,
            tags: req.body.tags
    })
        .then(ok => {
            Mapping.findOne(query)
                .then(mapping => res.status(200).json(hal.serializeMapping(req.headers.host,mapping)))
                .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).send(err));
}

module.exports = mappingPut;