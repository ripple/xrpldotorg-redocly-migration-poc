import * as React from "react";
import { XRPLCard } from "../XRPLCard";
import { usePathPrefix } from "@redocly/developer-portal/ui";

export default function XRPLHome() {
  const prefix = usePathPrefix();
  const benefits = [
    {
      id: "public",
      title: "Public and Decentralized Structure",
      description:
        "Open source, open to anyone to build on, maintained by the community",
    },
    {
      id: "streamlined",
      title: "Streamlined <br class='until-sm'/>Development",
      description:
        "Tools and documentation that speed development and reduce time to market",
    },
    {
      id: "performance",
      title: "High <br class='until-sm'/>Performance",
      description: "Capable of settling thousands of transactions in seconds",
    },
    {
      id: "low-cost",
      title: "Low Cost",
      description:
        "At fractions of a penny per transaction, costs are inexpensive enough to enable a wide variety of use cases",
    },
    {
      id: "community",
      title: "Vibrant Community",
      description:
        "Developers, validators, users, and businesses make the XRP Ledger better every day",
    },
    {
      id: "reliability",
      title: "Proven Reliability",
      description:
        "8+ years of consistent performance over more than 63 million ledgers",
    },
  ];

  const advfeatures = [
    {
      href: "docs/use-cases/decentralized-exchange",
      title: "Decentralized Exchange",
      description:
        "A high-performance decentralized peer-to-peer multi-currency exchange built directly into the blockchain",
    },
    {
      href: "docs/use-cases/payments",
      title: "Cross-Currency Payments",
      description:
        "Atomically settle multi-hop payments that cross currency or national boundaries with ease",
    },
    {
      href: "docs/use-cases/payments",
      title: "Payment <br class='until-sm'/>Channels",
      description:
        "Batched micropayments with unlimited speed, secured with XRP",
    },
    {
      href: "docs/use-cases/interoperability",
      title: "Interoperability",
      description:
        "Secure interactions with other chains and legacy payment systems",
    },
    {
      href: "docs/use-cases/tokenization",
      title: "Tokens",
      description:
        'All currencies other than XRP can be represented in the XRP Ledger as tokens, sometimes called "IOUs"',
    },
  ];

  const getstarted = [
    {
      href: "docs/tutorials/quickstart",
      title: "Quickstart",
      description:
        "Access everything you need to get started working with the XRPL",
    },
    {
      href: "docs/tutorials",
      title: "Guided Tutorials",
      description: "Follow step-by-step guides for frequent tasks",
    },
    {
      href: "docs/concepts/intro-to-xrpl",
      title: "XRPL Fundamentals",
      description: "Read about the XRP Ledger's foundational concepts",
    },
    {
      href: "docs/references/client-libraries",
      title: "Choose a Language",
      description:
        "Find tools, documentation, and sample code in Python, Java, Javascript, or use HTTP APIs",
    },
    {
      href: "docs/use-cases",
      title: "Get Inspired",
      description: "Explore use cases already in use on the XRP Ledger",
    },
  ];

  const newfeatures = [
    {
      chip: "In Development",
      title: "Smart Contracts",
      description:
        "Hooks are small, efficient WebAssembly modules designed specifically for the XRPL. Check out the <a href='https://hooks-testnet.xrpl-labs.com/' target='_blank'>hooks amendment and public testnet</a> that enable smart contract functionality.",
      href: "https://hooks-testnet.xrpl-labs.com/",
    },
    {
      chip: "In Development",
      title: "Non-Fungible Tokens",
      description:
        "Lower fees, faster transactions, and custom token functionality make the XRPL ideally suited for building an ecosystem for NFTs.",
      href: "docs/use-cases/tokenization",
    },
    {
      chip: "In Development",
      title: "Sidechains",
      description:
        "Extend, experiment, and specialize a custom sidechain based on the XRPL's proven blockchain technology. Learn more about <a href='https://dev.to/ripplexdev/a-vision-for-federated-sidechains-on-the-xrp-ledger-2o7o' target='_blank'>the vision of sidechains</a>.",
      href: "https://dev.to/ripplexdev/a-vision-for-federated-sidechains-on-the-xrp-ledger-2o7o",
    },
  ];

  return (
    <div className="overflow-hidden page-home styled-page">
      <section className="container-new pb-26-until-sm mt-10 mb-10-sm text-center">
        <div className="w-100">
          <img id="home-hero-graphic" alt="X" />
        </div>
        <div className="col-lg-5 mx-auto text-center pl-0 pr-0">
          <div className="d-flex flex-column-reverse">
            <h1 className="mb-10">
              Community
              <br className="until-sm" /> Powered Utility
            </h1>
            <h6 className="eyebrow mb-3">XRPL | XRP Ledger</h6>
          </div>
          <a href="docs" className="btn btn-primary btn-arrow">
            Start Building
          </a>
        </div>
      </section>
      <div className="position-relative d-none-sm">
        <img
          src={prefix + "/img/backgrounds/home-purple.svg"}
          id="home-purple"
        />
        <img src={prefix + "/img/backgrounds/home-green.svg"} id="home-green" />
      </div>
      <section className="container-new py-26">
        <div className="col-lg-6 offset-lg-3 pl-0-sm pr-0-sm p-8-sm p-10-until-sm">
          <h2 className="h4 mb-8 h2-sm">
            The XRP Ledger: A Scalable, Sustainable Blockchain
          </h2>
          <h6 className="longform mb-10">
            The XRP Ledger (XRPL) is a decentralized, public blockchain led by a
            global developer community.
          </h6>
          <p className="mb-0">
            It’s fast, energy efficient, and reliable. With ease of development,
            low transaction costs, and a knowledgeable community, it provides
            developers with a strong open-source foundation for executing on the
            most demanding projects—without hurting the environment.
          </p>
        </div>
      </section>
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-sm-8 p-0">
          <h3 className="h4 h2-sm">Why developers choose the XRP Ledger</h3>
          <h6 className="eyebrow mb-3">Discover Benefits</h6>
        </div>
        <ul className="mt-10 card-grid card-grid-3xN" id="benefits-list">
          {benefits.map((benefit, idx) => (
            <BenefitItem benefit={benefit} key={idx} idx={idx} />
          ))}
        </ul>
      </section>
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-sm-8 p-0">
          <h3 className="h4 h2-sm">
            Activate the power of the XRP Ledger and find the building blocks
            for your next innovation
          </h3>
          <h6 className="eyebrow mb-3">Explore Advanced Features</h6>
        </div>
        <div
          className="row row-cols-1 row-cols-lg-3 card-deck mt-10"
          id="advanced-features"
        >
          {advfeatures.map((card, idx) => (
            <XRPLCard card={card} key={idx} idx={idx} />
          ))}
        </div>
      </section>
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-sm-8 p-0">
          <h3 className="h4 h2-sm">
            Choose a path to start building on the XRPL
          </h3>
          <h6 className="eyebrow mb-3">Get Started</h6>
        </div>
        <div
          className="row row-cols-1 row-cols-lg-3 card-deck mt-10"
          id="get-started"
        >
          {getstarted.map((card, idx) => (
            <XRPLCard card={card} key={idx} idx={idx} />
          ))}
        </div>
      </section>
      <section className="container-new py-26">
        <div className="col-lg-6 offset-lg-3 p-6-sm p-10-until-sm br-8 cta-card">
          <img
            src={prefix + "/img/backgrounds/cta-home-purple.svg"}
            className="d-none-sm cta cta-top-left"
          />
          <img
            src={prefix + "/img/backgrounds/cta-home-green.svg"}
            className="cta cta-bottom-right"
          />
          <div className="z-index-1 position-relative">
            <h2 className="h4 mb-8-sm mb-10-until-sm">
              Our Shared Vision for XRPL’s Future
            </h2>
            <p className="mb-10">
              Together, we're building the greenest infrastructure to drive
              blockchain innovation that doesn't sacrifice utility or
              performance, to bring the developer community's vision to life.
            </p>
            <a
              className="btn btn-primary btn-arrow"
              href="about/xrp-ledger-overview"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-sm-8 p-0">
          <h3 className="h4 h2-sm">
            Explore what the community is building to enable new features and
            use cases on XRPL
          </h3>
          <h6 className="eyebrow mb-3">Preview New Features</h6>
        </div>
        <ul className="mt-10 card-grid card-grid-3xN">
          {newfeatures.map((feat, idx) => (
            <NewFeatureItem feat={feat} key={idx} idx={idx} />
          ))}
        </ul>
      </section>
      <section className="container-new py-26">
        <div className="col-md-6 offset-md-3 p-8-sm p-10-until-sm br-8 cta-card">
          <img
            src={prefix + "/img/backgrounds/cta-home-magenta.svg"}
            className="cta cta-bottom-right"
          />
          <div className="z-index-1 position-relative">
            <div className="d-flex flex-column-reverse">
              <h2 className="h4 mb-8-sm mb-10-until-sm">
                XRPL.org: by the community, for the community
              </h2>
              <h5 className="eyebrow mb-3">Get Involved</h5>
            </div>
            <p className="mb-10">
              XRPL.org is a community-driven resource by and for developers who
              build on the XRP Ledger (XRPL).
            </p>
            <a className="btn btn-primary btn-arrow" href="community">
              Join the Community
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function BenefitItem(props) {
  const benefit = props.benefit;
  const idx = props.idx;

  return (
    <li className="col ls-none">
      <img id={benefit.id} alt={`${benefit.id} Icon`} />
      <h4
        className="mt-3 mb-0 h5"
        dangerouslySetInnerHTML={{ __html: benefit.title }}
      ></h4>
      <p
        className="mt-6-until-sm mt-3 mb-0"
        dangerouslySetInnerHTML={{ __html: benefit.description }}
      ></p>
    </li>
  );
}

function NewFeatureItem(props) {
  const feat = props.feat;
  const idx = props.idx;

  return (
    <li className="col ls-none pt-2">
      <a className="label chip-green" href={feat.href}>
        {feat.chip}
      </a>
      <h4 className="mt-3 mb-0 h5">{feat.title}</h4>
      <p
        className="mt-6-until-sm mt-3 mb-0"
        dangerouslySetInnerHTML={{ __html: feat.description }}
      ></p>
    </li>
  );
}
