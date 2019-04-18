import ActionTypes from '../common/ActionTypes';

export const initialState = {users: []};

export const reducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.USER.GET:
            return {...state, users: action.payload};
        case ActionTypes.USER.ADD: {
            const users = state.users.concat(action.payload);
            return {...state, users: users};
        }
        case ActionTypes.USER.REMOVE: {
            const users = state.users.filter(user => user.id !== action.payload);
            return {...state, users: users};
        }
        default:
            return state;
    }
};