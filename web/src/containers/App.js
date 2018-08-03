import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';

import {
    Layout,
    ButtonPanel,
    LayoutRow,
    LayoutCol,
    SidePanel,
    ContentWindow,
    TopBar,
    FloatingButton,
} from '../components/';
import GraphContainer from './GraphContainer';
import {Menu} from './SideTabMenuContainer';
import {
    addElement, addElements, updateLayout, clearGraph, nodeElementFromResource,
    hoverIndicationOff, hoverIndicationOn
} from '../common/graph-helpers';
import {getResourceById, getAllResourcesWithTag} from "../common/resource-helpers";
import * as actionCreators from '../actions/index';
import * as parser from '../common/parser';
import _ from 'lodash';
import * as constants from '../constants/';
import BottomPaneContainer from './BottomPanelContainer';
import * as texts from '../data/text';
import * as events from '../common/graph.events';
import * as types from '../constants/types';
import styled from 'styled-components';
import {layoutOptions} from "../configs/configs.cytoscape";



const LAYOUT = 'cola';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cy: null,
            vis: null,
            resourceCategories: [],
            showGraphButtons: false,
            detail: texts.landingDetail,
            detailType: "",
            layout: LAYOUT,
            info: "I'm an info panel"
        };

        this.clearGraphSelection = this.clearGraphSelection.bind(this);
        this.setResourceDetail = this.setResourceDetail.bind(this);
        this.toggleFloatingButtons = this.toggleFloatingButtons.bind(this);
        this.setCategoryDetail = this.setCategoryDetail.bind(this);
        this.setDetail = this.setDetail.bind(this);
        this.saveMapping = this.saveMapping.bind(this);
        this.hoverResourceOff = this.hoverResourceOff.bind(this);
        this.hoverResourceOn = this.hoverResourceOn.bind(this);
        this.loadMappingOfTaggedResources = this.loadMappingOfTaggedResources.bind(this);
    }

    componentDidMount() {
        this.props.initGraph({
            eventHandlers: {
                tap: ['node', this.onNodeClick],
                mouseover: ['node', events.onNodeMouseOver],
                mouseout: ['node', events.onNodeMouseOut],
                cxttap: ['node', events.onCtxClick]
            }
        });

    }

    updateLayout() {
        const options = layoutOptions.cola;
        //const layout = this.state.cy.layout({name: this.state.layout, ...options});

        const layout = this.props.cy.layout({name: this.state.layout, ...options});
        layout.run();
    }

    setLayout(layout) {
        this.setState({layout: layout})
        this.updateLayout();
    }


    onNodeClick = (evt) => {
        // node click requires actions within the cy context
        // and also in the context of the resources

        // first we need to have the resource where our target node is
        // pointing and a list of resources that the
        // target resource is connected to.

        const resourceName = evt.target.id();

        this.setResourceDetail(resourceName);
        const clickedResource = getResourceById({
            id: resourceName,
            resources: this.props.resources
        });

        // the active mapping state needs to be updated by
        // adding the resources of the expanded node.
        this.props.addActiveMappingResources(clickedResource.connected_to);

        // required parameters for handling the graph update are
        // to have the reference of cy, target and the resource name
        // list to the target is connected to

        const targetNames = clickedResource.connected_to.map(r => r.name);
        events.onNodeClick({...evt, targetNames});
    }


    loadDependencyMap = (mapId) => {
        // load graph resources to the active mapping
        console.info('GwClientApi.getDependencyMap("' + mapId + '");');

        // current state of cy graph needs to be cleared
        clearGraph(this.props.cy);

        const mapping = this.props.mappings.filter(g => g.name === mapId)[0];

        // By default this is an array of objects.
        let resources = mapping ? mapping.resources : [];

        // Set mapping as active.
        this.props.loadActiveMappingResources(mapping);

        /**
         * This is because at the moment there's no back end solution.
         *  Current dev. environment returns mapping resources as objects,
         * which is not too efficient. Preferred method would be using
         * just an array of id's which would be used in a following manner.
         */
        if (_.isString(resources[0])) {
            // if resource is a string
            // map resource id's to resource objects
            resources = parser.filterResourcesByIds({
                ids: resources,
                resources: this.props.resources
            });
        }

        // objects for redux state
        const connections = parser.getConnectionsFromResources(resources);

        this.props.setActiveMappingConnections(connections);


        // json for graphing
        const edges = parser.parseEdgeElementsFromResources(resources);


        const nodes = resources.map(resource => nodeElementFromResource(resource));
        addElements(this.props.cy, nodes);
        addElements(this.props.cy, edges);

        this.props.setActiveDetail({data: mapping, type: constants.MAPPING});


        // this will be obsolete after refactoring is complete
        this.setState({detail: mapping, detailType: constants.MAPPING})

        this.updateLayout();
    };

    loadMappingOfTaggedResources = (tagId) => {

        this.setCategoryDetail(tagId);
        clearGraph(this.state.cy);
        const resources = getAllResourcesWithTag({tagId, resources: this.props.resources});
        const edges = parser.parseEdgeElementsFromResources(resources);
        const nodes = resources.map(resource => nodeElementFromResource(resource));
        addElements(this.state.cy, nodes);
        addElements(this.state.cy, edges);

        this.setState({info: "Mapping of resources containing tag: " + tagId + ", " + resources.length + " found."})
        this.updateLayout();
    };

    setDetail({detail, type, detailObject}) {
        // todo: refactor to store? CLEAN!
        console.info("App.setDetail({detail, type});");
        console.info(detail);
        console.info(type);
        console.info(detailObject);
        this.props.setActiveDetail({data: detail, type});
        if (detail === constants.EMPTY) {
            clearGraph(this.state.cy);
            this.setState({detail: {name: "no selection", description: "no selection"}});
            this.props.clearActiveMappingSelection();
            return;
        }
        switch (type) {
            case constants.MAPPING:
                this.loadDependencyMap(detail);
                break;
            case constants.ASSET:
                this.setResourceDetail(detail);
                break;
            case constants.TAG:
                this.setCategoryDetail(detail);
                break;
            default:
                break;
        }
    }


    setResourceDetail(resourceId) {
        const clickedResource = getResourceById({id: resourceId, resources: this.props.resources});
        // add attribute type to the object
        // this is needed when edit is used from detailview
        this.props.setActiveDetail({data: clickedResource, type: constants.ASSET});
        this.setState({detail: clickedResource, detailType: constants.ASSET});
    }

    setCategoryDetail(categoryId) {
        const clickedTag = this.props.tags.filter(r => r.name === categoryId)[0];
        this.props.setActiveDetail({data: clickedTag, type: constants.TAG});
        this.setState({detail: clickedTag, detailType: constants.TAG})
    }

    toggleFloatingButtons() {
        this.setState({showGraphButtons: !this.state.showGraphButtons});
    }

    clearGraphSelection() {
        clearGraph(this.props.cy)
        this.props.clearActiveMappingSelection();
    }

    addResourceToMapping(nameResource) {
        // create actionPost the mapping
        // this adds the resource to db
        const resource = this.props.postResource(nameResource);

        if (resource.error) {
            // if there's an error while doing so handle ui
        } else {
            // add the element to the visualization
            addElement({group: 'nodes', data: {id: resource.name}})
        }
    }

    saveMapping() {
        const {description, tags} = this.props.mappings.filter(g => g.name === this.props.activeMapping.name)[0];
        this.props.updateMapping({...this.props.activeMapping, description, tags});
    }

    downloadImage(cy) {
        // todo: cross-browser
        let downloadLink = document.createElement('a')
        downloadLink.href = cy.png({bg: 'white'});
        downloadLink.download = "mapping.png";
        downloadLink.click();
    }

    hoverResourceOn(id) {
        console.info("mouseover")
        hoverIndicationOn(this.props.cy, id);
    }

    hoverResourceOff(id) {
        console.info("mouseout")
        hoverIndicationOff(this.props.cy, id);
    }

    render() {
        console.info(this.props);
        const {type, data} = this.props.activeDetail;
        const activeDetailName = data.name;
        const mappings = this.props.mappings.map(m => m.name).sort();
        const tags = this.props.tags.map(c => c.name).sort();
        const activeResources = getResourceNameList(this.props.activeMapping.resources);
        const {cy} = this.props.cy;
        return (
            <Layout>
                <LayoutCol id="container-top" height={"60vh"}>
                    <TopBar>
                        <span>Dependency Mapper</span>
                        <span style={{fontSize: 'small'}}>{this.state.info}</span>
                        {/*<small>
              layout: 
                <span onClick={()=>this.setLayout('random')}>random</span>
                <span onClick={()=>this.setLayout('cola')}>physics</span>
                <span onClick={()=>this.setLayout('circle')}>circle</span>
                <span onClick={()=>this.setLayout('breadthfirst')}>r>breadthfirst</span>
          </small>*/}
                        <MenuToggle onClick={this.toggleFloatingButtons}>
                            &#9776;
                        </MenuToggle>
                    </TopBar>
                    <LayoutRow>

                        <SidePanel id="sidepanel">
                            <Menu
                                title="Mappings "
                                listItems={mappings}
                                onItemClick={this.loadDependencyMap}
                                selected={
                                    type === types.MAPPING ?
                                        activeDetailName : false
                                }
                            />


                        </SidePanel>

                        <SidePanel id="active-resources-list" wide>
                            <Menu
                                darkButtons
                                title={this.props.activeMapping.name ? this.props.activeMapping.name : 'Select Mapping'}
                                listItems={activeResources}
                                onItemClick={this.setResourceDetail}
                                onMouseOver={this.hoverResourceOn}
                                onMouseOut={this.hoverResourceOff}
                                selected={
                                    type === types.ASSET ?
                                        activeDetailName : false
                                }
                            />

                        </SidePanel>
                        <ContentWindow>
                            <GraphContainer elements={this.state.elements}/>
                        </ContentWindow>

                        {/* todo: refactor tool buttons  */}
                        <ButtonPanel buttons visible={this.state.showGraphButtons}>
                            <FloatingButton onClick={() => updateLayout(cy)}>refresh</FloatingButton>
                            <FloatingButton onClick={this.clearGraphSelection}>clear</FloatingButton>
                            <FloatingButton onClick={this.saveMapping}>save</FloatingButton>
                            <FloatingButton onClick={() => this.downloadImage(cy)}>download</FloatingButton>
                        </ButtonPanel>

                    </LayoutRow>
                </LayoutCol>
                <LayoutCol
                    id="container-bottom"
                    height={'40vh'}
                    align={'center'}
                    grow={1}>
                    <BottomPaneContainer
                        id="bottom-panel"
                        detail={this.state.detail}
                        detailType={this.state.detailType}
                        setResourceDetail={this.setResourceDetail}
                        setDetail={this.setDetail}
                        cy={this.props.cy}
                    />
                    {/*<PreviewAndFormsContainer detail={this.state.detail}/>*/}
                </LayoutCol>
            </Layout>
        );
    }
}

const getResourceNameList = (resources) => {
    //return resources.map(r=>r.url.split('/')[4]);
    return resources.map(r => r.name);
};


App.propTypes = {
    addActiveMappingResources: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps = {}) => {
    console.info(state);
    return {
        mappings: state.mappings,
        resources: state.resources,
        dependencies: state.dependencies,
        tags: state.tags,
        activeMapping: state.activeMapping,
        activeDetail: state.activeDetail,
        debug: state.debug,
        cy: state.graph
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({...actionCreators}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

const MenuToggle = styled.div`
    padding: 3px;
    margin-bottom: 2px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 3px;
    :hover {
      border-color: white;
    }    
    transition: all .3s ease-in-out;
`;

