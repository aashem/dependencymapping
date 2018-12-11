import React from 'react';

import { ASSET, CONNECTION, TAG } from '../../../constants/types';

import {
    ListItemBox,
    ResourceBrowserLayout,
    BrowserContainer,
    ListTab,
    ListTabs,
    ListContainer
} from '../resource-browser.styled.js';

import {FilterInputField} from '../../common.components';

export type Selected = ASSET | CONNECTION | TAG

export type ListItemProps = {
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
    tabItems: Array<{label: string, type: string}>,
    listItems: Array<Asset> | Array<Connection> | Array<Tag>,
    selected: Selected,
    onSelect: (any) => void,
    onFilterChange: (any) => void,
    setActiveDetail: (any) => void,
}



export const ListTabItems = ({items, selected, onSelect}) => (
    <ListTabs>
        {items.map(item => (
            <ListTab
                onClick={() => onSelect(item.type)}
                selected={selected === item.type}>{item.label}
            </ListTab>
        ))}
    </ListTabs>
);

export const ResourceBrowser = (props: BrowserProps) => (
    <BrowserContainer>
        <ListTabItems
            items={props.tabItems}
            selected={props.selected}
            onSelect={props.onSelect}
        />

        <FilterInputField
            type="text"
            placeholder="filter..."
            onChange={props.onFilterChange}
        />
        
        <ResourceList 
            onClick={props.setActiveDetail}
            listItems={props.listItems}
            selected={props.selected}
        />
    </BrowserContainer>
);



export const AssetList = (props: ResourceListProps) => (
    props.selected !== ASSET ? null :  
        props.listItems.map((item, i) => (
            <AssetListItem 
                key={i}
                item={item}
                {...props}
            />
        )
    )
)

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
) 

export const TagList = (props: ResourceListProps) => (
    props.selected !== TAG ? null :  
        props.listItems.map((item, i) => (
            <TagListItem 
                key={i}
                item={item}
                {...props}
            />
        )
    )
)


export const ResourceList = (props: ResourceListProps) =>(
    <ListContainer>
        <AssetList      {...props}/>
        <ConnectionList {...props}/>
        <TagList        {...props}/>
    </ListContainer>
)


export const ListItemByName = (props: ListItemProps) => (
    <ListItemBox
        selected={props.selected}
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

export const ConnectionListItem = (props: ListItemProps) => (
    <ListItemBox
        onClick={() => 
            props.onClick({
                data: props.item,
                type: props.selected
            }
        )}
    >
        {`${props.item.source} -> ${props.item.target}`}
    </ListItemBox>
)

export const TagListItem = ListItemByName;

    