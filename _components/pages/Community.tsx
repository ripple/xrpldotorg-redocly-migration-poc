import React, { useEffect, createRef } from "react";
import { usePathPrefix } from "@redocly/developer-portal/ui";
import lottie from "lottie-web";

import networkNodeLight from "../../static/js/community/network-node-light.json";
import xrplGrantsDark from "../../static/js/community/XRPL-grants-dark.json";
import careersDark from "../../static/js/community/careers-dark.json";
export default function Community() {
  const networkNodeAnimationContainer = createRef();
  const networkNodeSmallAnimationContainer = createRef();
  const xrplGrantsAnimationContainer = createRef();
  const xrplGrantsSmallAnimationContainer = createRef();
  const careersAnimationContainer = createRef();
  const careersSmallAnimationContainer = createRef();

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: networkNodeAnimationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: networkNodeLight,
    });
    const anim1 = lottie.loadAnimation({
      container: networkNodeSmallAnimationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: networkNodeLight,
    });
    const anim2 = lottie.loadAnimation({
      container: xrplGrantsAnimationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: xrplGrantsDark,
    });
    const anim3 = lottie.loadAnimation({
      container: xrplGrantsSmallAnimationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: xrplGrantsDark,
    });
    const anim4 = lottie.loadAnimation({
      container: careersSmallAnimationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: careersDark,
    });
    const anim5 = lottie.loadAnimation({
      container: careersAnimationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: careersDark,
    });
  }, []);

  const prefix = usePathPrefix();
  const platforms = [
    { name: "Twitter", id: "twitter", link: "https://twitter.com/XRPLF/" },
    { name: "Discord", id: "discord", link: "https://discord.gg/427qqMYwHh" },
    {
      name: "YouTube",
      id: "youtube",
      link: "https://www.youtube.com/channel/UC6zTJdNCBI-TKMt5ubNc_Gg",
    },
    {
      name: "GitHub",
      id: "github",
      link: "https://github.com/XRPLF/xrpl-dev-portal",
      imgclassNamees: "invertible-img",
    },
    {
      name: "Stack Overflow",
      id: "stack-overflow",
      link: "https://stackoverflow.com/questions/tagged/xrp",
    },
  ];
  // hrefs are subject to change
  const relatedDocs = [
    {
      name: "The rippled Server",
      href: "/docs/the-rippled-server",
      description: "Learn about the core servers that power the XRP Ledger.",
    },
    {
      name: "Join UNL",
      href: "/docs/run-rippled-as-a-validator",
      description: "Have your server vote on the consensus ledger.",
    },
    {
      name: "Install & Configure",
      href: "/docs/install-rippled",
      description: "Install and update the rippled server.",
    },
    {
      name: "Troubleshooting",
      href: "/docs/troubleshoot-the-rippled-server",
      description:
        "Troubleshoot all kinds of problems with the rippled server.",
    },
  ];
  return (
    <div className="landing page-community styled-page">
      <section className="text-center" id="community-heading">
        <div className="d-lg-block d-none">
          <img
            className="parallax one"
            width="220px"
            height="160px"
            src={prefix + "/img/community/community-one@2x.png"}
          />
          <img
            className="parallax two"
            width="120px"
            height="160px"
            src={prefix + "/img/community/community-two@2x.png"}
          />
          <img
            className="parallax three"
            width="102px"
            height="102px"
            src={prefix + "/img/community/community-three@2x.png"}
          />
          <img
            className="parallax four"
            width="120px"
            height="160px"
            src={prefix + "/img/community/community-four@2x.png"}
          />
          <img
            className="parallax five"
            width="216px"
            height="160px"
            src={prefix + "/img/community/community-five@2x.png"}
          />
        </div>

        <div className="col-lg-6 mx-auto text-left text-md-center">
          <div className="d-flex flex-column-reverse">
            <h1 className="mb-0">
              A Global Community of Builders and Innovators
            </h1>
            <h6 className="eyebrow mb-3">The XRPL Community</h6>
          </div>
        </div>
      </section>
      <section className="container-new" id="find-us-on-platforms">
        <div className="d-flex flex-column-reverse col-sm-8 p-0">
          <h3 className="h4 h2-sm">
            Find the community on the platforms below
          </h3>
          <h6 className="eyebrow mb-3">Join the Conversation</h6>
        </div>

        <div className="row row-cols-2 row-cols-lg-4 card-deck">
          {platforms.map((plat) => {
            return (
              <a className="card mb-10" href={plat.link} target="_blank">
                <div className="card-body">
                  <div className="circled-logo">
                    <img
                      id={`platform-${plat.id}`}
                      alt="(logo)"
                      className={plat.imgclassNamees || ""}
                    />
                  </div>
                  <h4 className="card-title h5">{plat.name}</h4>
                </div>
                <div className="card-footer">&nbsp;</div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="container-new" id="run-a-network-node">
        <div className="card-grid card-grid-2xN">
          <div className="col d-none d-lg-block align-self-center">
            <div
              className="mt-10"
              id="networkNode"
              ref={networkNodeAnimationContainer}
            />
          </div>

          <div className="col pt-lg-5">
            <div className="d-flex flex-column-reverse mb-8 pl-0">
              <h2 className="h4 h2-sm">Run an XRP Ledger network node</h2>
              <h6 className="eyebrow mb-3">Contribute to Consensus</h6>
            </div>

            <div className="col d-lg-none d-block">
              <div className="mt-10" id="networkNode-small" ref={networkNodeSmallAnimationContainer}></div>
            </div>

            <div className="pt-2 pt-lg-5 card-grid card-grid-2xN text-cards">
              {relatedDocs.map((doc) => {
                return (
                  <div className="text-card">
                    <a className="btn-arrow" href={doc.href}>
                      {doc.name}
                    </a>
                    <p className="mt-3 mb-0">{doc.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container-new" id="xrpl-grants">
        <div className="card-grid card-grid-2xN">
          <div className="col pr-2">
            <div className="d-flex flex-column-reverse">
              <h2 className="h4 h2-sm">
                Apply for funding for your next XRPL project
              </h2>
              <h6 className="eyebrow mb-3">XRPL Grants</h6>
            </div>
            <p className="mb-lg-3 py-lg-4 pt-4 mb-0">
              The XRPL Grants program funds select open-source projects that
              contribute to the growing XRP Ledger community.
            </p>

            <div className="d-lg-block d-none">
              <div className="mb-4 pb-3" id="xrplGrantsDark" ref={xrplGrantsAnimationContainer}></div>
              <a
                className="btn btn-primary btn-arrow"
                target="_blank"
                href="https://xrplgrants.org/"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="col">
            <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
              <h6 className="eyebrow mb-2">Awarded in a single grant</h6>
              <img
                src={prefix + "/img/community/community-grants-1.svg"}
                className="w-100"
              />
            </div>
            <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
              <h6 className="eyebrow mb-2">Distributed to grant recipients</h6>
              <img
                src={prefix + "/img/community/community-grants-2.svg"}
                className="w-100"
              />
            </div>
            <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
              <h6 className="eyebrow mb-2">Open-source projects funded </h6>
              <img
                src={prefix + "/img/community/community-grants-3.svg"}
                className="w-100"
              />
            </div>

            <div className="d-lg-none d-block mt-4 pt-3">
              <div className="mb-4 pb-3" id="xrplGrantsDark-small" ref={xrplGrantsSmallAnimationContainer}></div>
              <a
                className="btn btn-primary btn-arrow"
                target="_blank"
                href="https://xrplgrants.org/"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-new" id="xrpl-events">
        <div className="card-grid card-grid-2xN ">
          <div className="col pr-2 d-lg-block d-none">
            <div className="d-flex flex-row h-100">
              <div className=" pr-1 mr-3 align-self-start">
                <img
                  src={
                    prefix + "/img/community/community-events-apex-small@2x.png"
                  }
                  className="w-100"
                />
                <p className="bold text-light mt-3">Welcome to Apex 2021</p>
              </div>
              <div className=" px-1 mx-3 align-self-center">
                <img
                  src={
                    prefix +
                    "/img/community/community-events-meetup-small@2x.png"
                  }
                  className="w-100"
                />
                <p className="bold text-light mt-3">XRPL Community Meetup</p>
              </div>
              <div className=" pl-1 ml-3 align-self-end">
                <img
                  src={
                    prefix +
                    "/img/community/community-events-hackathon-small@2x.png"
                  }
                  className="w-100"
                />
                <p className="bold text-light mt-3">XRPL Hackathon 2022</p>
              </div>
            </div>
          </div>

          <div className="col pt-5">
            <div className="d-flex flex-column-reverse mb-lg-2 pl-0">
              <h2 className="h4 h2-sm">
                Check out global events across the XRPL community
              </h2>
              <h6 className="eyebrow mb-3">XRPL Events</h6>
            </div>
            <p className="mb-3 py-4">
              Meet the XRPL community at meetups, hackathons, conferences, and
              more across global regions.
            </p>

            <div className="col pr-2 d-lg-none d-block">
              <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
                <img
                  src={prefix + "/img/community/community-events-apex@2x.png"}
                  className="w-100"
                />
                <h6 className="mt-3">Welcome to Apex 2021</h6>
              </div>
              <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
                <img
                  src={prefix + "/img/community/community-events-meetup@2x.png"}
                  className="w-100"
                />
                <h6 className="mt-3">XRPL Community Meetup</h6>
              </div>
              <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
                <img
                  src={
                    prefix + "/img/community/community-events-hackathon@2x.png"
                  }
                  className="w-100"
                />
                <h6 className="mt-3">XRPL Hackathon 2022</h6>
              </div>
            </div>

            <div>
              <a
                className="btn btn-primary btn-arrow"
                target="_blank"
                href="/community/events"
              >
                View All Events
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-new" id="xrpl-careers">
        <div className="card-grid card-grid-2xN">
          <div className="col pr-2 d-lg-block d-none">
            <div className="mb-4 pb-3" id="careersDark" ref={careersAnimationContainer}></div>
          </div>

          <div className="col pt-5">
            <div className="d-flex flex-column-reverse mb-lg-2 pl-0">
              <h2 className="h4 h2-sm">
                Discover your next career opportunity in the XRPL community
              </h2>
              <h6 className="eyebrow mb-3">XRPL Careers</h6>
            </div>
            <p className="mb-3 py-4">
              Teams across the XRPL community are looking for talented
              individuals to help build their next innovation.
            </p>

            <div className="d-lg-none d-block">
              <div className="mb-4 pb-3" id="careersDark-small" ref={careersSmallAnimationContainer}></div>
            </div>
            <div className="d-lg-block">
              <a
                className="btn btn-primary btn-arrow"
                target="_blank"
                href="https://jobs.xrpl.org/jobs"
              >
                View Open Roles
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-new">
        <div className="col-md-6 offset-md-3 p-6-sm p-10-until-sm br-8 cta-card">
          <img
            src={prefix + "/img/backgrounds/cta-community-purple.svg"}
            className="d-none-sm cta cta-top-left"
          />
          <img
            src={prefix + "/img/backgrounds/cta-community-green.svg"}
            className="cta cta-bottom-right"
          />
          <div className="z-index-1 position-relative">
            <div className="d-flex flex-column-reverse">
              <h2 className="h4 mb-10-until-sm mb-8-sm">
                A community-driven resource for all things XRPL.org
              </h2>
              <h5 className="eyebrow mb-3">Contribute to XRPL.org</h5>
            </div>
            <p className="mb-10">
              Thank you for your interest in contributing to XRPL.org. This
              website was created as an XRPL community resource and is meant to
              be a living, breathing source of truth for XRP Ledger resources.
              This portal is open-source and anyone can suggest changes.
            </p>
            <a
              className="btn btn-primary btn-arrow"
              href="https://github.com/XRPLF/xrpl-dev-portal/blob/master/CONTRIBUTING.md"
              target="_blank"
            >
              Read Contributor Guidelines
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
