"use client";
import "./PrivacyPolicyPage.scss";
import DonneesSection from "./DonneesSection/DonneesSection";
import CookiesSection from "./CookiesSection/CookiesSection";
import DroitsSection from "./DroitsSection/DroitsSection";
import ConservationSection from "./ConservationSection/ConservationSection";
import ContactSection from "./ContactSection/ContactSection";

const PrivacyPolicyPage = () => {
  return (
    <main className="privacy-policy__page">
      <DonneesSection />
      <CookiesSection />
      <DroitsSection />
      <ConservationSection />
      <ContactSection />
    </main>
  );
};

export default PrivacyPolicyPage;
