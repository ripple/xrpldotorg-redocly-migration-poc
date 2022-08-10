import * as React from 'react';
import { Menu as OriginalMenu } from '@redocly/developer-portal/ui';

export default function WrappedMenu(props) {
  return (
    <div className="page-tree-nav">
      <OriginalMenu {...props}>
        {props.children} {}
      </OriginalMenu>
    </div>
  );
}
