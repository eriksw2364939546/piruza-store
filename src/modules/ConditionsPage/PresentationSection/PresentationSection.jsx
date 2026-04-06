"use client";
import "./PresentationSection.scss";
import { useTranslations } from "next-intl";

const PresentationSection = () => {
  const t = useTranslations("conditions.presentation");

  return (
    <section className="cg-presentation">
      <div className="container">
        <div className="cg-presentation__inner">
          <h2 className="cg-presentation__title">{t("title")}</h2>

          <div className="cg-presentation__block">
            <h3>{t("whatTitle")}</h3>
            <p>{t("whatText")}</p>
          </div>

          <div className="cg-presentation__block">
            <h3>{t("doesNotTitle")}</h3>
            <div className="cg-presentation__list cg-presentation__list--negative">
              {["doesNot1", "doesNot2", "doesNot3", "doesNot4", "doesNot5"].map(
                (key) => (
                  <div key={key} className="cg-presentation__list-item">
                    <span className="cg-presentation__list-icon cg-presentation__list-icon--negative">
                      ✗
                    </span>
                    <p>{t(key)}</p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="cg-presentation__block">
            <h3>{t("doesTitle")}</h3>
            <div className="cg-presentation__list cg-presentation__list--positive">
              {["does1", "does2", "does3", "does4"].map((key) => (
                <div key={key} className="cg-presentation__list-item">
                  <span className="cg-presentation__list-icon cg-presentation__list-icon--positive">
                    ✓
                  </span>
                  <p>{t(key)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="cg-presentation__notice">
            <span className="cg-presentation__notice-icon">⚠️</span>
            <p>{t("notice")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresentationSection;
