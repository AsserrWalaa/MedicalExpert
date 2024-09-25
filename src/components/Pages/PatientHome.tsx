import React from "react";
import hero from "../../assets/imgs/Contact us-cuate 1 (1).png";
import blogs from "../../assets/imgs/taylor-kiser-6hxK5l-sHys-unsplash 1.png";
import author from "../../assets/imgs/author.png";
import icon1 from "../../assets/imgs/Health, Sport, Apple watch.png";
import icon2 from "../../assets/imgs/Group.png";
import icon3 from "../../assets/imgs/shop.png";
import icon4 from "../../assets/imgs/expand.png";
import Accordion from "react-bootstrap/Accordion";

const Home: React.FC = () => {
  return (
    <div>
      {/* start header */}
      <section className="header">
        <div className="container">
          <div className="d-flex flex-wrap">
            <div className="discover col-md-6 mt-md-2">
              <h1 className="fw-bold text-dark mt-5">
                Discover a world of vibrant health through our youth nutrition
                platform.
              </h1>
              <h3 className="text-secondary fs-5 fw-light mt-5 mb-5">
                Unleash the benefits of smart choices, inspiring habits, and
                expert guidance for a resilient, thriving future ahead!
              </h3>
              <div>
                <form className="d-flex mt-5">
                  <button
                    className="btn btn-secondary text-light px-3"
                    type="submit">
                    Get Started
                  </button>
                  <button
                    className="btn btn-outline-secondary bg-white text-dark ms-2"
                    type="button">
                    Learn More
                  </button>
                </form>
              </div>
            </div>
            <div className="mb-4 mt-md-5 col-md-6 col-sm-4">
              <img src={hero} className="img-fluid" alt="Hero" />
            </div>
          </div>
        </div>
      </section>
      {/* end header */}

      <hr className="container text-center fw-bold w-75 mt-2" />

      {/* start section */}
      <section className="Two">
        <div className="text-center mt-5 mb-2">
          <h1 className="">Healthy Habits, Happy Lives</h1>
          <p className="text-secondary mb-2">
            The Ultimate Youth Nutrition Hub for Health and Happiness
          </p>
        </div>
        <div className="row mt-3 container mx-auto text-start">
          <div className="col-lg-6 col-md-6 col-sm-12 mb-1 d-flex align-items-center">
            <div className="pe-3">
              <h1 className="fw-bolder text-dark pt-3">
                <img src={icon1} alt="Icon 1" width="50" className="mb-4" />
              </h1>
            </div>
            <div>
              <h6 className="text-start">
                Track Your Habits, Transform Your Life
              </h6>
              <p className="text-secondary text-start">
                Small Changes, Big Impact: Tracking Habits, Building Futures
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mb-1 d-flex align-items-center">
            <div className="pe-3">
              <h1 className="fw-bolder text-dark pt-3">
                <img src={icon2} alt="Icon 2" width="50" className="mb-4" />
              </h1>
            </div>
            <div>
              <h6 className="text-start">
                Book Your Children's Doctor Appointment with Ease
              </h6>
              <p className="text-secondary text-start">
                Your Health, Your Schedule: Effortless Booking for a Better
                Tomorrow.
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mb-1 d-flex align-items-center">
            <div className="pe-3">
              <h1 className="fw-bolder text-dark pt-3">
                <img src={icon3} alt="Icon 3" width="50" className="mb-4" />
              </h1>
            </div>
            <div>
              <h6 className="text-start">
                Shop Smart, Healthy Products for Happy Children.
              </h6>
              <p className="text-secondary text-start">
                Elevate Their Health, One Thoughtful Purchase at a Time.
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mb-1 d-flex align-items-center">
            <div className="pe-3">
              <h1 className="fw-bolder text-dark pt-3">
                <img src={icon4} alt="Icon 4" width="50" className="mb-4" />
              </h1>
            </div>
            <div>
              <h6 className="text-start">
                Expand Knowledge, Read Articles for Your Child's Health.
              </h6>
              <p className="text-secondary text-start">
                Illuminate Their Future: Unlock Wisdom, Foster Well-being.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* end section */}

      <hr className="container text-center fw-bold w-75 mt-2" />

      {/* start section */}
      <section className="three">
        <div className="text-center m-5">
          <h1>Ready to dive in?</h1>
          <h1>Start your free trial today.</h1>
          <form className="">
            <button className="btn btn-secondary text-light px-3" type="submit">
              Download App
            </button>
          </form>
        </div>
      </section>
      {/* start section */}

      <hr className="container text-center fw-bold w-75 mt-2" />

      {/* start section */}
      <section className="four mb-4">
        <div>
          <div className="text-center">
            <div className="m-5">
              <h1>Want product news and updates?</h1>
              <h1 className="frequently">Sign up for our newsletter.</h1>
            </div>
          </div>
          <form className="d-flex justify-content-center ">
            <input
              className="form-control me-2 w-25"
              type="email"
              placeholder="Enter email address"
              aria-label="email"
              required
            />
            <button className="btn btn-secondary text-light px-3">
              Notify me
            </button>
          </form>
        </div>
      </section>
      {/* end section */}

      <hr className="container text-center fw-bold w-75 mt-2" />

      {/* start blogs */}
      <div className="blog-head text-center mt-5 mb-4">
        <h6 className="blog-one">From the blog</h6>
        <h1 className="blog-two">From our blog</h1>
        <p className="text-secondary">
          Knowledge is Nurturing: Cultivate a Healthier Tomorrow through
          Enlightened Parenting.
        </p>
      </div>
      {/* end blogs */}
      {/* start blogs cards */}
      <section className="blog-cards mb-5">
        <div className="container">
          <div className="row justify-content-center">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  className="card cards mt-3 me-lg-3 border-1 shadow col-lg-3 col-md-6 col-sm-12"
                  key={index}>
                  <img src={blogs} className="card-img-top mt-2" alt="Blog" />
                  <div className="card-body">
                    <h6 className="text-secondary mt-2">Article</h6>
                    <h6 className="card-title text-bold mt-3">
                      Management of food allergies
                    </h6>
                    <p className="card-text text-secondary mt-3 mb-3">
                      Worldwide, approximately 8 and 2% of children and adults,
                      respectively, suffer from food allergy, Cow's milk, egg,
                      peanut ...
                    </p>
                    <div className="Author d-flex mt-5 mb-2">
                      <div className="author-img me-3">
                        <img src={author} alt="Author" />
                      </div>
                      <div className="author-data">
                        <h6>Author name</h6>
                        <p className="text-secondary">
                          Jun 27, 2023 · 6 min read
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      {/* end blogs cards */}

      {/* start FAQ */}
      <section className="five w-75 m-auto">
        <div className="text-center mt-5 mb-4">
          <h1 className="frequently">Frequently asked questions</h1>
        </div>
        <Accordion className="accordion">
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              Is my personal data and information secure when using the app?
            </Accordion.Header>
            <Accordion.Body>
              Yes, we prioritize your privacy and data security. Our app employs
              robust encryption and security measures to protect your
              information.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              Can I access the app on multiple devices?
            </Accordion.Header>
            <Accordion.Body>
              Yes, you can log in to your account on multiple devices and access
              your personalized content seamlessly.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              Is there a free trial available?
            </Accordion.Header>
            <Accordion.Body>
              Yes, we offer a free trial period for you to explore the app and
              its features.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              How do I cancel my subscription?
            </Accordion.Header>
            <Accordion.Body>
              You can cancel your subscription at any time through your account
              settings within the app.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </section>
      {/* end FAQ */}
    </div>
  );
};

export default Home;
