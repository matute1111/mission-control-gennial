# 📋 Project Brief Feature

## ¿Qué es?

Cada proyecto en Mission Control ahora tiene un **brief vivo** que incluye:

1. **📝 BRIEF** - Resumen general del proyecto
2. **🗺️ ROADMAP** - Qué va a pasar (plan/fases)
3. **▶️ ESTADO ACTUAL** - Qué se está haciendo ahora
4. **📜 HISTORIAL** - Qué se fue haciendo (con timestamps)
5. **🔗 LINKS** - GitHub, Vercel, Docs

## ¿Para qué sirve?

Si Kimi (o cualquiera) pierde memoria del proyecto:
1. Va a Mission Control
2. Click en el proyecto
3. Lee el brief completo
4. Tiene TODO el contexto en un solo lugar

## Cómo usar

### Ver el Brief
1. Abre Mission Control
2. Ve a "Proyectos"
3. **Click en cualquier proyecto**
4. El sheet lateral muestra el brief completo

### Editar el Brief
1. Click en el ícono ✏️ (edit) en la sección "BRIEF"
2. Edita:
   - **Brief**: Resumen general
   - **Roadmap**: Lista de fases/plan
   - **Current Status**: Qué se está haciendo ahora
3. Click en "Guardar Brief"

### Agregar al Historial
1. En la sección "HISTORIAL"
2. Selecciona tipo: 🟡 Progreso / 🟢 Hitos / 🔴 Bloqueo / 🔵 Decisión / ⚪ Nota
3. Escribe la actualización
4. Click en ➕ o presiona Enter

### Links del Proyecto
Los campos `github_url`, `vercel_url`, `docs_url` se guardan en la tabla projects.
Para editarlos, usar Supabase Dashboard o crear un form de edición.

## Estructura de datos

### Tabla `projects` (columnas nuevas)
```sql
brief TEXT           -- Resumen general
roadmap TEXT         -- Plan/qué va a pasar  
current_status TEXT  -- Qué se está haciendo ahora
github_url TEXT      -- URL del repo
vercel_url TEXT      -- URL del deploy
docs_url TEXT        -- URL de docs
```

### Tabla `project_updates` (nueva)
```sql
id UUID PRIMARY KEY
project_id UUID REFERENCES projects(id)
update_type VARCHAR(20) -- milestone, blocker, decision, progress, note
content TEXT
created_by VARCHAR(50)
created_at TIMESTAMP
```

## Migración SQL

Ejecutar en Supabase:
```bash
supabase db push
# o manualmente el archivo:
# supabase/migrations/20260306_add_project_brief_and_updates.sql
```

## Ejemplo de uso

```
Proyecto: "Upload Multi-Tenant"

📝 BRIEF:
Sistema de upload de videos a múltiples plataformas
(YouTube, TikTok, Instagram) usando Blotato API.

🗺️ ROADMAP:
• Fase 1: Edge Functions para upload
• Fase 2: Frontend con status icons
• Fase 3: n8n workflow para sync de IDs
• Fase 4: Testing y documentación

▶️ ESTADO ACTUAL:
Implementando n8n workflow para sincronizar
video IDs desde Blotato a Supabase.

📜 HISTORIAL:
• [Hoy] 🟡 Progreso: n8n workflow en desarrollo
• [Ayer] 🟢 Hitos: Frontend con iconos terminado
• [Lunes] 🔵 Decisión: Usar n8n en vez de Supabase cron
```

## UX/UI

```
┌─ Mission Control ────────┬─ 📋 Brief del Proyecto
│                          │
│ Proyectos                │ 📝 BRIEF
│ ├── Upload Multi-Tenant──┼─→ [Editar ✏️]
│ ├── Animania Redesign    │   Resumen del proyecto...
│ └── AI Lab               │
│                          │ 🗺️ ROADMAP
│                          │   • Fase 1: ...
│                          │   • Fase 2: ...
│                          │
│                          │ ▶️ ESTADO ACTUAL
│                          │   Ahora estamos...
│                          │
│                          │ 📜 HISTORIAL
│                          │   🟡 Progreso - Hoy
│                          │   🟢 Hitos - Ayer
│                          │
│                          │ [Agregar update...]
└──────────────────────────┴─────────────────────
```

## Próximos pasos opcionales

- [ ] Agregar imágenes/logos al brief
- [ ] Agregar deadlines a roadmap items
- [ ] Agregar assignees a roadmap items  
- [ ] Exportar brief a PDF/Markdown
- [ ] Notificaciones cuando se actualiza
- [ ] Integrar con GitHub (auto-update on commits)

## Commits relacionados

- `7147320`: feat: Add project brief, roadmap, current status and updates history

---

**Status**: 🟢 PRODUCCIÓN
