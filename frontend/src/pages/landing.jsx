import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
export default function LandingPage() {
  const router = useNavigate();
  const [showContact, setShowContact] = React.useState(false);
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>MeetMaster Video Call</h2>
        </div>
        <div className="navlist">
          <p
            onClick={() => {
              router("/aljk23");
            }}
          >
            Join Meeting
          </p>
          <p
            onClick={() => {
              router("/auth");
            }}
          >
            Sign Up
          </p>
          <div
            onClick={() => {
              router("/auth");
            }}
            role="button"
          >
            <p>Sign In</p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div className="heroText">
          <h1>
            <span style={{ color: "#FF9839" }}>Meet</span> and{" "}
            <span style={{ color: "#FF9839" }}>Collaborate</span> Anytime
          </h1>
          <p>
            Secure, reliable, and easy-to-use video conferencing for work,
            study, and personal connections.
          </p>
          <div className="heroButtons">
            <Link to={"/auth"} className="ctaButton">
              Start Meeting
            </Link>
            <Link to={"/auth"} className="ctaButton secondary">
              Learn More
            </Link>
          </div>
        </div>

        <div className="heroImage">
          <img src={logo} alt="Video Collaboration" />
        </div>
      </div>

      <section className="featuresSection">
        <h2>Why Choose MeetMaster?</h2>
        <div className="featuresGrid">
          <div className="featureCard">
            <h3>HD Video & Audio</h3>
            <p>
              Crystal clear video and audio for a smooth meeting experience.
            </p>
          </div>
          <div className="featureCard">
            <h3>Screen Sharing</h3>
            <p>
              Share your screen instantly for presentations or collaborations.
            </p>
          </div>
          <div className="featureCard">
            <h3>Secure & Private</h3>
            <p>End-to-end encryption keeps your calls private and secure.</p>
          </div>
          <div className="featureCard">
            <h3>Easy to Use</h3>
            <p>Start a meeting with just a click—no complex setup needed.</p>
          </div>
        </div>
      </section>

      <section className="testimonialsSection">
        <h2>What Users Say</h2>
        <div className="testimonialGrid">
          <div className="testimonialCard">
            <p>
              "MeetMaster is my go-to app for online classes. The quality is
              amazing!"
            </p>
            <h4>- Priya S.</h4>
          </div>
          <div className="testimonialCard">
            <p>
              "I love how simple it is to start a meeting. No more Zoom
              headaches!"
            </p>
            <h4>- Rohan K.</h4>
          </div>
          <div className="testimonialCard">
            <p>"Secure, fast, and reliable. Perfect for business meetings."</p>
            <h4>- Neha M.</h4>
          </div>
        </div>
      </section>

      <div className="contactWrapper">
        <div
          className="contactIcon"
          onClick={() => setShowContact(!showContact)}
        ></div>

        {showContact && (
          <div className="contactModal">
            <h4>Contact Us</h4>
            <div className="contactCity">
              <h5>Mumbai Office</h5>
              <p>Email: mumbai@meetmaster.com</p>
              <p>Phone: +91 00000 00000</p>
              <p>Address: Mumbai, India</p>
            </div>
            <div className="contactCity">
              <h5>Kolkata Office</h5>
              <p>Email: kolkata@meetmaster.com</p>
              <p>Phone: +91 xxxxx xxxxx</p>
              <p>Address: Kolkata, India</p>
            </div>
            <button onClick={() => setShowContact(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
