import React from 'react'
import PropTypes from 'prop-types'

const listItemStyle = {
  padding: '10px',
  cursor: 'pointer',
  color: 'black',
}

const selected = {
  ...listItemStyle,
  backgroundColor: '#55c4b7',
  borderRadius: '3px',
  cursor: 'auto',
  color: 'white'
}

const inputStyle = {
  background: 'rgba(0,0,0,0)',
  borderBottom: '1pt black solid',
  width: '100%'
}

class EditableListItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      templateName: this.props.name || '',
      isEdit: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.state.name) {
      this.setState({
        templateName: nextProps.name
      })
    }
  }

  static propTypes = {
    selectedKey: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    updateName: PropTypes.func.isRequired,
    name: PropTypes.string,
  }

  handleSubmit = () => {
    this.props.updateName(this.props.name, this.state.templateName)
    this.toggleEdit()
  }

  toggleEdit = () => {
    this.setState({ isEdit: !this.state.isEdit })
  }
  
  handleChange = (event) => {
    let { target } = event

    this.setState({ 
      [target.name]: target.value
     })
  }  

  render() {
    let { name } = this.props
    return(
      <li
        style={this.props.selectedKey === name ? selected : listItemStyle} 
        onClick={() => this.props.handleClick(name)}
      >
        <span style={{display: 'flex', justifyContent: 'space-between'}}>
          {(this.props.selectedKey === name && this.state.isEdit) ? 
            <input 
              value={this.state.templateName} 
              name="templateName" 
              onChange={this.handleChange}
              style={inputStyle}
            /> :

            name
          }
          {this.props.selectedKey === name ? 
            !this.state.isEdit ? 
              <i class="fas fa-minus-circle" onClick={this.toggleEdit} /> :
              <i class="fas fa-check-circle" onClick={this.handleSubmit} /> :
            <span />
          }
        </span>
      </li>
    )
  }
}

export default EditableListItem