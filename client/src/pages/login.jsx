import React, { Suspense, lazy } from 'react';

import * as backend from '../backend'

const Login = React.lazy(() => import('../components/Login/Login.1'))

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
        <Suspense fallback={<div>Loading...</div>}>
          <Login onLoginSuccess={() => props.history.push('/dashboard')}/>
        </Suspense>
    </div>
  )
}


export default LoginPage