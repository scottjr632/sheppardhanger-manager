import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import Label from 'react-bootstrap/lib/Label';


class SaveDeleteModal extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            n_data : this.props.data,
        }
    }

    onSubmit = e => {
        e.preventDefault()
        let t_data = this.props.data
        if (window.confirm("Are you sure you want to save changes?")){
            t_data.forEach(e => {
                this.props.handleSave(e)
            })
            this.props.handleClose()
        }
    }

    onDelete = e => {
        e.preventDefault()
        let t_data = this.props.data
        if (window.confirm(
            `Are you sure you want to delete this ${t_data[0].name}?\nID: ${t_data[0].id}`)
            ){
            t_data.forEach(e => {
                this.props.handleDelete(e.id)
            })
            this.props.handleClose()
        }
    }

    handleChange = e => {
        let t_data = this.props.data
        this.props.data[0][e.target.id] = e.target.value
        t_data[0][e.target.id] = e.target.value
        this.setState({
            n_data: this.props.data
        })
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.schema &&
                        this.props.schema.map(value => {
                        return (
                            <div>
                                <Form onSubmit={this.onSubmit}>
                                        <div>
                                            <Label>{value['name']}</Label>
                                            {value['type'] !== "select" ? 
                                            <FormControl
                                                id={value['key']}
                                                className={value['type'] == 'date' ? 'date-picker' : ''}
                                                type={value['type']}
                                                value={this.props.data[0] &&  
                                                    this.props.data[0][value['key']]
                                                }
                                                onChange={this.handleChange}
                                                disabled={value['disabled']}
                                            /> :
                                            <FormControl 
                                                id={value['key']}
                                                componentClass="select"
                                                value={this.props.data[0] &&
                                                    this.props.data[0][value['key']]
                                                }
                                                disabled={value['disabled']}
                                                onChange={this.handleChange}
                                            >
                                            {value['options'] && value['options'].map(option => {
                                                return (
                                                    <option value={option}>{option}</option>
                                                )
                                            })}
                                            </FormControl>
                                            }
                                        </div>
                                </Form>
                            </div>
                        )
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onDelete} bsStyle="danger" >Delete</Button>
                    <Button onClick={this.onSubmit}>Save</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

SaveDeleteModal.prototypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
    handleDelete: PropTypes.func,
    handleSave: PropTypes.func,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            id: PropTypes.value,
        }),
    ),
    schema: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            key: PropTypes.string,
            type: PropTypes.any,
            disabled: PropTypes.bool
        })
    )
}

export default SaveDeleteModal;