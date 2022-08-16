import React from "react";
import { usePathPrefix } from "@redocly/developer-portal/ui";

export default function Impact() {
  const prefix = usePathPrefix();
  return (
    <div className="landing styled-page">
      <div className="overflow-hidden">
        <div className="position-relative">
          <img
            src={prefix + "/img/backgrounds/impact-green.svg"}
            className="landing-bg"
            id="impact-green"
          />
        </div>

        <section className="py-26">
          <div className="col-lg-5 mx-auto text-center">
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-0">Faster, Cheaper, Green Money</h1>
              <h6 className="eyebrow mb-3">Impact</h6>
            </div>
          </div>
        </section>

        <section className="container-new py-26">
          <div className="col-md-6 offset-md-3 p-10-until-sm pl-0-sm pr-0-sm pt-0">
            <h6 className="longform mb-10">
              The digital asset XRP is a truly global currency—ideally suited to
              enable today’s global economy.
            </h6>
            <p className="mb-6">
              As an optimal medium of exchange, XRP and the XRP Ledger on which
              it operates help to move money around the world faster, cheaper
              and more sustainably than any other currency available today.{" "}
            </p>
            <p className="mb-10">
              It was designed this way, and it’s proving its impact in global
              payments and beyond.
            </p>
            <a
              className="btn btn-primary btn-arrow"
              href="/about/impact"
            >
              How Green is Your Currency?
            </a>
          </div>
        </section>

        <div className="position-relative d-none-sm">
          <img
            src={prefix + "/img/backgrounds/impact-orange.svg"}
            id="impact-orange"
          />
        </div>

        <section className="container-new py-26">
          <div className="col-md-6 offset-md-3 p-10-until-sm pl-0-sm pr-0-sm">
            <h2 className="h4 h2-sm mb-8">Creating Economic Opportunity</h2>
            <h5 className="longform mb-10">
              For more than{" "}
              <a
                href="https://www.un.org/sites/un2.un.org/files/wmr_2020.pdf"
                target="_blank"
              >
                272 million migrants
              </a>{" "}
              worldwide, sending and receiving money across borders is
              expensive, unreliable and complex.
            </h5>
            <p className="mb-6">
              XRP and the XRP Ledger are changing that. The technology has been
              adopted by financial institutions around the world to source
              liquidity for international transactions. Because of the
              unprecedented efficiency it offers, they’re able to bring down
              costs and improve services.
            </p>
            <p className="mb-0">
              This means hundreds of millions of people worldwide who need to
              move money safely and securely across borders can do so more
              affordably and reliably than ever before.
            </p>
          </div>
        </section>

        <section className="container-new py-26">
          <div className="mt-10 card-grid card-grid-2xN">
            <div className="col ls-none mb-16-sm">
              <h2 className="h4 h2-sm mb-8">Building for the Future</h2>
              <h5 className="longform mb-10">
                Digital assets and blockchain technology are the future of
                finance. Open and decentralized, they offer the first-ever
                global standards for value exchange broadly—whether it’s money,
                stocks, loyalty points, intellectual property or more.
              </h5>
              <p className="mb-6">
                This has spawned increasing adoption of the technology across
                the financial services industry, from retail and institutional
                investment to commercial use cases like CBDCs, NFTs and
                cross-border payments.
              </p>
              <p className="mb-0">
                With usage growing, it’s critical that measures are taken today
                to ensure that the technology is environmentally sustainable
                tomorrow.
              </p>
            </div>
            <div className="col ls-none mb-16-sm">
              <div className="col-md-8 mx-auto pl-0-sm pr-0-sm">
                <h6 className="mb-10-until-sm mb-8-sm">
                  Projected BTC, ETH and XRP Transactions in USD
                </h6>
                <div className="mb-10">
                  <div className="d-flex align-items-baseline mb-3">
                    <h5 className="mb-0">2025</h5>
                    <p className="stat-highlight h6 ml-10 mb-0">
                      <img src={prefix + "/img/icons/green-up-arrow.svg"} />
                      +195.3%
                    </p>
                  </div>
                  <p className="numbers">$8.6T</p>
                </div>
                <div>
                  <div className="d-flex align-items-baseline mb-3">
                    <h5 className="mb-0">2030</h5>
                    <p className="stat-highlight h6 ml-10 mb-0">
                      <img src={prefix + "/img/icons/green-up-arrow.svg"} />
                      +21.4%
                    </p>
                  </div>
                  <p className="numbers">$10.5T</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="position-relative d-none-sm">
          <img
            src={prefix + "/img/backgrounds/impact-magenta.svg"}
            id="impact-magenta"
          />
        </div>

        <section className="container-new py-26">
          <div className="col-md-6 offset-md-3 p-10-until-sm pl-0-sm pr-0-sm">
            <h2 className="h4 h2-sm mb-8">Are All Digital Assets Alike?</h2>
            <h5 className="longform mb-10">
              All digital assets have different strengths that make them ideal
              for various use cases.
            </h5>
            <p className="mb-6">
              Bitcoin has historically been recognized as a store of value and
              Ether (ETH) for its smart contract capabilities.
            </p>
            <p className="mb-6">
              XRP was designed to be optimal for global payments—it’s fast,
              cheap, scalable and energy-efficient. But the XRP Ledger is also
              increasingly popular for innovative blockchain use cases, like
              NFTs and DeFi.
            </p>
            <p className="mb-6">
              The same characteristics that make XRP ideal for global
              transactions mean it’s also better for our environment. XRP is
              green by nature.
            </p>
          </div>
        </section>

        <section className="container-new py-26">
          <div className="col-md-6 offset-md-3 p-10-until-sm pl-0-sm pr-0-sm">
            <h2 className="h4 h2-sm mb-8">What Makes the XRP Ledger Green?</h2>
            <h5 className="longform mb-10">
              Most currencies today—whether digital or physical—are not
              environmentally friendly. The potential for long-term impact on
              our planet could hold startling consequences.{" "}
            </h5>
            <p className="mb-6">
              The XRP Ledger processes transactions through a unique “consensus”
              mechanism that consumes negligible energy and all XRP currency is
              already in circulation.
            </p>
            <p className="mb-6">
              Cash also leaves a substantial carbon footprint, and the
              environmental impact goes beyond energy consumption—eutrophication
              (due to waste), photochemical ozone creation, greenhouse gas
              emissions and more factor into the equation.
            </p>
            <p className="mb-6">
              Other digital assets, like Bitcoin, rely on a different mechanism
              to both validate transactions and create new coins. This
              “proof-of-work” algorithm requires “mining.” Mining is an
              incredibly energy-intensive process for validating transactions
              that consumes more energy in a year than entire countries.
            </p>
            <p className="mb-10">
              Adopting XRP more broadly will help limit this waste and ensure a
              sustainable future for our planet and global economy.
            </p>
            <a
              className="btn btn-primary btn-arrow"
              href="/about/impact"
            >
              Explore the Carbon Calculator
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
