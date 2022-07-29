import * as React from 'react';
import styled from 'styled-components';

import slugify from '../_components/slugify';

import { Flex, Link, NavBarProps, SearchBox } from '@redocly/developer-portal/ui';

import navbar from '../top-nav.yaml';

export default function CustomNavBar(props: NavBarProps) {
  const { items, logo, href, altText, pathPrefix } = props;

  const navItems = navbar.nav.map((item, index) => {
    if (item.group) {
      return (
        <NavDropdown key={index} group={item.group} items={item.items} pathPrefix={pathPrefix} />
      );
    } else {
      return (
        <NavItem key={index}>
          <Link to={item.link} className="nav-link">{item.label}</Link>
        </NavItem>
      );
    }
  });

  return (
    <>
    <AlertBanner show={navbar.alertbanner.show}
      message={navbar.alertbanner.message}
      button={navbar.alertbanner.button}
      link={navbar.alertbanner.link}
    />
    <NavWrapper belowAlertBanner={navbar.alertbanner.show}>
      <LogoBlock to={href} img={logo} alt={altText} />
      <NavControls>
        <MobileMenuIcon />
      </NavControls>
      <TopNavCollapsible>
        <NavItems>
          {navItems}
          <SearchBox pathPrefix={pathPrefix} location={props.location} />
          <ThemeToggle />
        </NavItems>
      </TopNavCollapsible>
    </NavWrapper>
    </>
  );
}

export function AlertBanner(props) {
  const {show, message, button, link} = props;

  //if (!show) { return null; }

  return (
    <div className="top-banner fixed-top">
      <div className="d-flex justify-content-center">
        <span><p class="mb-0">{message}</p></span>
        <span><a href={link} target="_blank" className="btn btn-outline-secondary">{button}</a></span>
      </div>
    </div>
  );
}

export function TopNavCollapsible(props) {
  return (
    <div className="collapse navbar-collapse justify-content-between" id="top-main-nav">
      {props.children}
    </div>
  );
}

export function NavDropdown(props) {
  const {group, items, pathPrefix} = props;

  const dropdownGroups = items.map((item, index) => {
    if (item.items) {
      const groupLinks = item.items.map((item2, index2) => {
        const cls2 = item2.external ? "dropdown-item external-link" : "dropdown-item";
        let item2_href = item2.link;
        if (item2_href && !item2_href.match(/^https?:/)) {
          item2_href = pathPrefix + item2_href;
        }
        return (
          <a key={index2} className={cls2} href={item2_href}>{item2.label}</a>
        );
      });

      const clnm = "navcol col-for-"+slugify(item.group);

      return (
        <div key={index} className={clnm}>
          <h5 class="dropdown-item">{item.group}</h5>
          {groupLinks}
        </div>
      )
    } else if (item.hero) {
      const hero_id = "dropdown-hero-for-" + slugify(group);
      const img_alt = item.label + " icon";

      let hero_href = item.link;
      if (hero_href && !hero_href.match(/^https?:/)) {
        hero_href = pathPrefix + hero_href;
      }

      return (
        <a key={index} className="dropdown-item dropdown-hero" id={hero_id} href={hero_href}>
          <img id={item.hero} alt={img_alt} />
          <div className="dropdown-hero-text">
            <h4>{item.label}</h4>
            <p>{item.description}</p>
          </div>
        </a>
      )
    } else {
      const cls = item.external ? "dropdown-item ungrouped external-link" : "dropdown-item ungrouped";
      let item_href = item.link;
      if (item_href && !item_href.match(/^https?:/)) {
        item_href = pathPrefix + item_href;
      }
      return (
        <a key={index} className={cls} href={item_href}>{item.label}</a>
      )
    }

  });

  const toggler_id = "topnav_"+slugify(group);
  const dd_id = "topnav_dd_"+slugify(group);

  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id={toggler_id} role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span>{group}</span>
      </a>
      <div className="dropdown-menu" aria-labelledby={toggler_id} id={dd_id}>
        {dropdownGroups}
      </div>
    </li>
  );
}

export function NavWrapper(props) {
  return (
    <nav className="top-nav navbar navbar-expand-lg navbar-dark fixed-top" style={props.belowAlertBanner ? {"margin-top": "46px"}: {}}>
      {props.children}
    </nav>
  )
};

export function NavControls(props) {
  return (
    <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#top-main-nav" aria-controls="navbarHolder" aria-expanded="false" aria-label="Toggle navigation">
      {props.children}
    </button>
  );
};

export function MobileMenuIcon() {
  return (
    <span className="navbar-toggler-icon"><div></div></span>
  );
}

export function NavItems(props) {
  return (
    <ul className="nav navbar-nav" id="topnav-pages">
      {props.children}
    </ul>
  );
}

export function NavItem(props) {
  return (
    <li className="nav-item">
      {props.children}
    </li>
  );
}

export function LogoBlock(props) {
  const { to, img, altText } = props;
  return (
    <a className="navbar-brand" href={to}>
      <img className="logo" alt={altText} height="40" />
    </a>
  );
}

export class ThemeToggle extends React.Component {

  auto_update_theme() {
    const upc = window.localStorage.getItem('user-prefers-color');
    let theme = "dark"; // Default to dark theme
    if (!upc) {
      // User hasn't saved a preference specifically for this site; check
      // the browser-level preferences.
      if (window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: light)").matches) {
        theme = "light";
      }
    } else { // Follow user's saved setting.
      theme = (upc == "light") ? "light" : "dark";
    }
    const disable_theme = (theme == "dark") ? "light" : "dark";
    document.documentElement.classList.add(theme);
    document.documentElement.classList.remove(disable_theme);
  }

  user_choose_theme() {
    const new_theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    window.localStorage.setItem("user-prefers-color", new_theme);
    document.body.style.transition = "background-color .2s ease";
    const disable_theme = (new_theme == "dark") ? "light" : "dark";
    document.documentElement.classList.add(new_theme);
    document.documentElement.classList.remove(disable_theme);
  }

  render() {
    return (
      <div className="nav-item" id="topnav-theme">
        <form className="form-inline">
          <div className="custom-control custom-theme-toggle form-inline-item" title="" data-toggle="tooltip" data-placement="left" data-original-title="Toggle Dark Mode">
            <input type="checkbox" className="custom-control-input" id="css-toggle-btn"
              onClick={this.user_choose_theme} />
            <label className="custom-control-label" for="css-toggle-btn"><span className="d-lg-none">Light/Dark Theme</span></label>
          </div>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.auto_update_theme();
  }
}
