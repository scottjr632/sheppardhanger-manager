import React from 'react'

const divStyle = {
  position: 'absolute',
  top: '50px',
  left: '50px',
  width: '50px',
  height: '50px',
  cursor: 'pointer',
  display: 'flex',
  textAlign: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
}

const GoBack = (props) => {
  return (
    <div style={divStyle} onClick={props.onClick}>
        <i class="fas fa-chevron-left" style={{fontSize: '1.5em', color: '#878888'}} />
    </div>
  )
}

export default GoBack