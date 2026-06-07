import React from 'react';
import Logo from '../assets/logo3.svg';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="download-section">
          <div className="footer-logo-container">
            <img src={Logo} alt="MeetMaster Logo" className="footer-logo" />
          </div>

          <div className="download-header">
            <div className="download-icon">⬇</div>
            <div>
              <p className="font-semibold">Download Center</p>
              <p>Get the most out of MeetMaster</p>
            </div>
          </div>

          <select aria-label="Select Language">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Chinese (Simplified)</option>
            <option>Chinese (Traditional)</option>
            <option>Japanese</option>
            <option>Korean</option>
            <option>Hindi</option>
            <option>Arabic</option>
            <option>Portuguese</option>
            <option>Russian</option>
            <option>Italian</option>
            <option>Dutch</option>
            <option>Turkish</option>
            <option>Swedish</option>
            <option>Thai</option>
            <option>Vietnamese</option>
            <option>Indonesian</option>
          </select>

          <select aria-label="Select Currency">
            <option>INR ₹</option>
            <option>USD $</option>
            <option>Euro €</option>
            <option>GBP £</option>
            <option>JPY ¥</option>
            <option>AUD A$</option>
            <option>CAD C$</option>
            <option>CHF CHF</option>
            <option>CNY ¥</option>
            <option>NZD NZ$</option>
            <option>SGD S$</option>
            <option>HKD HK$</option>
            <option>KRW ₩</option>
            <option>SEK kr</option>
            <option>NOK kr</option>
            <option>MXN $</option>
            <option>BRL R$</option>
            <option>ZAR R</option>
          </select>

          <p>Talk to a sales rep</p>
          <p className="font-bold">1.800.555.MEET</p>
        </div>

        <div className="column">
          <h4>About</h4>
          <ul>
            {[
              'MeetMaster Blog',
              'Customers',
              'Our Team',
              'Careers',
              'Integrations',
              'Partners',
              'Investors',
              'Press',
              'Sustainability & ESG',
              'MeetMaster Cares',
              'Media Kit',
              'How To Videos',
              'Developer Platform',
              'MeetMaster Ventures',
              'MeetMaster Merchandise Store',
            ].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase().replace(/ /g, '-')}`}>{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="column">
          <h4>Download</h4>
          <ul>
            {[
              'MeetMaster Workplace App',
              'MeetMaster Rooms App',
              'MeetMaster Rooms Controller',
              'Browser Extension',
              'Outlook Plug-in',
              'iPhone/iPad App',
              'Android App',
              'MeetMaster Virtual Backgrounds',
            ].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase().replace(/ /g, '-')}`}>{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="column">
          <h4>Sales</h4>
          <ul>
            {[
              '1.800.555.MEET',
              'Contact Sales',
              'Plans & Pricing',
              'Request a Demo',
              'Webinars and Events',
              'MeetMaster Experience Center',
            ].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase().replace(/ /g, '-')}`}>{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="column">
          <h4>Support</h4>
          <ul>
            {[
              'Test MeetMaster',
              'Account',
              'Support Center',
              'Learning Center',
              'Technical Content Library',
              'Feedback',
              'Contact Us',
              'Accessibility',
              'Developer Support',
              'Privacy & Legal Policies',
            ].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase().replace(/ /g, '-')}`}>{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bottom">
        <p>
          © {new Date().getFullYear()} MeetMaster Communications, Inc. All
          rights reserved.
        </p>
        <div className="social-icons">
          {[
            'WordPress',
            'LinkedIn',
            'X',
            'YouTube',
            'Facebook',
            'Instagram',
          ].map((icon) => (
            <span key={icon} className="social-icon-item">
              {icon}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
