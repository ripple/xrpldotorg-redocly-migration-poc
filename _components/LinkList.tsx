import * as React from 'react';

export function LinkList(props) {
  const { children, title } = props;

  const wrappedChildren = React.Children.map(children, child => {
    let cls = "nav-link "+(child.props.className || "");
    if (child.props.external) {
      cls = cls + " external-link"
    }
    return (
      <li className="nav-item">
        {React.cloneElement(child, {
          className: cls
        })}
      </li>
    )
  });

  return (
    <>
      {title ? (
        <h4>{title}</h4>
      ): ""}
      <ul className="nav flex-column">
        {wrappedChildren}
      </ul>
    </>
  )
}

export function Columns(props) {
  const { cols, children } = props;
  let classes = "landing row row-cols-2 row-cols-lg-4 mt-10 my-5";
  // TODO: change the CSS so landing isn't required for this
  if (typeof cols != "undefined") {
    const [mobile_cols, desktop_cols] = cols.split("/");
    classes = `landing row row-cols-${mobile_cols.trim()} row-cols-lg-${desktop_cols.trim()} my-5`
  }

  const wrappedChildren = React.Children.map(children, child => {
    return (
      <div className="col pr-5">
        {child}
      </div>
    )
  });

  return (
    <div className={classes}>
      {wrappedChildren}
    </div>
  )

}
