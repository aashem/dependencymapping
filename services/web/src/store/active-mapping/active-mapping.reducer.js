import * as types from './active-mapping.action-types';
import initialState from '../../reducers/initialState';
import _ from 'lodash';

export default function activeMappingReducer(state = initialState.activeMapping, action){
    switch(action.type) {

        case types.SET_ACTIVE_MAPPING:
            return action.mapping;


        case types.ADD_ACTIVE_MAPPING_ASSETS:
        
            // do not allow duplicates   
            let assetsToAdd = []

            action.assets.forEach(
                // for every asset that is going to be add
                // check that it is not already included in
                // the current active mapping
                newAsset => {
                    if (!_.find(state.assets, assetName => assetName === newAsset.name)){
                        // if asset can not be found from the current mapping
                        assetsToAdd.push(newAsset.name);
                    }
                }
            );
            
            return {...state, assets: [...state.assets, ...assetsToAdd]}

        case types.ADD_ACTIVE_MAPPING_ASSET:
            return { ...state, assets: [ ...state.assets, action.asset ]}

        case types.REMOVE_ACTIVE_MAPPING_ASSET:
            // remove the given resource from active mapping resources
            const filteredAssets = state
                .assets.filter(asset => asset !== action.asset.name);
            return { ...state, assets: filteredAssets };

        case types.CLEAR_ACTIVE_MAPPING_SELECTION:
            return {name: "no selection", resources:[], tags: []};

        case types.GROUP_BY_TAG:
            return {
                ...state,
                grouped: [...state.grouped, action.tagName]
            };

        case types.UNGROUP_BY_TAG:
             return {
                 ...state,
                 grouped: [...state.grouped.filter(t => t !== action.tagName)]
             };

        default:
            return state;
    }
}