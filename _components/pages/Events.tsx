import React from "react";
import { useState } from "react";
import { usePathPrefix } from "@redocly/developer-portal/ui";

export default function Events() {
  const prefix = usePathPrefix();
  let [evtFilters, setEvtFilters] = useState({
    "hackathon-past": true,
    "meetup-past": true,
    "hackathon-upcoming": true,
    "meetup-upcoming": true,
  });

  function handleClick(evt) {
    const evtType = evt.target.id;
    setEvtFilters((evts) => {
      return { ...evts, [evtType]: !evts[evtType] };
    });
  }
  const pastEvts = [
    {
      name: "XRPL Hackathon 2021",
      description:
        "Explore the exciting project submissions from the fall 2021 XRPL Hackathon that focused on the NFT and Hooks smart contract functionalities on the ledger.",
      type: "hackathon-past",
      link: "https://xrpl-hackathon-2021.devpost.com/project-gallery",
      location: "Virtual",
      date: "September 13–October 6, 2021",
      image: "event-hack-2021.svg",
    },

    {
      name: "XRPL Community Meetup: San Diego",
      description:
        "The first official Meetup hosted by the XRPL Community. Community members in Southern California gathered around a firepit and shared their experiences with the XRPL.",
      type: "meetup-past",
      link: "https://www.meetup.com/xrpl-community/events/281806645/",
      location: "San Diego, CA",
      date: "Saturday, November 20, 2021",
      image: "event-meetup-san-diego@2x.jpg",
    },

    {
      name: "XRPL Community Meetup: Atlanta",
      description:
        "The inaugural Meetup in the Southeast region of the United States got community members excited to meet like-minded individuals in their area.",
      type: "meetup-past",
      link: "https://www.meetup.com/xrpl-community/events/281980446/",
      location: "Atlanta, GA",
      date: "Saturday, November 27, 2021",
      image: "event-meetup-alanta@2x.jpg",
    },

    {
      name: "XRPL Community Meetup: San Francisco",
      description:
        "Community members in the Bay Area with diverse backgrounds in technology and beyond met in downtown San Francisco.",
      type: "meetup-past",
      link: "https://www.meetup.com/xrpl-community/events/281806676/",
      location: "San Francisco, CA",
      date: "Monday, November 29, 2021",
      image: "event-meetup-san-francisco@2x.jpg",
    },

    {
      name: "XRPL Community Meetup: Miami",
      description:
        "One of the biggest Meetups held so far, this was the first of an ongoing series of local XRPL Community Meetup events in Miami. ",
      type: "meetup-past",
      link: "https://www.meetup.com/xrpl-community/events/281829463/",
      location: "Miami, FL ",
      date: "Thursday, December 9, 2021",
      image: "event-meetup-miami@2x.jpg",
    },

    {
      name: "XRPL Community Meetup: Nashville",
      description:
        "Nashville-based members of the XRPL Community came together to network, learn, share ideas, and form new partnerships. ",
      type: "meetup-past",
      link: "https://www.meetup.com/xrp-ledger-nashville-community/events/282538189/",
      location: "Nashville, TN",
      date: "Saturday, December 18, 2021",
      image: "event-meetup-nashville@2x.jpg",
    },

    {
      name: "XRPL Hackathon: New Year, New NFT",
      id: "upcoming-xrpl-hackathon-new-year",
      description:
        "Build functional NFTs on the XRPL that span across a full range of use cases and showcase your project in this hackathon. Submissions have a chance to win prizes from a total prize pool of $50,000 in XRP.",
      type: "meetup-past",
      link: "https://xrplnft.devpost.com/",
      location: "Virtual",
      date: "January 31 - March 14, 2022",
      image: "event-hack-new-year.svg",
    },

    {
      name: "NYC Meetup/Hackathon XRPL Celebration",
      id: "upcoming-xrpl-new-york",
      description:
        "The NYC/XRP community and Dev Null Productions cordially invites you to attend our 10th meetup, being held in celebration of the on-going XRPL Hackathon, at the unique and artistic TALS studio in Midtown Manhattan.",
      type: "meetup-past",
      link: "https://www.meetup.com/NYC-XRP/events/284485901/",
      location: "NYC, NY",
      date: "March 30, 2022",
      image: "event-meetup-new-york@2x.jpg",
    },

    {
      name: "XRPL Community Meetup: London",
      id: "upcoming-xrpl-london",
      description:
        "Join for an evening of programming and networking with members of the XRPL Community in London, co-organised by Peerkat - the NFT platform for creators on the XRPL.",
      type: "meetup-past",
      link: "https://www.meetup.com/xrp-ledger-london-community/events/283536458/",
      location: "IDEALondon",
      date: "March 31, 2022",
      image: "event-meetup-london.png",
    },

    {
      name: "XRPL Community Meetup: Toronto",
      id: "upcoming-xrpl-toronto",
      description:
        "Join us for our first Toronto meetup with an evening of programming and networking with other members of the XRP Ledger Community with special guests from the XUMM Wallet and ARK PLATES teams!",
      type: "meetup-past",
      link: "https://www.meetup.com/xrpl-toronto-community-meetup/events/284177188/",
      location: "Toronto",
      date: "March 31, 2022",
      image: "event-meetup-toronto@2x.jpg",
    },

    {
      name: "XRPL Community Meetup: San Diego",
      id: "upcoming-xrpl-san-diego",
      description:
        "Get together with other San Diego-based members of the XRP Ledger Community to network and discuss all things XRPL! Join us for our second San Diego XRPL Meetup.",
      type: "meetup-past",
      link: "https://www.meetup.com/xrp-ledger-san-diego-community/events/284663355/",
      location: "San Diego, CA",
      date: "April 1st 2022",
      image: "event-meetup-san-diego@2x.jpg",
    },

    {
      name: "XRPL Community Meetup: Irvine LA",
      id: "upcoming-xrpl-irvine",
      description:
        "Get together with other LA-based members of the XRP Ledger Community to network and discuss all things XRPL.",
      type: "meetup-past",
      link: "https://www.meetup.com/xrp-ledger-la-community-meetup/events/284824635/",
      location: "UC Irvine, CA",
      date: "April 3rd 2022",
      image: "event-meetup-irvine@2x.jpg",
    },

    {
      name: "XRPL Community Meetup: Miami #2",
      id: "upcoming-xrpl-miami-2",
      description:
        "We're excited to host our second Miami meetup for XRP Ledger community members on April 6th from 6-8pm, featuring Marco Neri, Developer Advocate at Ripple, who will join us to give a presentation on the XRP Ledger.",
      type: "meetup-past",
      link: "https://www.meetup.com/xrp-ledger-miami-community/events/284463736/",
      location: "The LAB Miami, FL",
      date: "April 6th 2022",
      image: "event-meetup-miami@2x.jpg",
    },
  ];

  const upcomingEvts = [
    {
      name: "XRPL Hackathon: Creating Real World Impact",
      description:
        "Build apps to improve lives in the real world using any of the SDKs and APIs for the XRP Ledger",
      type: "hackathon-upcoming",
      link: "https://xrplimpact.devpost.com/",
      location: "Virtual",
      date: "May 26 - July 11",
      image: "event-hack-impact@2x.png",
    },
  ];
  return (
    <div className="landing page-events">
      <div className="position-relative d-none-sm">
        <img
          src={prefix + "/img/backgrounds/events-orange.svg"}
          id="events-orange"
        />
      </div>

      <section className="py-26 text-center">
        <div className="col-lg-5 mx-auto text-center">
          <div className="d-flex flex-column-reverse">
            <h1 className="mb-0">Find the XRPL Community Around the World</h1>
            <h6 className="eyebrow mb-3">Events</h6>
          </div>
        </div>
      </section>

      <section className="container-new py-26">
        <div className="event-hero card-grid event-hero card-grid-2xN">
          <div className="col order-2 order-lg-1 pr-2">
            <div className="d-flex flex-column-reverse">
              <h2 className="h4 h2-sm mb-8">Annual Summit: Apex</h2>
            </div>
            <p className="mb-4">
              Apex XRPL Developer Summit is the annual event where developers,
              contributors, and thought leaders come together to learn, build,
              share, network, and celebrate all things XRP Ledger.
            </p>
            <div className="pt-2 mt-5 mb-5 event-save-date">
              More info about Apex 2022 coming soon!
            </div>
            <div className="d-lg-block">
              <a
                className="btn btn-primary btn-arrow"
                target="_blank"
                href="http://apexdevsummit.com"
              >
                Explore Apex
              </a>
            </div>
          </div>
          <div className="col order-1 order-lg-2 pt-5 pr-2">
            <div id="event-hero-image"></div>
          </div>
        </div>
      </section>

      <section className="container-new py-26">
        <div className="event-hero card-grid card-grid-2xN">
          <div className="col pr-2">
            <img
              src={prefix + "/img/events/event-hero2@2x.png"}
              className="w-100"
            />
          </div>

          <div className="col pt-5 pr-2">
            <div className="d-flex flex-column-reverse">
              <h2 className="h4 h2-sm mb-8">Apex 2021 On-Demand</h2>
            </div>
            <p className="mb-4">
              View sessions from the Apex 2021 stages in Las Vegas and Tallinn.
              Relive the keynote fireside chat with Alexis Ohanian and soak in
              the knowledge that was shared by passionate XRPL community
              members.
            </p>

            <div className="event-small-gray py-2 my-5">
              September 29–30, 2021
              <br />
              Las Vegas, Estonia
            </div>

            <div className="d-lg-block">
              <a
                className="btn btn-primary btn-arrow"
                target="_blank"
                href="https://www.youtube.com/playlist?list=PLJQ55Tj1hIVZgnreb8ODgxJW032M9Z2XZ"
              >
                Watch Sessions On-Demand
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-new py-26" id="upcoming-events">
        <div className="d-flex flex-column-reverse col-lg-6 p-0 pr-lg-5 mb-4 pb-2">
          <h3 className="h4 h2-sm">
            Check out meetups, hackathons, and other events hosted by the XRPL
            Community
          </h3>
          <h6 className="eyebrow mb-3">Upcoming Events</h6>
        </div>

        <div className="filter row col-12 mt-lg-5 d-flex flex-column">
          <h6 className="mb-3">Filter By:</h6>
          <div>
            <div className="form-check form-check-inline">
              <input
                value="meetup"
                id="meetup-upcoming"
                name="meetup-upcoming"
                type="checkbox"
                className="events-filter"
                checked={evtFilters["meetup-upcoming"]}
                onChange={handleClick}
              />
              <label htmlFor="meetup-upcoming">Meetups</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                value="hackathon"
                id="hackathon-upcoming"
                name="hackathon-upcoming"
                type="checkbox"
                className="events-filter"
                checked={evtFilters["hackathon-upcoming"]}
                onChange={handleClick}
              />
              <label htmlFor="hackathon-upcoming">Hackathons</label>
            </div>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-lg-3 card-deck mt-2">
          {upcomingEvts.map((evt) => {
            if (evtFilters[evt.type]) {
              return (
                <a
                  className={"event-card " + evt.type}
                  href={evt.link}
                  target="_blank"
                >
                  <div
                    className="event-card-header"
                    style={{
                      background:
                        "no-repeat " +
                        "url(" +
                        prefix +
                        "/img/events/" +
                        evt.image +
                        ")",
                    }}
                  >
                    <div className="event-card-title">{evt.name}</div>
                  </div>
                  <div className="event-card-body">
                    <p>{evt.description}</p>
                  </div>
                  <div className="mt-lg-auto event-card-footer d-flex flex-column">
                    <span className="d-flex mb-2 icon icon-location">
                      {evt.location}
                    </span>
                    <span className="d-flex icon icon-date">{evt.date}</span>
                  </div>
                </a>
              );
            }
          })}
        </div>
      </section>

      <section className="container-new pt-26" id="past-events">
        <div className="d-flex flex-column-reverse col-lg-6 p-0 pr-lg-5 mb-4 pb-2">
          <h3 className="h4 h2-sm">Explore past community-hosted events</h3>
          <h6 className="eyebrow mb-3">Past Events</h6>
        </div>

        <div className="filter row col-12 mt-lg-5 d-flex flex-column">
          <h6 className="mb-3">Filter By:</h6>
          <div>
            <div className="form-check form-check-inline">
              <input
                value="meetup"
                id="meetup-past"
                name="meetup-past"
                type="checkbox"
                className="events-filter"
                checked={evtFilters["meetup-past"]}
                onChange={handleClick}
              />
              <label htmlFor="meetup-past">Meetups</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                value="hackathon"
                id="hackathon-past"
                name="hackathon-past"
                type="checkbox"
                className="events-filter"
                checked={evtFilters["hackathon-past"]}
                onChange={handleClick}
              />
              <label htmlFor="hackathon-past">Hackathons</label>
            </div>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-lg-3 card-deck mb-0 mt-2 ">
          {pastEvts.reverse().map((evt) => {
            if (evtFilters[evt.type]) {
              return (
                <a
                  className={"event-card " + evt.type}
                  href={evt.link}
                  target="_blank"
                >
                  <div
                    className="event-card-header"
                    style={{
                      background:
                        "no-repeat " +
                        "url(" +
                        prefix +
                        "/img/events/" +
                        evt.image +
                        ")",
                    }}
                  >
                    <div className="event-card-title">{evt.name}</div>
                  </div>
                  <div className="event-card-body">
                    <p>{evt.description}</p>
                  </div>
                  <div className="mt-lg-auto event-card-footer d-flex flex-column">
                    <span className="d-flex mb-2 icon icon-location">
                      {evt.location}
                    </span>
                    <span className="d-flex icon icon-date">{evt.date}</span>
                  </div>
                </a>
              );
            }
          })}
        </div>
      </section>
    </div>
  );
}
