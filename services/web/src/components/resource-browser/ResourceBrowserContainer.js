//@flow

import {connect} from 'react-redux'
import React, {Component} from 'react';

import {ASSET, CONNECTION, TAG} from '../../constants/types';
import * as resourceHelpers from './../../common/resource-helpers';
import ResourceDetail from '../resource-detail/ResourceDetailContainer';

import type {Asset, Connection, Tag} from '../../store/types';
import resourceBrowserCtrl from './resource-browser.controller';

import {ResourceBrowser} from './components/components';

import {
    BrowserGrid,
    ResourceBrowserLayout,
} from './resource-browser.styled.js';

type Props = {
    assets: Array<Asset>,
    connections: Array<Connection>,
    tags: Array<Tag>,
    selected: ASSET | CONNECTION | TAG,
    //  todo: specify the following
    activeDetail: any,
    setActiveDetail: (any) => void,
    typeToItemsMap: any,
}

type State = {
    filterValue: string,
    selected: ASSET | CONNECTION | TAG
}

class ResourceBrowserContainer extends Component <Props, State> {

    state = {
        filterValue: "",
        selected: this.props.selected,
    };

    onFilterChange(e) {
        console.info(e.target.value);
        this.setState({filterValue: e.target.value.toLowerCase()});
    }

    render() {

        const {filterValue, selected} = this.state;

        // todo: refactor all to selected
        const resourceTypes = selected;

        const listItems = resourceTypes === CONNECTION ?
            // todo: filter connections
            this.props.typeToItemsMap[resourceTypes]
            : resourceHelpers.filterByName({
                objectList: this.props.typeToItemsMap[resourceTypes] || [],
                filterValue
            });

        return (
            <BrowserGrid id="resource-browser__layout">
                <ResourceBrowser
                    tabItems={tabs}
                    listItems={listItems}
                    selected={selected}
                    activeDetail={this.props.activeDetail}
                    onSelect={(selected) => this.setState({selected})}
                    onFilterChange={this.onFilterChange.bind(this)}
                    setActiveDetail={this.props.setActiveDetail}
                />
                <ResourceDetail/>
            </BrowserGrid>
        );
    }
}

const tabs = [
    {label: "Assets", type: ASSET},
    {label: "Connections", type: CONNECTION},
    {label: "Tags", type: TAG},
];

export default connect(
    resourceBrowserCtrl.mapStateToProps,
    resourceBrowserCtrl.mapDispatchToProps
)(ResourceBrowserContainer);

