import * as React from "react";
import { Link } from '@redocly/developer-portal/ui';

export function XRPLCardDeck(props) {
  const { cards, cols, children } = props;
  let classes = "row row-cols-2 row-cols-lg-4 card-deck mt-10 autocards";
  if (typeof cols != "undefined") {
    const [mobile_cols, desktop_cols] = cols.split("/");
    classes = `row row-cols-${mobile_cols.trim()} row-cols-lg-${desktop_cols.trim()} card-deck mt-10 autocards`
  }

  return (
    <div className={classes}>
      {children} {}
    </div>
  )

}

export function DeckCard(props) {
  const {title, children, to, external} = props;

  return (
    <Link className="card" to={to} external={external}>
      <div className="card-body">
        <h4 className="card-title h5">{title}</h4>
        <p className="card-text">
          {children} {}
        </p>
      </div>
      <div className="card-footer">&nbsp;</div>
    </Link>
  );
}
