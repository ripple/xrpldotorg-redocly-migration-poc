// Custom Footer element, based partly on https://github.com/Redocly/developer-portal-starter/pull/223
// and partly on our old jinja template for the footer component.
// It would be nice to replace this with a "thin wrapper" like Menu.tsx instead,
// but that's currently impossible because Footer is not exported from @redocly/developer-portal/ui.

import * as React from 'react';
import styled from 'styled-components';

import { Link, FooterProps, usePathPrefix } from '@redocly/developer-portal/ui';

/**
 * Custom Navbar. The implementation below is almost identical to our default Footer
 */
export default function CustomFooter(props: FooterProps) {
  // you can use columns/copyright values from props, it comes from siteConfig.yaml
  // but you can also import it from a separate yaml or json file
  const { columns, copyrightText } = props.footer;
  const siteVersion = props.siteVersion;

  const columnsElement = columns.length ? (
    <FooterColumns>
      {columns.map((column, index) => (
        <FooterCol key={index}>
          <ColumnTitle>{column.group || column.label}</ColumnTitle>
          <ColumnList>
            {column.items.map((columnItem, columnItemInex) =>
              columnItem.type === 'separator' ? (
                <FooterSeparator key={columnItem.label + '_' + columnItemInex}>{columnItem.label}</FooterSeparator>
              ) : (
                <ColumnListItem key={columnItemInex}>
                  <Link
                    to={columnItem.link}
                    target={columnItem.target}
                    external={columnItem.external}
                    className="nav-link"
                  >
                    {columnItem.label}
                  </Link>
                </ColumnListItem>
              )
            )}
          </ColumnList>
        </FooterCol>
      ))}
    </FooterColumns>
  ) : null;

  const infoElement =
    copyrightText || siteVersion ? <AbsoluteBottomFooter copyrightText={copyrightText}></AbsoluteBottomFooter> : null;

  return (
    <FooterWrapper>
      {columnsElement}
      {infoElement}
      <JumpToTop />
    </FooterWrapper>
  );
}

// very important for NavWrapper to be a "footer" HTML tag
export function FooterWrapper(props) {
  return (
    <footer className="xrpl-footer" {...props}>
      {props.children} {}
    </footer>
  );
}

export function FooterColumns(props) {
  return (
    <section className="container-fluid">
      <div className="row">
        {props.children} {}
      </div>
    </section>
  );
}

export function FooterCol(props) {
  return (
    <div className="col-lg">
      {props.children} {}
    </div>
  );
}

export function AbsoluteBottomFooter(props) {
  const prefix = usePathPrefix();
  const { copyrightText } = props;
  return (
    <section className="container-fluid mt-20 absolute-bottom-footer">
      <div className="d-lg-flex row">
        <Link to="/" className="footer-brand">
          <img
            src={require('../static/img/XRPLedger_DevPortal-white.svg')}
            className="logo"
            height="24"
            alt="XRP Ledger"
          />
        </Link>
        <span className="flex-grow-1">&nbsp;</span>
        <div className="copyright-license">
          &copy; {copyrightText} &nbsp;
          <Link to="https://raw.githubusercontent.com/XRPLF/xrpl-dev-portal/master/LICENSE">Open Source.</Link>
        </div>
      </div>
    </section>
  );
}

export function ColumnList(props) {
  return (
    <ul className="nav footer-nav flex-column">
      {props.children} {}
    </ul>
  );
}

export function ColumnListItem(props) {
  return (
    <li className="nav-item">
      {props.children} {}
    </li>
  );
}

export const FooterSeparator = styled.li`
  opacity: 0.75;
  margin: 10px 0 5px 0;
  font-size: 0.75em;
  text-transform: uppercase;
  font-family: ${({ theme }) => theme.typography.headings.fontFamily};
`;

export const ColumnTitle = styled.h5``;

export function JumpToTop() {
  return (
    <a href="#main_content_wrapper" className="jump-to-top btn btn-primary" role="button" title="Jump to top of page">
      <i className="fa fa-arrow-up"></i>
    </a>
  );
}
