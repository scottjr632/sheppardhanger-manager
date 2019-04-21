import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';


class Navi extends React.Component {

    constructor(props) {
        super(props)
         this.state = {
             currentKey: 1
         }

    }

    componentDidMount(){
        switch(window.location.pathname) {
            case '/dashboard':
            this.setState({
                currentKey: 1
            })
            break
            case '/user/alerts':
            this.setState({
                currentKey: 2
            })
            break
            case '/stocks':
            this.setState({
                currentKey: 3
            })
            break
            default:
            break
         }
    }


    handleSelect = (selectedKey) => {
        this.setState({
            currentKey: selectedKey
        })
    }

    render() {
        return (
            <header>
                <div className={'pull-left header-title'}>
                    Sheppard Hanger Manager
                </div>
                <div className={'pull-right nav__link'}>
                    <a className={this.state.currentKey === 1 ? 'active' : ''}>Home</a>
                    <a className={this.state.currentKey === 2 ? 'active' : ''}>Admin</a>
                </div>
            </header>
        )
    }
}

Navi.propTypes = {
    userName: PropTypes.string.isRequired, 
    loggedIn: PropTypes.bool.isRequired, 
    onLogout: PropTypes.func.isRequired
}

export default withRouter(Navi);