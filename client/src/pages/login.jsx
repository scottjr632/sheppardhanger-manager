import React from 'react'

import Login from '../components/Login/Login.1'
import * as backend from '../backend'

const style = {
  background: 'url(bg.jpg) center center / cover fixed',
  width: '100%',
  minHeight: '100%',
  display: '-ms-flexbox',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#2e3649'
}

const LoginPage = (props) => {
  setTimeout(() => {
    backend.authenticate(res => { if (res === 200) props.history.push('/dashboard') })
  }, 0)
  return (
    <div style={style}>
      <div className={'background-image'} />
        <Login onLoginSuccess={() => props.history.push('/dashboard')}/>
    </div>
  )
}


export default LoginPage