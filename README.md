# FullStack E-commerce Frontend

Una aplicación de e-commerce moderna construida con React Router, TypeScript, Prisma y diseñada específicamente para desarrolladores web. La aplicación incluye un sistema completo de variantes de producto que permite diferentes opciones como tallas y dimensiones.

## 🚀 Características Principales

- **Sistema de Variantes de Producto**: Soporte completo para productos con múltiples opciones (tallas para polos, dimensiones por stickers)
- **Carrito de Compras Inteligente**: Gestión de productos con sus variantes específicas
- **Checkout Seguro**: Integración con Culqi para pagos seguros
- **Chat Bot AI**: Asistente virtual powered by Gemini para recomendaciones de productos
- **Autenticación Completa**: Sistema de login/registro con gestión de sesiones
- **Responsive Design**: Interfaz adaptativa con Tailwind CSS

## 📋 Implementación de Variantes de Producto

### 🗄️ Modificaciones en la Base de Datos

El sistema de variantes se implementó mediante las siguientes entidades en [prisma/schema.prisma](prisma/schema.prisma):

```prisma
model VariantAttribute {
  id    Int    @id @default(autoincrement())
  name  String // "talla", "dimensiones", "color"
  
  variantAttributeValues VariantAttributeValue[]
}

model VariantAttributeValue {
  id                Int              @id @default(autoincrement())
  variantAttributeId Int             @map("variant_attribute_id")
  productId         Int              @map("product_id")
  value             String           // "Small", "Medium", "Large", "3x3cm"
  price             Decimal          @db.Decimal(10, 2)
  
  variantAttribute  VariantAttribute @relation(fields: [variantAttributeId], references: [id])
  product          Product          @relation(fields: [productId], references: [id])
  cartItems        CartItem[]
}
```

### 🎨 Interfaz de Usuario para Variantes

#### Página de Producto ([src/routes/product/index.tsx](src/routes/product/index.tsx))

La página de producto fue actualizada para mostrar selectores de variantes dinámicos:

- **Detección Automática**: Solo muestra selectores para productos con variantes (polos y stickers)
- **Agrupación por Atributo**: Las variantes se agrupan por tipo (talla, dimensión)
- **Actualización de Precio**: El precio se actualiza automáticamente al seleccionar una variante

```tsx
// Ejemplo de selector de variantes
{shouldShowVariants && (
  <>
    {Object.entries(variantGroups).map(([attributeName, variants]) => (
      <div key={attributeName} className="mb-9">
        <p className="text-sm font-semibold text-accent-foreground mb-2">
          {attributeName.charAt(0).toUpperCase() + attributeName.slice(1)}
        </p>
        <div className="flex gap-2">
          {variants!.map((variant) => (
            <Button
              key={variant.id}
              variant={selectedVariant === variant.id ? "default" : "secondary"}
              size="lg"
              className="w-[70px]"
              onClick={() => handleVariantChange(variant.id)}
            >
              {variant.value}
            </Button>
          ))}
        </div>
      </div>
    ))}
  </>
)}
```

#### Carrito de Compras ([src/routes/cart/index.tsx](src/routes/cart/index.tsx))

El carrito fue actualizado para mostrar la información completa de las variantes:

- **Visualización de Variantes**: Muestra el valor de la variante seleccionada (ej: "Polo React (Medium)")
- **Gestión de Cantidades**: Cada variante se trata como un item único en el carrito
- **Precios Específicos**: Refleja el precio exacto de cada variante

```tsx
// Ejemplo de visualización en el carrito
<h3 className="text-sm leading-5 font-medium mb-1">
  {product.title} ({variantAttributeValue?.value})
</h3>
<p className="text-sm text-muted-foreground">
  S/{product.price!.toFixed(2)} c/u
</p>
```

#### Checkout ([src/routes/checkout/index.tsx](src/routes/checkout/index.tsx))

El proceso de checkout mantiene la información de variantes:

- **Resumen Detallado**: Muestra cada producto con su variante específica
- **Cálculo Correcto**: Los totales reflejan los precios exactos de cada variante
- **Información Completa**: Se preserva toda la información para la orden final

### 🛒 Lógica de Negocio

#### Gestión de Carrito ([src/services/cart.service.ts](src/services/cart.service.ts))

```typescript
// Agregar producto con variante específica
export async function addToCart(
  userId: number | undefined,
  sessionCartId: string | undefined,
  attributeValueId: number
): Promise<CartWithItems>
```

### 🔍 Lógica de Filtrado por Precios con Variantes

El sistema de filtros implementa una lógica inteligente para productos con variantes:

#### Comportamiento del Filtro
- **Evaluación por Variante**: El filtro analiza cada variante de precio individualmente
- **Inclusión Condicional**: Un producto se incluye si AL MENOS UNA de sus variantes está dentro del rango seleccionado
- **Visualización Resumida**: En las tarjetas se muestra el rango completo (precio mínimo - precio máximo)

#### Ejemplo Práctico
```
Producto: Sticker JavaScript
Variantes: S/2.99, S/3.99, S/4.99
Rango mostrado: S/2.99 - S/4.99

Filtro S/1 - S/3:
✅ Incluido (porque S/2.99 está en el rango)

Filtro S/5 - S/10:
❌ Excluido (ninguna variante está en el rango)
```

<!-- #### Creación de Órdenes ([src/services/order.service.ts](src/services/order.service.ts))

Las órdenes preservan la información completa de variantes:

```typescript
const items = cartItems.map((item) => ({
  productId: item.product.id,
  quantity: item.quantity,
  title: item.product.title,
  price: item.product.price,
  imgSrc: item.product.imgSrc,
  // Información de variante preservada
}));
``` -->

### 🤖 Integración con Chat Bot

El chat bot fue actualizado para manejar preguntas sobre variantes ([src/services/chat-system-prompt.ts](src/services/chat-system-prompt.ts)):

#### Manejo Inteligente de Variantes

```typescript
// Formatear variantes según el tipo
switch (product.variantType) {
  case 'talla':
    const sizes = product.variants.map(v => v.value).join(", ");
    variantDisplay = `\n- 👕 Tallas disponibles: ${sizes}`;
    break;
  case 'dimensión':
    const dimensions = product.variants
      .map(v => `${v.value} (S/${v.price})`)
      .join(", ");
    variantDisplay = `\n- 📐 Dimensiones: ${dimensions}`;
    break;
}
```

#### Respuestas Contextuales

- **Polos**: "¿Qué talla necesitas: Small, Medium o Large?"
- **Stickers**: "Tenemos 3 tamaños: 3x3cm (S/2.99), 5x5cm (S/3.99) o 10x10cm (S/4.99)"
- **Tazas**: Procede normal sin mencionar variantes

<!-- ## 🧪 Testing

### Tests de Componentes

Los tests fueron actualizados para cubrir los casos de variantes:

#### Test de Producto ([src/routes/product/product.test.tsx](src/routes/product/product.test.tsx))

```typescript
const createTestProps = (overrides = {}): Route.ComponentProps => ({
  loaderData: {
    product: createTestProduct({
      variantAttributeValues: [
        createTestVariantAttributeValue({ id: 1, value: "Small", price: 20 }),
        createTestVariantAttributeValue({ id: 2, value: "Medium", price: 20 }),
      ],
      ...overrides,
    }),
  },
  // ... otros props
});
```

#### Test de Confirmación de Orden ([src/routes/order-confirmation/order-confirmation.test.tsx](src/routes/order-confirmation/order-confirmation.test.tsx))

```typescript
const createTestProps = (orderId = "test-123"): Route.ComponentProps => ({
  loaderData: { orderId },
  params: { orderId },
  matches: [] as unknown as Route.ComponentProps["matches"],
});
```

### Tests E2E

Los tests end-to-end cubren el flujo completo con variantes ([src/e2e/guest-create-order.spec.ts](src/e2e/guest-create-order.spec.ts)):

```typescript
test("Guest can create an order", async ({ page }) => {
  // Navegar y seleccionar producto
  await page.goto(baseUrl);
  await page.getByRole("menuitem", { name: "Polos" }).click();
  await page.getByTestId("product-item").first().click();
  
  // Agregar al carrito (automáticamente selecciona primera variante)
  await page.getByRole("button", { name: "Agregar al Carrito" }).click();
  
  // Continuar con checkout...
});
``` -->

## 📱 Consideraciones de UX/UI

### Decisiones de Diseño para Variantes

1. **Mostrar Solo Cuando Necesario**: Los selectores de variantes solo aparecen para productos que las tienen
2. **Agrupación Clara**: Las variantes se agrupan por tipo de atributo (talla, dimensión)
3. **Feedback Visual**: El botón seleccionado tiene un estilo diferente
4. **Precio Dinámico**: El precio se actualiza inmediatamente al cambiar variantes
5. **Validación**: No se puede agregar al carrito sin seleccionar una variante

### Manejo de Precios

- **Productos Sin Variantes**: Muestran precio fijo
- **Productos Con Variantes**: Muestran rango de precios, es decir el precio mínimo y máximo
- **Carrito y Checkout**: Siempre muestran precios específicos de la variante


## 🔧 Instalación y Configuración

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npm run prisma:generate
npm run prisma:migrate:dev

# Poblar con datos iniciales
npm run prisma:seed

# Ejecutar en desarrollo
npm run dev

# Ejecutar tests
npm run test
npm run test:e2e
```

### Productos con Variantes

```typescript
// Polos - Variantes por talla
{
  title: "Polo React",
  variantAttributeValues: [
    { value: "Small", price: 20.0, variantAttribute: { name: "talla" } },
    { value: "Medium", price: 20.0, variantAttribute: { name: "talla" } },
    { value: "Large", price: 20.0, variantAttribute: { name: "talla" } }
  ]
}

// Stickers - Variantes por dimensión
{
  title: "Sticker Docker",
  variantAttributeValues: [
    { value: "3x3cm", price: 2.99, variantAttribute: { name: "dimensiones" } },
    { value: "5x5cm", price: 3.99, variantAttribute: { name: "dimensiones" } },
    { value: "10x10cm", price: 4.99, variantAttribute: { name: "dimensiones" } }
  ]
}
```

## 🚀 Tecnologías Utilizadas

- **Frontend**: React Router v7, TypeScript, Tailwind CSS
- **Backend**: Node.js con React Router Server Functions
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Pagos**: Culqi Payment Gateway
- **AI**: Google Gemini para el chat bot
- **Testing**: Vitest, Playwright, React Testing Library
- **Deployment**: Docker, Railway

## 📈 Tareas realizadas por cada integrante

### 👨‍💻 Mike Vera
- **Sistema de Variantes de Producto**: Implementación completa del sistema de variantes con base de datos (Prisma schema)
- **Carrito con Variantes**: Actualización del carrito para mostrar información detallada de variantes seleccionadas

### 👨‍💻 Sebastián
- **UI/UX Design & Responsive Design**: Implementación con Tailwind CSS y ajustes ligeros en 'initial_data.ts' y servicios para la correcta comunicación backend–frontend.
- **Actualización del ChatBot**: Actualización con nuevo contexto, prompts de comportamiento, estrategia de ventas, ejemplos de respuesta y lógica de recomendaciones.


### 👩‍💻 Janet
- **Modificacion del archivo de data inicial**: Modificación del archivo 'initial_data.ts' para las diferentes variables de productos
- **Actualización del servicio de productos**: Modificación de las funciones para integrar variantes de productos
- **Filtros de Precio Inteligentes**: Implementación de la lógica de filtrado que considera todas las variantes de precio
- **Test para Product**: Actualización de los test para product service y product route
<!-- - **Testing de Variantes**: Actualización de tests unitarios y E2E para cubrir casos de uso con variantes -->

### 🤝 Tareas Colaborativas
- **Arquitectura del Proyecto**: Definición conjunta de la estructura para contemplar variables de productos
- **Code Reviews**: Revisión cruzada de código y merge de pull requests entre los 3 integrantes
<!-- - **Testing Strategy**: Definición colaborativa de estrategias de testing y coverage mínimo -->
- **Integración de Features**: Trabajo conjunto para integrar variantes, en los diferente modulos, cart,

### 🔧 Metodología de Trabajo
- **Control de Versiones**: Git con GitHub Flow y branches por feature
- **Gestión de Proyecto**: Kanban board para tracking de tareas y sprints semanales
- **Comunicación**: Daily standups virtuales y sesiones de pair programming
- **Calidad de Código**: ESLint, Prettier y Husky configurados en conjunto

---

*Este proyecto fue desarrollado como parte del bootcamp de Codeable, implementando un sistema completo de e-commerce con variantes de producto para una experiencia de usuario optimizada.*