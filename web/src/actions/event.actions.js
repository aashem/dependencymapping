import * as graphHelpers from '../common/graph-helpers';
import * as activeMappingActions from './active-mapping.actions';

/**
 *  Compound actions.
 */

export function clearGraphAndActiveMapping(){
   return function(dispatch, getState){
       dispatch(activeMappingActions.clearActiveMappingSelection());
       graphHelpers.clearGraph(getState().graph);
   }
}

