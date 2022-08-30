import React from "react";
import { usePathPrefix } from "@redocly/developer-portal/ui";
import { Helmet } from "react-helmet";
export default function Docs() {
  const prefix = usePathPrefix();
  const getStartedVideos = [
    {
      img: prefix + "/img/docs/docs-intro-to-XRP-ledger@2x.png",
      title: "Intro to XRP Ledger",
      url: "https://www.youtube.com/embed/sVTybJ3cNyo?rel=0&amp;showinfo=0&amp;autoplay=1",
    },
    {
      img: prefix + "/img/docs/docs-accounts@2x.png",
      title: "Accounts",
      url: "https://www.youtube.com/embed/eO8jE6PftX8?rel=0&amp;showinfo=0&amp;autoplay=1",
    },
    {
      img: prefix + "/img/docs/docs-decentralized-exchange@2x.png",
      title: "Decentralized Exchange",
      url: "https://www.youtube.com/embed/VWNrHBDfXvA?rel=0&amp;showinfo=0&amp;autoplay=1",
    },
    {
      img: prefix + "/img/docs/docs-tokenization@2x.png",
      title: "Tokenization",
      url: "https://www.youtube.com/embed/Oj4cWOiWf4A?rel=0&amp;showinfo=0&amp;autoplay=1",
    },
  ];
  const intermediateVideos = [
    {
      img: prefix + "/img/docs/docs-advanced-payment-features@2x.png",
      title: "Advanced Payment Features",
      url: "https://www.youtube.com/embed/e2Iwsk37LMk?rel=0&amp;showinfo=0&amp;autoplay=1",
    },
    {
      img: prefix + "/img/docs/docs-governance@2x.png",
      title: "Governance and the Amendment Process",
      url: "https://www.youtube.com/embed/4GbRdanHoR4?rel=0&amp;showinfo=0&amp;autoplay=1",
    },
    {
      img: prefix + "/img/docs/docs-sidechains@2x.png",
      title: "Federated Sidechains",
      url: "https://www.youtube.com/embed/NhH4LM8NxgY?rel=0&amp;showinfo=0&amp;autoplay=1",
    },
  ];
  const useCases = [
    {
      title: "Build a Wallet",
      id: "build-a-wallet",
      img: prefix + "/img/docs/docs-wallet@2x.png",
      subItems: [
        {
          description: "Use Specialized Payment Types",
          link: "https://xrpl.org/use-specialized-payment-types.html",
        },
        {
          description: "Build a Desktop Wallet in Python",
          link: "https://xrpl.org/build-a-desktop-wallet-in-python.html",
        },
      ],
    },
    {
      title: "NFTs",
      id: "nfts",
      img: prefix + "/img/docs/docs-nft@2x.png",
      subItems: [
        {
          description: "NFT Conceptual Overview",
          link: "https://xrpl.org/non-fungible-tokens.html",
        },
        {
          description: "NFToken Format",
          link: "https://xrpl.org/nftoken.html",
        },
        {
          description: "NFToken Tester Tutorial",
          link: "https://xrpl.org/nftoken-tester-tutorial.html",
        },
      ],
    },
    {
      title: "Run an XRP Ledger Node",
      id: "run-an-xrp-ledger-node",
      img: prefix + "/img/docs/docs-node@2x.png",
      subItems: [
        {
          description: "About the Server",
          link: "https://xrpl.org/xrpl-servers.html",
        },
        {
          description: "Install & Configure",
          link: "https://xrpl.org/install-rippled.html",
        },
        {
          description: "Run a Validator Node",
          link: "https://xrpl.org/run-rippled-as-a-validator.html",
        },
      ],
    },
  ];
  const devTools = [
    {
      title: "Faucets",
      link: "https://xrpl.org/xrp-testnet-faucet.html",
      description:
        "Get credentials and test-XRP for XRP Ledger Testnet or Devnet.",
    },
    {
      title: "WebSocket Tool",
      link: "https://xrpl.org/websocket-api-tool.html",
      description:
        "Send sample requests and get responses from the rippled API. ",
    },
    {
      title: "XRP Explorer",
      link: "https://livenet.xrpl.org",
      description:
        "View validations of new ledger versions in real-time, chart the location of servers in the XRP Ledger.",
    },
    {
      title: "Transaction Sender",
      link: "https://xrpl.org/tx-sender.html",
      description:
        "Test how your code handles various XRP Ledger transactions by sending them over the Testnet to the address.",
    },
  ];
  const recommendedPages = [
    {
      description: "rippled API Reference",
      link: "https://xrpl.org/manage-the-rippled-server.html",
    },
    {
      description: "XRP Faucet",
      link: "https://xrpl.org/xrp-testnet-faucet.html",
    },
    {
      description: "Getting Started with Python",
      link: "https://xrpl.org/get-started-using-python.html#get-started-using-python",
    },
    {
      description: "Websocket API Tool",
      link: "https://xrpl.org/websocket-api-tool.html",
    },
    { description: "XRP Ledger Explorer", link: "https://livenet.xrpl.org" },
  ];

  function VideoCard({ props }) {
    return (
      <div className="col">
        <a className="btn1" data-url={props.url}>
          <img
            className="get-started-img video-image"
            id={props.title}
            src={props.img}
          />
        </a>

        <h6 className="pt-3">{props.title} </h6>
      </div>
    );
  }
  return (
    <div className="landing page-docs landing-builtin-bg overflow-hidden">
      <div id="video-overlay"></div>
      <div id="video">
        <div id="videoWrapper">
          <iframe
            id="player"
            width="853"
            height="480"
            src=""
            frameBorder="0"
            allowFullScreen={true}
          ></iframe>
        </div>
      </div>
      <section className="py-26 text-center">
        <div className="col-xl-4 col-lg-6 mx-auto text-center">
          <div className="d-flex flex-column-reverse w-100">
            <h1 className="mb-18">XRP Ledger Developer Resources</h1>
            <h6 className="eyebrow mb-3">Documentation</h6>
          </div>
        </div>
      </section>

      <section className="py-10 px-20 text-left">
        <div className="mx-auto mb-10">
          <h4>Getting Started with XRP Ledger</h4>
        </div>
        <div className="card-grid card-grid-2xN">
          <div className="col card" id="quick-start">
            <h5 className="mt-7"> Quickstart to XRP Ledger </h5>
            <p className="mb-8 mt-4">
              An introduction to fundamental aspects of the XRP Ledger.
            </p>
            <div className="dg-lg-block mb-5">
              <a
                className="btn btn-primary btn-arrow get-started-button"
                href="https://xrpl.org/xrpl-quickstart.html"
              >
                Get Started
              </a>
            </div>
            <img
              src={prefix + "/img/docs/docs-quick-start.svg"}
              alt="quick-start"
              id="quick-start-img"
            />
          </div>
          <div className="col">
            <div className="card-grid card-grid-2xN">
              {getStartedVideos.map((video) => (
                <VideoCard props={video} />
              ))}
            </div>
            <a
              className="btn btn-primary btn-arrow-out mt-10"
              href="https://www.youtube.com/playlist?list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi"
            >
              Watch Full Series
            </a>
          </div>
        </div>
      </section>

      <section className="py-26 px-20 text-left">
        <div className="card-grid card-grid-2xN">
          <div className="col">
            <h6>Explore SDKs</h6>
            <h4>Interact with the XRP Ledger in a language of your choice</h4>
            <div className="card-grid card-grid-2xN mt-10">
              <div className="col langs">
                <img
                  src={prefix + "/img/docs/javascript.svg"}
                  className="circled-logo"
                ></img>
                <h5>
                  <a
                    className="btn-arrow-purple"
                    target="_blank"
                    href="https://github.com/XRPLF/xrpl.js"
                  >
                    Javascript
                  </a>
                </h5>
              </div>
              <div className="col langs">
                <img
                  src={prefix + "/img/docs/python.svg"}
                  className="circled-logo"
                ></img>
                <h5>
                  <a
                    className="btn-arrow-purple"
                    target="_blank"
                    href="https://github.com/XRPLF/xrpl-py"
                  >
                    Python
                  </a>
                </h5>
              </div>
              <div className="col langs">
                <img
                  src={prefix + "/img/docs/java.svg"}
                  className="circled-logo"
                ></img>
                <h5>
                  <a
                    className="btn-arrow-purple"
                    target="_blank"
                    href="https://github.com/XRPLF/xrpl4j"
                  >
                    Java
                  </a>
                </h5>
              </div>
            </div>
          </div>
          <div className="col">
            <img
              src={prefix + "/img/docs/docs-sdk@2x.png"}
              className="img-fluid pt-20"
            ></img>
          </div>
        </div>
      </section>

      <section className="py-15 px-20 text-left">
        <h4 className="pb-4">Use Cases</h4>
        <div className="card-grid card-grid-3xN">
          {useCases.map((u) => (
            <UseCasesCard props={u} />
          ))}
        </div>
      </section>
      <section className="py-26 px-20 text-left">
        <h4 className="pb-4">Intermediate Learning Sources</h4>
        <div className="card-grid card-grid-3xN">
          {intermediateVideos.map((video) => (
            <VideoCard props={video} />
          ))}
        </div>
      </section>

      <section className="py-26 px-20 text-left">
        <div className="card-grid card-grid-2xN">
          <div className="col d-flex align-items-center justify-content-center">
            <img
              src={prefix + "/img/docs/docs-devtools-@2x.png"}
              className="dev-tools-img"
            ></img>
          </div>
          <div className="col">
            <div className="d-flex flex-column-reverse w-100">
              <h4 className="mb-10">Explore, Test, Verify</h4>
              <h6 className="mb-3">Explore Dev Tools</h6>
            </div>
            <p className="mb-20">
              Use these web-based tools to assist during all stages of
              development, from getting your first payment to testing your
              implementation for best practices.{" "}
            </p>
            <div className="card-grid card-grid-2xN">
              {devTools.map((card) => (
                <DevToolsCard props={card} />
              ))}
            </div>
            <a
              className="btn btn-primary btn-arrow"
              href="https://xrpl.org/dev-tools.html"
            >
              View All tools
            </a>
          </div>
        </div>
      </section>

      <section className="py-26 px-20 text-left">
        <div className="card-grid card-grid-2xN">
          <div className="col">
            <h4>Browse By Recommended Pages</h4>
            {recommendedPages.map((r) => (
              <UnderLindedArrow props={r}></UnderLindedArrow>
            ))}
          </div>

          <div className="col">
            <div className="col-lg-12 p-6-sm p-10-until-sm br-8 cta-card">
              <img
                src={prefix + "/img/docs/cta-docs-purple.svg"}
                className="d-none-sm cta cta-top-left"
              />
              <img
                src={prefix + "/img/docs/cta-docs-green.svg"}
                className="cta cta-bottom-right"
              />
              <div className="z-index-1 position-relative">
                <h2 className="h4 mb-8-sm mb-10-until-sm">
                  Have an Idea For a Tool?
                </h2>
                <p className="mb-10">
                  Connect to the XRP Ledger Testnet network to develop and test
                  your apps built on the XRP Ledger, without risking real money
                  or impacting production XRP Ledger users.
                </p>
                <a
                  className="btn btn-primary btn-arrow-out"
                  href="https://xrpl.org/xrp-testnet-faucet.html"
                >
                  Generate Testnet Credentials
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Helmet>
        <script src="/js/video.js"></script>
      </Helmet>
    </div>
  );
}

function DevToolsCard({ props }) {
  return (
    <div className="col">
      <h6>
        {props.title}
        <a className="btn-arrow-purple" target="_blank" href={props.link}></a>
      </h6>
      <p> {props.description}</p>
    </div>
  );
}

function UseCasesCard({ props }) {
  return (
    <div className="col">
      <img
        className="use-cases-img img-fluid"
        src={props.img}
        alt={props.title}
        id={props.id}
      ></img>
      <h5>{props.title} </h5>
      {props.subItems.map((i) => {
        return <UnderLindedArrow props={i} />;
      })}
    </div>
  );
}

function UnderLindedArrow({ props }) {
  return (
    <div className="use-cases d-flex">
      <div className="pt-3">
        <p>{props.description} </p>
      </div>
      <div className="ml-auto pt-3">
        <a className="btn-arrow-purple" target="_blank" href={props.link}></a>
      </div>
    </div>
  );
}
