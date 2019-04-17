import React, {useEffect, useState} from 'react';

import axios from 'axios';
import PropTypes from 'prop-types';

import './Users.css'
import Urls from "../../common/urls";

const Users = (props) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get(`${Urls.API_URL}/users`)
            .then(response => {

            })
            .catch(error => console.log(error))
    }, []);

    return (
        <div className='Users'>

        </div>
    );
};

Users.propTypes = {

};

export default Users;