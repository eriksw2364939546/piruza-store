"use client";

// ═══════════════════════════════════════════════════════
// ClientsListPage — список клиентов для Owner
// /admins-piruza/owner/clients
// ═══════════════════════════════════════════════════════

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Users } from "lucide-react";
import "./ClientsPage.scss";
import Pagination from "@/components/Pagination/Pagination";

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function ClientRow({ client, basePath }) {
  return (
    <tr>
      <td>
        <Link
          href={`${basePath}/${client._id}`}
          className="clients-list__client-link"
        >
          <div className="clients-list__client-wrap">
            <div className="clients-list__avatar">
              {client.avatar ? (
                <img src={client.avatar} alt={client.name} />
              ) : (
                <span>{client.name?.charAt(0)?.toUpperCase() || "?"}</span>
              )}
            </div>
            <div>
              <div className="clients-list__name">{client.name}</div>
              <div className="clients-list__email">{client.email}</div>
            </div>
          </div>
        </Link>
      </td>
      <td>{client.city?.name || "—"}</td>
      <td>
        <span
          className={`clients-list__badge ${client.isActive ? "clients-list__badge--active" : "clients-list__badge--blocked"}`}
        >
          {client.isActive ? "Активен" : "Заблокирован"}
        </span>
      </td>
      <td className="clients-list__fav-count">
        {client.favorites?.length ?? 0}
      </td>
      <td className="clients-list__date">{formatDate(client.createdAt)}</td>
      <td>
        <Link
          href={`${basePath}/${client._id}`}
          className="sellers-btn sellers-btn--sm sellers-btn--ghost"
          title="Подробнее"
        >
          👁
        </Link>
      </td>
    </tr>
  );
}

export default function ClientsListPage({
  clients = [],
  pagination,
  initialQuery = "",
  initialActive = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef(null);

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState(initialActive);

  const basePath = "/admins-piruza/owner/clients";

  const pushUrl = useCallback(
    (query, isActive, page = 1) => {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (isActive !== "") params.set("isActive", isActive);
      if (page > 1) params.set("page", page);
      const qs = params.toString();
      router.push(`${pathname}${qs ? "?" + qs : ""}`);
    },
    [router, pathname],
  );

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQueryInput(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      pushUrl(val, activeFilter);
    }, 400);
  };

  const handleActiveChange = (val) => {
    setActiveFilter(val);
    pushUrl(queryInput, val);
  };

  const total = pagination?.total ?? clients.length;

  return (
    <div className="clients-list">
      {/* ── Шапка ── */}
      <div className="clients-list__head">
        <div>
          <h2 className="clients-list__title">Клиенты</h2>
          <p className="clients-list__subtitle">Всего: {total}</p>
        </div>
      </div>

      {/* ── Фильтры ── */}
      <div className="clients-list__filters">
        <div className="clients-list__search-wrap">
          <Search size={15} className="clients-list__search-icon" />
          <input
            className="clients-list__search"
            type="text"
            placeholder="Поиск по имени или email..."
            value={queryInput}
            onChange={handleQueryChange}
          />
        </div>
        <div className="clients-list__toolbar">
          <button
            className={`clients-list__filter-btn ${activeFilter === "" ? "clients-list__filter-btn--active" : ""}`}
            onClick={() => handleActiveChange("")}
          >
            Все
          </button>
          <button
            className={`clients-list__filter-btn clients-list__filter-btn--ok ${activeFilter === "true" ? "clients-list__filter-btn--active" : ""}`}
            onClick={() => handleActiveChange("true")}
          >
            Активные
          </button>
          <button
            className={`clients-list__filter-btn clients-list__filter-btn--bad ${activeFilter === "false" ? "clients-list__filter-btn--active" : ""}`}
            onClick={() => handleActiveChange("false")}
          >
            Заблокированные
          </button>
        </div>
      </div>

      {/* ── Таблица ── */}
      {clients.length === 0 ? (
        <div className="clients-list__empty">
          <Users size={32} />
          <p>Клиентов не найдено</p>
        </div>
      ) : (
        <div className="clients-list__table-wrap">
          <table className="clients-list__table">
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Город</th>
                <th>Статус</th>
                <th>Избранных</th>
                <th>Зарегистрирован</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <ClientRow key={c._id} client={c} basePath={basePath} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.pages ?? pagination?.totalPages ?? 1}
        onPageChange={(page) => pushUrl(queryInput, activeFilter, page)}
      />
    </div>
  );
}
