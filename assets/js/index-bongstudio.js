;(() => {
  const grid = document.querySelector('#homeFeaturedGrid');
  const statusEl = document.querySelector('#homeFeaturedStatus');

  // Nếu không có khối này (ví dụ trang khác) thì bỏ qua
  if (!grid) return;

  // ⚠️ QUAN TRỌNG:
  // Đổi JSON_URL này thành đúng đường dẫn mà store-bongstudio.js đang fetch.
  // Ví dụ: '/assets/json/bongstudio/products.json'
  const JSON_URL = '/assets/json/bongstudio/products.json';

  function formatPrice(value) {
    if (!value && value !== 0) return '';
    const n = Number(value);
    if (Number.isNaN(n)) return String(value);
    return n.toLocaleString('vi-VN') + '₫';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderCard(p) {
    const name = escapeHtml(p.name || p.title || '');
    const img = escapeHtml(
      p.image ||
      p.img ||
      '/assets/img/placeholder-product.webp'
    );
    const price = formatPrice(p.price || p.final_price || p.sale_price);
    const brand = escapeHtml(p.brand || p.shop || '');
    const origin = escapeHtml(p.origin || p.origin_url || '');
    const merchant = (p.merchant || 'shopee').toLowerCase();
    const sku = escapeHtml(p.sku || p.id || '');

    return `
<article class="product-card"
         data-origin="${origin}"
         data-merchant="${merchant}"
         data-sku="${sku}">
  <a class="thumb" href="${origin}" target="_blank" rel="nofollow noopener">
    <img src="${img}" alt="${name}"/>
  </a>
  <div class="product-card-body">
    <h3 class="product-card-title">${name}</h3>
    <div class="product-card-meta">
      <span class="product-price">${price}</span>
      <span class="product-brand">${brand}</span>
    </div>
    <div class="product-actions">
      <a href="${origin}" class="btn-buy js-mxd-buy">Xem / Mua</a>
    </div>
  </div>
</article>`;
  }

  function isFeatured(p) {
    // Chấp nhận nhiều kiểu flag cho chắc
    if (p.featured === true || p.featured === 1 || p.featured === '1') return true;
    if (p.home === true || p.homepage === true) return true;
    return false;
  }

  async function load() {
    try {
      statusEl.textContent = 'Đang tải sản phẩm…';

      const res = await fetch(JSON_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      const list = Array.isArray(data) ? data : data.items || data.products || [];

      const featured = list.filter(isFeatured);
      if (!featured.length) {
        statusEl.textContent = 'Sản phẩm nổi bật đang được bổ sung.';
        return;
      }

      // Lấy tối đa 8 sản phẩm
      const top = featured.slice(0, 8);
      grid.innerHTML = top.map(renderCard).join('');
      statusEl.textContent = '';
    } catch (err) {
      console.error('[home-products] Lỗi tải JSON', err);
      statusEl.textContent = 'Không tải được danh sách sản phẩm.';
    }
  }

  load();
})();
