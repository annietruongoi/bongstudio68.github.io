// REPLACE WHOLE FILE: /assets/mxd-categories.js
// MXD Categories v1.0 — bongstudio68

(() => {
  const CATEGORIES = [
    {
      slug: "gia-dung-decor",
      name: "Gia dụng, decor nhà cửa",
      description: "Đồ gia dụng thông minh, decor nhà cửa, giúp không gian gọn gàng và đẹp mắt hơn.",
      icon: "cat-gia-dung-decor.webp"
    },
    {
      slug: "thoi-trang-nu",
      name: "Thời trang nữ",
      description: "Trang phục, phụ kiện thời trang nữ – đi làm, đi chơi, dạo phố đều có.",
      icon: "cat-thoi-trang-nu.webp"
    },
    {
      slug: "thoi-trang-nam",
      name: "Thời trang nam",
      description: "Quần áo, giày dép, phụ kiện cho nam – đơn giản, nam tính, dễ phối.",
      icon: "cat-thoi-trang-nam.webp"
    },
    {
      slug: "quan-ao-em-be",
      name: "Quần áo em bé",
      description: "Đồ sơ sinh, quần áo em bé mềm mịn, ưu tiên sự thoải mái & an toàn.",
      icon: "cat-quan-ao-em-be.webp"
    },
    {
      slug: "suc-khoe-tpcn",
      name: "Sức khoẻ, thực phẩm chức năng",
      description: "Vitamin, khoáng chất, thực phẩm chức năng hỗ trợ sức khoẻ – chọn lọc kỹ.",
      icon: "cat-suc-khoe-tpcn.webp"
    },
    {
      slug: "sach",
      name: "Sách",
      description: "Sách kỹ năng, tiểu thuyết, truyện tranh… để bongstudio có góc đọc riêng.",
      icon: "cat-sach.webp"
    },
    {
      slug: "do-an",
      name: "Đồ ăn",
      description: "Đồ ăn vặt, thực phẩm tiện lợi, món ngon dễ order về nhà.",
      icon: "cat-do-an.webp"
    }
  ];

  function getCategory(slug) {
    return CATEGORIES.find(c => c.slug === slug) || null;
  }

  function renderStrip(selector, options = {}) {
    const el = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!el) return;

    const { baseUrl = "/store.html", activeSlug = null } = options;

    el.innerHTML = CATEGORIES.map(cat => {
      const isActive = activeSlug && cat.slug === activeSlug;
      const cls = "cat-link" + (isActive ? " is-active" : "");
      return `<a class="${cls}" href="${baseUrl}?cat=${cat.slug}">${cat.name}</a>`;
    }).join("");
  }

  window.MXD_CATEGORIES = {
    all: CATEGORIES,
    get: getCategory,
    renderStrip
  };
})();
