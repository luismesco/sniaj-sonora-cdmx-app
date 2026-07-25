# SNIAJ Sonora + CDMX

MVP del Sistema Nacional de Inteligencia Academica Juridica.

Autor unico: Luis Antonio Montanez Escobar, salvo indicacion expresa en contrario.

La app permite consultar un mapa operativo de Mexico, hacer click en estados,
revisar universidades piloto, distinguir publicas y privadas, estimar distancias
entre sedes y proponer rutas de recorrido academico para Sonora y Ciudad de
Mexico.

## Pagina publicada

La version visible se publica con GitHub Pages desde la carpeta `docs/`:

https://luismesco.github.io/sniaj-sonora-cdmx-app/

## Alcance actual

- Mapa nacional clicable con los 32 estados.
- Datos piloto para Sonora y CDMX.
- Filtros por territorio, regimen y oferta de Derecho.
- Ranking de oportunidad academica.
- Ficha institucional con modalidad, horario, validez y fuente.
- Distancias estimadas desde la universidad seleccionada.
- Ruta sugerida ordenando publicas y privadas.
- Exportacion CSV del estado o filtro activo.
- Notas privadas locales en el navegador.

Los datos de esta version son de demostracion y deben verificarse con SEP,
SIRVOES, ANUIES, DENUE y fuentes institucionales antes de usarse como registro
definitivo.

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

- `app/page.tsx`: experiencia principal, datos piloto, mapa, rutas y calculo de distancias.
- `app/globals.css`: estilos responsive para smartphone, tablet y escritorio.
- `src/main.tsx`: entrada de la aplicacion estatica.
- `docs/`: version compilada para GitHub Pages.

## Siguiente etapa

1. Ampliar el inventario con universidades verificadas individualmente.
2. Importar catalogos oficiales por CSV/XLSX.
3. Vincular RVOE a institucion + campus + programa + modalidad.
4. Agregar mapa geoespacial real con capas GeoJSON.
5. Persistir notas, contactos y resultados de eventos con autenticacion y roles.
