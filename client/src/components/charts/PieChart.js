import React from 'react';
import { Pie } from './Charts'


class PieChart extends React.Component {

    componentWillMount(){
        this.props.getAccountTotals()
    }

    render(){
        return (
            <Pie data={this.props.data} />
        )
    }

}

export default PieChart