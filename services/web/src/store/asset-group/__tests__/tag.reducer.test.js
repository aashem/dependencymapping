import assetGroupReducer from '../asset-group.reducer';
import * as actions from '../asset-group.actions';
it("todo", ()=> expect(true).toBe(true))
/*
const initialState = [
    {name: "Tag one", description: "describing one"},
    {name: "Tag two", description: "describing two"},
];

test('Tag reducer returns initialState as default', () => {
    const state = tagReducer(initialState, {});
    expect(state).toEqual(initialState);
});

test('Tag should be removed from the store after success the tag with name t.name', () => {
    const state = tagReducer(
        initialState,
        actions.deleteTagSuccess({tagName: initialState[1].name})
    );
    const expected = [initialState[0]];
    expect(state).toEqual(expected)
});

test('New tag should be added to the state after addTag(tag)', () => {
    const newTag = {name: "Tag three", description: "describing three"};
    const state = tagReducer(
        initialState,
        actions.postTagSuccess(newTag)
    );
    const expected = [newTag, ...initialState];
    expect(state).toEqual(expected);
});

test('Update tag should update the tag with the same name', () => {
   const updatedTag = {...initialState[0], description: "updated description"};
   const state = tagReducer(
       initialState,
       actions.updateTagSuccess({tag: updatedTag})
   );
   const expectedUpdate = state.filter(t => t.name === updatedTag.name)[0];
   expect(updatedTag).toEqual(expectedUpdate);
});

test('Load tags success should returns passed tags', () => {
   const state = tagReducer(
       [],
       actions.loadTagsSuccess(initialState)
   );
   expect(state).toEqual(initialState);
});*/