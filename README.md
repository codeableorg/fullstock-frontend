# 🛒 Full Stock Frontend

> Tienda online especilizada en productos como polos, tazas y stickers con tematica para desarrolladores, incluye chatbot AI integrado.

### ✨ Características principales

- 🛍️ **Catálogo de productos** con variantes (tallas, tamaños) y precios dinámicos
- 🤖 **Chatbot AI** que conoce inventario, precios y puede recomendar productos
- 🛒 **Carrito de compras** persistente con gestión de sesiones
- 📱 **Diseño responsive** optimizado para móviles y desktop
- ⚡ **Server-Side Rendering** con React Router v7
- 🔍 **Filtros avanzados** por categoría, precio y variantes
- 💳 **Gestión de precios** con modificadores por variante

## 🛠️ Stack Tecnológico

### **Frontend**

- **Framework**: React 19.1 con TypeScript
- **Routing**: React Router v7 (con SSR)
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite 6.0.1
- **State**: React useState/useEffect + URL state

### **Backend**

- **Runtime**: Node.js (integrado con React Router)
- **Database**: PostgreSQL con Prisma ORM
- **AI**: Google Gemini AI para chatbot
- **Session**: Cookie-based sessions

### **Dev Tools**

- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged

## 🚀 Instalación

### **Prerrequisitos**

- Node.js 18+
- npm/yarn/pnpm
- PostgreSQL database
- Google AI API Key

### **1. Clonar repositorio**

```bash
git clone git@github.com:codeableorg/fullstock-frontend.git
cd fullstock-frontend
```

### **2. Instalar dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

### **3. Configurar variables de entorno**

```bash
# Crear archivo .env
cp .env.example .env
```

Completar con tus valores:

```env
# Database
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

# Google AI
GOOGLE_API_KEY="tu_google_ai_api_key"
```

### **4. Configurar base de datos**

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Seed con datos de ejemplo
npx prisma db seed
```

### **5. Ejecutar en desarrollo**

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

🎉 **¡Listo!** Abre [http://localhost:5173](http://localhost:5173)

## 📁 Estructura del Proyecto

```
fullstock-frontend/
├── 📁 prisma/                 # Esquemas y migraciones de DB
│   ├── schema.prisma          # Modelo de datos
│   └── migrations/            # Historial de migraciones
├── 📁 src/
│   ├── 📁 components/         # Componentes reutilizables
│   │   ├── ui/               # Componentes base (shadcn/ui)
│   │   └── layout/           # Layouts y navegación
│   ├── 📁 routes/            # Páginas y rutas (React Router v7)
│   │   ├── _index.tsx        # Homepage
│   │   ├── products/         # Páginas de productos
│   │   ├── category/         # Páginas de categorías
│   │   └── cart/             # Carrito de compras
│   ├── 📁 services/          # Lógica de negocio
│   │   ├── product.service.ts # Gestión de productos
│   │   ├── cart.service.ts   # Gestión de carrito
│   │   └── chat.service.ts   # Chatbot AI
│   ├── 📁 models/            # Tipos TypeScript
│   ├── 📁 lib/               # Utilidades
│   └── 📁 db/                # Configuración de Prisma
├── 📁 public/                # Assets estáticos
├── 📄 package.json           # Dependencias y scripts
├── 📄 tailwind.config.js     # Configuración de Tailwind
├── 📄 vite.config.ts         # Configuración de Vite
└── 📄 README.md              # Este archivo
```

## 🎮 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build para producción
npm run start            # Servidor de producción
npm run preview          # Preview del build

# Base de datos
npm run db:generate      # Generar cliente Prisma
npm run db:migrate       # Ejecutar migraciones
npm run db:seed          # Llenar con datos de ejemplo
npm run db:studio        # Abrir Prisma Studio

# Testing
npm run test             # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Coverage report

# Code Quality
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Arreglar errores de lint
npm run type-check       # Verificar tipos TypeScript
```

## 🔧 Configuración Adicional

### **Google AI Setup**

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Crea un nuevo proyecto
3. Genera una API Key
4. Agrégala a tu `.env` como `GOOGLE_API_KEY`

## 🤖 Chatbot Features

El chatbot AI tiene conocimiento completo de:

- **Inventario**: Productos disponibles, precios, variantes
- **Categorías**: Polos, Stickers, Tazas, etc.
- **Variantes**: Tallas (S, M, L), Tamaños (3×3, 5×5, 10×10 cm)
- **Precios**: Precios base + modificadores por variante
- **Carrito**: Productos que ya tiene el usuario

### Ejemplos de interacción:

```
Usuario: "¿Tienen stickers de 10×10 cm?"
Bot: "¡Sí! Tenemos Stickers JavaScript en 10×10 cm por S/8.00. ¿Te interesa?"

Usuario: "¿Qué tallas tienen en polos?"
Bot: "Nuestros polos vienen en S (S/20.00), M (S/22.00) y L (S/23.00)."
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests específicos
npm run test src/services/chat.service.test.ts
npm run test src/routes/product/

# Coverage
npm run test:coverage
```

### **Estructura de tests**

- Unit tests para services
- Integration tests para loaders
- Component tests para UI
- E2E tests con Playwright

## 🚀 Deployment

### **Docker**

```dockerfile
# Dockerfile incluido en el proyecto
docker build -t fullstock .
docker run -p 3000:3000 fullstock
```

## 🤝 Contribuir

1. **Fork** el repositorio
2. **Crea** una branch: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** tus cambios: `git commit -m 'feat: add nueva funcionalidad'`
4. **Push** a la branch: `git push origin feature/nueva-funcionalidad`
5. **Abre** un Pull Request

### **Convenciones de commits**

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(chat): add variant knowledge to system prompt
fix(product): resolve price calculation for variants
docs(readme): update installation instructions
```

## 📝 Roadmap

- [ ] 🔐 Autenticación de usuarios
- [ ] 💳 Integración con pasarelas de pago Culqi
- [ ] 🌙 Modo oscuro

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](./LICENSE).

## 👨‍💻 Autor

**Jota(Jhonattan Saldaña Camacho)**

- GitHub: [@jhonattan](https://github.com/jhonattan)
- LinkedIn: [jhonattansaldana](https://www.linkedin.com/in/jhonattansaldana/)
- Email: jsaldana999@gmail.com

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes base
- [React Router](https://reactrouter.com/) por el framework fullstack
- [Google AI](https://ai.google.com/) por la API de Gemini
- [Vercel](https://vercel.com/) por el hosting gratuito
