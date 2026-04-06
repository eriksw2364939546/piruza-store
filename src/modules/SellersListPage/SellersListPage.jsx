"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { clientApi } from "@/lib/clientApi";
import SellerPublicCard from "@/components/SellerPublicCard/SellerPublicCard";
import CityModal from "@/components/CityModal/CityModal";
import Pagination from "@/components/Pagination/Pagination";
import { useTranslations } from "next-intl";
import "./SellersListPage.scss";

const SellersListPage = ({
  sellers = [],
  pagination = null,
  categories = [],
  initialFilters = {},
}) => {
  const t = useTranslations("sellersList");
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef(null);

  const [query, setQuery] = useState(initialFilters.query || "");
  const [category, setCategory] = useState(initialFilters.category || "");
  const [showCityModal, setShowCityModal] = useState(false);
  const [cities, setCities] = useState([]);

  const pageTitle =
    initialFilters.sort === "views" ? t("titleViews") : t("titleLocal");
  const city = initialFilters.city;

  const injectCity = useCallback(
    (citySlug) => {
      const params = new URLSearchParams(window.location.search);
      params.set("city", citySlug);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  useEffect(() => {
    if (city) return;

    const checkLocal = () => {
      const saved = localStorage.getItem("piruza_city");
      if (saved) {
        const parsedCity = JSON.parse(saved);
        if (parsedCity?.slug) injectCity(parsedCity.slug);
      } else {
        clientApi
          .get("/cities/active?limit=100")
          .then((json) => {
            setCities(json.data || []);
            setShowCityModal(true);
          })
          .catch(() => setShowCityModal(true));
      }
    };

    clientApi
      .get("/clients/profile")
      .then((json) => {
        const citySlug = json.data?.city?.slug;
        if (citySlug) injectCity(citySlug);
        else checkLocal();
      })
      .catch(() => checkLocal());
  }, [injectCity, city]);

  const pushUrl = useCallback(
    (newQuery, newCategory, newPage = 1) => {
      const params = new URLSearchParams();
      if (initialFilters.city) params.set("city", initialFilters.city);
      if (initialFilters.sort) params.set("sort", initialFilters.sort);
      if (newQuery) params.set("query", newQuery);
      if (newCategory) params.set("category", newCategory);
      if (newPage > 1) params.set("page", newPage);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, initialFilters],
  );

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => pushUrl(val, category), 400);
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    pushUrl(query, val);
  };

  const handlePage = (newPage) => {
    pushUrl(query, category, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const total = pagination?.total ?? sellers.length;
  const totalPages = pagination?.totalPages ?? pagination?.pages ?? 1;
  const currentPage = pagination?.page ?? 1;

  return (
    <div className="sellers-list-page">
      <div className="container">
        {/* ── Шапка ── */}
        <div className="sellers-list-page__head">
          <button
            className="sellers-list-page__back"
            onClick={() => {
              const ref = sessionStorage.getItem("sellers_referrer") || "/";
              router.push(ref);
            }}
          >
            {t("back")}
          </button>
          <h1 className="sellers-list-page__title">{pageTitle}</h1>
          <p className="sellers-list-page__count">
            {total} {total !== 1 ? t("vendeurs") : t("vendeur")}
          </p>
        </div>

        {/* ── Фильтры ── */}
        <div className="sellers-list-page__filters">
          <div className="sellers-list-page__search-wrap">
            <Search size={15} className="sellers-list-page__search-icon" />
            <input
              className="sellers-list-page__search"
              type="text"
              placeholder={t("searchPlaceholder")}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          <select
            className="sellers-list-page__select"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">{t("allCategories")}</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* ── Сетка ── */}
        {!initialFilters.city ? (
          <div className="sellers-list-page__loading">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="sellers-list-page__skeleton" />
            ))}
          </div>
        ) : sellers.length === 0 ? (
          <div className="sellers-list-page__empty">
            <SlidersHorizontal size={32} />
            <p>{t("empty")}</p>
          </div>
        ) : (
          <div className="sellers-list-page__grid">
            {sellers.map((seller) => (
              <SellerPublicCard key={seller._id} seller={seller} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePage}
        />
      </div>

      {showCityModal && (
        <CityModal
          cities={cities}
          onSelect={(selectedCity) => {
            localStorage.setItem("piruza_city", JSON.stringify(selectedCity));
            setShowCityModal(false);
            injectCity(selectedCity.slug);
          }}
        />
      )}
    </div>
  );
};

export default SellersListPage;
