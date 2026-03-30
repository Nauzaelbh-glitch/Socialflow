# Stitch Prompt: SocialFlow Dashboard Overview

Copia y pega este prompt en Stitch:

---

**Prompt:**

```
Design a modern SaaS dashboard overview page for SocialFlow, a social media management platform.

## Layout Structure
- Fixed header (60px height) with logo left, global search center, notifications bell + user avatar right
- Collapsible sidebar (250px expanded / 64px collapsed) with navigation items
- Main content area with responsive grid

## Navigation Items (Sidebar)
1. Dashboard (active state)
2. Empresas (Companies)
3. Cuentas Sociales (Social Accounts)
4. Publicaciones (Posts)
5. Calendario (Calendar)
6. Analytics
7. Configuración (Settings)

## Header Elements
- Logo: "SocialFlow" with icon
- Search bar with placeholder "Buscar empresas, posts..."
- Notifications bell with badge counter
- User avatar with dropdown menu

## Main Content Sections

### 1. Welcome Section
- "Buenos días, Admin" greeting with current date
- Subtitle: "Aquí está el resumen de hoy"

### 2. Metrics Cards (4 cards in row)
- Total Posts: 142 | +12% vs anterior
- Engagement Rate: 4.8% | +0.3%
- Reach: 12.4K | +8%
- Active Accounts: 8 | +2

### 3. Platform Status Cards
Show each platform with connection status:
- Facebook: Connected ✓
- Instagram: Connected ✓
- LinkedIn: Connected ✓
- Twitter/X: Expired ⚠
- TikTok: Not Connected ✗

### 4. Recent Activity Feed
List of recent actions:
- "Post publicado en Facebook" - hace 2h
- "Nueva cuenta de Instagram conectada" - hace 4h
- "Post programado para mañana" - hace 6h

### 5. Quick Actions Panel
- Button: "+ Nueva Publicación" (primary)
- Button: "+ Conectar Cuenta" (secondary)

## Design System

### Colors
- Primary: Emerald Green #10B981
- Primary Hover: #059669
- Accent: Teal #14B8A6
- Background: #F9FAFB
- Cards: #FFFFFF
- Text Primary: #111827
- Text Secondary: #6B7280
- Border: #E5E7EB
- Success: #22C55E
- Warning: #F59E0B
- Error: #EF4444

### Typography
- Font: Nunito (Google Fonts)
- Headings: Bold (700)
- Body: Regular (400)

### Components
- Cards: white bg, rounded-xl (12px), shadow-sm, p-6
- Buttons: rounded-lg (8px), px-4 py-2
- Inputs: rounded-lg, border-gray-300
- Badges: rounded-full, px-3 py-1

### Social Platform Colors
- Facebook: #1877F2
- Instagram: gradient pink/purple
- LinkedIn: #0A66C2
- Twitter/X: #000000
- TikTok: #000000 with cyan accent

## Responsive Breakpoints
- Desktop: Full sidebar + 4-column grid
- Tablet (1024px): Collapsed sidebar + 2-column grid
- Mobile (640px): Hidden sidebar (hamburger) + 1-column stack
```

---

## Cómo usar en Stitch:

1. Abre https://stitch.withgoogle.com
2. Crea nuevo proyecto o usa existente
3. Pega el prompt en el campo de diseño
4. Selecciona "Desktop" como tipo de dispositivo
5. Genera y personaliza según necesites

## Siguiente prompt (para crear más páginas):

Después del dashboard, genera:
- **Empresas**: Lista con tabla de empresas, botón crear
- **Cuentas Sociales**: Grid de plataformas con estado de conexión
- **Publicaciones**: Editor con preview multi-plataforma
- **Analytics**: Gráficos y métricas
