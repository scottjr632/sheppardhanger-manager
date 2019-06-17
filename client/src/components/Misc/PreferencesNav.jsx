import React from 'react'
import PropTypes from 'prop-types'


class PreferencesNav extends React.Component {

  handleClick = (event) => {
    let { target } = event
    this.props.changeKey(target.id)
  }

  render() {
    return(
      <div className={'preferences__nav'}>
         <ul>
           <div>
            {Object.keys(this.props.tabs).map(key => {
              return (
                <li>
                  <div 
                    id={this.props.tabs[key]}
                    className={this.props.activeKey === this.props.tabs[key] ? 'selected' : ''}
                    onClick={this.handleClick}>

                      {this.props.tabs[key]}
                  </div>
                </li>
              )
            })}
           </div>
           <div className={'preferences__seperator'}>
             <li><button className={'btn__close'} onClick={this.props.close}>Close</button></li>
           </div>
         </ul>
         
      </div>
    )
  }
}

PreferencesNav.propTypes = {
  close: PropTypes.func.isRequired,
  tabs: PropTypes.object.isRequired,
  changeKey: PropTypes.func.isRequired,
  activeKey: PropTypes.string.isRequired
}

export default PreferencesNav