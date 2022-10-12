// {% block head %}

//     <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
//     <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
//     <!--[if lt IE 9]>
//       <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
//       <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
//     <![endif]-->

// {% endblock %}
import ReactGA from "react-ga";
import React, { useEffect } from "react";
import { usePathPrefix } from "@redocly/developer-portal/ui";
import { Helmet } from "react-helmet";

export default function CarbonCalculator() {
  const prefix = usePathPrefix();
  const TRACKING_ID = "UA-45576805-2";
  ReactGA.initialize(TRACKING_ID);
  const numbers = [
    { num: "20" },
    { num: "40" },
    { num: "60" },
    { num: "80" },
    { num: "100" },
  ];

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "page_info",
    page_type: "Splash Page",
    page_group: "About",
  });

  return (
    <>
      <div className="no-sidebar page-calculator landing">
        <div className="position-relative ">
          <img
            src={prefix + "/img/backgrounds/calculator-purple.svg"}
            className="landing-bg"
            id="calculator-purple"
          />
        </div>
        <section className="py-26 text-center">
          <div className="col-lg-5 mx-auto text-center">
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-10">Green Currency Interactive Tool</h1>
              <h6 className="eyebrow mb-3">How Green Is Your Currency?</h6>
            </div>
            <a className="btn btn-primary" href="#carbon-calculator-section">
              Explore
            </a>
          </div>
        </section>

        <div className="position-relative d-none-sm">
          <img
            src={prefix + "/img/backgrounds/calculator-green.svg"}
            id="calculator-green"
          />
        </div>

        <section className="container-new py-26">
          <div className="col-lg-6 offset-lg-3 p-10-until-sm pt-0">
            <h2 className="h4 h2-sm mb-8">
              Energy Consumption for Cash, Credit Cards and Crypto
            </h2>
            <h5 className="longform mb-10">
              Moving money carries cost—and not just the fee on your transaction
              or the value of your payment.
            </h5>
            <p className="mb-6">
              Whether it’s in cash, on a credit card or with crypto, every
              transaction you make consumes energy, and therefore, emits
              pollutants into the environment.
            </p>
            <p className="mb-6">
              The impact of this is startling when you look at the total
              transactions across an entire year—for any one form of currency.
            </p>
            <p className="mb-0">
              Find out more about the environmental cost of some of the world’s
              most popular and innovative currencies, and start making more
              educated choices about how you transact.
            </p>
          </div>
        </section>

        <section className="container-new py-26">
          <div className="col-md-6 offset-md-3 p-6-sm p-10-until-sm br-8 cta-card">
            <img
              src={prefix + "/img/backgrounds/cta-calculator-green.svg"}
              className="cta cta-bottom-right"
            />
            <div className="z-index-1 position-relative">
              <h2 className="h4 mb-10-until-sm mb-8-sm">
                How Does XRP Compare to Other Currencies?
              </h2>
              <a
                className="btn btn-primary btn-arrow"
                href={prefix + "/pdf/xrpl-sustainability-methodology-2020.pdf"}
              >
                Methodology
              </a>
            </div>
          </div>
        </section>

        <div className="container py-26" id="carbon-calculator-section">
          <section className="row">
            <a
              href="#"
              className="btn btn-outline-primary d-lg-none"
              id="calculator-mobile-toggle"
            >
              Change Inputs
            </a>
            <div id="calculator-inputs-offset"></div>
            <div className="col-lg-4">
              <div
                className="rounded sticky-top floating-nav mb-3 mb-lg-0"
                id="calculator-inputs"
              >
                <div className="border-green p-3 br-8 calc-inputs">
                  <h4 className="h5">
                    Comparing
                    <br className="until-sm" /> Transaction Data
                  </h4>
                  <ul
                    className="p-0 mt-10 ls-none d-sm-flex d-lg-block d-xl-flex flex-wrap justify-content-center justify-xl-content-around"
                    id="data-selector"
                  >
                    <li className="d-block d-xl-inline-flex text-center active">
                      <a
                        className="tab-link d-block d-xl-flex fs-base va-middle"
                        href="#"
                        data-currencytype="d-crypto"
                      >
                        Crypto
                      </a>
                    </li>
                    <li className="d-block d-xl-inline-flex text-center">
                      <a
                        className="tab-link d-block d-xl-flex fs-base va-middle"
                        href="#"
                        data-currencytype="d-credit"
                      >
                        Credit Cards
                      </a>
                    </li>
                    <li className="d-block d-xl-inline-flex text-center">
                      <a
                        className="tab-link d-block d-xl-flex fs-base va-middle"
                        href="#"
                        data-currencytype="d-cash"
                      >
                        Cash
                      </a>
                    </li>
                  </ul>
                  <p className="grey-500 mb-0 mt-4 text-smaller">
                    Number of Transactions:
                  </p>
                  <div className="slidecontainer mb-10">
                    <input
                      type="range"
                      min="20"
                      max="100"
                      defaultValue="60"
                      className="slider w-100"
                      id="myRange"
                      step="20"
                    />
                    <ul
                      className="d-flex p-0 ls-none justify-content-between position-relative mr-neg-8 ml-neg-8 mt-1"
                      style={{ zIndex: -1 }}
                    >
                      {numbers.map((n) => {
                        return (
                          <li
                            className="dash text-center text-smaller grey-500"
                            data-num={n.num}
                          >
                            {n.num}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="d-flex mb-3 ml-3">
                    <a
                      href="https://twitter.com/intent/tweet?url=https://xrpl.org/carbon-calculator.html&text=XRPL Carbon Calculator"
                      target="_blank"
                      className="mr-3"
                    >
                      <img
                        src={prefix + "/img/logos/twitter-link.svg"}
                        alt="Twitter share"
                        className="mw-100"
                      />
                    </a>
                    <a
                      href="https://www.linkedin.com/sharing/share-offsite/?url=https://xrpl.org/carbon-calculator.html"
                      target="_blank"
                      className="mr-3"
                    >
                      <img
                        src={prefix + "/img/logos/linkedin.svg"}
                        alt="LinkedIn share"
                        className="mw-100"
                      />
                    </a>
                    <a
                      href="https://www.facebook.com/sharer/sharer.php?u=https://xrpl.org/carbon-calculator.html"
                      target="_blank"
                      className="mr-3"
                    >
                      <img
                        src={prefix + "/img/logos/facebook.svg"}
                        alt="Facebook share"
                        className="mw-100"
                      />
                    </a>
                  </div>
                </div>
                <a
                  href={
                    prefix + "/pdf/xrpl-sustainability-methodology-2020.pdf"
                  }
                  target="_blank"
                  className="arrow-link bold mt-4 d-block"
                >
                  Learn more about the methodology
                </a>
              </div>
            </div>

            <div
              className="col-lg-7 offset-lg-1 scroll-container h-100 mt-20-sm"
              id="calculator-outputs"
            >
              <section className="min-vh100 bb-gray mb-40 section1 clearfix">
                <h4 className="h5">Energy Consumption of Portugal</h4>

                <p className="grey-400 text-small my-4">
                  Comparing <span className="slider-amt"></span> Million
                  Transactions in 2019
                </p>

                <p className="calculator-section-description">
                  The country of Portugal consumes 46.94 billion Kilowatt hours
                  (kWh) of energy annually. Explore how much energy today’s
                  various currencies consume in relation to Portugal.
                </p>

                <div className="d-viz d-viz-1 mt-10">
                  <ul className="d-sm-flex  p-0">
                    <li
                      className="d-output d-crypto active"
                      data-comp="kWh"
                      data-type="btc"
                    >
                      <div className="viz-wrapper">
                        <img
                          src={prefix + "/img/green/Portugal.png"}
                          alt="Portugal"
                          className="mw-100"
                        />
                        <div className="dot" id="kWh-btc-dot"></div>
                      </div>
                      <div className="num-wrapper">
                        <img
                          src={prefix + "/img/icons/bw-bitcoin.png"}
                          alt="BTC"
                          className="mw-100 mt-3 invertible-img"
                        />
                        <p className="h6 mt-2 mb-1">Bitcoin</p>
                        <h5 className="normal mb-0" id="kWh-btc"></h5>
                        <p className="text-small black-90">kWh</p>
                      </div>
                    </li>
                    <li
                      className="d-output d-crypto active"
                      data-comp="kWh"
                      data-type="eth"
                    >
                      <div className="viz-wrapper">
                        <img
                          src={prefix + "/img/green/Portugal.png"}
                          className="mw-100"
                        />
                        <div className="dot" id="kWh-eth-dot"></div>
                      </div>
                      <div className="num-wrapper">
                        <img
                          src={prefix + "/img/icons/bw-ethereum.png"}
                          alt="ETH"
                          className="mw-100 mt-3 invertible-img"
                        />
                        <p className="h6 mt-2 mb-1">Ethereum</p>
                        <h5 className="normal mb-0" id="kWh-eth"></h5>
                        <p className="text-small black-90">kWh</p>
                      </div>
                    </li>
                    <li
                      className="d-output d-cash"
                      data-comp="kWh"
                      data-type="pap"
                    >
                      <div className="viz-wrapper">
                        <img
                          src={prefix + "/img/green/Portugal.png"}
                          className="mw-100"
                        />
                        <div className="dot" id="kWh-pap-dot"></div>
                      </div>
                      <div className="num-wrapper">
                        <img
                          src={prefix + "/img/icons/bw-cash.png"}
                          className="mw-100 mt-3 mb-2 invertible-img"
                        />
                        <p className="h6 mt-2 mb-1">Cash</p>
                        <h5 className="normal mb-0" id="kWh-pap"></h5>
                        <p className="text-small black-90">kWh</p>
                      </div>
                    </li>
                    <li
                      className="d-output d-crypto d-credit d-cash active"
                      data-comp="kWh"
                      data-type="xrp"
                    >
                      <div className="viz-wrapper">
                        <img
                          src={prefix + "/img/green/Portugal.png"}
                          className="mw-100"
                        />
                        <div className="dot" id="kWh-xrp-dot"></div>
                      </div>
                      <div className="num-wrapper">
                        <img
                          src={prefix + "/img/icons/xrp.png"}
                          alt="XRP"
                          className="mw-100 mt-3 invertible-img"
                        />
                        <p className="h6 mt-2 mb-1">XRP</p>
                        <h5 className="normal mb-0" id="kWh-xrp"></h5>
                        <p className="text-small black-90">kWh</p>
                      </div>
                    </li>
                    <li
                      className="d-output d-credit"
                      data-comp="kWh"
                      data-type="vsa"
                    >
                      <div className="viz-wrapper">
                        <img
                          src={prefix + "/img/green/Portugal.png"}
                          alt="Portugal"
                          className="mw-100"
                        />
                        <div className="dot" id="kWh-vsa-dot"></div>
                      </div>
                      <div className="num-wrapper">
                        <img
                          src={prefix + "/img/icons/bw-visa.png"}
                          alt="Visa"
                          className="mw-100 mb-2 invertible-img"
                          style={{ marginTop: "1.85rem" }}
                        />
                        <p className="h6 mt-2 mb-1">Visa</p>
                        <h5 className="normal mb-0" id="kWh-vsa"></h5>
                        <p className="text-small black-90">kWh</p>
                      </div>
                    </li>
                    <li
                      className="d-output d-credit"
                      data-comp="kWh"
                      data-type="mst"
                    >
                      <div className="viz-wrapper">
                        <img
                          src={prefix + "/img/green/Portugal.png"}
                          alt="Portugal"
                          className="mw-100"
                        />
                        <div className="dot" id="kWh-mst-dot"></div>
                      </div>
                      <div className="num-wrapper">
                        <img
                          src={prefix + "/img/icons/bw-mastercard.png"}
                          alt="Mastercard"
                          className="mw-100 mb-1 invertible-img"
                          style={{ marginTop: "1.65rem" }}
                        />
                        <p className="h6 mt-2 mb-1">Mastercard</p>
                        <h5 className="normal mb-0" id="kWh-mst"></h5>
                        <p className="text-small black-90">kWh</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>
              <section className="min-vh100 bb-gray mb-40 section2 clearfix">
                <h4 className="h5">
                  CO<sub>2</sub> Emissions from Airline Flights
                </h4>

                <p className="grey-400 text-small my-4">
                  Comparing <span className="slider-amt"></span> Million
                  Transactions in 2019
                </p>

                <p className="calculator-section-description">
                  A 12-hour flight from London to Hong Kong releases 3 tons of
                  carbon dioxide (CO<sub>2</sub>). Discover how much CO
                  <sub>2</sub> different forms of currency release in comparison
                  to emissions from airline flights.
                </p>

                <div className="mt-10" id="co2Animation"></div>

                <ul className="d-sm-flex  p-0">
                  <li
                    className="d-output d-crypto active"
                    data-comp="tons"
                    data-type="btc"
                  >
                    <p className="h6 mt-3 mb-1">Bitcoin</p>
                    <h5 className="normal mb-0" id="tons-btc"></h5>
                    <p className="text-small black-90">
                      metric tons of CO<sub>2</sub>
                    </p>
                  </li>
                  <li
                    className="d-output d-crypto active"
                    data-comp="tons"
                    data-type="eth"
                  >
                    <p className="h6 mt-3 mb-1">Ethereum</p>
                    <h5 className="normal mb-0" id="tons-eth"></h5>
                    <p className="text-small black-90">
                      metric tons of CO<sub>2</sub>
                    </p>
                  </li>
                  <li
                    className="d-output d-cash"
                    data-comp="tons"
                    data-type="pap"
                  >
                    <p className="h6 mt-3 mb-1">Cash</p>
                    <h5 className="normal mb-0" id="tons-pap"></h5>
                    <p className="text-small black-90">
                      metric tons of CO<sub>2</sub>
                    </p>
                  </li>
                  <li
                    className="d-output d-crypto d-credit d-cash active"
                    data-comp="tons"
                    data-type="xrp"
                  >
                    <p className="h6 mt-3 mb-1">XRP</p>
                    <h5 className="normal mb-0" id="tons-xrp"></h5>
                    <p className="text-small black-90">
                      metric tons of CO<sub>2</sub>
                    </p>
                  </li>
                  <li
                    className="d-output d-credit"
                    data-comp="tons"
                    data-type="vsa"
                  >
                    <p className="h6 mt-3 mb-1">Visa</p>
                    <h5 className="normal mb-0" id="tons-vsa"></h5>
                    <p className="text-small black-90">
                      metric tons of CO<sub>2</sub>
                    </p>
                  </li>
                  <li
                    className="d-output d-credit"
                    data-comp="tons"
                    data-type="mst"
                  >
                    <p className="h6 mt-3 mb-1">Mastercard</p>
                    <h5 className="normal mb-0" id="tons-mst"></h5>
                    <p className="text-small black-90">
                      metric tons of CO<sub>2</sub>
                    </p>
                  </li>
                </ul>
              </section>
              <section className="min-vh100 bb-gray section3 clearfix">
                <h4 className="h5">Gas Consumption by the Gallon</h4>

                <p className="grey-400 text-small my-4">
                  Comparing <span className="slider-amt"></span> Million
                  Transactions in 2019
                </p>

                <p className="calculator-section-description">
                  An Ultra Large Crude Carrier (ULCC) carries approximately 120
                  million gallons of gas. Measure the environmental impact
                  between currencies in relation to the amount of gas they would
                  consume in the real-world.
                </p>

                <div className="mt-10" id="gasAnimation"></div>

                <ul className="d-sm-flex  p-0">
                  <li
                    className="d-output d-crypto active"
                    data-comp="gas"
                    data-type="btc"
                  >
                    <p className="h6 mt-3 mb-1">Bitcoin</p>
                    <h5 className="normal mb-0" id="gas-btc"></h5>
                    <p className="text-small black-90">Gallons of Gas</p>
                  </li>
                  <li
                    className="d-output d-crypto active"
                    data-comp="gas"
                    data-type="eth"
                  >
                    <p className="h6 mt-3 mb-1">Ethereum</p>
                    <h5 className="normal mb-0" id="gas-eth"></h5>
                    <p className="text-small black-90">Gallons of Gas</p>
                  </li>
                  <li
                    className="d-output d-cash"
                    data-comp="gas"
                    data-type="pap"
                  >
                    <p className="h6 mt-3 mb-1">Cash</p>
                    <h5 className="normal mb-0" id="gas-pap"></h5>
                    <p className="text-small black-90">Gallons of Gas</p>
                  </li>
                  <li
                    className="d-output d-crypto d-credit d-cash active"
                    data-comp="gas"
                    data-type="xrp"
                  >
                    <p className="h6 mt-3 mb-1">XRP</p>
                    <h5 className="normal mb-0" id="gas-xrp"></h5>
                    <p className="text-small black-90">Gallons of Gas</p>
                  </li>
                  <li
                    className="d-output d-credit"
                    data-comp="gas"
                    data-type="vsa"
                  >
                    <p className="h6 mt-3 mb-1">Visa</p>
                    <h5 className="normal mb-0" id="gas-vsa"></h5>
                    <p className="text-small black-90">Gallons of Gas</p>
                  </li>
                  <li
                    className="d-output d-credit"
                    data-comp="gas"
                    data-type="mst"
                  >
                    <p className="h6 mt-3 mb-1">Mastercard</p>
                    <h5 className="normal mb-0" id="gas-mst"></h5>
                    <p className="text-small black-90">Gallons of Gas</p>
                  </li>
                </ul>
              </section>
            </div>
          </section>
        </div>

        <div className="container-new py-26">
          <section className="row last-section">
            <div className="col-sm-8 col-sm-offset-4">
              <h3 className="h2-sm">Breaking Down Individual Transactions</h3>
              <p>
                Looking at individual transactions below, compare how a single
                transaction across each form of currency equates to kWh, CO
                <sub>2</sub> emissions, and gallons of gas.
              </p>
            </div>
            <div className="col-sm-12 mt-14 overflow-x-xs">
              <table id="calculator-table">
                <thead>
                  <tr>
                    <th></th>
                    <th className="text-right h6 mb-10">Kilowatt Hour</th>
                    <th className="text-right h6 mb-10">
                      CO<sub>2</sub> Emissions
                    </th>
                    <th className="text-right h6 mb-10">Gallons of Gas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="">
                      <div className="w48 mr-3 text-center d-md-inline-block">
                        <img
                          className="h36 invertible-img"
                          src={prefix + "/img/logos/bitcoin.svg"}
                        />
                      </div>
                      Bitcoin
                    </td>
                    <td className="fs-6 text-right">
                      951.58<span className="ratio"> kWh/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      4.66<sup>-7</sup>
                      <span className="ratio"> Mt/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      75.7<span className="ratio"> gal/tx</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="">
                      <div className="w48 mr-3 text-center d-md-inline-block">
                        <img
                          className="h36 invertible-img"
                          src={prefix + "/img/logos/ethereum.svg"}
                        />
                      </div>
                      Ethereum
                    </td>
                    <td className="fs-6 text-right">
                      42.8633<span className="ratio"> kWh/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      2.73<sup>-8</sup>
                      <span className="ratio"> Mt/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      2.3867<span className="ratio"> gal/tx</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="">
                      <div className="w48 mr-3 text-center d-md-inline-block">
                        <img
                          className="h36 invertible-img"
                          src={prefix + "/img/logos/xrp.svg"}
                        />
                      </div>
                      XRP
                    </td>
                    <td className="fs-6 text-right">
                      0.0079<span className="ratio"> kWh/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      4.5<sup>-12</sup>
                      <span className="ratio"> Mt/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      0.00063<span className="ratio"> gal/tx</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="">
                      <div className="w48 mr-3 text-center d-md-inline-block">
                        <img
                          className="w40 invertible-img"
                          src={prefix + "/img/logos/visa.svg"}
                        />
                      </div>
                      Visa
                    </td>
                    <td className="fs-6 text-right">
                      0.0008<span className="ratio"> kWh/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      4.6<sup>-13</sup>
                      <span className="ratio"> Mt/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      0.00006<span className="ratio"> gal/tx</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="">
                      <div className="w48 mr-3 text-center d-md-inline-block">
                        <img
                          className="w40 invertible-img"
                          src={prefix + "/img/logos/mastercard.svg"}
                        />
                      </div>
                      Mastercard
                    </td>
                    <td className="fs-6 text-right">
                      0.0006<span className="ratio"> kWh/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      5.1<sup>-13</sup>
                      <span className="ratio"> Mt/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      0.00005<span className="ratio"> gal/tx</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="">
                      <div className="w48 mr-3 text-center d-md-inline-block">
                        <img
                          className="w40 invertible-img"
                          src={prefix + "/img/logos/paper-currency.svg"}
                        />
                      </div>
                      Paper Currency
                    </td>
                    <td className="fs-6 text-right">
                      0.044<span className="dblue">0</span>
                      <span className="ratio"> kWh/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      2.32<sup>-11</sup>
                      <span className="ratio"> Mt/tx</span>
                    </td>
                    <td className="fs-6 text-right">
                      0.0035<span className="dblue">0</span>
                      <span className="ratio"> gal/tx</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <Helmet>
          <script src="https://www.googletagmanager.com/ns.html?id=GTM-KCQZ3L8"></script>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
          <script
            type="text/javascript"
            src={prefix + "/js/bodymovin.min.js"}
          ></script>
          <script
            type="text/javascript"
            src={prefix + "/js/calculator/co2-crypto.json"}
          ></script>
          <script
            type="text/javascript"
            src={prefix + "/js/calculator/co2-cash.json"}
          ></script>
          <script
            type="text/javascript"
            src={prefix + "/js/calculator/co2-credit.json"}
          ></script>
          <script
            type="text/javascript"
            src={prefix + "/js/calculator/gas-crypto.json"}
          ></script>
          <script
            type="text/javascript"
            src={prefix + "/js/calculator/gas-cash.json"}
          ></script>
          <script
            type="text/javascript"
            src={prefix + "/js/calculator/gas-credit.json"}
          ></script>
          <script
            type="text/javascript"
            src={prefix + "/js/calculator/animation.js"}
          ></script>
          <script
            type="text/javascript"
            src={prefix + "/js/calculator/carbon-calculator.js"}
          ></script>
        </Helmet>
      </div>
    </>
  );
}
