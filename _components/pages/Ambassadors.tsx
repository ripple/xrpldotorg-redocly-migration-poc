import React from "react";
import { usePathPrefix } from "@redocly/developer-portal/ui";
import { Helmet } from "react-helmet";
import Carousel from "react-bootstrap/Carousel";
export default function Ambassadors() {
  const prefix = usePathPrefix();

  return (
    <div className="landing page-ambassadors styled-page">
      <div className="position-relative d-none-sm">
        <img
          src={prefix + "/img/backgrounds/ambassador-purple.svg"}
          className="position-absolute"
          style={{ top: 0, right: 0 }}
        />
      </div>

      <section className="container-new py-26 text-lg-center">
        <div className="p-0 col-lg-8 mx-lg-auto">
          <div className="d-flex flex-column-reverse">
            <h1 className="mb-0">Become an XRP Ledger Campus Ambassador</h1>
            <h6 className="eyebrow mb-3">Join the Student Cohort</h6>
          </div>
          <p className="mt-3 py-3 col-lg-8 mx-lg-auto p-0">
            The XRPL Campus Ambassador program engages, supports, connects, and
            recognizes a group of student champions of the XRPL and empowers
            them to further advance engagement on the XRP Ledger.
          </p>
          <button
            data-tf-popup="vXU4VN5c"
            data-tf-iframe-props="title=XRPL Ambassador Program"
            data-tf-medium="snippet"
            className="btn btn-primary btn-arrow-out"
            data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx"
          >
            Apply Now for Fall 2022
          </button>
        </div>
      </section>

      <section className="container-new py-26">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center">
          <div className="order-lg-2 mx-lg-4 mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0 pr-lg-5">
            <div className="d-flex flex-column-reverse p-lg-3">
              <h3 className="h4 h2-sm">XRPL Campus Ambassadors</h3>
              <h6 className="eyebrow mb-3">Current Students</h6>
            </div>
            <p className="p-lg-3 mb-2 longform">
              The XRPL Campus Ambassador program aims to elevate the impact of
              college students who are passionate about blockchain technology.
              In their role, Campus Ambassadors help educate other students
              about crypto and how to start building on the XRPL.
            </p>
            <div className="d-none d-lg-block p-lg-3">
              <button
                data-tf-popup="vXU4VN5c"
                data-tf-iframe-props="title=XRPL Ambassador Program"
                data-tf-medium="snippet"
                className="btn btn-primary btn-arrow-out"
                data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx"
              >
                Apply Now for Fall 2022
              </button>
            </div>
          </div>

          <div className="order-lg-1 col-lg-6 px-0 mr-lg-4">
            <div className="row m-0">
              <img
                src={prefix + "/img/ambassadors/developer-hero@2x.png"}
                className="w-100"
              />
            </div>
          </div>

          <div className="d-lg-none order-3 mt-4 pt-3 p-lg-3">
            <button
              data-tf-popup="vXU4VN5c"
              data-tf-iframe-props="title=XRPL Ambassador Program"
              data-tf-medium="snippet"
              className="btn btn-primary btn-arrow-out"
              data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx"
            >
              Apply Now for Fall 2022
            </button>
          </div>
        </div>
      </section>

      <section className="container-new py-26">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center">
          <div className="order-1 mr-lg-4 mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0">
            <div className="d-flex flex-column-reverse p-lg-3">
              <h3 className="h4 h2-sm">
                Process to become a Campus Ambassador
              </h3>
              <h6 className="eyebrow mb-3">How it Works</h6>
            </div>

            <p className="p-lg-3 mb-2 longform">
              Apply now to become an XRPL Campus Ambassador.
            </p>

            <div className="d-none d-lg-block p-lg-3">
              <button
                data-tf-popup="vXU4VN5c"
                data-tf-iframe-props="title=XRPL Ambassador Program"
                data-tf-medium="snippet"
                className="btn btn-primary btn-arrow-out"
                data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx"
              >
                Apply Now for Fall 2022
              </button>
            </div>
          </div>

          <div className="order-2 col-lg-6 px-0 ml-lg-2">
            <div className="row m-0">
              <div className="col-12 col-lg-6 p-0 pr-lg-4">
                <div className="px-lg-3 pb-3">
                  <img
                    src={prefix + "/img/ambassadors/01.svg"}
                    className="pl-lg-3"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Apply</h6>
                    <p>
                      Submit an application to be considered for the Campus
                      Ambassador program.
                    </p>
                  </div>
                </div>

                <div className="px-lg-3 pb-3 d-lg-none ">
                  <img
                    src={prefix + "/img/ambassadors/02.svg"}
                    className="pl-lg-3"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Interview</h6>
                    <p>
                      Tell the XRPL community-led panel more about yourself and
                      your interest in the program during an interview.
                    </p>
                  </div>
                </div>

                <div className="px-lg-3 pb-3">
                  <img
                    src={prefix + "/img/ambassadors/03.svg"}
                    className="pl-lg-3"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Join</h6>
                    <p>
                      Congrats on your new role! Join the global cohort of
                      Ambassadors and meet with community participants during
                      onboarding.
                    </p>
                  </div>
                </div>

                <div className="p-lg-3 pb-3 d-lg-none">
                  <img
                    src={prefix + "/img/ambassadors/04.svg"}
                    className="pl-lg-3"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Learn</h6>
                    <p>
                      Participate in personalized learning and training sessions
                      for Ambassadors on the XRPL and blockchain technology.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6 p-0 pl-lg-4 d-none d-lg-block mt-5">
                <div className="px-lg-3 pb-3 mt-5">
                  <img
                    src={prefix + "/img/ambassadors/02.svg"}
                    className="pl-lg-3"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Interview</h6>
                    <p>
                      Tell the XRPL community-led panel more about yourself and
                      your interest in the program during an interview.
                    </p>
                  </div>
                </div>
                <div className="p-lg-3 pb-3 ">
                  <img
                    src={prefix + "/img/ambassadors/04.svg"}
                    className="pl-lg-3"
                  />
                  <div className="p-lg-3 pt-3 pb-lg-0">
                    <h6 className="mb-3">Learn</h6>
                    <p className="pb-lg-0">
                      Participate in personalized learning and training sessions
                      for Ambassadors on the XRPL and blockchain technology.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-lg-none order-3 mt-4 pt-3">
            <button
              data-tf-popup="vXU4VN5c"
              data-tf-iframe-props="title=XRPL Ambassador Program"
              data-tf-medium="snippet"
              className="btn btn-primary btn-arrow-out"
              data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx"
            >
              Apply Now for Fall 2022
            </button>
          </div>
        </div>
      </section>

      <section className="container-new py-26">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center">
          <div className="order-1 order-lg-2 mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0">
            <div className="d-flex flex-column-reverse p-lg-3">
              <h3 className="h4 h2-sm">
                Why become an XRPL Campus Ambassador?
              </h3>
              <h6 className="eyebrow mb-3">Benefits</h6>
            </div>
            <p className="p-lg-3 mb-2 longform">
              Join a global cohort of students empowering others to build on the
              XRPL.
            </p>
          </div>

          <div className="order-2 order-lg-1 col-lg-6 px-0 mr-lg-5">
            <div className="row align-items-center m-0" id="benefits-list">
              <div className="col-12 col-lg-6 p-0 pr-lg-4">
                <div className="px-lg-3 pb-3">
                  <img
                    id="benefits-01"
                    src={prefix + "/img/ambassadors/benefits-01.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Exclusive Opportunities</h6>
                    <p>
                      Get access and invitations to Ambassador-only events,
                      conferences, and opportunities
                    </p>
                  </div>
                </div>

                <div className="px-lg-3 pb-3 d-lg-none ">
                  <img
                    id="benefits-02"
                    src={prefix + "/img/ambassadors/benefits-02.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Education</h6>
                    <p>
                      Tutorials and workshops from leading XRPL and blockchain
                      developers
                    </p>
                  </div>
                </div>
                <div className="px-lg-3 pb-3">
                  <img
                    id="benefits-03"
                    src={prefix + "/img/ambassadors/benefits-03.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Swag</h6>
                    <p>
                      New XRPL swag for Ambassadors and swag to share with other
                      students
                    </p>
                  </div>
                </div>
                <div className="px-lg-3 pb-3 d-lg-none">
                  <img
                    id="benefits-04"
                    src={prefix + "/img/ambassadors/benefits-04.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Mentorship</h6>
                    <p>
                      Serve as an advocate and receive support from notable
                      members of the community
                    </p>
                  </div>
                </div>
                <div className="px-lg-3 pb-3">
                  <img
                    id="benefits-05"
                    src={prefix + "/img/ambassadors/benefits-05.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3 pb-lg-0">
                    <h6 className="mb-3">Career Acceleration</h6>
                    <p className="pb-lg-0">
                      Gain hands-on experience building communities and grow
                      your professional network in the blockchain industry
                    </p>
                  </div>
                </div>
                <div className="px-lg-3 pb-3 d-lg-none">
                  <img
                    id="benefits-06"
                    src={prefix + "/img/ambassadors/benefits-06.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="pb-lg-0">
                    <h6 className="mb-3">Stipend</h6>
                    <p className="pb-lg-0">
                      Receive a stipend to fund your ideas and initiatives that
                      fuel XRPL growth on your campus
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6 p-0 pl-lg-4 d-none d-lg-block">
                <div className="px-lg-3 pb-3 pt-5 mt-5">
                  <img
                    id="benefits-02"
                    src={prefix + "/img/ambassadors/benefits-02.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Education</h6>
                    <p>
                      Tutorials and workshops from leading XRPL and blockchain
                      developers
                    </p>
                  </div>
                </div>

                <div className="px-lg-3 pb-3 ">
                  <img
                    id="benefits-04"
                    src={prefix + "/img/ambassadors/benefits-04.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Mentorship</h6>
                    <p>
                      Serve as an advocate and receive support from notable
                      members of the community
                    </p>
                  </div>
                </div>

                <div className="px-lg-3 pb-3">
                  <img
                    id="benefits-06"
                    src={prefix + "/img/ambassadors/benefits-06.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3 pb-lg-0">
                    <h6 className="mb-3">Stipend</h6>
                    <p className="pb-lg-0">
                      Receive a stipend to fund your ideas and initiatives that
                      fuel XRPL growth on your campus
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-new py-26">
        <Carousel
          controls={false}
          indicators={false}
          id="carouselSlidesOnly"
          className="carousel slide col-lg-10 mx-auto px-0"
        >
          <Carousel.Item className="p-0">
            <img
              src={prefix + "/img/ambassadors/quote1-small.svg"}
              className="h-100 d-lg-none mb-4"
            />
            <img
              src={prefix + "/img/ambassadors/quote1.svg"}
              className="h-100 d-none d-lg-block"
            />
            <div className="p-0 col-lg-7 mx-lg-auto">
              <p className="p-lg-3 mb-2">
                <strong>Titose C.</strong>
                <br />
                University of Cape Town,
                <br />
                Spring 2022 XRPL Campus Ambassador
              </p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="p-0">
              <div className="mb-4 p-lg-3">
                <img
                  src={prefix + "/img/ambassadors/quote2-small.svg"}
                  className="h-100 d-lg-none  mb-4"
                />
                <img
                  src={prefix + "/img/ambassadors/quote2.svg"}
                  className="h-100 d-none d-lg-block"
                />
                <div className="p-0 col-lg-7 mx-lg-auto">
                  <p className="p-lg-3 mb-2">
                    <strong>Derrick N.</strong>
                    <br />
                    Ryerson University,
                    <br />
                    Spring 2022 XRPL Campus Ambassador
                  </p>
                </div>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>

        <div>
          <img
            src={prefix + "/img/ambassadors/students-large.png"}
            className="w-100"
          />
        </div>
      </section>

      <section className="container-new py-26">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center mr-lg-4">
          <div className="order-1  mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0 mr-lg-5">
            <div className="d-flex flex-column-reverse p-lg-3">
              <h3 className="h4 h2-sm">Should You Apply?</h3>
              <h6 className="eyebrow mb-3">
                Eligibility for XRPL Campus Ambassadors
              </h6>
            </div>
            <p className="p-lg-3 mb-2 longform">
              Students currently enrolled in an undergraduate or postgraduate
              program at an accredited college or university are eligible to
              apply.
            </p>
          </div>

          <div className="order-2 col-lg-6 px-0">
            <div className="row align-items-center m-0" id="eligibility-list">
              <div className="col-12 col-lg-6 p-0 pr-lg-4">
                <div className="px-lg-3 pb-3">
                  <img
                    id="eligibility-01"
                    src={prefix + "/img/ambassadors/eligibility-01.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">A Leader</h6>
                    <p>
                      Interested in leading meetups and workshops for your local
                      campus community
                    </p>
                  </div>
                </div>

                <div className="px-lg-3 pb-3 d-lg-none ">
                  <img
                    id="eligibility-02"
                    src={prefix + "/img/ambassadors/eligibility-02.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Active</h6>
                    <p>
                      An active participant in the XRPL community or interested
                      in blockchain and crypto technologies
                    </p>
                  </div>
                </div>

                <div className="px-lg-3 pb-3">
                  <img
                    id="eligibility-03"
                    src={prefix + "/img/ambassadors/eligibility-03.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Curious</h6>
                    <p>
                      Eager to learn more about technical blockchain topics and
                      the XRPL
                    </p>
                  </div>
                </div>

                <div className="px-lg-3 pb-3 d-lg-none">
                  <img
                    id="eligibility-04"
                    src={prefix + "/img/ambassadors/eligibility-04.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3 pb-lg-0">
                    <h6 className="mb-3">Passionate</h6>
                    <p>
                      Passionate about increasing XRPL education and awareness
                      through events, content, and classNameroom engagement
                    </p>
                  </div>
                </div>

                <div className="p-lg-3 pb-3">
                  <img
                    id="eligibility-05"
                    src={prefix + "/img/ambassadors/eligibility-05.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3 pb-lg-0">
                    <h6 className="mb-3">Creative</h6>
                    <p className="pb-lg-0 mb-0">
                      Ability to think outside the box to grow the XRPL student
                      community
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 p-0 pl-lg-4 d-none d-lg-block">
                <div className="px-lg-3 pb-3 ">
                  <img
                    id="eligibility-02"
                    src={prefix + "/img/ambassadors/eligibility-02.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3">
                    <h6 className="mb-3">Active</h6>
                    <p>
                      An active participant in the XRPL community or interested
                      in blockchain and crypto technologies
                    </p>
                  </div>
                </div>
                <div className="px-lg-3 pb-3 ">
                  <img
                    id="eligibility-04"
                    src={prefix + "/img/ambassadors/eligibility-04.svg"}
                    className="pl-lg-3 invertible-img"
                  />
                  <div className="p-lg-3 pt-3 pb-lg-0">
                    <h6 className="mb-3">Passionate</h6>
                    <p>
                      Passionate about increasing XRPL education and awareness
                      through events, content, and classNameroom engagement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-new pt-26">
        <div className="p-0 col-lg-5">
          <div className="d-flex flex-column-reverse p-lg-3">
            <h3 className="h4 h2-sm">
              Join a global cohort of Student Ambassadors
            </h3>
            <h6 className="eyebrow mb-3">Global Community</h6>
          </div>
        </div>
      </section>

      <div id="container-scroll">
        <div className="photobanner">
          <img
            src={prefix + "/img/ambassadors/locations-row-1.png"}
            alt="Ambassador locations"
            height="48px"
            className="px-5"
          />
          <img
            src={prefix + "/img/ambassadors/locations-row-1.png"}
            alt="Ambassador locations"
            height="48px"
            className="px-5"
          />
          <img
            src={prefix + "/img/ambassadors/locations-row-1.png"}
            alt="Ambassador locations"
            height="48px"
            className="px-5"
          />
        </div>
        <div className="photobanner photobanner-bottom">
          <img
            src={prefix + "/img/ambassadors/locations-row-2.png"}
            alt="Ambassador locations"
            height="48px"
            className="px-5"
          />
          <img
            src={prefix + "/img/ambassadors/locations-row-2.png"}
            alt="Ambassador locations"
            height="48px"
            className="px-5"
          />
          <img
            src={prefix + "/img/ambassadors/locations-row-2.png"}
            alt="Ambassador locations"
            height="48px"
            className="px-5"
          />
        </div>
      </div>

      <section className="container-new py-26">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center">
          <div className="order-1 mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0">
            <div className="d-flex flex-column-reverse p-lg-3">
              <h3 className="h4 h2-sm">
                Stay connected to the XRPL Campus Ambassadors
              </h3>
              <h6 className="eyebrow mb-3">Connect</h6>
            </div>

            <p className="p-lg-3 mb-2 longform">
              To stay up-to-date on the latest activity, meetups, and events of
              the XRPL Campus Ambassadors be sure to follow these channels:
            </p>

            <div className="d-none d-lg-block p-lg-3">
              <button
                data-tf-popup="vXU4VN5c"
                data-tf-iframe-props="title=XRPL Ambassador Program"
                data-tf-medium="snippet"
                className="btn btn-primary btn-arrow-out"
                data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx"
              >
                Apply Now for Fall 2022
              </button>
            </div>
          </div>

          <div className="order-2 col-lg-6 px-0 ml-lg-5">
            <div className="row align-items-center m-0">
              <div className="col-12 col-lg-6 p-0 pr-lg-4">
                <div className="p-lg-3 mb-3 pb-3 connect-links">
                  <a href="https://www.meetup.com/pro/xrpl-community/">
                    <img
                      src={prefix + "/img/ambassadors/icon_meetup.svg"}
                      className="mb-3"
                    />
                    <h6 className="mb-3 btn-arrow">MeetUp</h6>
                    <p>Attend an XRPL Meetup in your local area</p>
                  </a>
                </div>
                <div className="p-lg-3 mb-3 pb-3 connect-links">
                  <a href="https://dev.to/t/xrpl">
                    <img
                      src={prefix + "/img/ambassadors/icon_devto.svg"}
                      className="mb-3"
                    />
                    <h6 className="mb-3 btn-arrow">Dev.to Blog</h6>
                    <p>Read more about the activity of the XRPL Ambassadors</p>
                  </a>
                </div>
              </div>

              <div className="col-12 col-lg-6 p-0 pl-lg-4">
                <div className="p-lg-3 mb-3 pb-3 connect-links">
                  <a href="https://discord.com/invite/427qqMYwHh">
                    <img
                      src={prefix + "/img/ambassadors/icon_discord.svg"}
                      className="mb-3"
                    />
                    <h6 className="mb-3 btn-arrow">Discord</h6>
                    <p>Join the conversation on the XRPL Developer Discord</p>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="d-lg-none order-3 mt-4 pt-3">
            <button
              data-tf-popup="vXU4VN5c"
              data-tf-iframe-props="title=XRPL Ambassador Program"
              data-tf-medium="snippet"
              className="btn btn-primary btn-arrow-out"
              data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx"
            >
              Apply Now to XRPL Ambassadors
            </button>
          </div>
        </div>
      </section>
      <Helmet>
        <script src="//embed.typeform.com/next/embed.js"></script>
      </Helmet>
    </div>
  );
}
