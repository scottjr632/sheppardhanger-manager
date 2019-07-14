import React from 'react';

import Navi from '../components/HeaderComponents/Navbar'
import Emails from '../components/emails/Emails'

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '[padl] 10% [center] auto [padr] 10%',
  gridTemplateRows: 'auto'
}

const emailStyle = {
  gridArea: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}

class EmailsPage extends React.Component {

  render() {
    return(
      <div>
        <Navi />
        <div style={gridStyle}>
          <div style={emailStyle}>
            <Emails />
          </div>
        </div>
      </div>
    )
  }
}

export default EmailsPage