import React from 'react';


export default class AccessDenied extends React.Component {
    componentDidMount(){
        if (!this.props.isLoginSuccess && this.props.handleLoad) {
            this.props.handleLoad().then((res) => {
                if (!res){
                    this.props.history.push('/login')
                }
            })
        }
    }
    render(){
        return(<div></div>)
    }
}