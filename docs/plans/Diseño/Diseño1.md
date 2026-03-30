<!DOCTYPE html>

<html class="light" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SocialFlow - Dashboard Overview</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=Be+Vietnam+Pro:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<!-- Icons -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-tertiary-fixed-variant": "#00468a",
                        "on-tertiary": "#ffffff",
                        "on-tertiary-container": "#003871",
                        "surface-container": "#edeeef",
                        "on-primary-fixed": "#002113",
                        "tertiary-fixed-dim": "#a8c8ff",
                        "error": "#ba1a1a",
                        "on-secondary-container": "#006f64",
                        "inverse-surface": "#2e3132",
                        "primary-fixed": "#6ffbbe",
                        "surface-container-high": "#e7e8e9",
                        "secondary-fixed": "#71f8e4",
                        "error-container": "#ffdad6",
                        "tertiary-fixed": "#d6e3ff",
                        "primary": "#006c49",
                        "on-primary-container": "#00422b",
                        "secondary-container": "#6df5e1",
                        "on-surface": "#191c1d",
                        "inverse-on-surface": "#f0f1f2",
                        "primary-container": "#10b981",
                        "on-primary": "#ffffff",
                        "on-background": "#191c1d",
                        "surface-dim": "#d9dadb",
                        "surface": "#f8f9fa",
                        "on-tertiary-fixed": "#001b3d",
                        "on-primary-fixed-variant": "#005236",
                        "inverse-primary": "#4edea3",
                        "on-secondary-fixed": "#00201c",
                        "outline-variant": "#bbcabf",
                        "primary-fixed-dim": "#4edea3",
                        "surface-container-low": "#f3f4f5",
                        "on-error-container": "#93000a",
                        "surface-variant": "#e1e3e4",
                        "background": "#f8f9fa",
                        "surface-tint": "#006c49",
                        "surface-container-highest": "#e1e3e4",
                        "on-surface-variant": "#3c4a42",
                        "secondary-fixed-dim": "#4fdbc8",
                        "outline": "#6c7a71",
                        "on-secondary-fixed-variant": "#005048",
                        "on-secondary": "#ffffff",
                        "surface-container-lowest": "#ffffff",
                        "tertiary": "#005eb5",
                        "on-error": "#ffffff",
                        "tertiary-container": "#65a3ff",
                        "surface-bright": "#f8f9fa",
                        "secondary": "#006b5f"
                    },
                    fontFamily: {
                        "headline": ["Plus Jakarta Sans"],
                        "body": ["Be Vietnam Pro"],
                        "label": ["Be Vietnam Pro"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        body { font-family: 'Be Vietnam Pro', sans-serif; }
        h1, h2, h3 { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
        }
    </style>
</head>
<body class="bg-surface text-on-surface min-h-screen">
<!-- TopNavBar -->
<header class="fixed top-0 w-full h-[60px] z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none flex justify-between items-center px-6 w-full">
<div class="flex items-center gap-4">
<span class="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-['Plus_Jakarta_Sans']">SocialFlow</span>
<div class="hidden md:flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-full px-4 py-1.5 ml-4">
<span class="material-symbols-outlined text-slate-400 text-sm">search</span>
<input class="bg-transparent border-none focus:ring-0 text-sm w-64 text-slate-600" placeholder="Buscar..." type="text"/>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-95 duration-200">
<span class="material-symbols-outlined text-slate-500">notifications</span>
</button>
<button class="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-95 duration-200">
<span class="material-symbols-outlined text-slate-500">account_circle</span>
</button>
</div>
</header>
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-screen w-[250px] z-40 bg-slate-50 dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 flex flex-col py-8 px-4 space-y-2 pt-[80px]">
<div class="px-4 mb-6">
<div class="flex items-center gap-3 mb-2">
<div class="w-10 h-10 rounded-xl overflow-hidden bg-primary-container">
<img class="w-full h-full object-cover" data-alt="professional corporate headshot of a smiling executive in a bright modern office setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9KNuw49L8e6Ma09Jy0unQDCXR-fPt5BopC8WPrHX_luuEQcAXjIHrnaKrB8EIAOnYl60NdY751xMZ-uZEO2mPEmtNnkGNE8AHRpLieqG_dLPU2TWq7vaXxoaiXaL642HY2NVSds-DTAA0il5xic20ip49QBQFgHOoBuGo7FL4-PqyYJK-CAUeL3F3LGdfzc63BqeDg1xkFCN7efrWbGSn29CqftxwqZdLfXLQrrfIs83yZ9WsfsPqXPQxauGUvoJW7Qq1-9w-DVzW"/>
</div>
<div>
<p class="text-sm font-bold text-slate-900 dark:text-slate-100 font-['Be_Vietnam_Pro']">SocialFlow</p>
<p class="text-[10px] text-slate-500 uppercase tracking-wider">Editorial Workspace</p>
</div>
</div>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-bold border-r-4 border-emerald-600 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="text-sm font-medium">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="business">business</span>
<span class="text-sm font-medium">Empresas</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="share">share</span>
<span class="text-sm font-medium">Cuentas Sociales</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="send">send</span>
<span class="text-sm font-medium">Publicaciones</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span class="text-sm font-medium">Calendario</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="analytics">analytics</span>
<span class="text-sm font-medium">Analytics</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="text-sm font-medium">Configuración</span>
</a>
</nav>
<div class="mt-auto space-y-1 border-t border-slate-100 dark:border-slate-800 pt-4">
<button class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
<span class="material-symbols-outlined" data-icon="help">help</span>
<span class="text-sm">Help</span>
</button>
<button class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error-container/20 transition-all">
<span class="material-symbols-outlined" data-icon="logout">logout</span>
<span class="text-sm">Logout</span>
</button>
</div>
</aside>
<!-- Main Content Area -->
<main class="ml-[250px] pt-[60px] p-8">
<!-- Welcome Section -->
<section class="mb-10 flex justify-between items-end">
<div>
<h1 class="text-3xl font-extrabold text-on-surface tracking-tight mb-1">Buenos días, Admin</h1>
<p class="text-on-surface-variant font-medium flex items-center gap-2">
                    Aquí está el resumen de hoy <span class="w-1.5 h-1.5 bg-outline-variant rounded-full"></span> 24 de Mayo, 2024
                </p>
</div>
<div class="flex gap-3">
<button class="flex items-center gap-2 px-6 py-3 bg-primary-container text-on-primary-container font-bold rounded-xl shadow-lg shadow-primary-container/20 hover:scale-[1.02] transition-transform active:scale-95">
<span class="material-symbols-outlined">add_circle</span>
                    + Nueva Publicación
                </button>
<button class="flex items-center gap-2 px-6 py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-colors active:scale-95">
<span class="material-symbols-outlined">link</span>
                    + Conectar Cuenta
                </button>
</div>
</section>
<!-- Bento Grid Metrics -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
<!-- Metric Card 1 -->
<div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-shadow">
<div class="flex justify-between items-start mb-4">
<div class="p-3 bg-primary/10 rounded-lg text-primary">
<span class="material-symbols-outlined">description</span>
</div>
<span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12% vs anterior</span>
</div>
<p class="text-on-surface-variant text-sm font-medium mb-1">Total Posts</p>
<p class="text-4xl font-extrabold text-on-surface">142</p>
</div>
<!-- Metric Card 2 -->
<div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-shadow">
<div class="flex justify-between items-start mb-4">
<div class="p-3 bg-secondary/10 rounded-lg text-secondary">
<span class="material-symbols-outlined">favorite</span>
</div>
<span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+0.3%</span>
</div>
<p class="text-on-surface-variant text-sm font-medium mb-1">Engagement Rate</p>
<p class="text-4xl font-extrabold text-on-surface">4.8%</p>
</div>
<!-- Metric Card 3 -->
<div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-shadow">
<div class="flex justify-between items-start mb-4">
<div class="p-3 bg-tertiary/10 rounded-lg text-tertiary">
<span class="material-symbols-outlined">visibility</span>
</div>
<span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+8%</span>
</div>
<p class="text-on-surface-variant text-sm font-medium mb-1">Reach</p>
<p class="text-4xl font-extrabold text-on-surface">12.4K</p>
</div>
<!-- Metric Card 4 -->
<div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-shadow">
<div class="flex justify-between items-start mb-4">
<div class="p-3 bg-on-surface/5 rounded-lg text-on-surface">
<span class="material-symbols-outlined">group</span>
</div>
<span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+2</span>
</div>
<p class="text-on-surface-variant text-sm font-medium mb-1">Active Accounts</p>
<p class="text-4xl font-extrabold text-on-surface">8</p>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
<!-- Platform Status (Column Span 2) -->
<div class="lg:col-span-2 space-y-6">
<h2 class="text-xl font-bold text-on-surface">Estado de Plataformas</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<!-- FB -->
<div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-12 h-12 flex items-center justify-center bg-[#1877F2]/10 text-[#1877F2] rounded-xl">
<span class="material-symbols-outlined text-3xl">social_leaderboard</span>
</div>
<div>
<p class="font-bold">Facebook</p>
<p class="text-xs text-on-surface-variant">Conectado hace 12 días</p>
</div>
</div>
<div class="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
<span class="material-symbols-outlined text-sm">check_circle</span> Conectado
                        </div>
</div>
<!-- IG -->
<div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white rounded-xl">
<span class="material-symbols-outlined text-3xl">camera</span>
</div>
<div>
<p class="font-bold">Instagram</p>
<p class="text-xs text-on-surface-variant">Conectado hace 8 días</p>
</div>
</div>
<div class="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
<span class="material-symbols-outlined text-sm">check_circle</span> Conectado
                        </div>
</div>
<!-- LinkedIn -->
<div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-12 h-12 flex items-center justify-center bg-[#0A66C2]/10 text-[#0A66C2] rounded-xl">
<span class="material-symbols-outlined text-3xl">work</span>
</div>
<div>
<p class="font-bold">LinkedIn</p>
<p class="text-xs text-on-surface-variant">Conectado hace 30 días</p>
</div>
</div>
<div class="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
<span class="material-symbols-outlined text-sm">check_circle</span> Conectado
                        </div>
</div>
<!-- Twitter/X -->
<div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-12 h-12 flex items-center justify-center bg-on-surface text-surface rounded-xl">
<span class="material-symbols-outlined text-3xl">close</span>
</div>
<div>
<p class="font-bold">Twitter/X</p>
<p class="text-xs text-on-surface-variant">Requiere re-autenticación</p>
</div>
</div>
<div class="flex items-center gap-1 text-error bg-error-container/30 px-3 py-1 rounded-full text-xs font-bold">
<span class="material-symbols-outlined text-sm">warning</span> Expired
                        </div>
</div>
<!-- TikTok -->
<div class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 flex items-center justify-between md:col-span-2">
<div class="flex items-center gap-4">
<div class="w-12 h-12 flex items-center justify-center bg-black rounded-xl">
<div class="relative w-8 h-8">
<div class="absolute inset-0 flex items-center justify-center text-[#25F4EE]">
<span class="material-symbols-outlined text-3xl">music_note</span>
</div>
<div class="absolute inset-0 flex items-center justify-center text-[#FE2C55] translate-x-[1px] translate-y-[1px] mix-blend-screen">
<span class="material-symbols-outlined text-3xl">music_note</span>
</div>
</div>
</div>
<div>
<p class="font-bold">TikTok</p>
<p class="text-xs text-on-surface-variant">Conecta tu cuenta para empezar</p>
</div>
</div>
<button class="flex items-center gap-1 text-on-surface-variant bg-surface-container-high px-4 py-2 rounded-full text-xs font-bold hover:bg-surface-container-highest transition-colors">
<span class="material-symbols-outlined text-sm">add</span> Conectar
                        </button>
</div>
</div>
</div>
<!-- Activity Feed -->
<div class="space-y-6">
<h2 class="text-xl font-bold text-on-surface">Actividad Reciente</h2>
<div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
<div class="divide-y divide-surface-container">
<!-- Activity 1 -->
<div class="p-4 hover:bg-surface transition-colors cursor-pointer group">
<div class="flex gap-4">
<div class="mt-1 w-8 h-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
<span class="material-symbols-outlined text-lg">social_leaderboard</span>
</div>
<div>
<p class="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">'Post publicado en Facebook'</p>
<p class="text-xs text-on-surface-variant">hace 2h • Campaña Primavera</p>
</div>
</div>
</div>
<!-- Activity 2 -->
<div class="p-4 hover:bg-surface transition-colors cursor-pointer group">
<div class="flex gap-4">
<div class="mt-1 w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] to-[#bc1888] flex items-center justify-center text-white">
<span class="material-symbols-outlined text-lg">camera</span>
</div>
<div>
<p class="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">'Nueva cuenta de Instagram conectada'</p>
<p class="text-xs text-on-surface-variant">hace 4h • Perfil Business</p>
</div>
</div>
</div>
<!-- Activity 3 -->
<div class="p-4 hover:bg-surface transition-colors cursor-pointer group">
<div class="flex gap-4">
<div class="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">calendar_month</span>
</div>
<div>
<p class="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">'Post programado para mañana'</p>
<p class="text-xs text-on-surface-variant">hace 6h • LinkedIn Update</p>
</div>
</div>
</div>
<!-- Activity 4 -->
<div class="p-4 hover:bg-surface transition-colors cursor-pointer group">
<div class="flex gap-4">
<div class="mt-1 w-8 h-8 rounded-full bg-error-container/30 flex items-center justify-center text-error">
<span class="material-symbols-outlined text-lg">warning</span>
</div>
<div>
<p class="text-sm font-semibold text-on-surface group-hover:text-error transition-colors">Sesión expirada en Twitter</p>
<p class="text-xs text-on-surface-variant">hace 10h • Acción requerida</p>
</div>
</div>
</div>
</div>
<button class="w-full py-3 text-xs font-bold text-on-surface-variant hover:bg-surface transition-colors">Ver todo el historial</button>
</div>
<!-- Small Analytics Snapshot -->
<div class="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
<div class="relative z-10">
<p class="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Crecimiento Mensual</p>
<h3 class="text-2xl font-bold mb-4">+24.8%</h3>
<div class="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-lg p-3">
<span class="material-symbols-outlined text-emerald-200">auto_awesome</span>
<p class="text-[11px] leading-tight">Tu rendimiento es un 15% superior al promedio del sector este mes.</p>
</div>
</div>
<div class="absolute -right-4 -bottom-4 opacity-10">
<span class="material-symbols-outlined text-[120px]">trending_up</span>
</div>
</div>
</div>
</div>
</main>
</body></html>
