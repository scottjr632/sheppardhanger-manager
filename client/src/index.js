import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router } from 'react-router-dom';
import createHistory from 'history/createHashHistory';
import { Provider } from 'mobx-react'
import axios from 'axios'

import { stores } from './stores'

const App = React.lazy(() => import('./App'))

import './index.scss';

// const { createHistory } = require('history')
require('dotenv').config()

axios.defaults.baseURL = '/api/v1'

ReactDOM.render(
    <Provider {...stores} >
        <Router history={createHistory()}>
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <App />
                </Suspense>
            </div>
        </Router>
    </Provider>,
document.getElementById('root')
);

serviceWorker.register();
