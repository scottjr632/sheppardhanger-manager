import React from 'react'
import PropTypes from 'prop-types'


const minimizedStyle = {
  transition: '0.2s ease-in-out 0s',
  fontSize: '0',
  whiteSpace: 'pre-line'
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
        expanded: false,
        moreInfo: this.props.moreInfo || false
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
          <tr className={'no-color'}>
            <td style={{padding: '0'}} colSpan={Object.keys(data).length-1}>
              <div style={this.state.expanded ? expandedStyle : minimizedStyle}>
                {data['exandableInfo']}
                {this.state.moreInfo && <button style={{display: this.state.expanded ? '' : 'none'}} className={'btn__new more-info'} onClick={this.props.moreInfoClick}>More info</button>}
                {this.state.moreInfo && <button style={{display: this.state.expanded ? '' : 'none'}} className={'btn__new more-info'} onClick={this.props.emailUserClick}>Email user</button>}
              </div>
            </td>
          </tr>
        </React.Fragment>
    )
  }
}

ExpandableRow.popTypes = {
  data: PropTypes.shape({
    ...PropTypes.Object,
    expandableInfo: PropTypes.string
  }),
  moreInfo: PropTypes.bool,
  moreInfoClick: PropTypes.func,
  emailUserClick: PropTypes.func,

}

export default ExpandableRow