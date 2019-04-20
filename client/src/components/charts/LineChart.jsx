import React from 'react';
import { Line } from './Charts'


class LineChart extends React.Component {

    componentWillMount(){
        this.props.getAccountTotals()
    }

    componentDidMount(){
        console.log(this.props.data, "data");
    }

    componentWillReceiveProps(){
        console.log(this.props.data, "data");
    }

    render(){
        return (
            <Line data={this.props.data} />
        )
    }

}

export default LineChart