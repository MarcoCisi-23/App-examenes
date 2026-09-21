# ART Sanidad Móvil

App web para que los evaluadores (médicos laborales) de ANDINA ART gestionen
exámenes médicos periódicos: lotes/campañas por empresa, nómina de
trabajadores, carga de estudios clínicos y dictamen, y un panel de exámenes
realizados.

Construida con Next.js (App Router) + TypeScript + Tailwind CSS v3 + Prisma
(SQLite) + Server Actions. Ver el plan de implementación completo para el
detalle de arquitectura y modelo de datos.

## Requisitos

- Node.js 20+ y npm.

## Primeros pasos

```bash
npm install
npm run seed   # crea la base SQLite local y la llena con datos de ejemplo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). El seed imprime en
consola el CUIT y la contraseña de la evaluadora de prueba para iniciar
sesión:

- **CUIT:** 20-34589123-9
- **Contraseña:** ExamenLaboral2024

`npm run seed` borra y vuelve a crear todos los datos — usalo cuando quieras
reiniciar el estado de la demo.

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` / `npm run start` — build de producción.
- `npm run seed` — resetea y siembra la base de datos con datos de ejemplo.
- `npm run lint` — ESLint.
- `npx tsc --noEmit` — chequeo de tipos.
- `npx prisma studio` — explorar/editar la base de datos SQLite a mano.

## Estado del proyecto

MVP funcional de punta a punta: login (CUIT + contraseña), listado de
lotes/exámenes asignados con filtros, nómina de trabajadores con buscador,
ficha clínica del trabajador, carga de los 4 estudios requeridos + dictamen,
y panel de "Realizados".

**Fuera de alcance por ahora** (deliberado, ver plan): generación real de
PDF/ZIP y envío de resultados (los botones de "Realizados" muestran un aviso
de "Próximamente"), integración real con SRT/AFIP, modo offline real, y
almacenamiento real de archivos adjuntos (se guardan solo como nombre de
archivo).
