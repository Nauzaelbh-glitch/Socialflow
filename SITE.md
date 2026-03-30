# SocialFlow - Site Vision

**Project:** SocialFlow - SaaS para gestión de redes sociales multiempresa
**Stitch Project ID:** (pendiente - se obtendrá al conectar)

## Visión del Sitio

Plataforma SaaS privada para gestión centralizada de redes sociales. El administrador único gestiona múltiples empresas/clientes desde un único panel, sin que los clientes tengan acceso directo.

## Stack Tecnológico
- Frontend: Next.js 14 + React + TypeScript
- Backend: Node.js + Fastify
- Database: PostgreSQL + Supabase
- UI: shadcn/ui + Tailwind CSS

## Páginas del Dashboard

### 1. Dashboard Principal (/)
- Overview de métricas (posts, engagement, reach)
- Widgets de actividad reciente
- Quick actions (nueva publicación)
- Estado de cuentas sociales conectadas

### 2. Empresas (/companies)
- Lista de empresas/clientes
- CRUD de empresas
- Configuración por empresa

### 3. Cuentas Sociales (/social-accounts)
- Lista de cuentas conectadas por plataforma
- Estado de conexión (activo/expirado/error)
- Botón OAuth para conectar nuevas cuentas

### 4. Publicaciones (/posts)
- Editor de publicaciones con preview multi-plataforma
- Programación de fecha/hora
- Biblioteca de plantillas
- Galería de medios

### 5. Calendario (/calendar)
- Vista mensual/semanal de programaciones
- Drag & drop para re-programar

### 6. Analytics (/analytics)
- Métricas por plataforma
- Gráficos de engagement
- Reportes exportables

### 7. Configuración (/settings)
- Perfil de usuario
- Gestión de miembros del equipo
- Notificaciones

## Roadmap de Páginas para Generar

- [ ] Dashboard Overview (home)
- [ ] Lista de Empresas
- [ ] Detalle de Empresa
- [ ] Cuentas Sociales
- [ ] Editor de Publicación
- [ ] Calendario de Programaciones
- [ ] Analytics Dashboard
- [ ] Settings/Configuración
- [ ] Login/Auth Pages

## Plataformas Social Soportadas
- Facebook (azul #1877F2)
- Instagram (gradiente rosa/púrpura)
- LinkedIn (azul #0A66C2)
- Twitter/X (negro)
- TikTok (cian)

## Notas de Implementación
- Mobile-first responsive
- Sidebar colapsable (250px / 64px)
- Breakpoints: 640px (tablet), 1024px (desktop)
- Estilo: Moderno con formas redondeadas
