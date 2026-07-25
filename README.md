# SNIAJ Sonora + CDMX

MVP del Sistema Nacional de Inteligencia Academica Juridica.

Autor unico: Luis Antonio Montanez Escobar, salvo indicacion expresa en contrario.

La app permite consultar un mapa de Mexico, abrir Sonora y Ciudad de Mexico,
revisar instituciones de educacion superior una por una, distinguir publicas y
privadas, identificar la oferta de Licenciatura en Derecho y estimar distancias
y rutas de consulta.

## Pagina publicada

La version visible se publica con GitHub Pages desde la carpeta `docs/`:

https://luismesco.github.io/sniaj-sonora-cdmx-app/

## Alcance actual

- Mapa nacional con Sonora y CDMX resaltadas y clicables.
- 360 instituciones oficiales unicas: 82 en Sonora y 278 en CDMX.
- 157 instituciones con Licenciatura en Derecho detectada: 29 en Sonora y 128 en CDMX.
- Escuelas, campus, facultades y departamentos conservados como unidades subordinadas, sin inflar el numero de instituciones.
- Filtros por territorio, regimen y oferta de Derecho.
- Ranking de oportunidad academica.
- Ficha institucional con modalidad, horario, validez y fuente.
- Distancias estimadas desde la institucion seleccionada.
- Ruta sugerida ordenando publicas y privadas.
- Exportacion CSV del estado o filtro activo.
- Notas privadas locales en el navegador.

El inventario se deriva de ANUIES 2024-2025 y se contrasta con RENOES, SIGED,
SIRVOES, SEC Sonora, SECTEI CDMX y SIC Cultura. El RVOE, domicilio y fundamento
de cada programa deben validarse antes de una accion operativa.

## Desarrollo

Requiere Node.js `>=22.13.0`.

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run lint
pnpm run test
```

## Estructura principal

- `app/page.tsx`: experiencia principal, filtros, mapa, rutas y calculo de distancias.
- `app/globals.css`: estilos responsive para smartphone, tablet y escritorio.
- `data/processed/app_universities_sonora_cdmx.json`: inventario institucional consolidado para la app.
- `data/README.md`: cobertura, conteos, fuentes y limites de integracion.
- `src/main.tsx`: entrada de la aplicacion estatica.
- `docs/`: version compilada para GitHub Pages.

## Siguiente etapa

1. Resolver domicilios y coordenadas exactas por institucion o plantel.
2. Vincular RVOE a institucion + unidad + programa + modalidad.
3. Ampliar el inventario a otras entidades con el mismo criterio institucional.
4. Persistir notas, contactos y resultados de eventos con autenticacion y roles.
