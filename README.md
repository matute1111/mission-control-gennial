# Mission Control - Gennial Studios

Sistema de gestión operacional para proyectos de Gennial Studios. Frontend React + Supabase backend.

## 🎯 Descripción

Mission Control es el centro de operaciones de Gennial Studios. Gestiona proyectos, features y tasks con jerarquía clara y sistema de prioridades.

## 📁 Estructura del Repositorio

```
mission-control-gennial/
├── src/                    # Frontend React + TypeScript
├── skills/                 # Documentación de skills para Kimi
│   └── SKILL.md           # Cómo usar Mission Control
├── supabase/              # Edge functions y schema
├── docs/                  # Documentación adicional
└── README.md             # Este archivo
```

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# Correr en desarrollo
npm run dev

# Build para producción
npm run build
```

## 📊 Jerarquía de Datos

### Estructura: Project → Feature → Task

```
PROJECT (Gennial Growth)
├── priority: 8/10
├── status: active
│
├── FEATURE: Skill Acquisition Engine
│   ├── priority: 8/10
│   ├── status: todo
│   │
│   └── TASK: Install marketing-drafter
│       ├── priority: 8/10
│       └── status: todo
│
└── FEATURE: Oportunidades de Negocio
    └── TASK: Configurar RSS feeds
```

## 🎚️ Sistema de Prioridades

### Cálculo de Alertas

```
Promedio = (Prioridad Proyecto + Prioridad Task) / 2

Si Promedio > 8 → 🚨 Alertar a Matias
Si Promedio ≤ 8 → 😴 No alertar
```

### Ejemplos

| Proyecto | Task | Promedio | ¿Alertar? |
|----------|------|----------|-----------|
| 9 (HIGH) | 8 (HIGH) | 8.5 | 🚨 SÍ |
| 5 (MED) | 6 (MED) | 5.5 | 😴 NO |
| 8 (HIGH) | 9 (CRIT) | 8.5 | 🚨 SÍ |

## 🔗 Links

- **Frontend:** https://mission-control-gennial.vercel.app
- **Supabase Dashboard:** https://supabase.com/dashboard
- **GitHub Repo:** https://github.com/matute1111/mission-control-gennial

## 🤖 Skill de Kimi

Ver [`skills/SKILL.md`](./skills/SKILL.md) para documentación completa de cómo Kimi interactúa con Mission Control.

Incluye:
- Jerarquía Project → Feature → Task
- API queries para cada operación
- Sistema de prioridades
- Reglas de autonomía

## 🛠️ Tecnologías

- **Frontend:** React + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL)
- **Deploy:** Vercel

## 📝 Environment Variables

```bash
VITE_SUPABASE_URL=https://xpufofaemvoohcqdhvva.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

## 📚 Documentación Adicional

- [`FEATURE_SHEETS.md`](./FEATURE_SHEETS.md) - Documentación de features
- [`skills/SKILL.md`](./skills/SKILL.md) - Skill para Kimi

## 👥 Equipo

- **Matias Albaca** - Chief AI Officer
- **Adrian Garelik** - CEO
- **Kimi** - AI Agent Autónomo

---

**Última actualización:** 7 de marzo de 2026
