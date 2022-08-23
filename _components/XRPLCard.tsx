import * as React from 'react';

export function XRPLCard(props) {
  const card = props.card;

  return (
    <a className="card" id={card.id} href={card.href}>
      <div className="card-body">
        <h4 className="card-title h5" dangerouslySetInnerHTML={{ __html: card.title }}></h4>
        <p className="card-text" dangerouslySetInnerHTML={{ __html: card.description }}></p>
      </div>
      <div className="card-footer">&nbsp;</div>
    </a>
  );
}
