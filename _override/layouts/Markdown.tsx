import * as React from 'react';
import { MarkdownLayout as OriginalMarkdownLayout, MarkdownLayoutProps } from '@redocly/developer-portal/ui';
import LayoutWrapper from '../../_components/LayoutWrapper';


export default function WrappedMarkdownLayout(props: MarkdownLayoutProps) {
    return (
      <LayoutWrapper>
        <OriginalMarkdownLayout {...props} />
      </LayoutWrapper>
    );
}
