// app/privacy-policy/page.js
"use client";
import "./PrivacyPolicyPage.scss";
import HeaderSection from "./HeaderSection/HeaderSection";
import DataCollectionSection from "./DataCollectionSection/DataCollectionSection";
import PurposeSection from "./PurposeSection/PurposeSection";
import RightsSection from "./RightsSection/RightsSection";
import ContactSection from "./ContactSection/ContactSection";

const PrivacyPolicyPage = () => {
  return (
    <main className="privacy-policy__page">
      <HeaderSection />
      <DataCollectionSection />
      <PurposeSection />
      <RightsSection />
      <ContactSection />
    </main>
  );
};

export default PrivacyPolicyPage;
