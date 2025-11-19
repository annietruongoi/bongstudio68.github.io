<!-- REPLACE WHOLE FILE: /README.md -->
# — MXD Canonical Skeleton

Chuẩn áp dụng (theo MXD210):
- **GA4 trước** `/assets/mxd-affiliate.js` (gắn đúng 1 lần/trang). GA4 của NThương: `G-2FQ0YDHWDE`.
- **Canonical tuyệt đối** (https://…).
- Ảnh sản phẩm: `/assets/img/products/<sku>.webp` (tên file = SKU, đuôi `.webp`).
- **affiliates.json** là nguồn sự thật (name, sku, image, price_vnd, origin_url, merchant, category).
- `g.html` tạo Product JSON-LD, auto `noindex` nếu SKU không tồn tại.
- SW: HTML network-first; assets stale-while-revalidate (bump `VERSION` khi đổi asset).
- `store.html`: chỉ có **1 hub "Cửa hàng"**; danh mục con = `/store/<slug>.html` (thêm tile theo MXD Rule 53).


