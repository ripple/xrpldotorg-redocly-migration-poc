import * as React from 'react';
import { SidebarLayout, SidebarProps } from '@redocly/developer-portal/ui';

import LayoutWrapper from '../../_components/LayoutWrapper';

export default function WrappedSidebarLayout(props: SidebarProps<any>) {
  return (
    <LayoutWrapper>
      <SidebarLayout {...props}>
        {props.children} {}
      </SidebarLayout>
    </LayoutWrapper>
  )
}
