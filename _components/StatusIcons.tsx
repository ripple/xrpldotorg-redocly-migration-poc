import * as React from 'react';

export function IconNotEnabled() {
  return (
    <StatusBadge className="not_enabled" title="This feature is not currently enabled on the production XRP Ledger." icon="fa-flask" />
  )
}

export function StatusBadge(props) {
  const {className, title, icon} = props;
  return (
      <span className={`status ${className}`} title={title}><i class={`fa ${icon}`}></i></span>
  )
}
