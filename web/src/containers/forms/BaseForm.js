import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {handleResponse, handleError} from "./response.handlers";
import {getSelected, selectOptionsInList} from './form.helpers';
import * as validators from '../../common/validators';

import * as types from '../../constants/types';
import * as parser from '../../common/parser';

class BaseForm extends Component {
        constructor(props) {
        super(props);
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.handleResponsePromise = this.handleResponsePromise.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.clearErrors = this.clearErrors.bind(this);
        this.actionPost = this.actionPost.bind(this);
        this.actionUpdate = this.actionUpdate.bind(this);
        this.actionDelete = this.actionDelete.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.state = {
            name: "",
            description: "",
            resources: [],
            categories: [],
            error: {},
            type: types.EMPTY,
            selections: true // if there's the selects
        }
    }

    componentDidMount() {
        if (this.props.edit) {
            // if form is opened to edit a resource
            // map the resource properties to starting values
            this.setState({
                name: this.props.detail.name,
                description: this.props.detail.description
            });


            // if mapping has resources map the selection
            if (this.props.detail.resources) {
                const resourceNameList = this.props.detail.resources.map(
                    r => r.name
                );
                const resourceOptions = this.inputResources.options;
                selectOptionsInList({
                    list: resourceNameList,
                    options: resourceOptions
                });
            }

            // if mapping has categories map the selection
            if (this.props.detail.categories) {
                const categoryNameList = this.props.detail.categories.map(
                    c => c.name
                );
                const categoryOptions = this.inputCategories.options;
                selectOptionsInList({
                    list: categoryNameList,
                    options: categoryOptions
                });
            }
        }
    }



    handleResponsePromise(promise) {
        const response = promise.then((response) => {
            /** todo: refactor to more logical */

            // this is empty if no error
            const handledResponse = handleResponse({
                response,
                setDetail: this.props.setDetail,
                detailType: this.state.type,
                setView: this.props.setView,
                closeForm: this.props.cancel
            });
            const error = handledResponse? handledResponse.error : false;
            if (error) {
                this.setState({error: handledResponse.error});
            }
        }).catch(error => {
            console.warn(error);
            throw new Error('Unhandled error!');
            alert('unhandled error!');
        });

    }

    getFormData() {
        const name = this.state.name;
        const description = this.state.description;


        if (this.state.selections){
            const resourceIds = getSelected(this.inputResources.options);
            const tags = getSelected(this.inputTags.options);
            const resources = parser.filterResourcesByIds({
                ids: resourceIds,
                resources: this.props.resources
            });

            const form = {name, description, resources, tags};
            console.info(form)
            return form;
        }

        return {name, description};
    }

    clearErrors() {
        this.setState({error: {}});
    }

    exists({id, set}){
            throw new Error('Implement notExist');
    }

    actionPost(form){
            throw new Error('Implement actionPost');
    }

    actionUpdate(form){
            throw new Error('Implement actionUpdate');
    }

    actionDelete(form){
            throw new Error('Implement remove')
    }

    onSave() {
        if (this.validateForm()) {
            const form = this.getFormData();
            const nameReserved = this.exists({id: form.name, set: this.props.mappings});

            if (nameReserved || this.props.edit) {
                const responsePromise = this.actionUpdate(form);
                this.handleResponsePromise(responsePromise);
            } else {
                const responsePromise = this.actionPost(form);   // handle actionPost
                this.handleResponsePromise(responsePromise);
            }
        }
        // if mapping stored successfully return to browse view

        else {
            this.toggleValidation();
        }
    }

    onDelete({name}) {
        const userReallyWantsToDelete = window.confirm("Do you really want to delete " + name + "?");
        if (userReallyWantsToDelete) {
            const responsePromise = this.actionDelete({name});
            this.handleResponsePromise(responsePromise);
        }
    }

    toggleValidation() {
        this.setState({check: true});
    }

    validateForm() { // same as mapping
        const nameValid = validators.validMappingName(this.state.name);
        const descriptionValid = validators.validDescription(this.state.description);
        return nameValid && descriptionValid;
    }

    render() {
        return null;
    }
}


BaseForm.propTypes = {
    updateMapping: PropTypes.func.isRequired,
    detail: PropTypes.object,
    cancel: PropTypes.func.isRequired,
    setView: PropTypes.func.isRequired
};



export default BaseForm;