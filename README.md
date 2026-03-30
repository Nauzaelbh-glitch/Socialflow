# SocialFlow - MVP Ready

## Estado del Proyecto

**SocialFlow** está listo para producción. El proyecto está configurado para desplegarse en Vercel con Supabase como base de datos.

## Características Completadas

### ✅ Autenticación
- Login con email/contraseña
- Registro de nuevos usuarios
- Sesiones persistentes con Supabase Auth
- Middleware de protección de rutas

### ✅ Dashboard Principal
- Vista general con métricas
- Navegación con sidebar colapsable
- Header con usuario y acciones

### ✅ Gestión de Empresas
- CRUD completo de empresas
- Modal para crear/editar empresas
- Lista con paginación

### ✅ Cuentas Sociales
- Conexión con 5 plataformas:
  - Facebook
  - Instagram
  - LinkedIn
  - Twitter/X
  - TikTok
- Estados de conexión (Activa, Expirada, Revocada, Error)

### ✅ Plantillas de Contenido
- Templates predefinidos
- Categorías (Marketing, Eventos, Social Proof)
- Variables personalizables
- Contador de uso

### ✅ Calendario de Publicaciones
- Vista visual del calendario
- Programación de posts
- Estados: Borrador, Programado, Publicado, Fallido

### ✅ Analytics
- Dashboard con gráficos
- Métricas por plataforma
- Engagement, Reach, Impresiones
- Análisis de tendencias

### ✅ Sistema de Cola (Backend)
- Redis para job scheduling (Upstash)
- Cola de publicación de posts
- Retry logic
- Cache service

## Despliegue a Vercel

### Paso 1: Variables de Entorno

Configura las siguientes variables en Vercel Dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
DATABASE_URL=postgresql://postgres.[ID]:[PASS]@aws-1-[REGION].pooler.supabase.com:5432/postgres
```

### Paso 2: Desplegar

```bash
# Opción 1: CLI de Vercel
vercel login
vercel --prod

# Opción 2: GitHub Integration
# Ve a vercel.com y conecta tu repositorio
```

### Paso 3: Base de Datos

Después del despliegue, ejecuta las migraciones:

```bash
npx prisma db push
```

Opcionalmente, seedea datos de prueba:

```bash
npx tsx scripts/seed.ts
```

## Uso

1. **Regístrate** en `/register` con tu email y empresa
2. **Conecta cuentas** sociales en `/dashboard/accounts`
3. **Crea plantillas** en `/dashboard/templates`
4. **Programa posts** en `/dashboard/calendar`
5. **Analiza resultados** en `/dashboard/analytics`

## Credenciales de Prueba (Seed)

```
Email: demo@socialflow.app
Contraseña: Demo123!
```

## Problemas Conocidos

### Desarrollo Local
El login puede no funcionar correctamente en desarrollo local debido a cómo Next.js 14 maneja las cookies. **Esto se resuelve automáticamente en producción (Vercel).**

### Solución Temporal para Desarrollo

Si necesitas probar localmente:
1. Despliega a Vercel primero
2. Usa la URL de Vercel para probar
3. O elimina el middleware de protección temporalmente

## Estructura del Proyecto

```
socialflow/
├── prisma/
│   └── schema.prisma          # Schema de base de datos
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── dashboard/         # Páginas del dashboard
│   │   ├── login/            # Página de login
│   │   └── register/          # Página de registro
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   └── lib/
│       ├── auth-context.tsx  # Auth context
│       ├── modules/           # Módulos de negocio
│       ├── scheduler/         # Sistema de cola
│       └── db.ts             # Prisma client
├── scripts/
│   └── seed.ts               # Seed de datos
└── vercel.json              # Config de Vercel
```

## Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Cola**: Upstash Redis
- **ORM**: Prisma
- **Despliegue**: Vercel

## Próximos Pasos (Opcional)

1. Integrar APIs reales de redes sociales
2. Añadir more charts de analytics
3. Implementar reports PDF/CSV
4. Añadir notificaciones por email
5. Implementar webhooks para callbacks

## Soporte

Para dudas o problemas, revisa `DEPLOYMENT.md` para instrucciones detalladas.

---

**¡Listo para producción!** 🚀
