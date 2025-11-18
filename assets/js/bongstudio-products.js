// NEW FILE: /assets/js/bongstudio-products.js
;(function(){
  const PRODUCTS_URL = "/assets/data/bongstudio-products.json";

  function escapeHtml(str){
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeAttr(str){
    return escapeHtml(str).replace(/"/g, "&quot;");
  }

  function formatPrice(v){
    if (typeof v !== "number") return "";
    return v.toLocaleString("vi-VN") + "₫";
  }

  function merchantLabel(m){
    switch ((m || "").toLowerCase()){
      case "shopee": return "Shopee";
      case "lazada": return "Lazada";
      case "tiktok": return "TikTok Shop";
      default: return "Sàn TMĐT";
    }
  }

  function buyText(m){
    switch ((m || "").toLowerCase()){
      case "shopee": return "Mua trên Shopee";
      case "lazada": return "Mua trên Lazada";
      case "tiktok": return "Mua qua TikTok";
      default: return "Xem sản phẩm";
    }
  }

  function createCard(p){
    const article = document.createElement("article");
    article.className = "product-card";

    if (p.sku) article.dataset.sku = p.sku;
    if (p.merchant) article.dataset.merchant = (p.merchant || "").toLowerCase();
    if (p.origin_url) article.setAttribute("data-origin-url", p.origin_url);

    const img = p.image || "/assets/img/products/placeholder.webp";
    const skuAnchor = (p.sku || "").toLowerCase();
    const name = p.name || "";
    const merchantText = merchantLabel(p.merchant);
    const btnText = buyText(p.merchant);
    const current = formatPrice(p.price_vnd);
    const old = p.old_price_vnd ? formatPrice(p.old_price_vnd) : "";

    article.innerHTML = `
      <a class="product-thumb" href="#${escapeAttr(skuAnchor)}" aria-label="${escapeAttr(name)}">
        <img src="${img}" loading="lazy" alt="${escapeAttr(name)}"/>
      </a>
      <div class="product-card-body">
        <h3 class="product-name">${escapeHtml(name)}</h3>
        <div class="product-merchant">Nguồn: ${escapeHtml(merchantText)}</div>
        <div class="product-price">
          <span class="product-price-current">${current}</span>
          ${old ? `<span class="product-price-old">${old}</span>` : ``}
        </div>
        <div class="product-actions">
          <button class="btn-primary js-mxd-buy" type="button">
            ${escapeHtml(btnText)}
          </button>
          <a class="btn-secondary" href="#${escapeAttr(skuAnchor)}">Chi tiết</a>
        </div>
      </div>
    `;
    return article;
  }

  function wireIsclix(root){
    const AFF_BASE = {
      shopee: "https://go.isclix.com/deep_link/6837508078414670452/4751584435713464237",
      lazada: "https://go.isclix.com/deep_link/6837508078414670452/5127144557053758578",
      tiktok: "https://go.isclix.com/deep_link/6837508078414670452/6648523843406889655"
    };

    const UTM_BASE =
      "utm_source=" + encodeURIComponent(location.hostname) +
      "&utm_medium=affiliate";

    function makeIsclixUrl(base, originUrl, sku, merchant){
      if (!base || !originUrl) return originUrl;
      const head = base + (base.includes("?") ? "&" : "?") +
        "url=" + encodeURIComponent(originUrl);
      const params = [
        UTM_BASE,
        "utm_campaign=" + encodeURIComponent(merchant || ""),
        "sub1=" + encodeURIComponent(sku || ""),
        "sub2=" + encodeURIComponent(merchant || "")
      ];
      return head + "&" + params.join("&");
    }

    const cards = root.querySelectorAll(".product-card[data-origin-url][data-merchant]");
    cards.forEach(card => {
      const sku = card.getAttribute("data-sku") || "";
      const merchant = (card.getAttribute("data-merchant") || "").toLowerCase();
      const origin = card.getAttribute("data-origin-url");
      const base = AFF_BASE[merchant];
      const btn = card.querySelector(".js-mxd-buy");
      if (!btn) return;

      const finalUrl = makeIsclixUrl(base, origin, sku, merchant);

      btn.addEventListener("click", function(ev){
        ev.preventDefault();
        const urlToOpen = finalUrl || origin;
        if (!urlToOpen) return;
        window.open(urlToOpen, "_blank");
      });
    });
  }

  async function init(){
    const grid = document.querySelector(".product-grid");
    if (!grid) return;

    const category = grid.getAttribute("data-category") || "all";

    try{
      grid.textContent = "Đang tải sản phẩm...";

      const res = await fetch(PRODUCTS_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);

      const data = await res.json();
      const items = Array.isArray(data) ? data : [];

      const filtered = category === "all"
        ? items
        : items.filter(p =>
            (p.category || "").toLowerCase() === category.toLowerCase()
          );

      grid.innerHTML = "";

      if (!filtered.length){
        const note = document.createElement("p");
        note.style.fontSize = ".9rem";
        note.style.opacity = "0.8";
        note.textContent = "Tạm thời chưa có sản phẩm trong danh mục này.";
        grid.appendChild(note);
        return;
      }

      filtered.forEach(p => {
        const card = createCard(p);
        grid.appendChild(card);
      });

      wireIsclix(grid);
    } catch (err){
      console.error("Load bongstudio products failed:", err);
      grid.innerHTML = "";
      const note = document.createElement("p");
      note.style.fontSize = ".9rem";
      note.style.opacity = "0.8";
      note.textContent = "Có lỗi khi tải danh sách sản phẩm. Bạn vui lòng tải lại trang sau.";
      grid.appendChild(note);
    }
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
