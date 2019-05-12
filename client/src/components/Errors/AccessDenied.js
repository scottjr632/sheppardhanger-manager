import React from 'react';
import PropTypes from 'prop-types'

import * as backend from '../../backend'


export default class AccessDenied extends React.Component {

    componentWillMount() {
        backend.authenticate(status => {
            if (status !== 200) {
                this.props.history.push('/login')
            }
        })
    }
    render(){ return(<div />) }
}

AccessDenied.propTypes = {
    history: PropTypes.object.isRequired
}