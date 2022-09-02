import * as React from "react";
import { useState, useEffect } from "react";
import { usePathPrefix } from "@redocly/developer-portal/ui";

export default function XRPOverview() {
  const prefix = usePathPrefix();
  let [escrowInfo, setEscrowInfo] = useState({ date: "", amount: "" });

  useEffect(() => {
    async function getEscrow() {
      const resp = await fetch(
        "https://data.ripple.com/v2/network/xrp_distribution?descending=true&limit=1"
      );
      const json = await resp.json();
      const exact_amt = json.rows[0].escrowed;
      const amtBillions = Math.floor(exact_amt / 1e9) + "B";
      const date = new Date(json.rows[0].date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
      setEscrowInfo({ date: date, amount: amtBillions });
    }
    getEscrow();
  }, []);

  const links = [
    { hash: "#about-xrp", text: "About XRP" },
    { hash: "#xrp-trading", text: "XRP in Trading" },
    { hash: "#ripple", text: "Ripple vs. XRP" },
    { hash: "#wallets", text: "XRP Wallets" },
    { hash: "#exchanges", text: "XRP Exchanges" },
  ];
  const hardWallets = [
    {
      href: "https://www.ledger.com/",
      id: "wallet-ledger",
      alt: "Ledger",
      imgclasses: "invertible-img",
    },
    {
      href: "https://trezor.io/",
      id: "wallet-trezor",
      alt: "Trezor",
      imgclasses: "invertible-img",
    },
  ];

  const softWallets = [
    { href: "https://xumm.app/", id: "wallet-xumm", alt: "Xumm" },
    {
      href: "https://trustwallet.com/",
      id: "wallet-trust",
      alt: "Trust Wallet",
    },
    {
      href: "https://gatehub.net/",
      id: "wallet-gatehub",
      alt: "Gatehub",
      imgclasses: "invertible-img",
    },
  ];
  const exchanges = [
    {
      href: "https://www.bitstamp.net/",
      id: "exch-bitstamp",
      alt: "Bitstamp",
      idx: 1,
    },
    {
      href: "https://www.kraken.com/",
      id: "exch-kraken",
      alt: "Kraken",
      idx: 2,
    },
    { href: "https://cex.io/", id: "exch-cex-io", alt: "Cex.io", idx: 3 },
    {
      href: "https://www.liquid.com/",
      id: "exch-liquid",
      alt: "Liquid",
      idx: 4,
    },
    { href: "https://www.lmax.com/", id: "exch-lmax", alt: "LMAX", idx: 5 },
    {
      href: "https://www.bitfinex.com/",
      id: "exch-bitfinex",
      alt: "Bitfinex",
      idx: 6,
    },
    {
      href: "https://www.etoro.com/crypto/exchange/",
      id: "exch-etoro",
      alt: "eToro",
      idx: 7,
    },
    {
      href: "https://currency.com",
      id: "exch-currency-com",
      alt: "Currency.com",
      idx: 8,
    },
    {
      href: "https://bittrex.com/",
      id: "exch-bittrex",
      alt: "Bittrex",
      idx: 9,
    },
    { href: "https://ftx.com/", id: "exch-ftx", alt: "FTX", idx: 10 },
  ];

  return (
    <div className="landing  styled-page">
      <div className="position-relative">
        <img
          src={prefix + "/img/backgrounds/xrp-overview-blue.svg"}
          className="landing-bg"
          id="xrp-overview-blue"
        />
      </div>

      <section className="py-26 text-center">
        <div className="col-lg-5 mx-auto text-center">
          <div className="d-flex flex-column-reverse">
            <h1 className="mb-0">Your Questions About XRP, Answered</h1>
            <h6 className="eyebrow mb-3">XRP Overview</h6>
          </div>
        </div>
      </section>

      <section className="container-new my-20">
        <div className="card-grid card-grid-1x2 pt-2">
          <div className="d-none-sm mt-lg-0 ">
            <ul className="page-toc no-sideline p-0 sticky-top floating-nav">
              {links.map((link) => {
                return (
                  <li className="nav-item">
                    <a className="sidelinks nav-link" href={link.hash}>
                      {link.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="col mt-lg-0">
            <div className="link-section pb-26" id="about-xrp">
              <h2 className="h4 h2-sm mb-8">What Is XRP?</h2>
              <h5 className="longform mb-10">
                XRP is a digital asset that’s native to the XRP Ledger—an
                open-source, permissionless and decentralized{" "}
                <a
                  href="https://www.distributedagreement.com/2018/09/24/what-is-a-blockchain/"
                  target="_blank"
                >
                  blockchain technology.
                </a>
              </h5>
              <p className="mb-6">
                Created in 2012 specifically for payments, XRP can settle
                transactions on the ledger in 3-5 seconds. It was built to be a
                better Bitcoin—faster, cheaper and greener than any other
                digital asset.
              </p>
              <div className="overflow-x-xs">
                <table className="mb-10 landing-table">
                  <thead>
                    <tr>
                      <th>
                        <h6>Benefits</h6>
                      </th>
                      <th>
                        <h6>XRP</h6>
                      </th>
                      <th>
                        <h6>Bitcoin</h6>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Fast</td>
                      <td>3-5 seconds to settle</td>
                      <td>500 seconds to settle</td>
                    </tr>
                    <tr>
                      <td>Low-Cost</td>
                      <td>$0.0002/tx</td>
                      <td>$0.50/tx</td>
                    </tr>
                    <tr>
                      <td>Scalable</td>
                      <td>1,500 tx per second</td>
                      <td>3 tx per second</td>
                    </tr>
                    <tr>
                      <td>Sustainable</td>
                      <td>
                        Environmentally sustainable (negligible energy
                        consumption)
                      </td>
                      <td>0.3% of global energy consumption</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mb-10">
                XRP can be sent directly without needing a central intermediary,
                making it a convenient instrument in bridging two different
                currencies quickly and efficiently. It is freely exchanged on
                the open market and used in the real world for enabling
                cross-border payments and microtransactions.
              </p>
              <div className="card-grid card-grid-2xN mb-10">
                <div>
                  <img
                    className="mw-100 mb-2 invertible-img"
                    src={prefix + "/img/icons/briefcase.svg"}
                  />
                  <h6 className="fs-4-5">Financial Institutions</h6>
                  <p className="">
                    Leverage XRP as a bridge currency to facilitate faster, more
                    affordable cross-border payments around the world.
                  </p>
                </div>
                <div>
                  <img
                    className="mw-100 mb-2 invertible-img"
                    src={prefix + "/img/icons/user.svg"}
                  />
                  <h6 className="fs-4-5">Individual Consumers</h6>
                  <p>Use XRP to move different currencies around the world. </p>
                </div>
              </div>
              <div className="mt-10 p-10 br-8 cta-card position-relative">
                <img
                  src={prefix + "/img/backgrounds/cta-xrp-overview-magenta.svg"}
                  className="cta cta-bottom-right"
                />
                <div className="z-index-1 position-relative">
                  <h2 className="h4 mb-10-until-sm mb-8-sm">
                    XRP was designed with sustainability in mind.
                  </h2>
                  <p className="mb-10">
                    Explore how the energy consumption of XRP compares to other
                    currencies.
                  </p>
                  <a
                    className="btn btn-primary btn-arrow"
                    href="carbon-calculator.html"
                  >
                    Green Currency Calculator
                  </a>
                </div>
              </div>
            </div>

            <div className="py-26 link-section" id="xrp-trading">
              <h2 className="h4 h2-sm mb-8">How Is XRP Used in Trading?</h2>
              <h5 className="longform mb-10">
                XRP is traded on more than 100 markets and exchanges worldwide.
              </h5>
              <p className="mb-6">
                XRP’s low transaction fees, reliability and high-speed enable
                traders to use the digital asset as high-speed, cost-efficient
                and reliable collateral across trading venues—
                <a
                  href="https://ripple.com/insights/xrp-a-preferred-base-currency-for-arbitrage-trading/"
                  target="_blank"
                >
                  seizing arbitrage opportunities
                </a>
                , servicing margin calls and managing general trading inventory
                in real time.
              </p>
              <p>
                Because of the properties inherent to XRP and the ecosystem
                around it, traders worldwide are able to shift collateral,
                bridge currencies and switch from one crypto into another nearly
                instantly, across any exchange on the planet.
              </p>
            </div>

            <div className="py-26 link-section" id="ripple">
              <h2 className="h4 h2-sm mb-8">
                What Is the Relationship Between Ripple and XRP?
              </h2>
              <h5 className="longform mb-10">
                <a href="https://ripple.com" target="_blank">
                  Ripple
                </a>{" "}
                is a technology company that makes it easier to build a
                high-performance, global payments business. XRP is a digital
                asset independent of this.
              </h5>
              <p>
                There is a finite amount of XRP. All XRP is already in existence
                today—no more than the original 100 billion can be created. The
                XRPL founders gifted 80 billion XRP, the platform’s native
                currency, to Ripple. To provide predictability to the XRP
                supply, Ripple has locked 55 billion XRP (55% of the total
                possible supply) into a series of escrows using the XRP Ledger
                itself. The XRPL's transaction processing rules, enforced by the
                consensus protocol, control the release of the XRP.
              </p>
              <div className="mt-10 p-10 br-8 cta-card position-relative">
                <img
                  src={prefix + "/img/backgrounds/cta-xrp-overview-green-2.svg"}
                  className="landing-bg cta cta-bottom-right"
                />
                <div className="z-index-1 position-relative">
                  <h3 className="h4">
                    As of{" "}
                    <span className="stat-highlight" id="ripple-escrow-as-of">
                      {escrowInfo.date || "December 2017"}
                    </span>{" "}
                    <br />
                    <span className="d-inline-flex">
                      <img
                        id="xrp-mark-overview"
                        className="mw-100 invertible-img mr-2"
                        src={prefix + "/img/logos/xrp-mark.svg"}
                        alt="XRP Logo Mark"
                      />{" "}
                      <span
                        className="numbers stat-highlight"
                        id="ripple-escrow-amount"
                      >
                        {escrowInfo.amount || "55B"}
                      </span>
                    </span>
                    <br />
                    XRP remains in escrow
                  </h3>
                </div>
              </div>
            </div>

            <div className="link-section py-26" id="wallets">
              <h2 className="h4 h2-sm mb-8">What Wallets Support XRP?</h2>
              <h5 className="longform mb-10">
                Digital wallets are pieces of software that allow people to
                send, receive, and store cryptocurrencies, including XRP. There
                are two types of digital wallets: hardware and software.
              </h5>
              <ul className="nav nav-grid-lg cols-of-4" id="wallets">
                <li className="nav-item nav-grid-head">
                  <h6 className="fs-4-5">Software Wallets</h6>
                </li>
                {softWallets.map((wallet) => {
                  return (
                    <li className="nav-item">
                      <a
                        className="nav-link external-link"
                        href={wallet.href}
                        target="_blank"
                      >
                        <img
                          className={"mw-100" + " " + wallet.imgclasses || ""}
                          id={wallet.id}
                          alt={wallet.alt}
                        />
                      </a>
                    </li>
                  );
                })}

                <li className="nav-item nav-grid-head">
                  <h6 className="fs-4-5">Hardware Wallets</h6>
                </li>
                {hardWallets.map((wallet) => {
                  return (
                    <li className="nav-item">
                      <a
                        className="nav-link external-link"
                        href={wallet.href}
                        target="_blank"
                      >
                        <img
                          className={"mw-100" + " " + wallet.imgclasses || ""}
                          id={wallet.id}
                          alt={wallet.alt}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
              <p className="fs-3 mt-10">
                Disclaimer: This information is drawn from other sources on the
                internet. XRPL.org does not endorse or recommend any exchanges
                or make any representations with respect to exchanges or the
                purchase or sale of digital assets more generally. It’s
                advisable to conduct your own due diligence before relying on
                any third party or third-party technology, and providers may
                vary significantly in their compliance, data security, and
                privacy practices.
              </p>
            </div>

            <div className="py-26 link-section" id="exchanges">
              <h2 className="h4 h2-sm mb-8">What Exchanges Support XRP?</h2>
              <h5 className="longform mb-10">
                Exchanges are where people trade currencies. XRP is traded on
                more than 100 markets and exchanges worldwide.
              </h5>
              <p className="mb-10">
                There are different types of exchanges that vary depending on
                the type of market (spot, futures, options, swaps), and the type
                of security model (custodial, non-custodial).
              </p>
              <div className="card-grid card-grid-2xN mb-10">
                <div>
                  <h6 className="fs-4-5">Spot Exchanges</h6>
                  <p className="mb-0">
                    Spot exchanges allow people to buy and sell cryptocurrencies
                    at current (spot) market rates.
                  </p>
                </div>
                <div>
                  <h6 className="fs-4-5">
                    Futures, Options and Swap Exchanges
                  </h6>
                  <p className="mb-0">
                    Futures, options and swap exchanges allow people to buy and
                    sell standardized contracts of cryptocurrency market rates
                    in the future.
                  </p>
                </div>
                <div>
                  <h6 className="fs-4-5">Custodial Exchanges</h6>
                  <p className="mb-0">
                    Custodial exchanges manage a user’s private keys, and
                    publish centralized order books of buyers and sellers.
                  </p>
                </div>
                <div>
                  <h6 className="fs-4-5">Non-Custodial Exchanges</h6>
                  <p className="mb-0">
                    Non-custodial exchanges, also known as decentralized
                    exchanges, do not manage a user’s private keys, and publish
                    decentralized order books of buyers and sellers on a
                    blockchain.
                  </p>
                </div>
              </div>
              <h6>Top Exchanges, according to CryptoCompare</h6>
              <ul
                className="nav nav-grid-lg cols-of-5 mb-10"
                id="top-exchanges"
              >
                {exchanges.map((exch) => {
                  return (
                    <li className="nav-item">
                      <a
                        className="nav-link external-link"
                        href={exch.href}
                        target="_blank"
                      >
                        <span className="longform mr-3">{exch.idx}</span>
                        <img className="mw-100" id={exch.id} alt={exch.alt} />
                      </a>
                    </li>
                  );
                })}
              </ul>

              <p className="fs-3 mt-10 mb-0">
                Disclaimer: This information is drawn from other sources on the
                internet. XRPL.org does not endorse or recommend any exchanges
                or make any representations with respect to exchanges or the
                purchase or sale of digital assets more generally. It’s
                advisable to conduct your own due diligence before relying on
                any third party or third-party technology, and providers may
                vary significantly in their compliance, data security, and
                privacy practices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
