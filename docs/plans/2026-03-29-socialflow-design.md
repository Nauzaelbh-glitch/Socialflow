# SocialFlow - Sistema de Gestión Unificada de Redes Sociales

**Versión:** 2.0  
**Fecha:** 2026-03-29  
**Tipo:** Documento de Diseño Técnico y Plan de Desarrollo

---

## Resumen Ejecutivo

SocialFlow es una plataforma SaaS **privada** para la gestión centralizada de redes sociales de múltiples clientes. El administrador único (tú) gestiona todas las cuentas de clientes desde un único panel, sin que los clientes tengan acceso directo al sistema.

### Modelo de Negocio

| Aspecto | Descripción |
|---------|-------------|
| **Modelo** | SaaS privado |
| **Administrador** | Usuario único con control total |
| **Clientes** | Empresas sin acceso a la plataforma |
| **Workflow** | Programación → Publicación automática |
| **Roles internos** | Admin + Editor + Viewer (para futuros colaboradores) |

---

## Modelo de Negocio Detallado

### 1.1 Estructura de Usuarios

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Admin** | Propietario/Administrador principal | Control total: gestión de empresas, usuarios, configuraciones, semua |
| **Editor** | Colaborador interno | Crear/editar/publicar contenido, gestionar medios |
| **Viewer** | Observador | Solo ver reportes y métricas |

### 1.2 Estructura de Empresas (Clientes)

- Cada **Empresa** representa un cliente del administrador
- Cada empresa tiene sus propias cuentas sociales conectadas
- Los clientes **NO tienen acceso** a SocialFlow
- El administrador gestiona todo desde su cuenta

### 1.3 Métricas de Analytics

Métricas estándar habilitadas:
- **Reach** - Alcance total de publicaciones
- **Impressions** - Número de veces que se mostró el contenido
- **Engagements** - Interacciones totales (likes, comentarios, compartidos)
- **Comments** - Comentarios recibidos
- **Shares** - Veces compartido
- **Clicks** - Clics en enlaces/llamadas a acción
- **Followers** - Seguidores/cantidad de audiencia

### 1.4 Workflow de Publicación

```
Crear Post → Seleccionar Empresa → Seleccionar Cuentas → Programar Fecha/Hora → Publicación Automática
                                                         ↓
                                              Cola con reintentos automáticos
                                                         ↓
                                              Notificación de éxito/error
```

---

## 1. Análisis de Requisitos

---

## 1. Análisis de Requisitos

### 1.2 Requisitos Funcionales

| ID | Requisito | Prioridad | Categoría |
|----|-----------|-----------|-----------|
| RF-01 | Login único con autenticación segura | Crítica | Auth |
| RF-02 | Gestión de empresas (clientes) - CRUD completo | Crítica | Empresas |
| RF-03 | Gestión de usuarios internos (Admin, Editor, Viewer) | Crítica | Auth |
| RF-04 | Visualización del estado de conexión de cada red social por empresa | Crítica | Dashboard |
| RF-05 | Conexión de cuentas sociales mediante OAuth (Facebook, Instagram, LinkedIn, Twitter, TikTok) | Crítica | Integración |
| RF-06 | Creación y almacenamiento de plantillas de contenido | Alta | Contenido |
| RF-07 | Biblioteca de medios (imágenes, videos) con upload y organización | Alta | Contenido |
| RF-08 | Programación de publicaciones automáticas con fecha/hora | Crítica | Scheduler |
| RF-09 | Cola de publicación con reintentos automáticos en caso de fallo | Alta | Scheduler |
| RF-10 | Monitoreo de métricas de engagement estándar | Alta | Analytics |
| RF-11 | Generación de reportes de desempeño por empresa y plataforma | Alta | Reports |
| RF-12 | Control de permisos por rol (Admin, Editor, Viewer) | Crítica | Auth |
| RF-13 | Dashboard principal con overview de métricas | Alta | Dashboard |
| RF-14 | Calendario de programaciones con vista mensual/semanal | Media | Scheduler |
| RF-15 | Notificaciones de eventos de publicación (éxito/error) | Baja | Sistema |

### 1.3 Requisitos No Funcionales

| ID | Requisito | Meta | Observaciones |
|----|-----------|------|---------------|
| RNF-01 | Disponibilidad | 99.5% | Compatible con hosting simple |
| RNF-02 | Tiempo de respuesta API | < 500ms p95 | Para uso interno |
| RNF-03 | Concurrencia | 50 usuarios simultáneos | Equipo pequeño |
| RNF-04 | Retención de datos | 12 meses mínimo | Historial de publicaciones |
| RNF-05 | Escalabilidad | Vertical inicial | Mono-repo, docker-compose |
| RNF-06 | Recuperación ante desastres | Backup diario | RPO < 24h, RTO < 4h |

### 1.4 Plataformas Social Integration Matrix

| Plataforma | API Version | OAuth2 | Rate Limits | Webhooks | Engagement Metrics |
|------------|-------------|--------|-------------|----------|-------------------|
| Facebook | v18.0 | ✅ | 200 req/seg | ✅ | Reach, Engagements, Reactions, Comments, Shares |
| Instagram | Graph API | ✅ | 200 req/seg | ✅ | Reach, Impressions, Engagement, Saves |
| LinkedIn | v2 | ✅ | 125 req/seg | ✅ | Impressions, Clicks, Engagement Rate |
| Twitter/X | v2 | ✅ | 300 req/15min | ✅ | Impressions, Engagements, Profile Visits |
| TikTok | v1 | ✅ | 200 req/seg | ❌ | Video Views, Engagement, Followers |

### 1.5 Matriz de Trazabilidad

#### Requisitos Funcionales → Módulos

| RF | Descripción | Módulo Backend | Módulo Frontend | API Endpoint |
|----|-------------|----------------|-----------------|--------------|
| RF-01 | Login único | auth-service | AuthPages | POST /auth/login |
| RF-02 | Gestión empresas | company-service | CompanyModule | CRUD /companies |
| RF-03 | Gestión usuarios | auth-service | UserManagement | CRUD /users |
| RF-04 | Estado conexión redes | social-adapter-* | AccountsList | GET /social-accounts |
| RF-05 | Conexión OAuth | social-adapter-* | OAuthCallback | POST /social-accounts/connect |
| RF-06 | Plantillas | content-service | TemplateModule | CRUD /templates |
| RF-07 | Biblioteca medios | content-service | MediaGallery | CRUD /media |
| RF-08 | Programación posts | scheduler-service | PostEditor | POST /posts |
| RF-09 | Cola con reintentos | scheduler-service | PostQueue | BullMQ Jobs |
| RF-10 | Métricas engagement | analytics-service | AnalyticsDashboard | GET /analytics |
| RF-11 | Reportes | analytics-service | ReportGenerator | GET /reports |
| RF-12 | Permisos por rol | auth-service | UserManagement | RBAC Middleware |
| RF-13 | Dashboard overview | analytics-service | DashboardPage | GET /dashboard |
| RF-14 | Calendario | scheduler-service | CalendarView | GET /posts/calendar |
| RF-15 | Notificaciones | notification-service | NotificationBell | WebSocket/SSE |

#### Métricas de Prueba

| RF | Caso de Prueba | Criterio Éxito |
|----|----------------|----------------|
| RF-01 | Login con credenciales válidas | Token JWT generado |
| RF-01 | Login con credenciales inválidas | Error 401 devuelto |
| RF-02 | Crear empresa con datos válidos | Empresa creada en BD |
| RF-02 | Crear empresa con nombre duplicado | Error 409 devuelto |
| RF-05 | OAuth flow Facebook completo | Access token almacenado |
| RF-08 | Programar post para fecha futura | Post en cola con delay |
| RF-09 | Simular fallo de publicación | Retry ejecutado |
| RF-10 | Consultar métricas último mes | Datos agregados devueltos |
| RF-12 | Editor intentando acceder a Admin | Error 403 devuelto |

---

## 2. Arquitectura del Sistema

### 2.1 Decisión de Arquitectura: Monolito Modular

**Arquitectura:** Monolito Modular con Next.js (Full-stack)

Esta arquitectura combina frontend y backend en un único proyecto Next.js, separando la lógica en módulos bien definidos. Permite:
- Desarrollo más rápido y simple
- Deployment unificado en Vercel
- Escalado gradual a microservicios cuando sea necesario

### 2.2 Diagrama de Arquitectura (Vercel + Supabase)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VERCEL                                         │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                   Next.js 14 App (App Router)                       │   │
│  │                                                                      │   │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐│   │
│  │   │   Frontend   │  │   Backend    │  │   Server Actions         ││   │
│  │   │  (React)     │  │  (API Routes)│  │   (Mutations/Queries)   ││   │
│  │   └──────────────┘  └──────────────┘  └──────────────────────────┘│   │
│  │                                                                      │   │
│  │   Módulos:                                                         │   │
│  │   • auth        - Autenticación y autorización                     │   │
│  │   • companies   - Gestión de empresas                               │   │
│  │   • social      - Cuentas sociales y adaptadores                   │   │
│  │   • posts       - Publicaciones y scheduler                        │   │
│  │   • templates   - Plantillas de contenido                          │   │
│  │   • media       - Biblioteca de medios                             │   │
│  │   • analytics   - Métricas y reportes                             │   │
│  │   • scheduler   - Cola de publicaciones (BullMQ)                   │   │
│  │                                                                      │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │              Vercel Cron Jobs (Scheduler)                            │   │
│  │   • Ejecuta cada minuto para procesar cola de publicaciones         │   │
│  │   • Recolecta métricas de plataformas                              │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└────────────────────────────────┬─────────────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐
│    SUPABASE      │    │    UPSTASH      │    │     SOCIAL APIs         │
│                  │    │                 │    │                         │
│  ┌─────────────┐ │    │  ┌───────────┐  │    │  • Facebook Graph API   │
│  │ PostgreSQL  │ │    │  │   Redis   │  │    │  • Instagram Graph API  │
│  │  (15 LTS)  │ │    │  │  Serverless│  │    │  • LinkedIn API        │
│  └─────────────┘ │    │  └───────────┘  │    │  • Twitter/X API v2    │
│                  │    │                 │    │  • TikTok API          │
│  ┌─────────────┐ │    │  ┌───────────┐  │    │                         │
│  │  Supabase   │ │    │  │  BullMQ   │  │    │                         │
│  │    Auth     │ │    │  │   Queue   │  │    │                         │
│  └─────────────┘ │    │  └───────────┘  │    │                         │
│                  │    │                 │    │                         │
│  ┌─────────────┐ │    │                 │    │                         │
│  │  Storage    │ │    │                 │    │                         │
│  │   (S3)      │ │    │                 │    │                         │
│  └─────────────┘ │    │                 │    │                         │
│                  │    │                 │    │                         │
│  ┌─────────────┐ │    │                 │    │                         │
│  │  Realtime   │ │    │                 │    │                         │
│  │  (WebSocket)│ │    │                 │    │                         │
│  └─────────────┘ │    └─────────────────┘    └─────────────────────────┘
└─────────────────┘
```

### 2.3 Módulos del Dominio

| Módulo | Responsabilidad | Endpoints | Storage |
|---------|----------------|-----------|---------|
| `auth` | Login, registro, sesiones, MFA | `/api/auth/*` | Supabase Auth |
| `companies` | CRUD empresas, configuración | `/api/companies/*` | PostgreSQL |
| `users` | Gestión de usuarios internos | `/api/users/*` | PostgreSQL |
| `social-accounts` | Conexión OAuth, estado de cuentas | `/api/social-accounts/*` | PostgreSQL |
| `posts` | Crear, editar, programar posts | `/api/posts/*` | PostgreSQL |
| `templates` | Plantillas de contenido | `/api/templates/*` | PostgreSQL |
| `media` | Upload, organización de archivos | `/api/media/*` | Supabase Storage |
| `analytics` | Métricas, agregaciones | `/api/analytics/*` | PostgreSQL |
| `scheduler` | Cola BullMQ, procesamiento | Jobs workers | Upstash Redis |
| `notifications` | Eventos, webhooks | Supabase Realtime | - |

### 2.4 Flujo de Datos

#### Publicación de Contenido
```
1. User crea post → POST /api/posts
2. API valida y guarda en PostgreSQL (status: 'scheduled')
3. API agrega job a BullMQ con scheduled_at como delay
4. Vercel Cron (cada 1 min) consulta BullMQ para jobs ready
5. Worker ejecuta job → Llama a Social API (FB/IG/LI/TW/TK)
6. Actualiza status en PostgreSQL (published/failed)
7. Supabase Realtime notifica al frontend
```

#### Recolección de Métricas
```
1. Vercel Cron (cada 15 min) triggered
2. Consulta posts publicados en último período
3. Llama a Social APIs para obtener métricas
4. Guarda métricas en PostgreSQL
5. Frontend consulta métricas vía API
```

---

## 3. Stack Tecnológico

### 3.1 Infraestructura Principal

| Servicio | Tecnología | Uso | Costo |
|----------|------------|-----|-------|
| **Hosting** | Vercel (Pro) | Frontend + API + Cron | ~$20/mes |
| **Database** | Supabase (Pro) | PostgreSQL + Auth + Storage + Realtime | ~$25/mes |
| **Queue** | Upstash Redis + BullMQ | Jobs con retry automático | ~$10/mes |
| **CDN** | Vercel Edge Network | Assets estáticos + API cache | Incluido |
| **Domain** | Vercel Domains | SSL automático | ~$15/año |

**Total infraestructura:** ~$55/mes + $15/year

### 3.2 Backend / API

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Runtime | Node.js 20 LTS | Vercel serverless functions |
| Framework | Next.js 14 (App Router) | Full-stack, Server Actions, API Routes |
| API | Next.js API Routes + Server Actions | Tipado con TypeScript |
| Validation | Zod | Validación runtime type-safe |
| ORM | Prisma | Type-safe queries, migrations |
| Auth | Supabase Auth | OAuth providers, email/password, MFA |
| Queue | BullMQ + Upstash Redis | Jobs duraderos con retry |

### 3.3 Base de Datos

| Tipo | Motor | Uso |
|------|-------|-----|
| OLTP | Supabase PostgreSQL 15 | Todos los datos: empresas, posts, usuarios |
| Auth | Supabase Auth | Users, sessions, OAuth providers |
| Storage | Supabase Storage (S3) | Imágenes, videos, archivos |
| Realtime | Supabase Realtime | WebSocket para notificaciones live |
| Cache | Upstash Redis | BullMQ queue state |

### 3.4 Frontend

| Componente | Tecnología | Justificación |
|------------|------------|---------------|
| Framework | Next.js 14 | SSR, SSG, Server Actions |
| Language | TypeScript 5 | Type safety en todo el codebase |
| UI Components | shadcn/ui | Componentes accesibles, copy-paste |
| Styling | Tailwind CSS 3.4 | Utility-first, responsive |
| State | Zustand + React Query | Global state + server state |
| Forms | React Hook Form + Zod | Validation type-safe |
| Charts | Recharts / Tremor | Dashboards de analytics |
| Calendar | react-big-calendar | Vista de programaciones |
| Rich Text | Tiptap / Lexical | Editor de contenido rico |

### 3.5 Herramientas de Desarrollo

| Herramienta | Uso |
|-------------|-----|
| ESLint + Prettier | Linting y formatting |
| Husky + lint-staged | Pre-commit hooks |
| GitHub Actions | CI/CD pipeline |
| Vercel Preview | PR deployments automáticos |
| Sentry | Error tracking |
| LogSnag | Logs simplificados |
| Postman / Insomnia | API testing |

---

## 4. Modelos de Datos (Prisma Schema)

### 4.1 Schema de Base de Datos

```prisma
// Schema de Prisma para SocialFlow
// Compatible con Supabase PostgreSQL

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums
enum UserRole {
  ADMIN
  EDITOR
  VIEWER
}

enum Platform {
  FACEBOOK
  INSTAGRAM
  LINKEDIN
  TWITTER
  TIKTOK
}

enum PostStatus {
  DRAFT
  SCHEDULED
  PUBLISHING
  PUBLISHED
  FAILED
}

enum AccountStatus {
  ACTIVE
  EXPIRED
  REVOKED
  ERROR
}

// Modelo: Empresa (Cliente)
model Company {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  settings    Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  // Relaciones
  users          User[]
  socialAccounts SocialAccount[]
  posts          Post[]
  templates      Template[]
  media          Media[]

  @@index([slug])
  @@map("companies")
}

// Modelo: Usuario (Colaborador interno)
model User {
  id            String    @id @default(uuid())
  companyId     String
  email         String    @unique
  passwordHash   String
  firstName     String?
  lastName      String?
  avatarUrl     String?
  role          UserRole  @default(EDITOR)
  isActive      Boolean   @default(true)
  mfaEnabled    Boolean   @default(false)
  mfaSecret     String?
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  // Relaciones
  company         Company         @relation(fields: [companyId], references: [id])
  socialAccounts  SocialAccount[]
  posts           Post[]
  templates       Template[]
  media           Media[]
  permissions     Permission[]

  @@index([companyId])
  @@map("users")
}

// Modelo: Cuenta Social
model SocialAccount {
  id                    String        @id @default(uuid())
  companyId             String
  userId                String
  platform              Platform
  platformAccountId     String
  platformAccountName   String?
  platformPageId       String?
  accessTokenEncrypted  String
  refreshTokenEncrypted String?
  tokenExpiresAt       DateTime?
  status                AccountStatus @default(ACTIVE)
  permissions           Json          @default("[]")
  metadata              Json          @default("{}")
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
  deletedAt             DateTime?

  // Relaciones
  company        Company         @relation(fields: [companyId], references: [id])
  user           User            @relation(fields: [userId], references: [id])
  postPlatforms  PostPlatform[]
  analytics      PostAnalytics[]
  accountMetrics AccountAnalytics[]

  @@unique([companyId, platform, platformAccountId])
  @@index([companyId])
  @@index([status])
  @@map("social_accounts")
}

// Modelo: Permisos por Usuario
model Permission {
  id             String   @id @default(uuid())
  userId         String
  socialAccountId String?
  canPublish     Boolean  @default(false)
  canSchedule    Boolean  @default(false)
  canViewAnalytics Boolean @default(true)
  canManageTeam  Boolean  @default(false)
  createdAt      DateTime @default(now())

  // Relaciones
  user          User           @relation(fields: [userId], references: [id])
  socialAccount SocialAccount? @relation(fields: [socialAccountId], references: [id])

  @@map("permissions")
}

// Modelo: Plantilla
model Template {
  id              String   @id @default(uuid())
  companyId      String
  userId         String
  name           String
  description    String?
  category       String?
  contentTemplate Json
  variables      Json     @default("[]")
  thumbnailUrl   String?
  usageCount     Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  deletedAt      DateTime?

  // Relaciones
  company Company @relation(fields: [companyId], references: [id])
  user    User   @relation(fields: [userId], references: [id])
  posts   Post[]

  @@index([companyId])
  @@map("templates")
}

// Modelo: Medio (Storage)
model Media {
  id               String   @id @default(uuid())
  companyId       String
  userId          String
  filename        String
  originalFilename String?
  mimeType        String?
  sizeBytes       Int?
  storageUrl      String
  storageKey      String
  thumbnailUrl    String?
  metadata        Json     @default("{}")
  tags            String[] @default([])
  folderPath      String?
  createdAt       DateTime @default(now())
  deletedAt       DateTime?

  // Relaciones
  company Company @relation(fields: [companyId], references: [id])
  user    User   @relation(fields: [userId], references: [id])
  posts   PostMedia[]

  @@index([companyId])
  @@map("media")
}

// Modelo: Publicación
model Post {
  id           String     @id @default(uuid())
  companyId   String
  userId      String
  templateId  String?
  title       String?
  content     Json
  status      PostStatus @default(DRAFT)
  scheduledAt DateTime?
  publishedAt DateTime?
  visibility  String     @default("public")
  metadata    Json       @default("{}")
  errorMessage String?
  retryCount  Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  deletedAt   DateTime?

  // Relaciones
  company    Company       @relation(fields: [companyId], references: [id])
  user       User         @relation(fields: [userId], references: [id])
  template   Template?    @relation(fields: [templateId], references: [id])
  platforms  PostPlatform[]
  media      PostMedia[]
  analytics  PostAnalytics[]

  @@index([companyId, status])
  @@index([scheduledAt])
  @@map("posts")
}

// Modelo: Plataforma por Post (many-to-many)
model PostPlatform {
  id              String   @id @default(uuid())
  postId          String
  socialAccountId String
  status          PostStatus @default(DRAFT)
  platformPostId  String?
  publishedAt     DateTime?
  errorMessage    String?
  retryCount      Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relaciones
  post          Post          @relation(fields: [postId], references: [id])
  socialAccount SocialAccount @relation(fields: [socialAccountId], references: [id])

  @@unique([postId, socialAccountId])
  @@map("post_platforms")
}

// Modelo: Media por Post (many-to-many)
model PostMedia {
  id        String   @id @default(uuid())
  postId    String
  mediaId   String
  order     Int      @default(0)
  createdAt DateTime @default(now())

  // Relaciones
  post  Post  @relation(fields: [postId], references: [id])
  media Media @relation(fields: [mediaId], references: [id])

  @@unique([postId, mediaId])
  @@map("post_media")
}

// Modelo: Analytics por Publicación
model PostAnalytics {
  id              String   @id @default(uuid())
  postId          String
  socialAccountId String
  platform        Platform
  platformPostId  String?
  collectedAt     DateTime
  metrics         Json
  createdAt       DateTime @default(now())

  // Relaciones
  post          Post          @relation(fields: [postId], references: [id])
  socialAccount SocialAccount @relation(fields: [socialAccountId], references: [id])

  @@unique([postId, socialAccountId, collectedAt])
  @@index([postId, collectedAt])
  @@map("post_analytics")
}

// Modelo: Analytics por Cuenta Social
model AccountAnalytics {
  id              String   @id @default(uuid())
  socialAccountId String
  collectedAt     DateTime
  followersCount  Int?
  followingCount  Int?
  postsCount      Int?
  engagementRate  Float?
  metrics         Json     @default("{}")
  createdAt       DateTime @default(now())

  // Relaciones
  socialAccount SocialAccount @relation(fields: [socialAccountId], references: [id])

  @@unique([socialAccountId, collectedAt])
  @@index([socialAccountId, collectedAt])
  @@map("account_analytics")
}
```

---

## 5. Sistema de Diseño UI/UX

### 5.1 Filosofía de Diseño

**Estilo:** Moderno / Friendly

Sistema de diseño con formas redondeadas, gradientes sutiles y colores vibrantes. Orientado a transmitir profesionalismo mientras mantiene una experiencia amigable y accesible.

### 5.2 Sistema de Tokens

#### Colores (CSS Variables)

```css
:root {
  /* Primary */
  --color-primary-50: #ECFDF5;
  --color-primary-100: #D1FAE5;
  --color-primary-200: #A7F3D0;
  --color-primary-300: #6EE7B7;
  --color-primary-400: #34D399;
  --color-primary-500: #10B981; /* Main */
  --color-primary-600: #059669;
  --color-primary-700: #047857;
  --color-primary-800: #065F46;
  --color-primary-900: #064E3B;

  /* Accent (Turquesa) */
  --color-accent-50: #F0FDFA;
  --color-accent-100: #CCFBF1;
  --color-accent-500: #14B8A6;
  --color-accent-600: #0D9488;

  /* Neutral */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;

  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Background */
  --bg-primary: #F9FAFB;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F3F4F6;

  /* Text */
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
}
```

#### Tipografía

```css
/* Fuentes */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

:root {
  --font-sans: 'Nunito', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Tamaños */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;   /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

#### Espaciado

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}
```

#### Sombras

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

#### Bordes y Radios

```css
:root {
  --radius-sm: 0.25rem;  /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;  /* 24px */
  --radius-full: 9999px;

  --border-width: 1px;
  --border-color: var(--color-gray-200);
}
```

#### Animaciones

```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-slower: 500ms ease;

  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 5.3 Layout y Estructura

#### Estructura Principal

```
┌─────────────────────────────────────────────────────────────┐
│ ┌──────┐                                    ┌───────────┐ │
│ │      │                                    │ Notifs    │ │
│ │ Logo │      Header / Topbar               │ Profile   │ │
│ │      │                                    └───────────┘ │
│ └──────┘                                                    │
├────────────┬───────────────────────────────────────────────┤
│            │                                               │
│  ┌──────┐ │  ┌─────────────────────────────────────────┐ │
│  │ Nav  │ │  │                                         │ │
│  │ Item │ │  │           Main Content Area             │ │
│  │      │ │  │                                         │ │
│  │ Nav  │ │  │   ┌───────────┐  ┌───────────┐         │ │
│  │ Item │ │  │   │  Widget   │  │  Widget   │         │ │
│  │      │ │  │   └───────────┘  └───────────┘         │ │
│  │ Nav  │ │  │                                         │ │
│  │ Item │ │  └─────────────────────────────────────────┘ │
│  └──────┘ │                                               │
│           │                                               │
│  Sidebar  │                                               │
│  (250px)  │                                               │
│           │                                               │
└───────────┴───────────────────────────────────────────────┘
```

#### Sidebar (Colapsable)

| Estado | Ancho | Iconos | Tooltips |
|--------|-------|--------|----------|
| **Expanded** | 250px | + Texto | No |
| **Collapsed** | 64px | Solo iconos | Sí |

#### Breakpoints

| Breakpoint | Min Width | Layout |
|------------|-----------|--------|
| **Mobile** | < 640px | Full-width, drawer |
| **Tablet** | 640px - 1024px | Collapsed sidebar |
| **Desktop** | > 1024px | Full sidebar |

### 5.4 Componentes Base

#### Botones

```tsx
// Variantes
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// Estados
// default, hover, active, disabled, loading
```

| Variante | Uso |
|----------|-----|
| **Primary** | Acciones principales |
| **Secondary** | Acciones secundarias |
| **Outline** | Cancelar, volver |
| **Ghost** | Acciones en tablas |
| **Danger** | Eliminar, acciones destructivas |

#### Cards

```tsx
// Estructura
Card
├── CardHeader (título + acciones)
├── CardBody (contenido)
└── CardFooter (opcional)
```

- Background: `--bg-secondary`
- Border: 1px solid `--border-color`
- Radius: `--radius-lg`
- Shadow: `--shadow-sm`
- Padding: `--space-6`

#### Inputs

```tsx
Input
├── Label (requerido)
├── Input (text, email, password, etc.)
├── Helper text (opcional)
└── Error message (opcional)
```

- Height: 40px (md), 32px (sm), 48px (lg)
- Border: `--border-color`
- Focus: `--color-primary-500` + ring

#### Badges / Tags

| Tipo | Color | Uso |
|------|-------|-----|
| **Success** | Verde | Activo, publicado |
| **Warning** | Ámbar | Pendiente, draft |
| **Error** | Rojo | Error, fallido |
| **Info** | Azul | Info, procesando |

### 5.5 Iconos de Plataformas

```tsx
// Iconos oficiales de cada plataforma
const platformIcons = {
  facebook: '/icons/facebook.svg',    // Azul #1877F2
  instagram: '/icons/instagram.svg', // Gradiente rosa/purple
  linkedin: '/icons/linkedin.svg',   // Azul #0A66C2
  twitter: '/icons/twitter.svg',      // Negro #000000
  tiktok: '/icons/tiktok.svg',        // Cian #000000
};
```

### 5.6 Responsive Grid

```tsx
// Grid de 12 columnas
// Gutter: 24px

// Clases Tailwind equivalentes
grid-cols-1      // Mobile
grid-cols-2      // Tablet
grid-cols-3      // Desktop
grid-cols-4      // Desktop+
```

### 5.7 User Flows Principales

#### Flow 1: Crear Publicación
```
Dashboard → "Nueva Publicación" → Seleccionar Empresa →
Seleccionar Cuentas → Crear Contenido → Preview →
Programar/Publicar → Confirmación
```

#### Flow 2: Conectar Cuenta Social
```
Settings → Cuentas Sociales → "Conectar" →
Seleccionar Plataforma → OAuth Popup →
Aprobar Permisos → Callback → Cuenta Conectada
```

#### Flow 3: Ver Analytics
```
Dashboard → Seleccionar Empresa → Rango de Fechas →
Ver Métricas → Filtrar por Plataforma →
Descargar Reporte
```

---

## 6. API RESTful - Contratos Principales

### 6.1 Autenticación

```typescript
// POST /api/v1/auth/login
interface LoginRequest {
  email: string;
  password: string;
  mfa_code?: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
  company: Company;
}

// POST /api/v1/auth/refresh
interface RefreshRequest {
  refresh_token: string;
}
```

### 5.2 Empresas

```typescript
// GET /api/v1/companies/:id
interface CompanyResponse {
  id: string;
  name: string;
  slug: string;
  plan_type: 'starter' | 'professional' | 'enterprise';
  social_accounts_count: number;
  team_members_count: number;
  created_at: string;
}
```

### 5.3 Cuentas Sociales

```typescript
// GET /api/v1/social-accounts
interface SocialAccountsResponse {
  data: SocialAccount[];
  meta: { total: number; platform_breakdown: Record<string, number> };
}

// POST /api/v1/social-accounts/connect
interface ConnectAccountRequest {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok';
  authorization_code: string;
}

// GET /api/v1/social-accounts/:id/status
interface AccountStatusResponse {
  id: string;
  platform: string;
  account_name: string;
  status: 'active' | 'expired' | 'error';
  token_expires_at: string | null;
  permissions: string[];
  last_sync_at: string;
}
```

### 5.4 Publicaciones

```typescript
// POST /api/v1/posts
interface CreatePostRequest {
  content: Record<Platform, PostContent>;
  platforms: string[];
  scheduled_at?: string;
  media_ids?: string[];
  visibility: 'public' | 'private';
}

// GET /api/v1/posts
interface PostsQuery {
  status?: PostStatus;
  platform?: Platform;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

interface PostResponse {
  id: string;
  content: Record<Platform, PostContent>;
  status: PostStatus;
  scheduled_at: string | null;
  published_at: string | null;
  platforms: PlatformPostStatus[];
  analytics?: PostAnalytics;
}

// POST /api/v1/posts/:id/retry
interface RetryPostResponse {
  success: boolean;
  job_id: string;
  estimated_publish_at: string;
}
```

### 5.5 Plantillas

```typescript
// POST /api/v1/templates
interface CreateTemplateRequest {
  name: string;
  description?: string;
  category?: string;
  content_template: Record<Platform, PostContent>;
  variables: TemplateVariable[];
}

// POST /api/v1/templates/:id/apply
interface ApplyTemplateRequest {
  variables: Record<string, string>;
}
```

### 5.6 Analytics

```typescript
// GET /api/v1/analytics/overview
interface AnalyticsOverviewQuery {
  from_date: string;
  to_date: string;
  platforms?: Platform[];
  interval: 'day' | 'week' | 'month';
}

interface AnalyticsOverviewResponse {
  summary: {
    total_posts: number;
    total_engagements: number;
    total_reach: number;
    avg_engagement_rate: number;
    best_performing_post: PostSummary;
  };
  trends: TrendData[];
  by_platform: PlatformMetrics[];
  by_content_type: ContentTypeMetrics[];
}

// GET /api/v1/analytics/reports
interface GenerateReportRequest {
  type: 'performance' | 'engagement' | 'comparison';
  date_range: { from: string; to: string };
  platforms?: Platform[];
  format: 'pdf' | 'csv' | 'json';
  include_media?: boolean;
}
```

---

## 6. Fases de Desarrollo

### Fase 1: Análisis y Especificación (Semanas 1-2)

**Objetivo:** Completar análisis de requisitos y especificación técnica detallada.

**Entregables:**
- [ ] Documento de requisitos funcionales firmado por stakeholders
- [ ] Documento de requisitos no funcionales con métricas aceptables
- [ ] Matriz de trazabilidad requisitos-casos de prueba
- [ ] Glosario de términos técnicos
- [ ] Constraints document (budget, timeline, technology stack)

**Criterios de Aceptación:**
- 100% de requisitos funcionales documentados
- Matriz RNFs con métricas cuantificables
- Aprobación de product owner

**Recursos:** 1 Product Manager, 1 Tech Lead, 1 Solution Architect  
**Duración:** 10 días hábiles

---

### Fase 2: Arquitectura y Diseño (Semanas 3-4)

**Objetivo:** Diseñar arquitectura del sistema, base de datos y modelos de datos.

**Entregables:**
- [ ] Arquitectura de microservicios con diagramas C4
- [ ] Schema de base de datos completo (DDL)
- [ ] API contracts (OpenAPI 3.1 specs)
- [ ] Diagrama de flujo de datos
- [ ] Strategy de seguridad (encryption, secrets management)
- [ ] Plan de capacidad y scaling
- [ ] Disaster recovery plan

**Criterios de Aceptación:**
- Architecture review aprobado (min. 3 reviewers)
- Database schema passes normalization check
- API contracts validados contra requisitos

**Recursos:** 2 Backend Engineers, 1 DevOps, 1 Security Engineer  
**Duración:** 10 días hábiles

---

### Fase 3: UI/UX y Prototipado (Semanas 5-6)

**Objetivo:** Crear mockups y prototipos de alta fidelidad del panel administrativo.

**Entregables:**
- [ ] Wireframes low-fidelity de todas las pantallas principales
- [ ] Prototipo interactivo en Figma/FigJam
- [ ] Design system con tokens de diseño
- [ ] Guía de estilos para cada plataforma social
- [ ] Responsive breakpoints spec
- [ ] User flows documentados
- [ ] Accessibility compliance check (WCAG 2.1 AA)

**Criterios de Aceptación:**
- Prototipo aprobado por stakeholders
- Minimum 3 iterations completadas
- Mobile-first responsive design validado
- Accessibility audit passed

**Recursos:** 1 UI/UX Designer, 1 Frontend Lead, 1 Product Manager  
**Duración:** 10 días hábiles

---

### Fase 4: Backend Development (Semanas 7-12)

**Objetivo:** Implementar APIs RESTful y lógica de negocio del backend.

**Entregables:**
- [ ] Auth Service (OAuth2, JWT, MFA)
- [ ] Company Service (CRUD, plans, settings)
- [ ] Social Adapter Service (integración con 5 plataformas)
- [ ] Content Service (templates, media library)
- [ ] Scheduler Service (Bull queues, cron jobs)
- [ ] API Gateway con rate limiting y auth
- [ ] Database migrations y seeders
- [ ] Unit tests (min 80% coverage)

**Criterios de Aceptación:**
- 100% endpoints implementados según API contracts
- Integration tests passing para cada servicio
- Load testing: 10,000 concurrent users sin degradation
- Security audit passed (OWASP Top 10)

**Recursos:** 3 Backend Engineers, 1 DevOps  
**Duración:** 30 días hábiles

---

### Fase 5: Frontend Development (Semanas 11-16)

**Objetivo:** Implementar aplicación web responsive con React.

**Entregables:**
- [ ] Autenticación (login, register, MFA, password reset)
- [ ] Dashboard principal con overview de métricas
- [ ] Gestión de cuentas sociales (connect, disconnect, status)
- [ ] Editor de publicaciones con preview multi-plataforma
- [ ] Calendario de programaciones
- [ ] Biblioteca de plantillas
- [ ] Galería de medios con upload drag-drop
- [ ] Dashboard de analytics con gráficos interactivos
- [ ] Report generator
- [ ] Settings panel (company, user, notifications)

**Criterios de Aceptación:**
- Lighthouse score > 90 (performance, accessibility, best practices)
- Responsive en mobile, tablet, desktop
- E2E tests covering critical user flows
- Visual regression tests passing

**Recursos:** 2 Frontend Engineers, 1 UI/UX Designer  
**Duración:** 30 días hábiles

---

### Fase 6: Autenticación Multiempresa y Permisos (Semanas 13-14)

**Objetivo:** Implementar sistema de auth multiempresa con RBAC completo.

**Entregables:**
- [ ] Sistema de login con SSO (Google, Microsoft, SAML)
- [ ] RBAC con 4 roles predefinidos
- [ ] Permisos granulares por cuenta social
- [ ] Audit log de accesos y modificaciones
- [ ] Session management con refresh tokens
- [ ] Password policy enforcement

**Criterios de Aceptación:**
- Auth flow E2E tests passing
- Penetration testing passed
- Session timeout handling validated
- GDPR consent management

**Recursos:** 2 Backend Engineers, 1 Security Engineer  
**Duración:** 10 días hábiles

---

### Fase 7: Sistema de Programación y Cola (Semanas 15-16)

**Objetivo:** Implementar sistema robusto de scheduling con cola de publicaciones.

**Entregables:**
- [ ] Bull queue setup con priorities
- [ ] Retry logic con exponential backoff
- [ ] Dead letter queue handling
- [ ] Webhook handlers para callbacks de plataformas
- [ ] Notification system para publish events
- [ ] Monitoring dashboard para queue health

**Criterios de Aceptación:**
- 99.9% de posts programados publicados exitosamente
- Retry logic tested with 5 failure scenarios
- Queue latency < 5 segundos
- Dead letter queue < 0.1% de jobs

**Recursos:** 2 Backend Engineers, 1 DevOps  
**Duración:** 10 días hábiles

---

### Fase 8: Analytics y Dashboard (Semanas 17-20)

**Objetivo:** Implementar sistema de métricas en tiempo real y generación de reportes.

**Entregables:**
- [ ] Analytics service con aggregation pipelines
- [ ] Real-time metrics via WebSocket/SSE
- [ ] Dashboard interactivo con filtros
- [ ] Report generator (PDF, CSV)
- [ ] Scheduled reports via email
- [ ] Custom date ranges y comparisons
- [ ] Export functionality

**Criterios de Aceptación:**
- Metrics accuracy validated vs platform APIs
- Report generation < 30 segundos para 90 días
- Real-time updates latency < 10 segundos
- Email deliverability > 95%

**Recursos:** 2 Backend Engineers, 1 Data Engineer  
**Duración:** 20 días hábiles

---

### Fase 9: Testing (Semanas 19-22)

**Objetivo:** Implementar suite completa de testing con cobertura mínima del 80%.

**Entregables:**
- [ ] Unit tests para servicios backend (Jest)
- [ ] Unit tests para componentes frontend (Vitest)
- [ ] Integration tests API (Supertest)
- [ ] E2E tests (Playwright)
- [ ] Load tests (k6)
- [ ] Security tests (OWASP ZAP)
- [ ] Code coverage reports (SonarQube)
- [ ] Test automation in CI/CD

**Criterios de Aceptación:**
- Coverage > 80% en todas las carpetas principales
- All E2E tests passing (min 50 scenarios)
- Load test: sustained 1000 concurrent users
- Security scan: 0 critical vulnerabilities
- Flaky test rate < 1%

**Recursos:** 2 QA Engineers, 1 Backend Engineer, 1 DevOps  
**Duración:** 20 días hábiles

---

### Fase 10: Documentación (Semanas 21-22)

**Objetivo:** Producir documentación técnica y de usuario completa.

**Entregables:**
- [ ] Documentación de API (Swagger/OpenAPI)
- [ ] Architecture decision records (ADR)
- [ ] Runbooks para operaciones
- [ ] Deployment guide
- [ ] User manual (admin, editor, viewer roles)
- [ ] Onboarding guide
- [ ] Video tutorials (3-5 min cada uno)
- [ ] Knowledge base en sistema de tickets

**Criterios de Aceptación:**
- API docs 100% accurate y examples working
- User docs reviewed por 3 usuarios beta
- All runbooks tested in staging
- Video completion rate > 70%

**Recursos:** 1 Technical Writer, 1 Backend Engineer (API docs)  
**Duración:** 10 días hábiles

---

### Fase 11: CI/CD y Despliegue (Semanas 23-24)

**Objetivo:** Configurar pipeline de CI/CD y desplegar en producción.

**Entregables:**
- [ ] GitHub Actions workflows (build, test, deploy)
- [ ] Kubernetes manifests (dev, staging, prod)
- [ ] ArgoCD setup con GitOps
- [ ] Environment configs (dev, staging, prod)
- [ ] Database migrations automation
- [ ] Rollback procedures documented
- [ ] Monitoring stack deployed (Prometheus, Grafana, Loki)
- [ ] Alert configurations
- [ ] Production deployment completed
- [ ] DNS and SSL configured

**Criterios de Aceptación:**
- Deployment time < 15 minutos
- Zero-downtime deployments
- Rollback time < 5 minutos
- Monitoring covering 100% of services
- Uptime > 99.9% en primera semana

**Recursos:** 2 DevOps Engineers, 1 Backend Engineer  
**Duración:** 10 días hábiles

---

## 7. Timeline Consolidado

```
Semana:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
Fase 1:  ██████
Fase 2:       ████████
Fase 3:            ████████████
Fase 4:                    ████████████████████████████████
Fase 5:                         ████████████████████████████
Fase 6:                                   ██████████
Fase 7:                                            ██████████
Fase 8:                                                 ████████████████████
Fase 9:                                                      ████████████████████
Fase 10:                                                           ██████████
Fase 11:                                                                    ██████████
```

**Total:** 24 semanas (6 meses calendario)

---

## 8. Recursos y Costos Estimados

### 8.1 Equipo

| Rol | Cantidad | Semanas | Costo Mensual |
|-----|----------|---------|---------------|
| Tech Lead | 1 | 24 | $15,000 |
| Backend Engineers | 3 | 20 | $36,000 |
| Frontend Engineers | 2 | 16 | $24,000 |
| DevOps Engineer | 2 | 16 | $24,000 |
| UI/UX Designer | 1 | 6 | $8,000 |
| QA Engineer | 2 | 12 | $20,000 |
| Product Manager | 1 | 24 | $12,000 |
| Security Engineer | 1 | 8 | $10,000 |

### 8.2 Infraestructura Mensual (Producción)

| Servicio | Costo Mensual |
|----------|---------------|
| Kubernetes (EKS/GKE) | $2,000 |
| PostgreSQL (RDS) | $500 |
| ClickHouse | $800 |
| Redis | $200 |
| S3 Storage | $100 |
| CDN | $300 |
| Monitoring Stack | $400 |
| **Total** | **$4,300** |

---

## 9. Riesgos y Mitigaciones

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|----|--------|--------------|---------|------------|
| R-01 | API de plataforma social cambia | Alta | Alto | Abstracción con adapter pattern, feature flags |
| R-02 | Rate limits de APIs externas | Alta | Medio | Implementar throttling agresivo, caching |
| R-03 | Retraso en integraciones OAuth | Media | Alto | OAuth sandbox testing early |
| R-04 | Debt técnico por timeline ajustado | Media | Medio | Code review strict, refactoring sprints |
| R-05 |scope creep | Alta | Alto | Change request process, MoSCoW prioritization |
| R-06 | Vendor lock-in (cloud provider) | Baja | Medio | Containerización, S3-compatible storage |

---

## 10. Métricas de Éxito del Proyecto

| Métrica | Target | Medición |
|---------|--------|----------|
| Entrega a tiempo | 100% milestones | Weekly tracking |
| Budget adherence | ±10% | Monthly review |
| Defect density | < 5 por KLOC | SonarQube |
| Technical debt ratio | < 5% | SonarQube |
| User satisfaction | NPS > 40 | Beta testing |
| Performance (API) | p95 < 200ms | APM |
| Coverage | > 80% | CI reports |

---

*Documento creado para planificación inicial. Actualizar según avanza el proyecto.*
