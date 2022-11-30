import * as React from'react';
import XRPLHome from './_components/pages/Home';
import LayoutWrapper from './_components/LayoutWrapper';

export const frontmatter = {
  label: '',
}

export default function () {
  return (
    <LayoutWrapper>
      <XRPLHome />
    </LayoutWrapper>
  );
}
