//@flow

import * as types from '../actions/actionTypes';
import initialState from './initialState';


type Mapping = {
    name: String,
    description: ?String,
    assets: [?String],
    tags: [?String]
}

type MappingState = [Mapping]

export default function mappingReducer(state: MappingState = initialState.mappings, action){
    switch(action.type) {
        case types.LOAD_MAPPINGS_SUCCESS:
            // return empty array if the server response
            // didn't return any items
            return action.mappings ? action.mappings : [];

        case types.POST_MAPPING_SUCCESS:
            console.info(action);
            return [...state, action.mapping];

        case types.SAVE_MAPPING:
            const updatedMapping = action.mapping;
            return state.map(mapping => {
                if (mapping.name !== updatedMapping.name){
                    return mapping;
                } 
                return {
                    ...updatedMapping
                }
            });

        case types.UPDATE_MAPPING_SUCCESS:
            const removeUpdated = state.filter(m => m.name !== action.mapping.name);
            console.info(action.mapping);
            return [...removeUpdated, action.mapping];

        case types.DELETE_MAPPING_SUCCESS:
            console.info("DELETE_MAPPING_SUCCESS!");
            return state.filter(m => m.name !== action.removed);

        default:
            return state;
    }
}