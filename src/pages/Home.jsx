import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import Services from '../components/Services.jsx';
import Masters from '../components/Masters.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';
import { fetchServices, fetchMasters } from '../api.js';

export default function Home() {
  const [services, setServices] = useState([]);
  const [masters, setMasters] = useState([]);

  useEffect(() => {
    fetchServices().then(setServices);
    fetchMasters().then(setMasters);
  }, []);

  return (
    <>
      <Header />
      <Hero />
      {services.length > 0 && <Services services={services} />}
      {masters.length > 0 && <Masters masters={masters} services={services} />}
      <Contact />
      <Footer />
    </>
  );
}
