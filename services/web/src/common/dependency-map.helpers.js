import * as graphHelpers from './graph-helpers'
import * as activeMappingActions from '../store/active-mapping/active-mapping.actions'
import * as activeDetailActions from '../store/active-detail/active-detail.actions';
import * as parser from './parser';
import * as resourceHelpers from './graph-helpers';
import * as types from '../constants/types';
import * as _ from 'lodash';

export function getMappingById(mapId, mappings) {
    return mappings.filter(g => g.name === mapId)[0];
}

//export function loadDependencyMap(mapId, cy, mappings, assets, dispatch, getState) {
export function loadDependencyMap(mapId) {

    return function (dispatch, getState) {
        // load graph resources to the active mapping
        const {graph, mappings, assets, connections} = getState();
        const layout = getState().app.graph.selectedLayout;
        const cy = graph;

        // clear graph
        graphHelpers.clearGraph(cy);

        const mapping = getMappingById(mapId, mappings);

        // By default this is an array of objects.
        const assetNameList = mapping ? mapping.assets : [];
        const tagNameList = mapping ? mapping.tags : [];

        console.group("LoadDependencyMap()");
        console.info(assets);
        console.info(mapping);

        // get connections between assets in the mapping

        const createEdgesFromThese = connections.filter(
            c => {
                console.info(`${c.name} in ${JSON.stringify(assetNameList)}`);
                return (
                    _.includes(assetNameList, c.source) &&
                    _.includes(assetNameList, c.target)
                );
            }
        );

        const edges = createEdgesFromThese
            .map(
                c => graphHelpers.getEdgeFromConnection(c)
            );

        console.info(createEdgesFromThese);
        console.info(edges);

        // Set mapping as active.
        dispatch(activeMappingActions.setActiveMapping(mapping));

        /**
         * This is because at the moment there's no back end solution.
         *  Current dev. environment returns mapping resources as objects,
         * which is not too efficient. Preferred method would be using
         * just an array of id's which would be used in a following manner.
         */

            // if resource is a string
            // map resource id's to resource objects
        const activeMappingAssetObjects = parser.filterObjectsByName({
                names: assetNameList,
                objectList: assets
            });

        const activeMappingTagObjects = parser.filterObjectsByName({
            names: assetNameList,
            objectList: assets
        });


        // todo: check if this is obsolete?
        // objects for redux state
        // const connections = parser.getConnectionsFromResources(assets);
        // dispatch(activeMappingActions.setActiveMappingConnections(connections));


        // json for graphing
        //console.info(activeMappingAssetObjects)
        // get cy.element objects from active mapping assets
        //const edges = parser.parseEdgeElementsFromResources(activeMappingAssetObjects);


        const nodes = activeMappingAssetObjects
            .map(
                resource => resourceHelpers.nodeElementFromResource(resource)
            );

        graphHelpers.addElements(cy, nodes);
        graphHelpers.addElements(cy, edges);

        // update activeDetail store
        dispatch(activeDetailActions.setActiveMappingAsDetail({
                data: mapping,
                type: types.MAPPING
            })
        );

        // update the graph layout
        graphHelpers.updateLayout(cy, layout);
        console.groupEnd();
    }
};