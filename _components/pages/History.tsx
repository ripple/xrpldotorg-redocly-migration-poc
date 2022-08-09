import * as React from "react";
import { usePathPrefix } from '@redocly/developer-portal/ui';

export default function History() {
  const prefix = usePathPrefix()
  return (
    <div className="overflow-hidden landing styled-page">
      <div className="position-relative">
        <img
          src={prefix + "/img/backgrounds/history-orange.svg"}
          className="landing-bg"
          id="history-orange"
        />
      </div>

      <section className="py-26 text-center">
        <div className="col-lg-5 mx-auto text-center">
          <div className="d-flex flex-column-reverse">
            <h1 className="mb-0">Provide a Better Alternative to Bitcoin</h1>
            <h6 className="eyebrow mb-3">XRPL's Origin</h6>
          </div>
        </div>
      </section>

      <section className="container-new py-26">
        <div className="col-lg-6 offset-lg-3">
          <h4 className="longform mb-10">
            In 2011, three engineers—David Schwartz, Jed McCaleb, and Arthur Britto—began
            developing the XRP Ledger (XRPL). Fascinated by Bitcoin, they set out to
            create a better version that improved upon its limitations—with the goal of
            creating a digital asset that was more sustainable and built specifically for
            payments.
          </h4>
          <p className="mb-6">
            The XRP Ledger first launched in June 2012. Shortly thereafter, they were
            joined by Chris Larsen, and the group started the Company NewCoin in September
            2012 (quickly renamed OpenCoin and now named Ripple).
          </p>
          <p className="mb-0">
            The XRPL founders gifted 80 billion XRP, the platform’s native currency, to
            the company. Ripple has since put the majority in escrow.
          </p>
        </div>
      </section>

      <div className="position-relative d-none-sm">
        <img src={prefix + "/img/backgrounds/history-purple.svg"} id="history-purple" />
      </div>

      <div className="container-new marketing-wrapper">
        <section className="row mb-60">
          <div className="timeline">
            <div className="timeline-block mb-20-sm mb-10-until-sm">
              <div className="timeline-dot"></div>
              <div className="timeline-content text-sm-left text-md-right">
                <div className="d-flex flex-column-reverse">
                  <h2 className="mb-6 h5 h2-sm">2011 XRP Ledger Development</h2>
                  <h6 className="h1 mb-3">2011</h6>
                </div>
                <p>
                  In early 2011, three developers—David Schwartz, Jed McCaleb, and Arthur
                  Britto—were fascinated with Bitcoin but observed the waste inherent in
                  mining. They sought to create a more sustainable system for sending
                  value (an idea outlined in a{" "}
                  <a
                    href="https://bitcointalk.org/index.php?topic=10193.0"
                    target="_blank"
                  >
                    May 2011 forum post: “Bitcoin without mining”
                  </a>
                  ).
                </p>
                <a
                  className="btn btn-primary read-more mt-10"
                  href="#"
                  data-target="section-1"
                >
                  Read More
                </a>
                <div className="hidden-section" id="section-1">
                  <p>
                    Their initial observations about the high energy consumption and
                    scalability issues that would plague Bitcoin proved prescient. In
                    2019, estimates suggest Bitcoin mining used{" "}
                    <a href="carbon-calculator.html">
                      more energy than the entire country of Portugal
                    </a>
                    . Moreover, their initial read indicated that significant problems
                    could arise if any miner obtained (or miners colluded to obtain)
                    greater than 50% of the mining power. That risk persists with Bitcoin
                    (and Ethereum) today as mining power has consolidated in China.
                  </p>
                </div>
              </div>
            </div>
            <div className="timeline-block mb-20-sm mb-10-until-sm">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="d-flex flex-column-reverse">
                  <h2 className="mb-6 h5 h2-sm">
                    XRPL Launches its Native Currency, XRP
                  </h2>
                  <h6 className="h1 mb-3">2012</h6>
                </div>
                <p>
                  The trio of developers continued the work to build a distributed ledger
                  that improved upon these fundamental limitations of Bitcoin, originally
                  naming the code Ripple. The ledger included a digital asset that would
                  originally be called “ripples” (XRP as the currency code) to follow the
                  same naming convention as Bitcoin (BTC). At the time, the name Ripple
                  stood for the open-source project, the unique consensus ledger (Ripple
                  Consensus Ledger), transaction protocol (Ripple Transaction Protocol or
                  RTXP), the network (Ripple network), and the digital asset (known as
                  “ripples”).
                </p>
                <a
                  className="btn btn-primary read-more mt-10"
                  href="#"
                  data-target="section-2"
                >
                  Read More
                </a>
                <div className="hidden-section" id="section-2">
                  <p>
                    In practice, this approach led to many broad uses of “Ripple.” For
                    clarity, the community simply started calling the digital asset by its
                    currency code, “XRP.”
                  </p>
                  <p>
                    By June 2012, Schwartz, McCaleb, and Britto finished code development,
                    and the Ledger was complete.
                  </p>
                  <p>
                    Once the XRP Ledger was live, 80% of the XRP was gifted to a new
                    company that set out to build use cases for the digital
                    asset—initially called NewCoin and renamed quickly to OpenCoin.
                  </p>
                  <p>
                    Chris Larsen was the CEO of OpenCoin, and at the company's founding,
                    Jed was co-founder and CTO, David Schwartz was the Chief Cryptography
                    Officer, and Arthur Britto an advisor.
                  </p>
                </div>
              </div>
            </div>
            <div className="timeline-block mb-20-sm mb-10-until-sm">
              <div className="timeline-dot"></div>
              <div className="timeline-content text-sm-left text-md-right">
                <div className="d-flex flex-column-reverse">
                  <h2 className="mb-6 h5 h2-sm">OpenCoin Rebranded to Ripple Labs</h2>
                  <h6 className="h1 mb-3">2013</h6>
                </div>
                <p>
                  Since the early days, OpenCoin set out to revolutionize the global
                  financial system. Despite the revolutionary ideals of many of Bitcoin’s
                  early believers, Larsen never thought blockchain technology should be
                  used to overthrow the existing financial system. He believed that
                  history’s most transformative innovations have always relied on the
                  great ideas that came before them—not displacing them.
                </p>
                <a
                  className="btn btn-primary read-more mt-10"
                  href="#"
                  data-target="section-3"
                >
                  Read More
                </a>
                <div className="hidden-section" id="section-3">
                  <p>
                    In early conversations with potential customers, the team was asked
                    about the differences between the Ripple project and OpenCoin company.
                    With the community starting to refer to the digital asset as XRP,
                    company leaders decided to rebrand the company to Ripple Labs, which
                    has been shortened over time to “Ripple.”
                  </p>
                  <p>
                    Today, Ripple has created a use case leveraging the XRP Ledger and XRP
                    for liquidity management in its cross-border payments business. Ripple
                    also remains a stakeholder and contributor to the broader XRPL
                    community.
                  </p>
                </div>
              </div>
            </div>
            <div className="timeline-block mb-20-sm mb-10-until-sm">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="d-flex flex-column-reverse">
                  <h2 className="mb-6 h5 h2-sm">XRPL Foundation Launched</h2>
                  <h6 className="h1 mb-3">2020</h6>
                </div>
                <p>
                  <a
                    href="https://xrplf.org/assets/XRP_Foundation_Release_24Sep2020.pdf"
                    target="_blank"
                  >
                    Founded
                  </a>{" "}
                  September 24, 2020, the XRPL Foundation is an independent and nonprofit
                  entity with a mission to accelerate the development and adoption of the
                  decentralized XRP Ledger. The Foundation received an initial donation of
                  over $6.5M from Coil, Ripple, and Gatehub to fund the Foundation’s work
                  in service of the growing number of developers and other community
                  members building on the XRP Ledger.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
