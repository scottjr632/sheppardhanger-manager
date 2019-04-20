import React from 'react';
import { Redirect } from 'react-router-dom';

import '../CSS/login.css';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: ""
        }
        this.history = props.history
    }

    componentDidMount() {
        this.props.handleLoad();
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }
  
    validatePassword() {
        const length = this.state.password.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }
    
    handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        let {email, password} = this.state;
        this.props.handleSubmit(email, password)
        this.setState({
          email: '',
          password: ''
        });
      }

      render() {
        let {isLoginPending, isLoginSuccess, loginError} = this.props;
        return !isLoginPending && isLoginSuccess ? (
            <Redirect to='/dashboard' push={true} />
        ) :
            (
          <div className="container">
              <div className="login">
                  <div className="login-title"><h1>Login</h1></div>
                    <form onSubmit={this.onSubmit}>
                      <div className="input-group">
                        <i className="fas fa-user"></i>
                        <input 
                            id="email" 
                            type="email" 
                            name="username" 
                            placeholder="Email address" 
                            value={this.state.email} 
                            onChange={this.handleChange} 
                            required autoFocus>
                        </input>
                      </div>
  
                      <div className="input-group">
                        <i className="fas fa-lock"></i>
                        <input 
                            id="password" 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={this.state.password} 
                            onChange={this.handleChange} required>
                        </input>
                      </div>
                      <button type="submit">Login</button>
                  </form>
                  <div className="message">
                { isLoginPending && <div>Please wait...</div> }
                { isLoginSuccess && <div>Success.</div> }
                { loginError && <div>{loginError.text}</div> }
                </div>
              </div>
            </div>
        );
      }
}

export default Login;