import * as actions from './resource-controller.actions';
import * as actionsAsset from '../../store/asset/asset.actions';
import * as actionsMapping from '../../actions/mapping.actions';
import * as actionsTag from '../../store/tag/tag.actions';
import * as actionsActiveDetail from '../../store/active-detail/active-detail.actions';
import * as types from '../../constants/types';


const formActions = (dispatch) => ({
    [types.ASSET]: {
        post: (asset) => dispatch(actionsAsset.postAsset(asset)),
        put: (asset) => dispatch(actionsAsset.updateAsset(asset)),
        remove: (asset) => dispatch(actionsAsset.deleteAsset(asset)),
        parseForm: (form) => ({
            name: form.name,
            description: form.description,
            connected_to: form.resources,
            tags: form.tags,
            group: form.group,
            shape: form.shape,
            color: form.color,
        })
    },
    [types.MAPPING]: {
        post: (mapping) => dispatch(actionsMapping.postMapping(mapping)),
        put: (mapping) => dispatch(actionsMapping.updateMapping(mapping)),
        remove: (mapping) => dispatch(actionsMapping.deleteMapping(mapping)),
        parseForm: (form) => form,
    },

    [types.TAG]: {
        post: (tag) => dispatch(actionsTag.postTag(tag)),
        put: (tag) => dispatch(actionsTag.updateTag(tag)),
        remove: (tag) => dispatch(actionsTag.deleteTag(tag)),
        parseForm: (form) => ({
            name: form.name,
            description: form.description
        })
    }
});


function mapStateToProps(state, props) {
    console.info(props);
    console.info(state);
    return {
        activeDetail: state.activeDetail,
        types: types,
        formEdit: state.app.form.edit,
        formType: state.app.form.type,
        assets: state.assets,
        assetNameList: state.assets.map(r => r.name),
        tagNameList: state.tags.map(t => t.name)
    }
}

function dispatchToProps(dispatch) {
    return {
        formActions: formActions(dispatch),
        clearActiveDetail: () => dispatch(actionsActiveDetail.clearActiveDetail()),
        closeEdit: () => dispatch(actions.closeEdit()),
        closeFormAndSetActiveDetail: (detail) => dispatch(
            actions.closeFormAndSetActiveDetail(detail)
        ),
    }
}

export default {
    mapStateToProps: (state, props) => mapStateToProps(state, props),
    dispatchToProps: (dispatch) => dispatchToProps(dispatch),
}