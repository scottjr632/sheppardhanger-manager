import React, { Suspense, lazy } from 'react';

const PasswordReset = React.lazy(() => import('../components/Login/resetPassword'))

const style: React.CSSProperties = {
  background: 'url(bg.jpg) center center / cover fixed',
  width: '100%',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#2e3649'
}

const ResetPasswordPage = (props) => {
  return (
    <div style={{...style}}>
      <div className={'background-image'} />
        <Suspense fallback={<div>Loading...</div>}>
          <PasswordReset {...props}/>
        </Suspense>
    </div>
  )
}


export default ResetPasswordPage