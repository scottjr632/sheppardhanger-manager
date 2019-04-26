import React from 'react'
import PropTypes from 'prop-types'


class SubTable extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            expanded: this.props.expanded
        }
    }

    render() {
        return (
            <div style={{display: 'flex', fontSize: this.props.expanded ? '12pt' : '0', transition: '0.3s'}}>
                <label>Stuff</label>
                <label>Stuff</label>
                <label>Stuff</label>
                <label>Stuff</label>
                <label>Stuff</label>
                <label>Stuff</label>
            </div>
        )
    }
}

SubTable.propTypes = {
    expanded: PropTypes.bool.isRequired
} 

export default SubTable