import React from "react";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import Button from "react-bootstrap/lib/Button";

class EditableForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      n_data: this.props.data,
      editable: true,
      editText: "Edit"
    };
  }

  componentDidMount() {
    if (this.props.handleLoad) this.props.handleLoad();
  }

  setEditable = () => {
    this.setState({
      editable: !this.state.editable,
      editText: !this.state.editable ? "Edit" : "Save"
    });
    if (this.props.handleSave && this.state.editText === "Save") {
      this.props.handleSave(JSON.stringify(this.state.n_data));
    }
  };

  setNotEditable = () => {
    this.props.handleLoad();
    this.setState({
      editable: true,
      n_data: this.props.data,
      editText: "Edit"
    });
  };

  handleChangeMany = (e, o) => {
    let t_data = this.props.data;
    t_data[o]["content"][e.target.id] = e.target.value;
    this.setState({
      n_data: t_data
    });
  };

  handeChangeOne = (e, o) => {
    let t_data = this.props.data;
    t_data[o]["content"] = e.target.value;
    this.setState({
      n_data: t_data
    });
  };

  render() {
    return (
      <div id="EditableForm">
        <form>
          {this.props.data &&
            Object.keys(this.props.data).map(value => {
              let cValue = this.props.data[value];
              if (typeof cValue["content"] === "string") {
                return (
                  <div>
                    <ControlLabel>{cValue["pretty_name"]}</ControlLabel>
                    <FormControl
                      id={cValue}
                      type={cValue["type"]}
                      value={cValue["content"]}
                      disabled={this.state.editable}
                      onChange={e => this.handeChangeOne(e, value)}
                    />
                  </div>
                );
              }

              return (
                <div>
                  <ControlLabel>{cValue["pretty_name"]}</ControlLabel>
                  {Object.keys(cValue["content"]).map(c => {
                    let content = cValue["content"];
                    return (
                      <div>
                        <ControlLabel>{c}</ControlLabel>
                        <FormControl
                          id={c}
                          type={cValue["type"]}
                          value={content[c]}
                          disabled={this.state.editable}
                          onChange={e => this.handleChangeMany(e, value)}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </form>
        <br />
        <Button onClick={this.setEditable} style={{ margin: "5px" }}>
          {this.state.editText}
        </Button>
        <Button onClick={this.setNotEditable} style={{ margin: "5px" }}>
          Cancel
        </Button>
      </div>
    );
  }
}

export default EditableForm;
