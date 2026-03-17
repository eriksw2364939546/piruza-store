"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/admin-auth.actions";
import "./PrivateLayout.scss";

const NAV_CONFIG = {
  owner: [
    {
      label: "Главное",
      links: [{ href: "/admins-piruza/owner", icon: "📊", title: "Дашборд" }],
    },
    {
      label: "Управление",
      links: [
        { href: "/admins-piruza/owner/cities", icon: "🏙️", title: "Города" },
        {
          href: "/admins-piruza/owner/categories",
          icon: "🗂️",
          title: "Категории",
        },
        { href: "/admins-piruza/owner/sellers", icon: "🏪", title: "Продавцы" },
        { href: "/admins-piruza/owner/requests", icon: "📋", title: "Заявки" },
        { href: "/admins-piruza/owner/ratings", icon: "⭐", title: "Рейтинги" },
        { href: "/admins-piruza/owner/clients", icon: "👤", title: "Клиенты" },
      ],
    },
    {
      label: "Команда",
      links: [
        {
          href: "/admins-piruza/owner/managers",
          icon: "👥",
          title: "Менеджеры",
        },
        {
          href: "/admins-piruza/owner/admins",
          icon: "🛡️",
          title: "Администраторы",
        },
      ],
    },
    {
      label: "Аккаунт",
      links: [
        { href: "/admins-piruza/owner/profile", icon: "👤", title: "Профиль" },
      ],
    },
  ],

  admin: [
    {
      label: "Главное",
      links: [
        { href: "/admins-piruza/admin-panel", icon: "📊", title: "Дашборд" },
      ],
    },
    {
      label: "Управление",
      links: [
        {
          href: "/admins-piruza/admin-panel/sellers",
          icon: "🏪",
          title: "Продавцы",
        },
        {
          href: "/admins-piruza/admin-panel/requests",
          icon: "📋",
          title: "Заявки",
        },
      ],
    },
    {
      label: "Команда",
      links: [
        {
          href: "/admins-piruza/admin-panel/managers",
          icon: "👥",
          title: "Менеджеры",
        },
        {
          href: "/admins-piruza/admin-panel/admins",
          icon: "🛡️",
          title: "Администраторы",
        },
      ],
    },
    {
      label: "Аккаунт",
      links: [
        {
          href: "/admins-piruza/admin-panel/profile",
          icon: "👤",
          title: "Профиль",
        },
      ],
    },
  ],

  manager: [
    {
      label: "Главное",
      links: [{ href: "/admins-piruza/manager", icon: "📊", title: "Дашборд" }],
    },
    {
      label: "Мои продавцы",
      links: [
        {
          href: "/admins-piruza/manager/sellers",
          icon: "🏪",
          title: "Продавцы",
        },
        {
          href: "/admins-piruza/manager/requests",
          icon: "📋",
          title: "Мои заявки",
        },
      ],
    },
    {
      label: "Аккаунт",
      links: [
        {
          href: "/admins-piruza/manager/profile",
          icon: "👤",
          title: "Профиль",
        },
      ],
    },
  ],
};

const ROLE_LABELS = { owner: "Owner", admin: "Admin", manager: "Manager" };

const PAGE_TITLES = {
  "/admins-piruza/owner": "Дашборд",
  "/admins-piruza/owner/cities": "Города",
  "/admins-piruza/owner/categories": "Категории",
  "/admins-piruza/owner/sellers": "Продавцы",
  "/admins-piruza/owner/requests": "Заявки",
  "/admins-piruza/owner/managers": "Менеджеры",
  "/admins-piruza/owner/admins": "Администраторы",
  "/admins-piruza/owner/profile": "Профиль",
  "/admins-piruza/owner/ratings": "Рейтинги",
  "/admins-piruza/owner/clients": "Клиенты",
  "/admins-piruza/admin-panel": "Дашборд",
  "/admins-piruza/admin-panel/sellers": "Продавцы",
  "/admins-piruza/admin-panel/requests": "Заявки",
  "/admins-piruza/admin-panel/managers": "Менеджеры",
  "/admins-piruza/admin-panel/admins": "Администраторы",
  "/admins-piruza/admin-panel/profile": "Профиль",
  "/admins-piruza/manager": "Дашборд",
  "/admins-piruza/manager/sellers": "Продавцы",
  "/admins-piruza/manager/requests": "Мои заявки",
  "/admins-piruza/manager/profile": "Профиль",
};

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.match(/\/ratings\/[^/]+$/)) return "Рейтинг продавца";
  if (pathname.match(/\/sellers\/[^/]+\/edit$/))
    return "Редактирование продавца";
  if (pathname.match(/\/sellers\/create$/)) return "Новый продавец";
  if (pathname.match(/\/sellers\/[^/]+$/)) return "Продавец";
  if (pathname.match(/\/clients\/[^/]+$/)) return "Клиент";
  return "Админ панель";
}

const PrivateLayout = ({ children, role, userName }) => {
  const pathname = usePathname();
  const navSections = NAV_CONFIG[role] || [];
  const pageTitle = getPageTitle(pathname);
  const avatarLetter = userName ? userName.charAt(0) : "?";

  return (
    <div className="private-layout">
      {/* ── SIDEBAR ── */}
      <aside className="private-layout__sidebar">
        <div className="private-layout__logo">
          Piruza <span>Admin</span>
        </div>

        <span
          className={`private-layout__role-badge private-layout__role-badge--${role}`}
        >
          {ROLE_LABELS[role]}
        </span>

        <nav className="private-layout__nav">
          {navSections.map((section) => (
            <div key={section.label} className="private-layout__nav-section">
              <p className="private-layout__nav-label">{section.label}</p>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`private-layout__nav-link ${
                    pathname === link.href
                      ? "private-layout__nav-link--active"
                      : ""
                  }`}
                >
                  <span className="nav-icon">{link.icon}</span>
                  {link.title}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <form action={logoutAction}>
          <button type="submit" className="private-layout__logout">
            <span>🚪</span> Выйти
          </button>
        </form>
      </aside>

      {/* ── MAIN — скролл здесь ── */}
      <div className="private-layout__main">
        {/* Топбар sticky внутри скролла __main */}
        <div className="private-layout__topbar">
          <p className="private-layout__topbar-title">{pageTitle}</p>
          <div className="private-layout__topbar-user">
            <span>
              Добро пожаловать, <strong>{userName}</strong>
            </span>
            <div className="private-layout__avatar">{avatarLetter}</div>
          </div>
        </div>

        {/* Контент страницы */}
        <div className="private-layout__content">{children}</div>
      </div>
    </div>
  );
};

export default PrivateLayout;
