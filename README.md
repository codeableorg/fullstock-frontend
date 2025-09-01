# 🛍️ Soporte para variantes de productos (Nueva funcionalidad)

## 📌 Contexto general

- Nuestro objetivo es consolidar productos con variantes (en vez de crear productos separados por cada opción).
- Polos → Variantes por "talla": Small, Medium, Large (el precio NO cambia según la talla).
- Stickers → Variantes por "tamaño": 3x3cm, 5x5cm, 10x10cm (el precio SÍ cambia según el tamaño).
- Tazas → Sin variantes (se mantiene tal como esta).

---

## 📖 Justificación del diseño UI (PLP vs PDP)

### ¿Por qué mostrar variantes en la PDP y no en la PLP?

1. **Escaneabilidad y usabilidad en la grilla (PLP)**

   - La Product Listing Page (PLP) debe ser ligera y fácil de escanear. Incluir selectores de talla en cada tarjeta sobrecarga visualmente, rompe el ritmo de navegación y empeora el rendimiento [1].
   - Mostrar tallas en la PLP también aumenta la carga cognitiva y dificulta comparar rápidamente múltiples productos [1].

2. **Complejidad de inventario y performance**

   - Las tallas multiplican combinatorias (ej. precio × talla). Gestionar esta disponibilidad en la PLP incrementa costos de datos, ralentiza el rendimiento (LCP/INP) y genera riesgos de inconsistencias [2].
   - Los grandes e-commerce (Amazon, Mercado Libre, SHEIN) centralizan esta lógica en la PDP para asegurar precisión en stock y reducir errores de compra [3][4].

3. **Decisión de compra responsable**

   - La PDP ofrece guías de tallas, reseñas y recomendaciones específicas, ayudando a los usuarios a elegir con menor riesgo de devolución [5].
   - En cambio, seleccionar talla directamente desde la PLP puede inducir a errores de talla y aumentar devoluciones [5].

4. **Consistencia en mobile y desktop**
   - En dispositivos móviles, los selectores de talla en la PLP ocupan demasiado espacio y reducen la accesibilidad de los tap targets [6].
   - Mantener la lógica en la PDP garantiza una experiencia consistente y más usable en todos los dispositivos [6].

---

### Beneficios de este enfoque

✅ **Experiencia de usuario mejorada**: la PLP se mantiene rápida, clara y visualmente ligera.
✅ **Menos errores y devoluciones**: la elección de talla se respalda con guías y reseñas en la PDP.
✅ **Mejor rendimiento**: menos datos cargados en la PLP → scroll y carga más veloces.
✅ **Gestión de catálogo más simple**: evita duplicados y asegura consistencia de inventario.
✅ **Práctica alineada con líderes del mercado**: Amazon, Mercado Libre, SHEIN, Falabella y Ripley siguen este patrón.

---

### Ventajas y Desventajas de centralizar la selección de variantes en la PDP

- **Ventajas**

  - Favorece la escaneabilidad y usabilidad en la PLP.
  - Reduce costos de rendimiento y evita errores de inventario.
  - Permite decisiones de compra informadas (guías de talla, reseñas).
  - Consistencia cross-platform (desktop y mobile).

- **Desventajas**
  - Un clic adicional para el usuario (pasar de PLP → PDP).
  - Puede percibirse como más lento para usuarios avanzados que ya conocen su talla.
  - Requiere un buen diseño de PDP (clara, ágil y optimizada).

---

## 📚 Referencias

[1] Baymard Institute, _Ecommerce UX: Product Lists & Filtering Guidelines_, 2024. [Online]. Available: https://baymard.com
[2] Baymard Institute, _Performance and Loading UX Research_, 2024. [Online]. Available: https://baymard.com
[3] Amazon Seller Central Ireland, _Managing Product Variations_, 2023. [Online]. Available: https://sellercentral.amazon.ie
[4] Mercado Libre, _Guía de publicación con variantes_, 2023. [Online]. Available: https://www.mercadolibre.com.pe/ayuda
[5] SHEIN, _Seller Guidelines – Size Guide and Variations_, 2023. [Online]. Available: https://seller-us.shein.com
[6] Baymard Institute, _Mobile UX Research_, 2024. [Online]. Available: https://baymard.com

---

---

## ✨ Cambios principales en el proyecto

### 🔧 Base de datos (Prisma + Migraciones)

- **Nuevo modelo `ProductVariant`** con:
  - `id`, `productId`, `type` (ej: `"talla"`, `"tamaño"`), `value` (ej: `"Small"`, `"3x3cm"`), `price (Decimal)`, `timestamps`.
  - Relación `Product.variants`.
- Ajustes en `CartItem` y `OrderItem` para referenciar `productVariantId` opcional.
- Migraciones para crear tabla `product_variants` + índices/foreign keys.
  📂 Archivos clave:
- [`prisma/schema.prisma`](prisma/schema.prisma)
- [`prisma/migrations`](prisma/migrations)

---

### 🌱 Seed y Datos Iniciales

- Generación automática de variantes:
  - **Polos**: Tallas `S`, `M`, `L` (precio base).
  - **Stickers**: Tamaños `3x3`, `5x5`, `10x10` (precio multiplicador).
  - **Tazas**: sin variantes.
- Uso de `prisma.productVariant.createMany` para poblar datos.
  📂 Archivos clave:
- [`prisma/initial_data.ts`](prisma/initial_data.ts)
- [`prisma/seed.ts`](prisma/seed.ts)

---

### 🧩 Modelos y Servicios

- `Product` ahora expone `variants: { id, type, value, price }[]`.
- Servicios (`product.service`, `cart.service`, `order.service`) cargan variantes y mantienen firmas originales.
- Lógica de carrito/orden ahora distingue ítems por `(productId, productVariantId)`.
  📂 Archivos clave:
- [`src/models/product.model.ts`](src/models/product.model.ts)
- [`src/services/product.service.ts`](src/services/product.service.ts)
- [`src/services/cart.service.ts`](src/services/cart.service.ts)
- [`src/services/order.service.ts`](src/services/order.service.ts)

---

### 🖥️ UI

- **Categorías (PLP)**:
  - Precio mostrado usa `displayedPrice` (mínimo o rango si hay variantes).
- **Producto (PDP)**:
  - Selección de variantes con `selectedVariant` / `hoveredVariant`.
  - Botón "Agregar al Carrito" envía `productVariantId`.
- **Carrito**:
  - Renderiza `Producto (Variante)` cuando aplica.
  - Controles `+/-` separados por variante.
- **Checkout**:
  - Resumen y total con precios de variantes.
  - Orden guarda `productVariantId` y precios correctos.
- **Órdenes**:
  - Órdenes guardan `productVariantId`.
  - Render en UI muestra **Producto (Variante)**.

📂 Archivos clave:

- [`src/routes/category`](src/routes/category)
- [`src/routes/product/index.tsx`](src/routes/product/index.tsx)
- [`src/routes/cart/index.tsx`](src/routes/cart/index.tsx)
- [`src/routes/checkout/index.tsx`](src/routes/checkout/index.tsx)
- [`src/services/order.service.ts`](src/services/order.service.ts)
- [`src/routes/account/orders/index.tsx`](src/routes/account/orders/index.tsx)

---

### 🤖 Chatbot

- `sendMessage` y `generateSystemPrompt` listan variantes con precios y links (`?variant=`).
- Instrucciones para el bot:
  - Preguntar por talla/tamaño cuando sea necesario.
  - Respetar selección previa.
- Carrito mostrado al usuario incluye variantes y subtotales.
  📂 Archivos clave:
- [`src/services/chat.service.ts`](src/services/chat.service.ts)
- [`src/services/chat-system-prompt.ts`](src/services/chat-system-prompt.ts)

---

### ✅ Testing

- **Unitarios e integración**:
  - Cobertura de servicios y UI con variantes (`product.service.test`, `product.test.tsx`, `cart.ui.variants.test.tsx`).
- **E2E (Playwright)**:
  - Flujo completo: selección de variantes → carrito → checkout → Culqi sandbox.
    📂 Archivos clave:
- [`src/routes/product/product.test.tsx`](src/routes/product/product.test.tsx)
- [`src/routes/cart/cart.ui.variants.test.tsx`](src/routes/cart/cart.ui.variants.test.tsx)
- [`src/e2e/cart-variants.spec.ts`](src/e2e/cart-variants.spec.ts)

---

## Visión general (diagramas)

### Diagrama de datos (ER)

```mermaid
erDiagram
  CATEGORY ||--o{ PRODUCT : contains
  PRODUCT ||--o{ PRODUCT_VARIANT : has
  CART ||--o{ CART_ITEM : includes
  "ORDER" ||--o{ ORDER_ITEM : contains

  PRODUCT_VARIANT ||--o{ CART_ITEM : optional
  PRODUCT_VARIANT ||--o{ ORDER_ITEM : optional

  CATEGORY {
    int id PK
    string title
    string slug
  }
  PRODUCT {
    int id PK
    int categoryId FK
    string title
    string imgSrc
    string alt
    decimal price
    boolean isOnSale
  }
  PRODUCT_VARIANT {
    int id PK
    int productId FK
    string type  // talla | tamaño
    string value // S | M | L | 3x3cm | 10x10cm
    decimal price
  }
  CART {
    int id PK
    string sessionCartId
    int userId
  }
  CART_ITEM {
    int id PK
    int cartId FK
    int productId FK
    int productVariantId FK "nullable"
    int quantity
  }
  ORDER {
    int id PK
    int userId
    string paymentId
    timestamp createdAt
  }
  ORDER_ITEM {
    int id PK
    int orderId FK
    int productId FK
    int productVariantId FK "nullable"
    string title
    decimal price
    int quantity
  }
```

## Cómo ejecutar

### Base de datos y seeds

```bash
# Prisma
npx run prisma:generate
npx run prisma:migrate
npx run prisma:seed
```

### Desarrollo

```bash
npm install
npm run dev
```

### Pruebas unitarias/integración

```bash
npm run test
```

### Pruebas E2E (Playwright)

```bash
# Instalar navegadores y dependencias del sistema (Linux)
npx playwright install chromium
sudo npx playwright install-deps

# Ejecutar E2E
npm run test:e2e
```

> En local, el servidor de pruebas se levanta con `.env.test` para apuntar a la base de datos de testing.

---

## Notas finales

- Todos los cambios mantuvieron compatibilidad hacia atrás cuando fue posible.
- El soporte de variantes está integrado de extremo a extremo: lectura, UI, carrito, checkout, órdenes, chatbot y pruebas.
- Ante cualquier divergencia de UI en E2E, ajustar selectores manteniendo la intención de validación.
