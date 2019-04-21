import React from 'react'

import Login from '../components/Login/Login'

const LoginPage = (props) => {
  return (
    <div>
      <div className={'background-image'} />
      <div className={'title'} style={{zIndex: 99}}>
        <div style={{fontSize: '0.6em'}}>The Sheppard Hanger</div>
        <div >Manager</div>
      </div>
      <div className={'login-stuff'}>
        <h4 onClick={() => console.log(props)}>Management Login</h4>
        <Login onLoginSuccess={() => props.history.push('/dashboard')}/>
      </div>
    </div>
  )
}


export default LoginPage