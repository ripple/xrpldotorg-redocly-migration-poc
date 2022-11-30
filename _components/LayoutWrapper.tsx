import * as React from 'react';
// import navbar from '../top-nav.yaml';

/*
 * Put any "layout" in this wrapping element to make sure it ends up beneath the
 * top navbar regardless of whether the top nav has an alert banner active.
 */
export default function LayoutWrapper(props) {
  // const topmargin = navbar.alertbanner.show ? {"marginTop": "126px"} : {"marginTop": "80px"};
  return (
    <div id="main_content_wrapper">
      {props.children} {}
    </div>
  );
}
