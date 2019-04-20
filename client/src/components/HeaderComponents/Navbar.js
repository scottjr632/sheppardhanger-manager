import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Navbar from 'react-bootstrap/lib/Navbar';


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

    toUserPrefs = () => {
        this.props.history.push('/user/preferences')
    }

    handleSelect = (selectedKey) => {
        this.setState({
            currentKey: selectedKey
        })
    }

    render() {
        return (
            <header>
                <Navbar collapseOnSelect inverse>
                <Navbar.Header>
                    <Navbar.Brand >
                        <Link to='/'>Budget</Link>                    
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                {this.props.loggedIn && 
                <Navbar.Collapse>
                    <Nav  activeKey={this.state.currentKey}>
                        <NavItem 
                            componentClass={Link} 
                            href='/dashboard' 
                            to='/dashboard' 
                            onClick={this.handleSelect} 
                            onSelect={this.handleSelect}
                            eventKey={1}
                        > 
                            Dashboard 
                        </NavItem>
                        <NavItem 
                            componentClass={Link} 
                            href='/user/alerts' 
                            to='/user/alerts' 
                            onClick={this.handleSelect} 
                            onSelect={this.handleSelect}
                            eventKey={2}
                        > 
                            Alerts 
                        </NavItem>
                        <NavItem 
                            componentClass={Link} 
                            href='/stocks' 
                            to='/stocks' 
                            onClick={this.handleSelect} 
                            onSelect={this.handleSelect}
                            eventKey={3}
                        > 
                            Stocks 
                        </NavItem>
                    </Nav>
                    <Nav pullRight>
                            <NavItem eventKey={1} onSelect={this.toUserPrefs}>
                                <i class="fas fa-user" style={{padding:5}}></i>
                                {this.props.userName}
                            </NavItem>
                            <NavItem eventKey={1} onSelect={this.props.onLogout}>
                            <i class="fas fa-sign-out-alt" style={{padding:5}}></i>
                            Logout
                            </NavItem>
                    </Nav>
                </Navbar.Collapse>}
                </Navbar>
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