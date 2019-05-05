import React from 'react'
import PropTypes from 'prop-types'


class UserInfo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editable: this.props.editable || false,
      edit: false
    }
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
                {
                  Object.keys(data).map(key => {
                    return <td data-title={key}>{data[key]}</td>
                  })
                }
              </tr>
            </tbody>
          </table>
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