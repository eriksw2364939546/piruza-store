import "./ConservationSection.scss";
import { useTranslations } from "next-intl";

const ConservationSection = () => {
  const t = useTranslations("privacy.conservation");

  const groups = [
    {
      icon: "👤",
      catKey: "group1Cat",
      items: [
        { lKey: "group1i1l", dKey: "group1i1d", bKey: "group1i1b" },
        { lKey: "group1i2l", dKey: "group1i2d", bKey: "group1i2b" },
        { lKey: "group1i3l", dKey: "group1i3d", bKey: "group1i3b" },
        { lKey: "group1i4l", dKey: "group1i4d", bKey: "group1i4b" },
      ],
    },
    {
      icon: "🏪",
      catKey: "group2Cat",
      items: [
        { lKey: "group2i1l", dKey: "group2i1d", bKey: "group2i1b" },
        { lKey: "group2i2l", dKey: "group2i2d", bKey: "group2i2b" },
        { lKey: "group2i3l", dKey: "group2i3d", bKey: "group2i3b" },
      ],
    },
    {
      icon: "🛠️",
      catKey: "group3Cat",
      items: [
        { lKey: "group3i1l", dKey: "group3i1d", bKey: "group3i1b" },
        { lKey: "group3i2l", dKey: "group3i2d", bKey: "group3i2b" },
      ],
    },
    {
      icon: "⚙️",
      catKey: "group4Cat",
      items: [
        { lKey: "group4i1l", dKey: "group4i1d", bKey: "group4i1b" },
        { lKey: "group4i2l", dKey: "group4i2d", bKey: "group4i2b" },
        { lKey: "group4i3l", dKey: "group4i3d", bKey: "group4i3b" },
      ],
    },
  ];

  return (
    <section className="cg-conservation">
      <div className="container">
        <div className="cg-conservation__inner">
          <h2 className="cg-conservation__title">{t("title")}</h2>
          <p className="cg-conservation__intro">{t("intro")}</p>

          {groups.map((group, index) => (
            <div key={index} className="cg-conservation__group">
              <div className="cg-conservation__group-header">
                <span className="cg-conservation__group-icon">
                  {group.icon}
                </span>
                <h3>{t(group.catKey)}</h3>
              </div>
              <div className="cg-conservation__table">
                <div className="cg-conservation__table-header">
                  <span>{t("colData")}</span>
                  <span>{t("colDuration")}</span>
                  <span>{t("colBasis")}</span>
                </div>
                {group.items.map((item, i) => (
                  <div key={i} className="cg-conservation__table-row">
                    <span>{t(item.lKey)}</span>
                    <span className="cg-conservation__duration">
                      {t(item.dKey)}
                    </span>
                    <span className="cg-conservation__basis">
                      {t(item.bKey)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="cg-conservation__notice">
            <span className="cg-conservation__notice-icon">⚖️</span>
            <div>
              <h3>{t("noticeTitle")}</h3>
              <p>{t("noticeText")}</p>
              <ul>
                <li>{t("notice1")}</li>
                <li>{t("notice2")}</li>
                <li>{t("notice3")}</li>
              </ul>
            </div>
          </div>

          <div className="cg-conservation__security">
            <h3>{t("securityTitle")}</h3>
            <div className="cg-conservation__security-grid">
              {[
                { icon: "🔐", titleKey: "sec1Title", textKey: "sec1Text" },
                { icon: "🛡️", titleKey: "sec2Title", textKey: "sec2Text" },
                { icon: "🍪", titleKey: "sec3Title", textKey: "sec3Text" },
                { icon: "🚦", titleKey: "sec4Title", textKey: "sec4Text" },
              ].map((sec, i) => (
                <div key={i} className="cg-conservation__security-item">
                  <span>{sec.icon}</span>
                  <div>
                    <h4>{t(sec.titleKey)}</h4>
                    <p>{t(sec.textKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConservationSection;
