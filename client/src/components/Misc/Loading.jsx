import React from "react";

const Loading = props => (
  <div className={"center"}>
    <div className={"loader"} />
    {!props.data && "Loading..."}
    {props.data}
  </div>
);

export default Loading;
