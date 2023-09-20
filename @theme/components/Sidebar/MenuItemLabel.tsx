import * as React from 'react';

import { MenuItemLabel as Original } from '@theme/components/Sidebar/MenuItemLabel';

export const MenuItemLabel = function(props) {
  return <Original {...props} className="my-item" />;
}