const express = require('express');
const Mapping = require('../models').Mapping;
const mappingRouter = express.Router();
const hal = require('../utils/hal.utils');
const msg = require('../constants').messages;
const err = require('../constants').errors;
const { MappingCtrl } = require('../controllers/');


mappingRouter.get('(/:id)?', (req, res) => {
    if (req.params.id) {
        Mapping.findOne({name: req.params.id})
            .then(mapping => {
                if (!mapping) {
                    res.status(404).json(err.RESOURCE_NOT_FOUND)
                } else {
                    res.status(200).json(mapping);
                }

            }).catch(err => res.status(400).json(err));
    } else {
        Mapping.find()
            .then(mappings => {
                const HALMappings = mappings.map(m => hal.serializeMapping(req.headers.host, m));
                res.status(200).json(HALMappings);
            }).catch(err => res.send(err));
    }

});

mappingRouter.post('(/:id)?', (req, res) => {

    //
    console.log(`post: ${req.params.id}`);

    if (!req.body.name) {
        res.status(400).json({
            error: "name is a required required field",
            debug: req.body
        })
    } else {

        console.log(req.body.assets);
        const mapping = new Mapping(req.body);
        const query = {name: mapping.name};
        console.log(mapping)

        console.log("check if this already exists!");
        console.log(query);

        Mapping.findOne(query)
            .then(existing => {

                if (existing) {

                    console.log("Mapping already exists.");
                    console.log(`found: ${mapping}`)
                    res.status(409).json({
                        error: "point to existing?",
                        pathToExisting: `/mapping/${existing.name}`
                    });
                } else {
                /**  Mapping does not exist yet */

                    mapping.save().then(saved => {
                        console.log(`saved: ${saved.name}`);
                        res.status(201).json(hal.serializeMapping(req.headers.host, saved));
                    }).catch(err => {
                        console.log(err);
                    })
                }
            })
            .catch(err => {
                console.log(`err: ${err}`)
            });
    }
});

mappingRouter.put('(/:id)?', (req, res) => {
    const query = {name: req.params.id};
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
});

mappingRouter.delete('/:id', (req, res) => MappingCtrl.deleteById(req,res));


module.exports = mappingRouter;