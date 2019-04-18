import axios from 'axios';

import Urls from "../common/urls";
import ActionTypes from "../common/ActionTypes";

const UserActions = {
    getUsers: (dispatch) => {
        axios.get(`${Urls.API_URL}/users`)
            .then(response => {
                dispatch({type: ActionTypes.USER.GET, payload: response.data});
            })
            .catch(error => console.log(error))
    },
    addUser: (dispatch, user) => {
        axios.post(`${Urls.API_URL}/users`, user)
            .then(response => {
                dispatch({type: ActionTypes.USER.ADD, payload: response.data})
            })
            .catch(error => console.log(error));
    },
    deleteUser: (dispatch, id) => {
        console.log(id);
        axios.delete(`${Urls.API_URL}/users/${id}`)
            .then(response => dispatch({type: ActionTypes.USER.REMOVE, payload: id}))
            .catch(error => console.log(error));
    }
};

export default UserActions;