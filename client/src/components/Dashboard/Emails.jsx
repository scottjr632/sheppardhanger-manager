import React from 'react'
import PropTypes from 'prop-types'

const gridStyle = {
  textTransform: 'uppercase',
  display: 'grid',
  gridTemplateColumns: '1.2fr',
  gridTemplateRows: 'auto'
}

const leftBorder = {
  padding: '10px',
  borderLeft: '1pt black solid',
  borderTop: '1pt black solid',
  borderBottom: '1pt black solid',
  borderRadius: '4px 0 0 4px'
}

const rightBorder = {
  padding: '10px',
  borderRight: '1pt black solid',
  borderTop: '1pt black solid',
  borderBottom: '1pt black solid',
  borderRadius: '0 4px 4px 0'
}

const Emails = props => {
  return (
    <div style={{position: 'relative', fontStyle: '13pt'}}>
      <span style={{fontSize: '15pt', textDecoration: 'underline'}}>EMAILS</span>
      <div style={gridStyle}>
        {
          Object.keys(props.data).map(key => {
            let { prettyName, done } = props.data[key]
            return (
              <span style={{display: 'grid', gridTemplateColumns: '[left] 100px [center] 35px [right] auto', gridRowGap: '10px'}}>
                <div style={{textAlign: 'left', gridArea: 'left', ...leftBorder}}>{prettyName}</div>
                  <span style={{gridArea: 'center', ...rightBorder}}>
                    <input type="checkbox" checked={done} style={{transform: 'scale(1.5)'}} readOnly={true} disabled={true}/>
                  </span>
                  <span style={{gridArea: 'right'}}>
                    <button className={'btn__new'}>{`Send ${prettyName} email`}</button>
                  </span>
              </span>
            )
          })
        }
      </div>
    </div>
  )

}

Emails.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.shape({prettyName: PropTypes.string.isRequired, done: PropTypes.bool.isRequired})
  }).isRequired
}

export default Emails;