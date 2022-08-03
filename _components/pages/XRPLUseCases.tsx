import * as React from "react";

interface CardType {
  link: string;
  name: string;
  id: string;
  title: string;
  description: string;
}

// TODO: Determine if the use case category info is a subset of CardType
interface UseCaseCategoryInfo {
  id: string;
  title: string;
  description: string;
}

export default function XRPLUseCases() {
  const cards: Array<CardType> = [
    {
      link: "https://www.bitgo.com/",
      name: "BitGo",
      id: "bitgo",
      title: "Asset Custody",
      description:
        "BitGo provides custodial and non-custodial asset holdings for digital assets including XRP. BitGo's enterprise-level security empowers businesses to integrate digital currencies like XRP into new and existing financial systems.",
    },
    {
      link: "https://bitpay.com/",
      id: "bitpay",
      name: "BitPay",
      title: "Payment Processing",
      description:
        "BitPay builds powerful, enterprise-grade tools for accepting and spending cryptocurrencies, including XRP.",
    },
    {
      link: "https://coil.com/",
      id: "coil",
      name: "Coil",
      title: "Web Monetization",
      description:
        "Coil provides web monetization as an alternative to traditional paid advertising. Coil uses the interledger protocol (ILP) to stream micropayments as users consume content. The XRPL’s payment channels provide an ideal system for settling these micropayments at high speed and low cost.",
    },
    {
      link: "https://www.forte.io/",
      id: "forte",
      name: "Forte",
      title: "Online Gaming",
      description:
        "Forte offers an unprecedented set of easy-to-use tools and services for game developers to integrate blockchain technology into their games, to unlock new economic and creative opportunities for gamers across the world.",
    },
    {
      link: "https://gatehub.net/",
      id: "gatehub",
      name: "Gatehub",
      title: "Wallet and Platforms",
      description:
        "GateHub is a platform for the Internet of Value, built on the XRP Ledger protocol. It allows everyone to send, receive, trade and manage any type of assets.",
    },
    {
      link: "https://www.exodus.io/",
      id: "exodus",
      name: "Exodus",
      title: "Wallets and Apps",
      description:
        "Exodus offers wallets and applications for securing, managing and exchanging crypto.",
    },
    {
      link: "https://ripple.com/",
      id: "ripple",
      name: "Ripple",
      title: "On-Demand Liquidity",
      description:
        "Ripple powers instant, lower-cost settlement of cross-border payments using XRP to source liquidity on demand. XRP is ideally suited for global payments because it's quicker, less costly, and more scalable than any other digital asset.",
    },
    {
      link: "https://towolabs.com",
      id: "towo",
      name: "Towo Labs",
      title: "Infrastructure",
      description:
        "Towo Labs was founded in 2019, to develop XRP Ledger and Interledger infrastructures and make non-custodial crypto management easier.",
    },
    {
      link: "https://raisedinspace.com/",
      id: "raisedinspace",
      name: "Raised in Space",
      title: "Music",
      description:
        "Raised in Space is a music/tech investment group focused on raising the value of music, innovating across the entire value chain of the music industry.",
    },
    {
      link: "https://xrpl-labs.com/",
      id: "xrpl-labs",
      name: "XRPL Labs",
      title: "Applications",
      description:
        "From cold storage to apps for signing transactions, XRPL Labs is dedicated to building software on the XRP Ledger.",
    },
    {
      link: "https://xrplorer.com/",
      id: "xrplorer",
      name: "Xrplorer",
      title: "Security",
      description:
        "Xrplorer offers services and tools that help prevent and combat fraudulent activity on the XRPL as well as custom APIs and analytics that supplement the XRPL APIs where they are not enough.",
    },
  ];
  const uses: Array<UseCaseCategoryInfo> = [
    {
      id: "micropayments",
      title: "Micropayments",
      description:
        "Developers are using the XRP Ledger to build innovative products for gaming, content, and web monetization, among other applications where currency is at the center.",
    },
    {
      id: "wallets",
      title: "Cryptocurrency Wallets",
      description:
        "Use the Ledger to build digital wallets to store private and public passwords and interact with various blockchains to send and receive digital assets, including XRP.",
    },
    {
      id: "exchanges",
      title: "Exchanges",
      description:
        "Build sophisticated exchanges where users can invest and trade crypto and non-blockchain assets such as stocks, ETFs, and commodities.",
    },
    {
      id: "stablecoins",
      title: "Stablecoins",
      description:
        "Financial institutions can use Issued Currencies to issue stablecoins on the XRP Ledger. XRPL’s integrated decentralized exchange (DEX) allows neutral, counterparty-free digital assets to be seamlessly exchanged to and from “issued assets,” including stablecoins.",
    },
    {
      id: "nft",
      title: "NFTs",
      description:
        "XRPL allows issuance of IOUs which can represent a currency of any value, which can be extended to the issuance of non-fungible tokens (NFTs).",
    },
    {
      id: "defi",
      title: "DeFi",
      description:
        "Provide access to financial products and services online in a decentralized and borderless manner on XRPL, with decentralized smart contract protocols replacing the traditional role of financial institutions.",
    },
    {
      id: "cbdc",
      title: "CBDCs",
      description:
        "The CBDC Private Ledger provides Central Banks a secure, controlled, and flexible solution to issue and manage Central Bank Issued Digital Currencies (CBDCs).",
    },
  ];

  // {% extends "base.html.jinja" %}
  // {% block head %} TODO:

  //     <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  //     <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  //     <!--[if lt IE 9]>
  //       <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
  //       <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  //     <![endif]-->

  // {% endblock %}

  // {% block bodyclasses %}no-sidebar{% endblock %} TODO:
  // {% block mainclasses %}landing page-uses landing-builtin-bg{% endblock %}

  // {% block breadcrumbs %}{% endblock %} TODO:

  return (
    <div className="overflow-hidden">
      <section className="py-26 text-center">
        <div className="col-lg-5 mx-auto text-center">
          <div className="d-flex flex-column-reverse">
            <h1 className="mb-0">Powering Innovative Technology</h1>
            <h6 className="eyebrow mb-3">XRPL Use Cases</h6>
          </div>
        </div>
      </section>

      <section className="container-new py-26">
        <ul className="card-grid card-grid-3xN ls-none" id="use-case-card-grid">
          {uses.map((use: UseCaseCategoryInfo) => {
            const alt = `${use.title} icon`;
            return (
              <li className="col ls-none">
                <img id={use.id} alt={alt} />
                <h4 className="mt-3 mb-0 h5">{use.title}</h4>
                <p className="mt-6-until-sm mt-3 mb-0">{use.description}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="position-relative d-none-sm">
        <img src="./img/backgrounds/use-cases-orange.svg" id="use-cases-orange" />
      </div>

      <section className="container-new py-26">
        <div className="col-sm-7 p-0">
          <div className="d-flex flex-column-reverse">
            <h3 className="h4 h2-sm">
              Businesses and projects running
              <br className="until-sm" /> on the XRP Ledger
            </h3>
            <h6 className="eyebrow mb-3">Solving Real Problems Across Industries</h6>
          </div>
          <p className="mb-0 longform mt-8-until-sm mt-3 ">
            There are companies and developer projects around the world that leverage the
            XRP Ledger to solve interesting problems across a variety of industries and
            use cases.
          </p>
        </div>
        <div className="row row-cols-1 row-cols-lg-3 card-deck">
          {cards.map((card: CardType) => {
            return (
              <a className="card" href={card.link} target="_blank" id={card.id}>
                <div className="card-body">
                  <img className="mw-100 mb-3 biz-logo" alt={card.name ?? card.id} />
                  <h4 className="card-title h5">{card.title}</h4>
                  <p className="card-text">{card.description}</p>
                </div>
                <div className="card-footer">&nbsp;</div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );

  {
    /* {% block analytics %}
    <script type="application/javascript">
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "event": "page_info",
      "page_type": "Splash Page",
      "page_group": "About"
    })
    </script>
{% endblock analytics %} */
  }
}
