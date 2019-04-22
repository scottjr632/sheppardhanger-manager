
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router } from 'react-router-dom';
import createHistory from 'history/createHashHistory';
import { Provider } from 'mobx-react'
import axios from 'axios'

import { stores } from './stores'

import './index.scss';

require('dotenv').config()

axios.defaults.baseURL = '/api/v1'

ReactDOM.render(
    <Provider {...stores} >
        <Router history={createHistory()}>
            <div>
                <App />
            </div>
        </Router>
    </Provider>,
document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
