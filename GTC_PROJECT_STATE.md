# GTC_PROJECT_STATE.md

## Proyecto: SocialFlow

**Última actualización:** 2026-03-29

---

## Resumen del Proyecto

| Campo | Valor |
|-------|-------|
| Nombre | SocialFlow |
| Tipo | SaaS Multiempresa - Gestión de Redes Sociales |
| Estado | Planificación |
| Versión documento | 1.0 |

---

## Documentación

| Documento | Ruta | Estado |
|-----------|------|--------|
| Diseño técnico | [docs/plans/2026-03-29-socialflow-design.md](file:///e:/Apks/SocialFlow/docs/plans/2026-03-29-socialflow-design.md) | Completado |
| Task Board | [tasks.md](file:///e:/Apks/SocialFlow/tasks.md) | Completado |

---

## Stack Tecnológico Elegido

### Infraestructura Principal
- **Hosting:** Vercel
- **Database:** Supabase PostgreSQL 15
- **Queue:** BullMQ + Upstash Redis
- **Storage:** Supabase Storage (S3)
- **Auth:** Supabase Auth

### Backend
- **Framework:** Next.js 14 (App Router)
- **Runtime:** Node.js 20 LTS
- **Validation:** Zod
- **ORM:** Prisma

### Frontend
- **Framework:** Next.js 14
- **Language:** TypeScript 5
- **UI:** shadcn/ui + Tailwind CSS
- **State:** Zustand + React Query
- **Charts:** Recharts / Tremor

### Costo Estimado
- **Total:** ~$55/mes + $15/año

### Sistema de Diseño

| Aspecto | Decisión |
|---------|----------|
| **Estilo** | Moderno / Friendly |
| **Paleta** | Verde #10B981 + Turquesa #14B8A6 |
| **Tipografía** | Nunito |
| **Layout** | Sidebar colapsable |
| **Iconografía** | Lucide React |

---

## Fases de Desarrollo

| Fase | Nombre | Duración | Estado |
|------|--------|----------|--------|
| 1 | Análisis y Especificación | 2 semanas | ✅ Completada |
| 2 | Arquitectura y Diseño | 2 semanas | ✅ Completada |
| 3 | UI/UX y Prototipado | 2 semanas | ✅ Completada |
| 4 | Backend Development | 6 semanas | 🟡 En Progreso |
| 5 | Frontend Development | 6 semanas | 🔴 Pendiente |
| 6 | Auth Multiempresa y Permisos | 2 semanas | 🔴 Pendiente |
| 7 | Sistema de Programación y Cola | 2 semanas | 🔴 Pendiente |
| 8 | Analytics y Dashboard | 4 semanas | 🔴 Pendiente |
| 9 | Testing | 4 semanas | 🔴 Pendiente |
| 10 | Documentación | 2 semanas | 🔴 Pendiente |
| 11 | CI/CD y Despliegue | 2 semanas | 🔴 Pendiente |

**Progreso:** 30% (3.5/11 fases completadas)

**Total:** 24 semanas (6 meses)

---

## Plataformas Social Soportadas

- [ ] Facebook
- [ ] Instagram
- [ ] LinkedIn
- [ ] Twitter/X
- [ ] TikTok

---

## Modelo de Negocio

| Aspecto | Descripción |
|---------|-------------|
| **Modelo** | SaaS privado |
| **Administrador** | Usuario único con control total |
| **Clientes** | Empresas sin acceso a la plataforma |
| **Workflow** | Programación → Publicación automática |
| **Roles internos** | Admin + Editor + Viewer |

## Próximos Pasos

1. ~~Fase 1: Análisis y Especificación~~ ✅ **COMPLETADA**
2. ~~Fase 2: Arquitectura y Diseño~~ ✅ **COMPLETADA**
3. ~~Fase 3: UI/UX y Prototipado~~ ✅ **COMPLETADA**
4. Iniciar **Fase 4: Backend Development**

---

## Notas Importantes

- Revisar documento de diseño antes de cualquier implementación
- Mantener compliance GDPR y SOC2 desde el diseño
- Priorizar integración con Facebook/Instagram por API Graph madurez
