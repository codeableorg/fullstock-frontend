# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

//Proyecto final

# Proyecto Final: Implementación de Variantes de Producto  

## 📖 Descripción  
Este proyecto consiste en la evolución de una plataforma de **ecommerce** para soportar **variantes de producto** (por ejemplo: tallas en polos o tamaños en stickers), consolidando múltiples opciones dentro de un único producto.  

Con esta mejora se optimiza la **experiencia de usuario**, simplificando la navegación y ofreciendo información más clara en las páginas de producto, carrito y checkout.  

La implementación incluyó:  
- Ajustes en la base de datos y backend.  
- Actualización de la interfaz de usuario.  
- Manejo de variantes en el carrito y en el checkout.  
- Nuevas reglas de precios según el tipo de variante.  
- Adaptación de la página de categorías.  
- Actualización del chatbot para responder preguntas sobre variantes.  

### ⚡ Tecnologías principales  
- **Frontend**: React, React Router v7, Tailwind CSS  
- **Backend**: Node.js, Prisma  
- **Base de datos**: PostgreSQL  
- **Testing**: Vitest  
- **Calidad de código**: ESLint, Type-check  

---

## 🚀 Instalación y configuración  

### 🔧 Requisitos previos  
Antes de comenzar asegúrate de tener instalado:  
- [Node.js] 
- [PostgreSQL]
- [Prisma]

### 📌 Pasos de instalación  

1. **Clonar el repositorio**  
```bash
git clone <url-del-repo>
cd <carpeta-del-proyecto>

2. **Instalar dependencias**  
npm install

3. ** Configurar variables de entorno** 
Crea un archivo .env en la raíz del proyecto con la siguiente estructura:

DATABASE_URL="postgresql://<usuario>:<contraseña>@localhost:5432/<nombre_base_datos>?schema=public"

4. **Ejecutar migraciones de Prisma** 
npx prisma migrate dev

5. **Levantar el servidor en modo desarrollo** 
npm run dev

###Funcionalidades implementadas
👕 Polos

Opciones de talla (UI)

Implementación de tallas S, M y L en la UI.

Al hacer hover en cada producto se muestran las tallas disponibles.

La selección se refleja en el detalle del producto.

Realizado por: Jefferson Cárdenas


Base de datos y backend para variantes de Polos

Actualización del esquema de Prisma.

Migraciones para soportar tallas en la base de datos.

Realizado por: Jefferson Cárdenas y Kelly Arias


Carrito

Selector de tallas que envía la variante seleccionada a través de los params en la URL.

Realizado por: Jefferson Cárdenas


Checkout

Adaptación del flujo para mostrar la talla seleccionada.

Realizado por: Jefferson Cárdenas


Stickers

Opciones de tamaño (UI)

Implementación de tamaños 3x3 cm, 5x5 cm y 10x10 cm.

Hover sobre el producto muestra las medidas y precios correspondientes.

Realizado por: Kelly Arias


Base de datos y backend para variantes de Stickers

Nuevos modelos en Prisma para soportar medidas y precios.

Migraciones ejecutadas para poblar la base de datos.

Realizado por: Kelly Arias


Carrito

Selector de medidas reflejado en la ruta del producto.

Realizado por: Kelly Arias y Jefferson Cárdenas


Checkout

Información del carrito con la variante de medida seleccionada.

Realizado por: Kelly Arias y Jefferson Cárdenas


📑 Categorías

Polos: Hover muestra tallas disponibles.

Stickers: Hover muestra medidas y precios dinámicamente.

Mejora de experiencia de usuario con información suficiente antes de agregar al carrito.

Realizado por: Kelly Arias y Jefferson Cárdenas


🛠️ Otras funcionalidades

Filtros en la grilla de productos

Jeff: Mostrar solo la variante seleccionada por categoría.

Kelly: Mostrar dinámicamente los rangos de precios en stickers.


Chatbot

Ahora responde preguntas sobre variantes y precios.

Mejora en UI: icono flotante, ventana expandible, scroll automático al último mensaje.

✅ Pruebas

Unitarias con Vitest
npm run test

Se validó el renderizado de:

Selectores de tallas (Polos).

Selectores de medidas (Stickers).

Cambios aplicados en:

product.test

product.service

Además, se validó el comportamiento cuando un producto no existe.

Lint
npm run lint

Type-check
npm run type-check

✅ Todas las pruebas y verificaciones pasan correctamente.
