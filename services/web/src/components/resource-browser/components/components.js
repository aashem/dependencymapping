import React from 'react';

import {ASSET, CONNECTION, TAG} from '../../../constants/types';

import {
    ListItemBox,
    ResourceBrowserLayout,
    BrowserContainer,
    ListTab,
    ListTabs,
    ListContainer
} from '../resource-browser.styled.js';

import {FilterInputField} from '../../common.components';
import styled from 'styled-components';

export type Selected = ASSET | CONNECTION | TAG

export type ListItemProps = {
    activeDetail:  {
        type: ASSET | CONNECTION | TAG,
        data: Asset | Connection | Tag
    },
    item: Asset | Connection | Tag,
    itemType: Selected,
    selected: Selected,
    onClick: (any) => void,
}

export type ResourceListProps = {
    selected: Selected;
    listItems: Array<Asset> | Array<Connection> | Array<Tag>,
    onClick: (any)  => void,
    ...ListItemProps
}

type BrowserProps = {
    activeDetail: {
        type: ASSET | CONNECTION | TAG,
        data: Asset | Connection | Tag
    },
    tabItems: Array<{ label: string, type: string }>,
    listItems: Array<Asset> | Array<Connection> | Array<Tag>,
    selected: Selected,
    onSelect: (any) => void,
    onFilterChange: (any) => void,
    setActiveDetail: (any) => void,
}


type ListTabItemsProps = {
    items: Array<{ label: string, type: ASSET | CONNECTION | TAG }>,
    selected: ASSET | CONNECTION | TAG,
    onSelect: (string) => void
}

export const ListTabItems = (props: ListTabItemsProps) => (
    /**
     *  Resource browser list tabs for changing
     *  the resource types in the list
     */
    <ListTabs>
        {props.items.map((item,index) => (
            <ListTab
                key={index}
                onClick={() => props.onSelect(item.type)}
                selected={props.selected === item.type}>{item.label}
            </ListTab>
        ))}
    </ListTabs>
);

export const ResourceBrowser = (props: BrowserProps) => (
    <BrowserContainer>
        <ListTabItems
            id={"resource-list-nav"}
            items={props.tabItems}
            selected={props.selected}
            onSelect={props.onSelect}
        />

        <FilterInputField
            id={"resource-list-filter"}
            type="text"
            placeholder="filter..."
            onChange={props.onFilterChange}
        />

        <ResourceList
            id={"resource-list"}
            onClick={props.setActiveDetail}
            listItems={props.listItems}
            selected={props.selected}
            activeDetail={props.activeDetail}
        />
    </BrowserContainer>
);


export const AssetList = (props: ResourceListProps) => (
    props.selected !== ASSET ? null :
        props.listItems.map((item, i) => (
                <AssetListItem
                    isSelected={props.activeDetail.data.name === item.name}
                    key={i}
                    item={item}
                    {...props}
                />
            )
        )
);

export const ConnectionList = (props: ResourceListProps) => (
    props.selected !== CONNECTION ? null :
        props.listItems.map((item, i) => (
                <ConnectionListItem
                    key={i}
                    item={item}
                    {...props}
                />
            )
        )
);

export const TagList = (props: ResourceListProps) => (
    props.selected !== TAG ? null :
        props.listItems.map((item, i) => (
                <TagListItem
                    isSelected={props.activeDetail.data.name === item.name}
                    key={i}
                    item={item}
                    {...props}
                />
            )
        )
);


export const ResourceList = (props: ResourceListProps) => (
    <ListContainer id={props.id}>
        <AssetList      {...props}/>
        <ConnectionList {...props}/>
        <TagList        {...props}/>
    </ListContainer>
);


export const ListItemByName = (props: ListItemProps) => (
    <ListItemBox
        selected={props.isSelected}
        onClick={() =>
            props.onClick({
                data: props.item,
                // selected tab 
                type: props.selected
            })
        }
    >{props.item.name}
    </ListItemBox>
);

export const AssetListItem = ListItemByName;

// logic for ConnectionListItem selected field
function connectionIsActiveDetail(item, activeDetail) {
    try {
        if (activeDetail.type === CONNECTION) {
            return item.source === activeDetail.data.source.name
                && item.target === activeDetail.data.target.name
        } else {
            return false;
        }
    } catch (err){
        console.warn(err)
    }
}

export const ConnectionLabel =  styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45%;
    background: rgba(180,180,255,0.2);
    letter-spacing: 0.05rem;
    overflow: hidden;
  }
`;

export const ConnectionListItem = (props: ListItemProps) => (
    <ListItemBox
        selected={connectionIsActiveDetail(props.item, props.activeDetail)}
        onClick={() =>
            props.onClick({
                    data: props.item,
                    type: props.selected
                }
            )}
    >
        <ConnectionLabel>
            <span>{props.item.source}</span>
            >
            <span>{props.item.target}</span>
        </ConnectionLabel>
    </ListItemBox>
);

export const TagListItem = ListItemByName;

    