# Mission Control - Gennial Studios

[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://mission-control-gennial.vercel.app)
[![Backend](https://img.shields.io/badge/backend-supabase-green)](https://supabase.com)
[![License](https://img.shields.io/badge/license-MIT-blue)]()

Sistema de gestión operacional para Gennial Studios. Gestiona proyectos, features y tareas con jerarquía clara y sistema de prioridades inteligente.

## 🎯 Características Principales

- **Jerarquía Clara**: Project → Feature → Task
- **Prioridades Inteligentes**: Alertas basadas en (Proyecto + Task) / 2
- **Integración con Kimi**: AI agent autónomo que gestiona tareas
- **Heartbeat System**: Monitoreo automático cada 30 minutos
- **Autonomía Controlada**: Safeguards para acciones independientes

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+
- Cuenta en Supabase
- Variables de entorno configuradas

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/matute1111/mission-control-gennial.git
cd mission-control-gennial

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales:
# VITE_SUPABASE_URL=https://xpufofaemvoohcqdhvva.supabase.co
# VITE_SUPABASE_KEY=tu-anon-key

# Correr en desarrollo
npm run dev

# Build para producción
npm run build
```

### Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📊 Jerarquía de Datos

### Estructura

```
PROJECT (Ej: Gennial Growth) [Priority: 8/10]
├── status: active
├── metadata: {priority: 8, owner: "kimi"}
│
├── FEATURE: Skill Acquisition Engine [Priority: 8/10]
│   ├── status: todo
│   ├── metadata: {priority: 8, category: "autonomia"}
│   │
│   └── TASK: Install marketing-drafter [Priority: 8/10]
│       ├── status: todo
│       └── metadata: {
│           priority: 8,
│           parent_feature_id: "...",
│           parent_feature_name: "Skill Acquisition Engine"
│       }
│
└── FEATURE: Oportunidades de Negocio [Priority: 8/10]
    └── TASK: Configurar RSS feeds [Priority: 7/10]
```

### Sistema de Prioridades

**Fórmula de Alerta:**
```
Promedio = (Prioridad Proyecto + Prioridad Task) / 2

Si Promedio > 8 → 🚨 Alertar a Matias
Si Promedio ≤ 8 → 😴 Continuar silenciosamente
```

**Ejemplos:**

| Proyecto | Task | Promedio | ¿Alertar? |
|----------|------|----------|-----------|
| 9 (HIGH) | 8 (HIGH) | 8.5 | 🚨 SÍ |
| 5 (MED) | 6 (MED) | 5.5 | 😴 NO |
| 8 (HIGH) | 9 (CRIT) | 8.5 | 🚨 SÍ |
| 7 (MED) | 7 (MED) | 7.0 | 😴 NO |

## 🤖 Integración con Kimi

### Heartbeat System

Kimi ejecuta un heartbeat cada **30 minutos** que:

1. ✅ Chequea proyectos activos
2. ✅ Calcula prioridades de tareas pendientes
3. 🚨 Alerta a Matias si (Proyecto + Task) / 2 > 8
4. 🤖 Actúa independientemente si +24h sin respuesta

### Autonomía

**Kimi puede hacer sin permiso:**
- Instalar skills de ClawHub
- Generar contenido para redes
- Buscar oportunidades (RSS, Twitter, GitHub)
- Documentar aprendizajes

**Kimi NO puede hacer:**
- Gastar >$200 sin justificación
- Modificar código de OpenClaw
- Crear cuentas externas
- Borrar datos de producción

### Configuración de Autonomía

```bash
# En ~/.openclaw/workspace/kimi-autonomia/.env
SUPABASE_URL=https://xpufofaemvoohcqdhvva.supabase.co
SUPABASE_KEY=eyJ...  # service_role key
KIMI_PROJECT_ID=3c2f3715-0b64-42cf-b8f8-b1fc79e584ad
```

## 📁 Estructura del Repositorio

```
mission-control-gennial/
├── src/                          # Frontend React
│   ├── components/              # Componentes UI
│   ├── pages/                   # Páginas (Tasks, Projects, etc)
│   ├── lib/                     # Utilidades
│   └── App.tsx                  # App principal
├── skills/                      # Documentación para Kimi
│   └── SKILL.md                # API completa
├── docs/                        # Documentación adicional
│   └── ARCHITECTURE.md         # Arquitectura detallada
├── supabase/                    # Edge functions (si aplica)
├── public/                      # Assets estáticos
├── .env.example                # Variables de entorno
├── README.md                   # Este archivo
└── package.json
```

## 🛠️ Tecnologías

### Frontend
- **React 18** + TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Componentes UI
- **React Router** - Navegación

### Backend
- **Supabase** - PostgreSQL + API REST
- **Row Level Security** - Seguridad
- **Real-time** - Suscripciones (opcional)

### Deploy
- **Vercel** - Frontend
- **Supabase Cloud** - Base de datos

## 📚 Documentación

- **[Skill Documentation](./skills/SKILL.md)** - Guía completa para usar Mission Control
- **[Architecture](./docs/ARCHITECTURE.md)** - Arquitectura detallada del sistema
- **[Feature Sheets](./FEATURE_SHEETS.md)** - Documentación de features del frontend

## 🔗 Links

| Recurso | URL |
|---------|-----|
| **Frontend** | https://mission-control-gennial.vercel.app |
| **GitHub** | https://github.com/matute1111/mission-control-gennial |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/xpufofaemvoohcqdhvva |

## 📝 Environment Variables

```bash
# Frontend
VITE_SUPABASE_URL=https://xpufofaemvoohcqdhvva.supabase.co
VITE_SUPABASE_KEY=tu-anon-key-aqui

# Para Kimi (backend)
SUPABASE_URL=https://xpufofaemvoohcqdhvva.supabase.co
SUPABASE_KEY=tu-service-role-key-aqui
KIMI_PROJECT_ID=3c2f3715-0b64-42cf-b8f8-b1fc79e584ad
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type checking
npm run type-check
```

## 📈 Roadmap

### Corto Plazo
- [ ] Mejorar visualización de jerarquía Feature → Task
- [ ] Agregar filtros avanzados por prioridad
- [ ] Dashboard de métricas para Kimi

### Mediano Plazo
- [ ] Integración con más APIs (GitHub, Twitter)
- [ ] Sistema de notificaciones push
- [ ] App móvil

### Largo Plazo
- [ ] Autonomía completa de Kimi
- [ ] Presupuesto ilimitado con safeguards
- [ ] Memoria persistente en PostgreSQL dedicado

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una branch (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -am 'Add nueva feature'`)
4. Push a la branch (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

## 👥 Equipo

- **Matias Albaca** - Chief AI Officer
- **Adrian Garelik** - CEO & Founder
- **Kimi** - AI Agent Autónomo

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

**Última actualización:** 7 de marzo de 2026  
**Versión:** 2.0  
**Status:** 🟢 Producción
