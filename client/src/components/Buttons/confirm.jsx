import React from 'react'
import PropTypes from 'prop-types'


class ConfirmButton extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			active: false
		}

		this.timeout = null
	}

	componentWillMount() {
		document.addEventListener('mousedown', this.handleClick, false)
	}

	componentWillUnmount() {
		clearTimeout(this.timeout)
		document.removeEventListener('mousedown', this.handleClick, false)
	}

	handleClick = (e) => {
		if (this.node.contains(e.target)) {
			if (this.state.active) {
				this.props.confirmAction()
				this.setState({active: false})
				clearTimeout(this.timeout)
				return
			} else if (!this.state.active) {
				this.setState({active: true})
				this.timeout = setTimeout(() => this.setState({active: false}), 3000)
				return
			}
		}

		this.setState({active: false})
		clearTimeout(this.timeout)
	}

	render(){
		return (
			<div className={`buton-cover button-slide-out ${this.state.active ? 'is_active' : ''}`} >
				<span className="button-slide-out__above">{this.props.confirmMessage || 'Are you sure?'}</span>
				<div className="button-slide-out__middle" ref={node => this.node = node}>
					<button className="btn btn--primary" style={this.props.style}>
						{!this.state.active ?  (this.props.removeMessage || 'Delete') : 'Confirm'}
					</button>
				</div>
			</div>
		)
	}
}

ConfirmButton.propTypes = {
	confirmAction: PropTypes.func.isRequired,
	style: PropTypes.object,
	removeMessage: PropTypes.string,
	confirmMessage: PropTypes.string,
	cancelMessage: PropTypes.string
}

export default ConfirmButton
