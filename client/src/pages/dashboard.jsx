import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import Schedule from '../components/charts/scheduler'


const Dashboard = () => {
  return (
    <div>
        <Navi />
        <Schedule />
    </div>
  )
}

export default Dashboard