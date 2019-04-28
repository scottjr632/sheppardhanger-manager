import React from 'react'
import PropTypes from 'prop-types'


const minimizedStyle = {
  transition: '0.2s ease-in-out 0s',
  fontSize: '0'
}

const expandedStyle = {
  ...minimizedStyle,
  display: 'flex',
  fontSize: '12pt',
  padding: '15px 0 15px 100px'
}

class ExpandableRow extends React.Component {
  
  constructor(props) {
    super(props) 
      this.state = {
        expanded: false
      }
  }

  toggleExpanded = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    let { data } = this.props
    return (
      <React.Fragment>
          <tr onClick={this.toggleExpanded}>
          {Object.keys(data).map((key, index) => {
            if (key !== 'exandableInfo') {
              return index === 0
              ? <td><i className={`fas fa-plus ${this.state.expanded ? 'rotated' : ''}`}></i>{data[key]}</td>
              : <td>{data[key]}</td>
            }
          })}
          </tr>
          <tr style={{columnSpan: Object.keys(data).length-1}}>
            <div style={this.state.expanded ? expandedStyle : minimizedStyle}>
              {data['exandableInfo']}
            </div>
          </tr>
        </React.Fragment>
    )
  }
}

ExpandableRow.popTypes = {
  data: PropTypes.shape({
    ...PropTypes.Object,
    expandableInfo: PropTypes.string
  })
}

export default ExpandableRow