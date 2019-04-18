import React, {useContext, useEffect, useState} from 'react';

import './Users.css'
import {AppContext} from '../../contexts/app.context'
import UserActions from "../../actions/user.actions";
// import PropTypes from 'prop-types';

const Users = (props) => {
    const {state, dispatch} = useContext(AppContext);
    const [userName, setUserName] = useState('');
    const [userAge, setUserAge] = useState(0);
    useEffect(() => {
        UserActions.getUsers(dispatch);
    }, []);

    const renderOptions = (users) => {
        if (users && users.length) {
            return users.map((user) => {
                return (
                    <li key={user.id}>
                        <span>{user.name} - {user.age} </span>
                        <button
                            onClick={() => UserActions.deleteUser(dispatch, user.id)} >Delete
                        </button>
                    </li>
                );
            })
        }
    };

    return (
        <div className='Users'>
            <ul style={{cursor: 'pointer'}}>
                {renderOptions(state.users)}
            </ul>
            <br/>
            <input type="text"
                   placeholder='Enter the name'
                   onChange={(e) => {
                       setUserName(e.target.value);
                   }}/>
            <br/>
            <br/>
            <input type="text"
                   placeholder='Enter the age'
                   onChange={(e) => {
                       setUserAge(+e.target.value);
                   }}/>
            <br/>
            <br/>
            <button onClick={() => {
                UserActions.addUser(dispatch,{name: userName, age: userAge});
            }}
            >Add user
            </button>
        </div>
    );
};

Users.propTypes = {};

export default Users;