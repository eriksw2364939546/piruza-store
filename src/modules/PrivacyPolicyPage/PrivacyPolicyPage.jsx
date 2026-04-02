// app/privacy-policy/page.js
"use client";
import "./PrivacyPolicyPage.scss";
import HeaderSection from "./HeaderSection/HeaderSection";
import PresentationSection from "./PresentationSection/PresentationSection";
import VendeurSection from "./VendeurSection/VendeurSection";
import DonneesSection from "./DonneesSection/DonneesSection";
import CookiesSection from "./CookiesSection/CookiesSection";
import DroitsSection from "./DroitsSection/DroitsSection";
import ConservationSection from "./ConservationSection/ConservationSection";
import ContactSection from "./ContactSection/ContactSection";

const PrivacyPolicyPage = () => {
  return (
    <main className="privacy-policy__page">
      <HeaderSection />
      <PresentationSection />
      <VendeurSection />
      <DonneesSection />
      <CookiesSection />
      <DroitsSection />
      <ConservationSection />
      <ContactSection />
    </main>
  );
};

export default PrivacyPolicyPage;
