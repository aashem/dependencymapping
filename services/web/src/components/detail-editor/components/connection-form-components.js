import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import * as detailEditorActions from '../detail-editor.actions';

import {Label, SelectionField, Select, FieldsContainer} from "../detail-editor.styled";

import TagSelection from "./TagSelection";
import DescriptionTextarea from "./DescriptionTextarea";

export const ConnectionSelections = () => (
    <React.Fragment>
        <TagSelection/>
    </React.Fragment>
);

export const WrapFields = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  padding: 6px 0; 
  background-color: ${p => p.theme.formFieldBackgroundColor};
  flex-shrink: 1;
  align-content: flex-start;
   border: 1px solid rgba(255,255,255,0.15);
   border-radius: 3px;
`;

export const ConnectionFormGrid = styled.div`
  display: grid;
  grid-template:
   min-content
   min-content
   1fr
  / 1fr;
  height: 100%;
`;

const Input = styled.input`
  flex-grow:1;
  height: 1rem;
  margin-right: 6px;
`;

const FlexRow = styled.div`
  display: flex;
  padding: 6px 0;
  align-items: center;
   padding: 6px; 
  margin-bottom: 6px;
  background-color: ${p => p.theme.formFieldBackgroundColor};
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 3px;

`;

const Box = styled.div`
  display: flex;
  border: ${p => p.theme.insetBorder};
  border-radius: 3px;
  padding: 3px;
  align-items: center;
`;

const FormBox = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 6px; 
  margin-bottom: 6px;
  background-color: ${p => p.theme.formFieldBackgroundColor};
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 3px;

`;

export const ConnectionForm = (props) => (
    <React.Fragment>
        <ConnectionFormGrid>
            <FormBox>
            <AssetSelectOrLabel
                label={"source"}
                onChange={props.onSourceSelection}
                selected={props.source.name}
                error={props.errors.source}
                {...props}/>

            <AssetSelectOrLabel
                label={"target"}
                error={props.errors.target}
                selected={props.target.name}
                onChange={props.onTargetSelection}
                {...props}/>
            </FormBox>
            <FlexRow>

                <Label>edge </Label>
                    <Label>label</Label>
                <Input
                    value={props.edgeLabel}
                    onChange={(e) => props.onEdgeLabelChange(e.target.value)}
                    type="text"/>
                <Label>arrows</Label>
                    <Box>
                    <Label>source</Label>
                    <input
                        type="checkbox"
                        checked={props.sourceArrow}
                        onChange={props.toggleSourceArrow}
                    />
                    <Label>target</Label>
                    <input
                        type="checkbox"
                        checked={props.targetArrow}
                        onChange={props.toggleTargetArrow}
                    />
                    </Box>
            </FlexRow>
            <DescriptionTextarea/>
        </ConnectionFormGrid>
    </React.Fragment>
);

type SelectAssetProp = { selected: string, edit: boolean, error: string | null };

export const AssetSelectOrLabel = (props: SelectAssetProp) => (
    props.edit ? <div>{props.selected}</div> : <SelectAsset {...props}/>
);


function mapStateToProps(state, props) {
    return {
        edit: state.detailForm.edit,
        assets: state.assets.map(asset => asset.name),
        source: state.detailForm.source,
        target: state.detailForm.target,
        sourceArrow: state.detailForm.sourceArrow,
        targetArrow: state.detailForm.targetArrow,
        edgeLabel: state.detailForm.edgeLabel,
        errors: state.detailForm.errors
    }
}


function mapDispatchToProps(dispatch) {
    return {
        onSourceSelection: (value: string) => dispatch(detailEditorActions.onSourceSelection(value)),
        onTargetSelection: (value: string) => dispatch(detailEditorActions.onTargetSelection(value)),
        onEdgeLabelChange: (value: string) => dispatch(detailEditorActions.onEdgeLabelChange(value)),
        toggleSourceArrow: ()              => dispatch(detailEditorActions.toggleSourceArrow()),
        toggleTargetArrow: ()              => dispatch(detailEditorActions.toggleTargetArrow())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectionForm);

const SelectAsset = (props) => (
    <SelectionField id={"select-asset-group"}>
        <Label
            color={props.error ? 'red': null}
            for={`${props.label}-asset`}
        >{props.label}</Label>
        <Select
            selected={"none"}
            onChange={(e) => {
                this.selected = e.target.value;
                props.onChange((e.target.value: string));
            }}>
            <option value="" disabled selected>Select asset</option>
            {props.assets.map(option => (
                <option
                    selected={option === props.selected}
                    value={option}
                >{option}</option>))}
        </Select>
    </SelectionField>
);