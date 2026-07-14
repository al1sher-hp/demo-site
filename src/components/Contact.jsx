import { PinIcon, PhoneIcon, ClockIcon } from './icons/ContactIcons.jsx';
import MapPin from './MapPin.jsx';

export default function Contact() {
  return (
    <section className="section" id="kontakt">
      <div className="section-inner">
        <div className="section-head">
          <span className="section-eyebrow">Aloqa</span>
          <h2 className="section-title">Bizni toping</h2>
        </div>
        <div className="contact-card">
          <div className="contact-info">
            <h3>Nilufar Beauty</h3>
            <div className="contact-row">
              <PinIcon />
              <div>
                <strong>Manzil</strong>
                Toshkent sh., Yunusobod tumani,
                <br />
                Amir Temur shoh ko'chasi 45A
              </div>
            </div>
            <div className="contact-row">
              <PhoneIcon />
              <div>
                <strong>Telefon</strong>
                +998 90 123 45 67
              </div>
            </div>
            <div className="contact-row">
              <ClockIcon />
              <div>
                <strong>Ish vaqti</strong>
                Har kuni: 09:00 – 20:00
              </div>
            </div>
          </div>
          <div className="contact-map">
            <MapPin />
          </div>
        </div>
      </div>
    </section>
  );
}
