// REPLACE WHOLE FILE: /assets/js/mxd-buy.js
;(() => {
  // Base AccessTrade cho Bongstudio
  const AFF_BASE = {
    shopee: "https://go.isclix.com/deep_link/6837508078414670452/4751584435713464237",
    lazada: "https://go.isclix.com/deep_link/6837508078414670452/5127144557053758578",
    tiktok: "https://go.isclix.com/deep_link/6837508078414670452/6648523843406889655"
  };

  const UTM_BASE =
    "utm_source=" +
    encodeURIComponent(location.hostname) +
    "&utm_medium=affiliate";

  function makeIsclixUrl(originUrl, merchant, sku) {
    if (!originUrl) return "";
    merchant = (merchant || "shopee").toLowerCase();

    const base = AFF_BASE[merchant] || "";
    // Nếu chưa cấu hình base cho merchant thì cho đi thẳng link gốc
    if (!base) return originUrl;

    const sep = base.includes("?") ? "&" : "?";
    const head = base + sep + "url=" + encodeURIComponent(originUrl);
    const params = [
      UTM_BASE,
      "utm_campaign=" + encodeURIComponent(merchant || ""),
      "sub1=" + encodeURIComponent(sku || ""),
      "sub2=" + encodeURIComponent(merchant || "")
    ];
    return head + "&" + params.join("&");
  }

  function getDataset(el, key) {
    if (!el) return "";
    if (el.dataset && el.dataset[key]) return el.dataset[key];
    const parent = el.closest("[data-" + key + "]");
    if (parent && parent.dataset && parent.dataset[key]) return parent.dataset[key];
    return "";
  }

  function getOrigin(btn) {
    const fromData =
      getDataset(btn, "origin") ||
      getDataset(btn, "originUrl");
    if (fromData) return fromData;

    const href = btn.getAttribute("href") || "";
    if (/^https?:\/\//i.test(href)) return href;

    return "";
  }

  function clickHandler(e) {
    const btn = e.target.closest(
      ".btn-buy, .js-mxd-buy, .js-buy-btn, [data-role='buy-button']"
    );
    if (!btn) return;

    const origin = getOrigin(btn);
    if (!origin) {
      // Không biết link gốc → cho đi theo href mặc định
      return;
    }

    const merchant = (getDataset(btn, "merchant") || "shopee").toLowerCase();
    const sku = getDataset(btn, "sku") || getDataset(btn, "id") || "";

    const finalUrl = makeIsclixUrl(origin, merchant, sku);
    if (!finalUrl) return;

    e.preventDefault();
    window.open(finalUrl, "_blank", "noopener,noreferrer");
  }

  document.addEventListener("click", clickHandler, false);
})();
