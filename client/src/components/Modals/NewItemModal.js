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
        let t_data = {}
        this.props.schema.forEach(e => {
            t_data[e.key] = ""
        })
        this.state = {
            n_data : t_data
        }
    }

    onSubmit = e => {
        e.preventDefault()
        let t_data = this.state.n_data
        console.log(t_data)
        if (window.confirm("Are you sure you want to save new item?")){
            this.props.handleSave(t_data)
            this.props.handleClose()
            this.props.handleUpdate()
        }
    }

    handleChange = e => {
        let t_data = this.state.n_data
        t_data[e.target.id] = e.target.value
        this.setState({
            n_data: t_data
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
                                            <FormControl 
                                                id={value['key']}
                                                className={value['type'] == 'date' ? 'date-picker' : ''}
                                                type={value['type']}
                                                value={this.state.n_data[value['key']]}
                                                onChange={this.handleChange}
                                                disabled={value['disabled']}
                                            />
                                        </div>
                                </Form>
                            </div>
                        )
                    })}
                </Modal.Body>
                <Modal.Footer>
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