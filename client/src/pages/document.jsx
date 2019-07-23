import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import UserDocuments from '../components/documents/UsersDocuments'

class Documents extends React.Component {

  render() {
    return(
      <div>
         <Navi />
         <UserDocuments test={() => {}} />
      </div>
    )
  }
} 

export default Documents;