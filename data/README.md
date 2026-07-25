# Fuentes oficiales para SNIAJ Sonora + CDMX

Autor unico del proyecto: Luis Antonio Montanez Escobar, salvo indicacion expresa en contrario.

## Estado de cobertura al 25 de julio de 2026

Las descargas y consultas reproducibles estan en:

- `python3 scripts/ingest_official_sources.py`
- `python3 scripts/download_siged_files.py`
- `python3 scripts/download_anuies_2024_2025.py`
- `python3 scripts/download_renoes_derecho.py`
- `python3 scripts/build_app_dataset.py`

## Descargas realizadas

Fuentes procesadas:

- SIRVOES SEP: planteles particulares con RVOE de tipo superior, nivel licenciatura, estatus vigente, para Sonora y Ciudad de Mexico. La marca de Licenciatura en Derecho se obtiene con una consulta oficial separada por programa.
- SEC Sonora RVOE: instituciones de educacion superior publicadas por la Secretaria de Educacion y Cultura de Sonora, con pagina de detalle por plantel cuando esta disponible.
- SECTEI CDMX PIVOE: archivo XLSX de RVOE local de CDMX para tipo superior, nivel licenciatura, y descarga separada filtrada por Derecho.
- SIGED SEP CCT: Catalogo de Centros de Trabajo, archivos 01-16 y 17-32, con fecha oficial de actualizacion 25/07/2026 en el listado de SIGED.
- SIGED SEP Formato 911: educacion superior escolarizada y no escolarizada, inicio de cursos 2024-2025, archivos CSV publicados con fecha oficial de actualizacion 03/10/2025.
- ANUIES Anuario Estadistico de Educacion Superior: ciclo 2024-2025, consulta paginada para Sonora y Ciudad de Mexico, niveles licenciatura universitaria/tecnologica y licenciatura normal.
- SIC Cultura: Directorio de universidades en CSV y JSON, publicado como datos abiertos con registro de actualizacion 2026-07-22.
- RENOES SEP: catalogos publicos de instituciones, planteles y carreras; consulta publica filtrada a Derecho para Sonora y Ciudad de Mexico.

Archivos principales:

- `data/processed/sirvoes_sonora_cdmx_licenciatura.json`
- `data/processed/sonora_sec_rvoe_educacion_superior.json`
- `data/processed/cdmx_sectei_rvoe_superior_licenciatura.json`
- `data/processed/cdmx_sectei_rvoe_derecho_licenciatura.json`
- `data/processed/anuies_2024_2025_sonora_cdmx_licenciatura.csv`
- `data/raw/siged_ccts_4_CATALOGO_CENTRO_TRABAJO_01_16_CSV.zip`
- `data/raw/siged_ccts_3_CATALOGO_CENTRO_TRABAJO_17_32_CSV.zip`
- `data/raw/siged_databi911_429_Educacion_superior_escolarizada_inicio_de_cursos_2024-2025_CSV.zip`
- `data/raw/siged_databi911_426_Educacion_superior_no_escolarizada_inicio_de_cursos_2024-2025_CSV.zip`
- `data/raw/sic_cultura_universidad_directorio_20260725.csv`
- `data/raw/sic_cultura_universidad_directorio_20260725.json`
- `data/raw/renoes_additionData_20260725.json`
- `data/raw/renoes_planteles_20260725.json`
- `data/raw/renoes_derecho_sonora_cdmx_20260725.json`
- `data/processed/app_universities_sonora_cdmx.json`
- `data/processed/official_ingest_summary.csv`

## Conteos verificados

SIRVOES SEP, licenciatura vigente particular:

- Sonora: 44 planteles, 27 con Licenciatura en Derecho.
- Ciudad de Mexico: 406 planteles, 199 con Licenciatura en Derecho.

SEC Sonora:

- 79 registros de educacion superior publicados por el portal estatal consultado.

SECTEI CDMX PIVOE:

- 12 registros de RVOE local de tipo superior, nivel licenciatura, publicados por el XLSX consultado.

ANUIES 2024-2025, licenciatura:

- Sonora: 1,152 filas programa; 82 instituciones unicas; 187 escuelas/campus unicos; 74 filas de Derecho; 29 instituciones unicas con Derecho.
- Ciudad de Mexico: 3,001 filas programa; 278 instituciones unicas; 461 escuelas/campus unicos; 224 filas de Derecho; 127 instituciones unicas con Derecho.

SIGED 911 2024-2025:

- Sonora: 191 filas escuela en superior; 105 instituciones unicas; 191 escuelas unicas.
- Ciudad de Mexico: 595 filas escuela en superior; 345 instituciones unicas; 595 escuelas unicas.

SIGED CCT activo con servicio superior:

- Sonora: 448 CCT activos relacionados con educacion superior; 197 publicos y 251 privados.
- Ciudad de Mexico: 1,284 CCT activos relacionados con educacion superior; 411 publicos y 873 privados.

RENOES SEP:

- Catalogos descargados: 3,610 instituciones, 8,969 carreras y planteles nacionales.
- Consulta Derecho Sonora/CDMX: 72 carreras agregadas, 319 ofertas, 133 instituciones y 178 planteles.

Dataset activo de la app:

- 360 instituciones oficiales unicas derivadas principalmente de ANUIES.
- Sonora: 82 instituciones; 29 con Derecho detectado; 32 publicas y 50 privadas.
- Ciudad de Mexico: 278 instituciones; 128 con Derecho detectado; 52 publicas y 226 privadas.
- Las 648 etiquetas de escuela/campus/facultad originales (187 en Sonora y 461 en CDMX) se conservan como unidades reportadas dentro de su institucion y no se cuentan como universidades.

## Fuentes revisadas con limite de descarga

- DENUE INEGI: la API oficial requiere token para consultas; no se descarga automaticamente sin registrar un token.
- PUI SEP/DGAIR: es un proceso de registro institucional y carga con credenciales; no es un padron publico descargable completo.
- datos.gob.mx: el portal fue revisado, pero el endpoint historico tipo CKAN no respondio como API publica util en esta ejecucion. Se conserva como fuente a revisar por descarga manual/portal actualizado si aparece un recurso directo.

## Criterio de integracion

El criterio de trabajo debe ser: ningun registro entra a produccion como definitivo sin fuente oficial, fecha de consulta y campo de cobertura.

Para la app, la unidad principal es la institucion oficial dentro de cada entidad. Escuelas, campus, facultades y departamentos se agregan como unidades subordinadas; modalidad, sostenimiento y programas se consolidan a nivel institucional. La oferta de Licenciatura en Derecho toma prioridad desde SIRVOES/RVOE/ANUIES por programa; CCT y SIC se usan como soporte de plantel, domicilio, coordenadas y contraste.
