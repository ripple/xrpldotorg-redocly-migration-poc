import * as React from 'react';

export default function XRPLoader(props) {
  return (
    <div className="loader collapse">
      <img className="throbber" src={require("../static/img/xrp-loader-96.png")} />
      {props.message}
    </div>
  );
}

XRPLoader.defaultProps = {
  message: "Sending..."
}
