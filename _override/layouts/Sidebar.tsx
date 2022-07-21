import * as React from 'react';
import { SidebarLayout, SidebarProps } from '@redocly/developer-portal/ui';

import styled from 'styled-components';

import navbar from '../../top-nav.yaml';

export default function CustomSidebarLayout(props: SidebarProps<any>) {
  return (
    <SidebarWrapper>
      <SidebarLayout {...props}>
        {props.children} {}
      </SidebarLayout>
    </SidebarWrapper>
  )
}

export function SidebarWrapper(props) {
  const topmargin = navbar.alertbanner.show ? {"margin-top": "126px"} : {"margin-top": "80px"};
  return (
    <div style={topmargin}>
      {props.children} {}
    </div>
  );
}
