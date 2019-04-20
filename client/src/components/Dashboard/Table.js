import React from "react";
import Table from "react-bootstrap/lib/Table";
import PropTypes from "prop-types";

class TableT extends React.Component {
  componentDidMount() {
    if (this.props.onLoadFunction) {
      this.props.onLoadFunction();
    }
  }

  render() {
    return (
      <div id={this.props.id}>
        <Table striped responsive>
          {this.props.headers && (
            <thead>
              <tr>
                {this.props.headers.map((item, index) => {
                  return <th className={index}>{item}</th>;
                })}
              </tr>
            </thead>
          )}
          <tbody>
            {Object.keys(this.props.data).map((item, index) => {
              return (
                <tr>
                  <td>{item}</td>
                  <td>{this.props.data[item]}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

TableT.propTypes = {
  onLoadFunction: PropTypes.func,
  headers: PropTypes.array,
  data: PropTypes.object
};

export default TableT;
