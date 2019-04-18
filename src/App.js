import React, {useReducer} from 'react';


import {initialState, reducer} from './stores/user.store';
import {AppContext} from './contexts/app.context';

import './App.css';
import Users from "./components/Users/Users";

const App = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <div className="App">
            <AppContext.Provider value={{dispatch, state}}>
                <Users/>
                <Users/>
            </AppContext.Provider>
        </div>
    );
};


export default App;
