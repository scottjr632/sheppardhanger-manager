import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'



const testUserInfo = {
    name: 'TEST, User', 
    reservation: 'Ressee',
    checkInDate: '11-11-11',
    checkOutDate: '11-11-11',
    email: 'test@test.com',
    address: '1111111 no str',
    city: 'no name pl',
    state: 'tx',
    zipcode: '999999',
}

const emailTestInfo = {
    welcome: false,
    contract: true,
    noRooms: false,
    reciept: false
}

const gridStyle = {
  textTransform: 'uppercase',
  display: 'grid',
  gridTemplateColumns: '3fr',
  gridTemplateRows: 'auto'
}

class Info extends React.Component {

  render() {
    return (
      <div>
      <Navi />
      <div>
          {/* EMAIL SECTION */}
          <div style={{position: 'relative', top: '25vh', fontStyle: '13pt', display: 'flex', flexDirection: 'row'}}>
              <span>EMAILS</span>
            <div style={gridStyle}>
              {
                Object.keys(emailTestInfo).map(key => {
                  return (
                    <span style={{display: 'grid', gridTemplateColumns: '[left] 1.5fr [right] 1.5fr', gridRowGap: '10px'}}>
                      <div style={{textAlign: 'left', gridArea: 'left'}}>{key}</div>
                      <span style={{gridArea: 'right'}}>
                        <input type="checkbox" checked={emailTestInfo[key]} style={{transform: 'scale(1.5)'}}/>
                      </span>
                    </span>
                  )
                })

              }
            </div>
          </div>
          {/* User info section */}
          {/* EMAIL SECTION */}
          <div style={{position: 'relative', top: '25vh', left: '75%', fontStyle: '13pt'}}>
              <span>EMAILS</span>
            <div style={gridStyle}>
              {
                Object.keys(emailTestInfo).map(key => {
                  return (
                    <span style={{display: 'grid', gridTemplateColumns: '[left] 1.5fr [right] 1.5fr', gridRowGap: '10px'}}>
                      <div style={{textAlign: 'left', gridArea: 'left'}}>{key}</div>
                      <span style={{gridArea: 'right'}}>
                        <input type="checkbox" checked={emailTestInfo[key]} style={{transform: 'scale(1.5)'}}/>
                      </span>
                    </span>
                  )
                })

              }
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Info