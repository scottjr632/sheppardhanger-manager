import React from 'react'

import Login from '../components/Login/Login.1'

const style = {
  background: 'url(http://localhost:5000/bg.jpg) center center / cover fixed',
  width: '100%',
  minHeight: '100%',
  display: '-ms-flexbox',
  display: 'flex',
  // -ms-flex-direction: column;
  flexDirection: 'column',
  backgroundColor: '#2e3649'
}

const LoginPage = (props) => {
  return (
    <div style={style}>
      <div className={'background-image'} />
        <Login onLoginSuccess={() => props.history.push('/dashboard')}/>
    </div>
  )
}


export default LoginPage