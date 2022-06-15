import * as React from 'react';

export function XRPLCard(props) {
  const card = props.card;

  return (
    <a class="card" id={card.id} href={card.href}>
      <div class="card-body">
        <h4 class="card-title h5" dangerouslySetInnerHTML={{ __html: card.title }}></h4>
        <p class="card-text" dangerouslySetInnerHTML={{ __html: card.description }}></p>
      </div>
      <div class="card-footer">&nbsp;</div>
    </a>
  );
}
