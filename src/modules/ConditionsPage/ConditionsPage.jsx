"use client";
import "./ConditionsPage.scss";
import HeaderSection from "./HeaderSection/HeaderSection";
import PresentationSection from "./PresentationSection/PresentationSection";
import VendeurSection from "./VendeurSection/VendeurSection";
import ResponsabiliteSection from "./ResponsabiliteSection/ResponsabiliteSection";
import ContactSection from "./ContactSection/ContactSection";

const ConditionsPage = () => {
  return (
    <main className="conditions">
      <HeaderSection />
      <PresentationSection />
      <VendeurSection />
      <ResponsabiliteSection />
      <ContactSection />
    </main>
  );
};

export default ConditionsPage;
