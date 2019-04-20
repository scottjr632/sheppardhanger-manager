import React, { Component } from "react";
import Table from "react-bootstrap/lib/Table";
import Button from "react-bootstrap/lib/Button";
import Loading from '../Misc/Loading'
import { CSVLink } from "react-csv";

class SortableTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      headers: [],
      sortKeys: [],
      searchKey: 0,
      loading: true,
      sort: {
        column: null,
        direction: "asc"
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.headers !== undefined && nextProps.data !== undefined) {
      let keys = [];
      if (nextProps.schema) {
        keys = nextProps.schema;
      } else if (nextProps.data.length > 0) {
        keys = Object.keys(nextProps.data[0]);
      }
      this.setState({
        headers: nextProps.headers,
        sortKeys: keys
      });
    } else {
      console.log("No props");
    }
    if (nextProps.data.length > 0) {
      this.setState({loading: false})
    }
  }

  componentDidMount() {
    this.props.getDebits();
    if (this.props.headers !== undefined && this.props.data !== undefined) {
      let keys = [];
      if (this.props.schema) {
        keys = this.props.schema;
      } else if (this.props.data.length > 0) {
        keys = Object.keys(this.props.data[0]);
      }
      this.setState({
        headers: this.props.headers,
        data: this.props.data,
        sortKeys: keys,
      });
    } else {
      console.log("No props");
    }
  }

  group() {
    // Group the things together
  }

  ungroup() {
    // ungroup the things
  }

  search(event) {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById(this.props.id + "input");
    filter = input.value.toUpperCase();
    table = document.getElementById(this.props.id + "table");
    tr = table.getElementsByTagName("tr");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      // TODO : Change this so that you can choose which column to search.
      td = tr[i].getElementsByTagName("td")[this.state.searchKey];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  sort(event, sortKey) {
    const sortOrder = this.state.sort.direction === "asc" ? 1 : -1;

    // sort the table
    this.props.data.sort((a, b) => {
      const val1 = a[sortKey].toString().toUpperCase();
      const val2 = b[sortKey].toString().toUpperCase();
      if (isNaN(val1) && isNaN(val2)) {
        return val1 < val2 ? -sortOrder : val1 > val2 ? sortOrder : 0;
      } else {
        return sortOrder === 1 ? val1 - val2 : val2 - val1;
      }
    });

    if (sortOrder === 1) {
      this.setState({ sort: { column: sortKey, direction: "desc" } });
    } else {
      this.setState({ sort: { column: sortKey, direction: "asc" } });
    }
  }

  setArrow = column => {
    let className;
    if (this.state.sort.column === column) {
      className = this.state.sort.direction === "asc" ? "asc" : "desc";
    }

    return className;
  };

  handleSelect(e) {
    this.setState({ searchKey: parseInt(e.target.value) });
  }

  handleEditClick = e => {
    let id = e.target.parentElement.parentElement.querySelector("tr > .id")
      .innerText;
    let p = this.props.data.filter(e => e.id == id);
    this.props.setInfo(p);
    this.props.showModal();
  };

  render() {
    return (
      <div className="SortableTable" id={this.props.id}>
        {this.state.loading && (
          <Loading data={"Loading cool stuff..."}/>
        )}
        {!this.state.loading && (
          <div>
            {this.props.isSearchable && (
              <div class="input-search">
                <select
                  className="form-control"
                  onChange={e => this.handleSelect(e)}
                >
                  {this.state.headers.map((item, index) => {
                    return <option value={index}>{item}</option>;
                  })}
                </select>
                <input
                  id={this.props.id + "input"}
                  onKeyUp={e => this.search(e)}
                  className="form-control"
                  placeholder="Type to seach..."
                />
                <span className="search-icon">
                  <i class="fas fa-search" />
                </span>
                <CSVLink data={this.props.data} filename={"debits.csv"}>
                  Download CSV
                </CSVLink>
              </div>
            )}
            <Table striped responsive id={this.props.id + "table"}>
              <thead>
                <tr>
                  {this.state.sortKeys.map((item, index) => {
                    return (
                      <th
                        className={
                          this.setArrow(item) + " " + item + " sortable-header"
                        }
                        onClick={e => this.sort(e, item)}
                      >
                        {this.state.headers[index]}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="hide-ids">
                {this.props.data.map(item => {
                  if (this.props.schema) {
                    return (
                      <tr>
                        {this.props.schema.map((e, i) => {
                          if (i === 0) {
                            return (
                              <td
                                className={this.state.sortKeys[i] + " action"}
                                onClick={this.props.onClick ? () => {this.props.onClick(item[e])} : () => {}}
                                style={this.props.onClick ? {cursor: "pointer"} : {}}
                              >
                                {this.props.isEditable && (
                                  <Button
                                    bsStyle="warning"
                                    bsSize="small"
                                    className={"hidden-btn"}
                                    onClick={this.handleEditClick}
                                  >
                                    edit
                                  </Button>
                                )}
                                {item[e]}
                              </td>
                            );
                          } else {
                            return (
                              <td class={this.state.sortKeys[i]}>{item[e]}</td>
                            );
                          }
                        })}
                      </tr>
                    );
                  }
                  return (
                    <tr>
                      {Object.values(item).map((e, i) => {
                        if (i === 0) {
                          return (
                            <td className={this.state.sortKeys[i] + " action"}>
                              {this.props.isEditable && (
                                <Button
                                  bsStyle="warning"
                                  bsSize="small"
                                  className="hidden-btn"
                                  onClick={this.handleEditClick}
                                >
                                  edit
                                </Button>
                              )}
                              {e}
                            </td>
                          );
                        } else {
                          return <td class={this.state.sortKeys[i]}>{e}</td>;
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    );
  }
}

export default SortableTable;
