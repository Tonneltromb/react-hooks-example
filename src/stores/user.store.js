import ActionTypes from '../common/ActionTypes';

export const initialState = {users: []};

export const reducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.USER.GET:
            return {...state, users: action.payload};
        case ActionTypes.USER.REMOVE:
            return {...state, users: action.payload};
        default:
            return state;
    }
};