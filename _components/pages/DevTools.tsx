import React from "react";
import { usePathPrefix } from "@redocly/developer-portal/ui";

export default function DevTools() {
  const prefix = usePathPrefix();
  const explorerTools = [
    {
      id: "xrp-explorer",
      title: "XRPL Explorer",
      description:
        "View validations of new ledger versions in real-time, or chart the location of servers in the XRP Ledger.",
      href: "https://livenet.xrpl.org",
      footerImg: "3-col-orange",
      screenshot: prefix + "/img/dev-tools/explorer.png",
    },
    {
      id: "bithomp-explorer",
      title: "Bithomp Explorer",
      description:
        "Explore public ledger data including accounts' transaction history and known names.",
      href: "https://bithomp.com/",
      footerImg: "3-col-light-blue",
      screenshot: prefix + "/img/dev-tools/bithomp.png",
    },
    {
      id: "xrpscan",
      title: "XRPScan",
      description:
        "Explore ledger activity, view amendment voting in real-time, and get account information. API access is also available.",
      href: "https://xrpscan.com/",
      footerImg: "3-col-pink",
      screenshot: prefix + "/img/dev-tools/xrpscan.png",
    },
    {
      id: "token-list",
      title: "Token List",
      description:
        "See all tokens issued in the XRP Ledger and use preset tools to issue custom tokens at the click of a button.",
      href: "https://xumm.community/tokens",
      footerImg: "3-col-pink2",
      screenshot: prefix + "/img/dev-tools/tokenlist.png",
    },
  ];
  const apiAccessTools = [
    {
      id: "websocket",
      title: "WebSocket Tool",
      description:
        "Send sample requests and get responses from the rippled API. ",
      href: "websocket-api-tool.html",
      footerImg: "3-col-purple2",
      screenshot: prefix + "/img/dev-tools/websocket-tool.png",
    },
    {
      id: "rpc",
      title: "RPC Tool",
      description:
        "Print raw information about an XRP Ledger account, transaction, or ledger.",
      href: "xrp-ledger-rpc-tool.html",
      footerImg: "3-col-green",
      screenshot: prefix + "/img/dev-tools/rpc-tool.png",
    },
    {
      id: "technical-explorer",
      title: "Technical Explorer",
      description:
        "Browse API objects from the ledger with real-time updates. ",
      href: "https://explorer.xrplf.org/",
      footerImg: "3-col-purple-blue",
      screenshot: prefix + "/img/dev-tools/technical-explorer.png",
    },
    {
      id: "faucets",
      title: "Faucets",
      description:
        "Get credentials and test-XRP for XRP Ledger Testnet or Devnet.",
      href: "xrp-testnet-faucet.html",
      footerImg: "3-col-pink2",
      screenshot: prefix + "/img/dev-tools/faucets.png",
    },
    {
      id: "trasaction-sender",
      title: "Transaction Sender",
      description:
        "Test how your code handles various XRP Ledger transactions by sending them over the Testnet to the address.",
      href: "tx-sender.html",
      footerImg: "3-col-light-blue2",
      screenshot: prefix + "/img/dev-tools/transaction-sender.png",
    },
  ];
  const other = [
    {
      id: "domain",
      title: "Domain Verification Checker",
      description: "Verify your validator's domain.",
      href: "validator-domain-verifier.html",
      footerImg: "3-col-green-purple",
      screenshot: prefix + "/img/dev-tools/domain-checker.png",
    },
    {
      id: "xrp-ledger",
      title: "xrp-ledger.toml Checker",
      description: "Verify that your xrp-ledger.toml file is set up properly.",
      href: "xrp-ledger-toml-checker.html",
      footerImg: "3-col-dark-blue",
      screenshot: prefix + "/img/dev-tools/toml-checker.png",
    },
    {
      id: "binary-visualizer",
      title: "Binary Visualizer",
      description:
        "Parse the XRP Ledger's native binary format with a visual representation breaking down the raw structure into its parts.",
      href: "https://richardah.github.io/xrpl-binary-visualizer/",
      footerImg: "3-col-purple-blue",
      screenshot: prefix + "/img/dev-tools/binary-visualizer.png",
    },
    {
      id: "token-metadata-lookup",
      title: "Token Metadata Lookup",
      description:
        "Query known information about any token issued on the XRP Ledger.",
      href: "https://xrplmeta.org/",
      footerImg: "3-col-pink-purple",
      screenshot: prefix + "/img/dev-tools/token-metadata.png",
    },
  ];

  function ToolCard({ props }) {
    const footerImgStyle = {
      backgroundImage: `url(${prefix}/img/cards/${props.footerImg}.svg)`,
    };
    return (
      <a className="card" href={props.href} id={props.id}>
        <img src={props.screenshot} alt={props.title + "Screenshot"}></img>
        <div className="card-body">
          <h4 className="card-title h5">{props.title}</h4>
          <p className="card-text">{props.description}</p>
        </div>
        <div className="card-footer" style={footerImgStyle}>
          &nbsp;
        </div>
      </a>
    );
  }

  return (
    <div className="page-dev-tools">
      <section className="py-20 ">
        <div className="mx-auto text-lg-left">
          <div className="d-flex flex-column-reverse">
            <p className="mb-0">
              Use the developer tools to test, explore, and validate XRP Ledger
              API requests and behavior.
            </p>
            <h3 className="eyebrow mb-3"> Dev Tools</h3>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto text-lg-left">
          <div className="sticky">
            <ul className="nav nav-tabs pb-15" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active dev-tools-tab"
                  id="explorers-tab"
                  data-toggle="tab"
                  data-target="#explorers"
                  role="tab"
                  aria-controls="explorers"
                  aria-selected="true"
                >
                  Explorers
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link  dev-tools-tab"
                  id="api-access-tab"
                  data-toggle="tab"
                  data-target="#api-access"
                  role="tab"
                  aria-controls="api-access"
                  aria-selected="false"
                >
                  API Access
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link  dev-tools-tab"
                  id="other-tab"
                  data-toggle="tab"
                  data-target="#other"
                  role="tab"
                  aria-controls="other"
                  aria-selected="false"
                >
                  Other
                </button>
              </li>
            </ul>
          </div>
          <div className="tab-content pt-20">
            <div
              className="tab-pane show active"
              id="explorers"
              role="tabpanel"
              aria-labelledby="explorers-tab"
            >
              <h4> Explorers</h4>
              <div className="row row-cols-1 row-cols-lg-3 card-deck">
                {explorerTools.map((t) => (
                  <ToolCard props={t} />
                ))}
              </div>
            </div>
            <div
              className="tab-pane"
              id="api-access"
              role="tabpanel"
              aria-labelledby="api-access-tab"
            >
              <h4> API Access</h4>
              <div className="row row-cols-1 row-cols-lg-3 card-deck">
                {apiAccessTools.map((t) => (
                  <ToolCard props={t} />
                ))}
              </div>
            </div>
            <div
              className="tab-pane"
              id="other"
              role="tabpanel"
              aria-labelledby="other-tab"
            >
              <h4> Other</h4>

              <div className="row row-cols-1 row-cols-lg-3 card-deck">
                {other.map((t) => (
                  <ToolCard props={t} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-new py-10 px-0">
        <div className="col-lg-12 p-6-sm p-10-until-sm br-8 cta-card">
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
              Have an Idea For a Tool?
            </h2>
            <p className="mb-10">
              Contribute to the XRP Ledger community by submitting your idea for
              a tool or open a pull request if you've developed a tool.
            </p>
            <a
              className="btn btn-primary btn-arrow-out"
              href="https://github.com/XRPLF/xrpl-dev-portal/"
            >
              Open a pull Request
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
