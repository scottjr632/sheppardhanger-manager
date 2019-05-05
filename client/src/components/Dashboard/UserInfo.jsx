import React from 'react'
import PropTypes, { array } from 'prop-types'


const inputStyle = {
  borderBottom: '1pt #d8d5d5 solid'
}

const editStyle = {
  float: 'right',
  cursor: 'pointer',
}

class UserInfo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ...this.props.data,
      editable: this.props.editable || false,
      edit: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({...nextProps.data})
  }

  handleChange = (event) => {
    let { target } = event
    this.setState({
      [target.name]: target.value
    })
  }

  toggleEdit = () => {
    console.log(this.state, 'STATE')
    console.log(this.props, 'PROPS')
    this.setState({ edit: !this.state.edit })
  }

  render(){
    let { data } = this.props
    return (
      <div className={'table'} style={{gridArea: 'right'}}>
        <div className={'table-wrapper'}>
          <table className="table-responsive card-list-table">
            <thead>
              <tr>
                { Object.keys(data).map(key => { return <th>{key}</th> }) }
              </tr>
            </thead>
            <tbody>
              <tr>
                {!this.state.edit &&
                  Object.keys(data).map(key => {
                    return typeof data[key] === 'object' ?
                     <td data-title={'TEST'}>TEST</td>:
                     <td data-title={key}>{data[key]}</td>
                  })
                }
                {this.state.edit && 
                  Object.keys(data).map(key => {
                    return typeof data[key] === 'object' ?
                     <td data-tile={'TEST'}>TEST</td>:
                     <td data-title={key}><span className={'border-grow'}></span><input name={key} value={this.state[key]} style={inputStyle} onChange={this.handleChange}/></td>
                  })
                }
              </tr>
            </tbody>
          </table>
          <button className={'btn__new dangerous'}>Archive <i className="fas fa-archive" style={{float: 'left'}}></i></button>

          {!this.state.edit && <button className={'btn__new'} style={editStyle} onClick={this.toggleEdit}>Edit <i className="fas fa-edit" style={{float: 'left'}}></i></button>}
          {this.state.edit && <button className={'btn__new save'} style={editStyle} onClick={this.toggleEdit}>Save! <i className="fas fa-save" style={{float: 'left'}}></i></button>}
        </div>
      </div>
    )
  }
}

UserInfo.propTypes = {
    data: PropTypes.object.isRequired,
    editable: PropTypes.bool
}

export default UserInfo