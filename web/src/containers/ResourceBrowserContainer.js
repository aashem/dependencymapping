import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as actionCreators from '../actions/graphActions';
import styled from 'styled-components';
import * as l from '../components/layout';
import * as types from '../constants/types';
import {isResourceInMapping} from '../common/resource-helpers';
import {
    addElement, nodeElementFromResource,
    removeElement, updateLayout
} from "../common/graph-helpers";

import ResourceDetail from './ResourceDetail';

class ResourceBrowserContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterValue: ""
        };

        this.addResourceToMapping = this.addResourceToMapping.bind(this);
        this.removeResourceFromMapping = this.removeResourceFromMapping.bind(this);
        this.filterResources = this.filterResources.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
    }

    addResourceToMapping(resource) {
        this.props.addResourceToActiveMapping(resource);
        const node = nodeElementFromResource(resource);
        addElement(this.props.cyRef, node);
        updateLayout(this.props.cyRef);
    }

    removeResourceFromMapping(resource) {
        this.props.removeResourceFromActiveMapping(resource);
        removeElement(this.props.cyRef, resource.name);
    }

    filterResources({resources, filterValue}) {
        return resources.filter(r => r.name.toLowerCase().includes(filterValue));
    }

    onFilterChange(e) {
        console.info(e.target.value);
        this.setState({filterValue: e.target.value.toLowerCase()});
    }

    render() {
        const {resources} = this.props;
        const {filterValue} = this.state;
        const isResourceInMap = isResourceInMapping({
            mapping: this.props.activeMapping,
            resourceId: this.props.detail.name
        })

        const resourceItems = this.filterResources({resources, filterValue});
        return (

            <ResourceBrowserLayout>
                <l.LayoutRow justify={'center'}>

                    <ResourceBrowser>

                        <FilterInput
                            type="text"
                            placeholder="filter..."
                            onChange={this.onFilterChange}/>

                        <ResourceList>
                            {
                                resourceItems.map((r,i) => (
                                        <ResourceListItem
                                            key={i}
                                            selected={r.name === this.props.detail.name}
                                            onClick={() => this.props.setDetail({detail: r.name, type: types.RESOURCE})}
                                        >{r.name}
                                        </ResourceListItem>
                                    )
                                )
                            }</ResourceList>
                    </ResourceBrowser>

                    <ResourceDetail
                        editDetail={this.props.editDetail}
                        detailType={this.props.type}
                        detail={this.props.detail}
                        setDetail={this.props.setDetail}
                        setResourceDetail={this.props.setResourceDetail}
                        isResourceInMap={isResourceInMap}
                        addResourceToActiveMapping={this.addResourceToMapping}
                        removeResourceFromActiveMapping={this.removeResourceFromMapping}
                    />
                </l.LayoutRow>
            </ResourceBrowserLayout>
        );
    }
}

ResourceBrowserContainer.propTypes = {
    cyRef: PropTypes.object.isRequired,
    addResourceToActiveMapping: PropTypes.func.isRequired,
    removeResourceFromActiveMapping: PropTypes.func.isRequired,
    setDetail: PropTypes.func.isRequired,
    editDetail: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps = {}) => {
    return {
        resources: state.resources,
        activeMapping: state.activeMapping
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({...actionCreators}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceBrowserContainer);

const FilterInput = styled.input`
  background-color: transparent;
  text-align: center;
  max-width: 200px;
  width: 80%;
  border: none; 
  border-bottom: 1px solid grey; 
  margin: 0 8px 8px 0;
  color: rgba(255,255,255,0.6);

  :focus::placeholder{
    color: transparent;
  }
`;


const ResourceBrowserLayout = styled.div`
  width: 100%;
  height: 100%;
  color: rgba(255,255,255,0.8);

`;
const ResourceBrowser = styled.div`
 display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    width:33%;
    min-width: 16em;
    margin-right: 12px;
    border-radius: 3px;

`;

const ResourceList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    width:33%;
    min-width: 16em;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-right: 12px;
    border-radius: 3px;

`;

const ResourceListItem = styled.div`
    font-size: small;
    text-align: center;
    padding: 2px;
    cursor: pointer;
    margin: 2px 4px;
    width: 100%;
    border-radius: 3px;
    background: ${props => props.selected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'};
    :hover{
        background: rgba(255,255,255, 0.35);
    }
`;

