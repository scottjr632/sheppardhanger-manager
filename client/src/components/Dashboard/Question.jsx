import React from 'react'
import PropTypes from 'prop-types'

const defaultStyle = {
    textDecoration: 'none',
    margin: '0 5px 0 5px'
}

const QuestionHelper = props => {
    return <a className={'tip'} style={defaultStyle}><i class="fas fa-question-circle"><span>{ props.helpText }</span></i></a>
    
}

QuestionHelper.propTypes = {
    helpText: PropTypes.string.isRequired
}

export default QuestionHelper   