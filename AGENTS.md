# AGENTS.md

# SISTEMA DE COTIZACIÓN — LABORATORIO DE METROLOGÍA

## 1. PROPÓSITO DEL PROYECTO

Este proyecto es un sistema web de cotización para un laboratorio de metrología.

La aplicación actual ya es funcional y contiene una cantidad considerable de lógica de negocio. La versión de referencia actual tiene aproximadamente 4,000+ líneas de código y numerosas funciones interrelacionadas.

El objetivo NO es reducir artificialmente el número de líneas.

El objetivo es:

1. Reorganizar el código.
2. Mejorar su mantenibilidad.
3. Separar responsabilidades.
4. Reducir duplicaciones cuando sea seguro.
5. Mantener todas las funcionalidades existentes.
6. Preparar la aplicación para crecer.
7. Prepararla para migrar progresivamente desde una aplicación principalmente local hacia una arquitectura frontend + backend + base de datos.
8. Mejorar la seguridad de los datos.
9. Preparar autenticación y autorización con diferentes roles de usuario.

La funcionalidad existente tiene prioridad. Ninguna refactorización debe romper comportamiento existente.

---

# 2. REGLA FUNDAMENTAL: NO MODIFICAR SIN ANALIZAR

Antes de realizar una modificación estructural importante:

- Analizar el código completo.
- Identificar dependencias.
- Identificar variables globales.
- Identificar funciones utilizadas por varias partes.
- Identificar relaciones entre los datos.
- Identificar efectos secundarios.
- Identificar funciones duplicadas.
- Identificar dependencias entre módulos.
- Identificar qué información actualmente se almacena en LocalStorage.
- Identificar cómo se generan los PDFs.
- Identificar cómo funcionan Cotización y OT.
- Identificar cómo se genera y consulta el historial.
- Identificar qué datos están actualmente expuestos al frontend.

NO asumir que una función puede moverse simplemente porque su nombre parece pertenecer a otro módulo.

Si existe una duda sobre el propósito de una función, dato o relación, preguntar al usuario antes de modificarla.

---

# 3. NO HACER UNA REESCRITURA DESDE CERO

La aplicación existente funciona y contiene lógica de negocio que debe conservarse.

NO reemplazar toda la aplicación por una implementación nueva simplemente porque sea más moderna.

La estrategia debe ser una refactorización/migración progresiva.

Debe conservarse inicialmente:

- comportamiento;
- interfaz;
- cálculos;
- relaciones de datos;
- formatos;
- generación de documentos;
- historial;
- OT;
- importaciones;
- exportaciones;
- respaldos;
- numeración;
- funcionamiento de los formularios.

Las mejoras visuales o funcionales futuras se realizarán después de estabilizar la arquitectura.

---

# 4. FUNCIONALIDADES EXISTENTES

La aplicación contiene, entre otras, las siguientes áreas:

## Cotización

- Creación de cotizaciones.
- Edición de cotizaciones.
- Agregar instrumentos/equipos.
- Editar instrumentos/equipos.
- Eliminar instrumentos/equipos.
- Cálculo de precios.
- Cantidades.
- Descuentos.
- IGV.
- Totales.
- Monto en letras.
- Viáticos.
- Transporte.
- Datos del cliente.
- Datos del asesor.
- Tipo de servicio.
- Acreditación.
- Alcance.
- Puntos de calibración.
- Procedimientos.
- Actividades.
- Observaciones.

## Historial de cotizaciones

- Guardado de cotizaciones.
- Consulta.
- Visualización.
- Edición.
- Eliminación.
- Descarga.
- Información del cliente.
- Estados de las cotizaciones.
- Estadísticas derivadas del historial.

## Dashboard

- Estadísticas.
- Información derivada de cotizaciones.
- Información derivada de clientes.
- Información relacionada con servicios y equipos.

## Órdenes de Trabajo

- Creación de OT a partir de información de la cotización.
- Edición.
- Datos del cliente.
- Equipos.
- Servicios.
- Procedimientos.
- Puntos.
- Información del servicio.
- Generación de documento.
- Visualización.
- Historial de OT.
- Edición de OT almacenadas.
- Descarga de PDF.

## Clientes

Los clientes están relacionados con el historial de cotizaciones.

No asumir que los clientes son solamente datos estáticos: posteriormente deben convertirse en entidades protegidas de la base de datos.

## Catálogos

Existen datos relacionados entre:

- Magnitudes.
- Equipos.
- Marcas.
- Procedimientos.
- Áreas.
- Unidades.
- Alcances.
- Incertidumbres.
- Precios.
- Actividades.

Estas relaciones son importantes y NO deben romperse durante la separación de archivos.

---

# 5. RELACIONES DE DATOS

Una parte fundamental de la aplicación es la relación entre catálogos.

Conceptualmente:

Magnitud
→ Equipo
→ Marca
→ Procedimiento
→ Alcance
→ Unidades
→ Incertidumbre
→ Precio

Pero estas relaciones no deben asumirse solamente a partir de esta descripción.

Antes de modificar estructuras de datos, estudiar cómo están implementadas actualmente.

Al seleccionar una magnitud, equipo o servicio pueden actualizarse otros campos.

Al editar un instrumento, deben conservarse sus datos actuales y sus relaciones.

Debe existir compatibilidad con datos existentes cuando sea necesaria.

---

# 6. itemsData

`itemsData` es una estructura central de la aplicación.

Representa los instrumentos/equipos/servicios incluidos en la cotización.

No modificar su estructura sin analizar primero todas las funciones que la utilizan.

Debe estudiarse:

- quién la crea;
- quién la modifica;
- quién la lee;
- quién la guarda;
- quién la convierte en historial;
- quién la utiliza para OT;
- quién la utiliza para PDF;
- quién la utiliza para estadísticas;
- quién la utiliza para exportaciones.

Si se propone cambiar su estructura, explicar primero las consecuencias.

---

# 7. COTIZACIÓN Y PDF

La aplicación posee diferentes representaciones de la cotización.

Existe una representación para la interfaz/visualización y lógica específica para la generación del documento PDF.

Además, la cotización puede combinarse con otro PDF institucional existente.

No eliminar esta funcionalidad.

La futura arquitectura debe buscar evitar duplicación innecesaria, pero sin alterar el resultado final.

Objetivo conceptual:

DATOS DE COTIZACIÓN
→ lógica de cálculo
→ representación en pantalla

DATOS DE COTIZACIÓN
→ lógica de cálculo
→ generación PDF

PDF DE COTIZACIÓN
+
PDF INSTITUCIONAL
→ PDF FINAL

No duplicar innecesariamente la lógica de negocio.

---

# 8. ÓRDENES DE TRABAJO

OT es un módulo funcionalmente importante.

La información puede provenir de la cotización, pero posteriormente la OT posee su propia información y estado.

Debe estudiarse cuidadosamente:

- qué datos se copian;
- cuáles permanecen vinculados;
- cuáles se convierten en snapshot;
- qué ocurre al editar;
- qué ocurre al guardar;
- qué ocurre al generar PDF;
- qué ocurre al consultar historial.

No modificar esta relación sin analizarla.

---

# 9. LOCALSTORAGE

Actualmente la aplicación utiliza almacenamiento local del navegador.

Esto incluye información relacionada con:

- configuración;
- catálogos;
- cotizaciones;
- historial;
- OT;
- datos de formularios;
- otros estados de aplicación.

LocalStorage es aceptable como parte del sistema actual, pero NO debe considerarse la solución definitiva para datos sensibles o multiusuario.

La arquitectura futura debe migrar progresivamente los datos importantes hacia un backend y una base de datos.

No eliminar el almacenamiento actual hasta que exista una estrategia de migración.

---

# 10. SEGURIDAD

La seguridad es una prioridad futura del proyecto.

NO considerar seguro un dato solamente porque se haya movido de `index.html` a otro archivo JavaScript.

Todo dato enviado al navegador puede potencialmente ser inspeccionado mediante DevTools/F12.

Por lo tanto:

## NO deben permanecer permanentemente expuestos en el frontend:

- API keys privadas.
- Tokens privados.
- Credenciales.
- Contraseñas.
- Información sensible de clientes.
- Historial privado.
- Precios internos si deben protegerse.
- Configuración administrativa.
- Datos que solo el administrador debe modificar.
- Información que un usuario no autorizado no debe consultar.

---

# 11. .ENV

`.env` puede utilizarse para secretos y configuración del SERVIDOR.

Ejemplos:

- API keys.
- Credenciales de servicios externos.
- URL/credenciales de base de datos.
- Secretos de sesión.
- Configuraciones privadas.

IMPORTANTE:

`.env` NO debe utilizarse como base de datos para:

- clientes;
- historial;
- cotizaciones;
- equipos;
- precios;
- procedimientos;
- usuarios.

Los datos de aplicación deben almacenarse en una base de datos.

El `.env` debe permanecer fuera del frontend y no debe exponerse al navegador.

Nunca incluir secretos reales en el repositorio.

---

# 12. API

Actualmente existen funciones que pueden utilizar APIs externas.

Las claves privadas NO deben continuar en el JavaScript del navegador en la arquitectura final.

Arquitectura objetivo:

FRONTEND
→ solicitud HTTPS
→ BACKEND
→ API externa

El frontend no debe conocer la API key privada.

---

# 13. BASE DE DATOS

La arquitectura futura deberá permitir almacenar de manera centralizada:

- usuarios;
- clientes;
- cotizaciones;
- OT;
- historial;
- equipos;
- marcas;
- procedimientos;
- áreas;
- precios;
- configuraciones;
- relaciones entre catálogos.

La base de datos debe permitir control de acceso.

No asumir que LocalStorage seguirá siendo la fuente definitiva de información.

---

# 14. USUARIOS Y ROLES

Inicialmente existirán DOS niveles principales:

## ADMINISTRADOR

Tiene acceso completo.

Puede:

- crear usuarios;
- administrar usuarios;
- activar/desactivar usuarios;
- administrar equipos;
- administrar marcas;
- administrar procedimientos;
- administrar áreas;
- administrar precios;
- modificar catálogos;
- consultar todos los clientes;
- consultar todo el historial;
- consultar todas las OT;
- consultar todas las cotizaciones;
- realizar funciones administrativas.

## METRÓLOGO / VENDEDOR

Tiene acceso limitado.

Puede:

- iniciar sesión;
- crear cotizaciones;
- editar sus cotizaciones;
- crear OT;
- editar sus OT según las reglas del sistema;
- utilizar equipos existentes;
- utilizar marcas existentes;
- utilizar procedimientos existentes;
- utilizar precios existentes;
- consultar sus propios registros.

NO puede:

- agregar equipos;
- eliminar equipos;
- modificar equipos;
- modificar precios;
- eliminar precios;
- modificar procedimientos;
- modificar marcas;
- modificar áreas;
- administrar usuarios;
- consultar el historial privado de otros usuarios;
- consultar clientes privados de otros usuarios;
- modificar configuración administrativa.

La seguridad NO debe depender únicamente de ocultar botones.

El backend debe validar los permisos.

---

# 15. PROPIETARIO DE LOS REGISTROS

Cada cotización y OT deberá asociarse al usuario que la creó.

Conceptualmente:

cotización
→ creadoPor = usuario

OT
→ creadoPor = usuario

Esto permitirá:

ADMINISTRADOR
→ consultar todos los registros.

METRÓLOGO/VENDEDOR
→ consultar solamente sus propios registros.

El filtro de seguridad debe realizarse en el backend/base de datos.

No confiar únicamente en filtros realizados mediante JavaScript.

---

# 16. USUARIOS Y CONTRASEÑAS

Cada usuario tendrá su propia cuenta.

Ejemplo conceptual:

Usuario:
- ID interno
- nombre
- usuario
- contraseña protegida
- rol
- estado activo/inactivo

Las contraseñas NO deben almacenarse en texto plano.

No guardar contraseñas directamente en `.env`.

---

# 17. NUMERACIÓN DE COTIZACIONES

El usuario ya posee un formato propio para el número de cotización.

NO cambiar ese formato sin consultarlo.

Problema actual a resolver:

Si dos usuarios trabajan simultáneamente, no debe ocurrir:

Pedro → COT-002
Juan → COT-002

El navegador NO debe ser responsable de asignar de forma definitiva el número oficial.

La arquitectura futura debe permitir:

BORRADOR
→ guardar oficialmente
→ servidor
→ asignación segura del número
→ registro único

El servidor/base de datos debe garantizar que dos usuarios no reciban el mismo número.

---

# 18. ID INTERNO Y NÚMERO VISIBLE

Se recomienda separar:

1. ID interno único del registro.
2. Número administrativo visible de cotización.

El ID interno no debe depender del número visible.

Conceptualmente:

idInterno = identificador único

numeroCotizacion = número administrativo

Esto permitirá mantener referencias internas aunque el formato administrativo cambie.

---

# 19. NUMERACIÓN DE OT

El usuario también posee un formato propio para la numeración de OT.

NO reemplazarlo.

La futura arquitectura debe aplicar el mismo principio:

- ID interno único.
- Número oficial según el formato existente.
- Asignación segura en servidor.
- Sin colisiones entre usuarios.

---

# 20. BORRADORES

La arquitectura puede diferenciar:

BORRADOR
vs.
REGISTRO OFICIAL

Esto permitiría que varios usuarios comiencen cotizaciones simultáneamente sin reservar innecesariamente números oficiales.

El número oficial debería asignarse cuando corresponda según las reglas administrativas del laboratorio.

No implementar esta lógica hasta analizar primero el comportamiento actual y confirmar con el usuario.

---

# 21. REORGANIZACIÓN DEL CÓDIGO

No separar archivos simplemente por cantidad de líneas.

Separar por responsabilidad y dependencia.

Una arquitectura inicial posible es:

frontend/
    index.html

    css/
        estilos.css

    js/
        app.js
        cotizacion.js
        ot.js
        historial.js
        pdf.js
        almacenamiento.js
        archivos.js
        api.js
        datos.js

Esta estructura es solamente una propuesta inicial.

NO implementarla automáticamente.

Primero analizar el código real y determinar si esta división es apropiada.

Es preferible tener pocos módulos bien definidos que decenas de archivos pequeños difíciles de mantener.

---

# 22. DATOS.JS

No convertir automáticamente `datos.js` en un contenedor de todos los datos del laboratorio.

Hay que distinguir:

1. Datos públicos/no sensibles necesarios para el frontend.
2. Datos de configuración.
3. Datos administrativos.
4. Datos privados.
5. Datos que deben vivir en base de datos.

Los datos que deban protegerse NO deben terminar simplemente en `datos.js`.

---

# 23. REUTILIZACIÓN

Durante la refactorización buscar:

- funciones duplicadas;
- cálculos repetidos;
- generación repetida de HTML;
- generación repetida de PDF;
- validaciones repetidas;
- conversiones repetidas;
- acceso repetido a LocalStorage;
- lógica repetida entre Cotización y OT.

Pero NO eliminar duplicaciones automáticamente.

Primero comprobar que las funciones realmente tienen el mismo propósito y comportamiento.

---

# 24. FUNCIONES GRANDES

Si una función es muy grande, no dividirla solamente para reducir líneas.

Dividirla cuando existan responsabilidades claramente separables.

Ejemplo conceptual:

crearCotizacion()
→ validarDatos()
→ calcularTotales()
→ construirItems()
→ guardarCotizacion()
→ actualizarInterfaz()

Pero solamente realizar esta división después de comprobar las dependencias reales.

---

# 25. EVENTOS Y DOM

La aplicación utiliza numerosos elementos de interfaz y eventos.

Antes de mover funciones:

- comprobar quién registra el evento;
- qué elementos DOM necesita;
- qué variables globales utiliza;
- qué funciones llama;
- si depende del orden de ejecución;
- si necesita ejecutarse después de cargar la página.

No mover funciones únicamente por nombre.

---

# 26. COMPATIBILIDAD

Durante la reorganización:

- conservar IDs HTML importantes;
- conservar nombres de claves de almacenamiento mientras sea necesario;
- conservar formatos JSON;
- conservar formatos de cotización;
- conservar formatos de OT;
- conservar estructuras necesarias para importar/exportar;
- conservar compatibilidad con registros existentes.

Si se propone cambiar una clave o estructura:

1. explicar el motivo;
2. identificar qué funciones la utilizan;
3. preparar migración;
4. probar datos antiguos.

---

# 27. IMPORTACIÓN Y EXPORTACIÓN

La aplicación posee funciones de:

- respaldo JSON;
- restauración/importación JSON;
- exportación/importación relacionada con Excel;
- importación desde Word.

Estas funciones deben considerarse módulos importantes.

No eliminar compatibilidad con los archivos existentes.

La importación desde documentos puede contener lógica de identificación de:

- equipos;
- magnitudes;
- procedimientos;
- acreditación;
- precios;
- datos relacionados.

Debe analizarse antes de modificarla.

---

# 28. PDF

La aplicación utiliza generación de documentos y combinación de PDFs.

No eliminar bibliotecas o lógica de PDF sin comprobar todas las dependencias.

Antes de reorganizar:

- identificar funciones de jsPDF;
- identificar funciones de AutoTable;
- identificar funciones de PDF-Lib;
- identificar archivos PDF externos;
- identificar dónde se genera el contenido;
- identificar dónde se combinan documentos;
- identificar numeración de páginas;
- identificar diferencias entre vista previa y descarga.

---

# 29. PRUEBAS

Después de cada fase importante de refactorización se debe comprobar como mínimo:

## Cotización

- crear;
- agregar equipo;
- editar equipo;
- eliminar equipo;
- modificar cantidades;
- modificar descuentos;
- recalcular;
- guardar;
- cargar;
- visualizar;
- descargar PDF.

## Catálogos

- seleccionar magnitud;
- seleccionar equipo;
- seleccionar marca;
- seleccionar procedimiento;
- comprobar alcance;
- comprobar unidades;
- comprobar precios.

## Historial

- guardar;
- consultar;
- abrir;
- editar;
- descargar;
- eliminar.

## OT

- crear;
- editar;
- guardar;
- consultar historial;
- visualizar;
- descargar PDF.

## Datos

- respaldo JSON;
- restauración JSON;
- importación;
- exportación.

No considerar una fase terminada solamente porque el código "no muestra errores".

---

# 30. DESARROLLO POR FASES

La migración debe realizarse progresivamente.

Orden recomendado:

FASE 1
→ análisis completo del código.

FASE 2
→ mapa de dependencias.

FASE 3
→ propuesta de arquitectura.

FASE 4
→ separar responsabilidades del frontend.

FASE 5
→ pruebas.

FASE 6
→ refactorización de funciones duplicadas.

FASE 7
→ estabilización.

FASE 8
→ backend.

FASE 9
→ base de datos.

FASE 10
→ autenticación.

FASE 11
→ roles y permisos.

FASE 12
→ migración de datos.

FASE 13
→ seguridad y pruebas multiusuario.

No saltar directamente a la fase de usuarios si la arquitectura todavía no está preparada.

---

# 31. REGLAS PARA CODEX

Antes de modificar:

1. Leer `AGENTS.md`.
2. Leer el código relevante.
3. Entender las dependencias.
4. Explicar qué archivos serán modificados.
5. Explicar por qué.
6. Identificar posibles riesgos.
7. Proponer la estrategia.
8. Esperar autorización cuando el cambio sea estructural o pueda afectar varias funcionalidades.

Cuando se solicite una modificación pequeña y claramente aislada, puede realizarse directamente si no existe riesgo razonable para otras partes.

---

# 32. PRIMERA TAREA AL RECIBIR EL PROYECTO

NO modificar código.

Realizar solamente un análisis.

El análisis debe incluir:

1. Lista de archivos.
2. Estructura actual.
3. Número aproximado de líneas.
4. Lista de funciones.
5. Variables globales.
6. Estado global.
7. Estructuras de datos.
8. Claves de LocalStorage.
9. Relaciones entre catálogos.
10. Flujo de Cotización.
11. Flujo de Historial.
12. Flujo de OT.
13. Flujo de PDF.
14. Flujo de importación/exportación.
15. Dependencias externas.
16. APIs.
17. Posibles datos sensibles.
18. Duplicaciones.
19. Funciones altamente acopladas.
20. Riesgos de refactorización.
21. Propuesta de módulos.
22. Funciones que deberían permanecer juntas.
23. Funciones que pueden separarse.
24. Funciones cuyo propósito sea ambiguo.

No modificar archivos durante esta primera tarea.

---

# 33. PREGUNTAR AL USUARIO

Si durante el análisis aparece algo que no puede determinarse con seguridad a partir del código, preguntar.

Ejemplos:

- "¿Esta función se utiliza solamente para X?"
- "¿Este campo debe conservarse en el PDF?"
- "¿Este número se considera oficial al guardar o al enviar?"
- "¿Esta información puede verla el vendedor?"
- "¿Este catálogo debe ser editable por el administrador?"
- "¿Este PDF externo siempre estará presente?"
- "¿Este comportamiento actual es intencional?"

NO inventar respuestas.

---

# 34. OBJETIVO FINAL

La aplicación debe evolucionar desde:

FRONTEND MONOLÍTICO
+
DATOS LOCALES
+
LOCALSTORAGE

hacia:

FRONTEND
    ↓
BACKEND
    ↓
BASE DE DATOS

con:

- autenticación;
- autorización;
- roles;
- datos protegidos;
- historial por usuario;
- administración centralizada;
- numeración segura;
- API protegida;
- catálogos centralizados;
- clientes protegidos;
- PDFs;
- cotizaciones;
- OT;
- respaldo;
- escalabilidad.

La migración debe conservar las funcionalidades existentes.

---

# 35. PRINCIPIO FINAL

NO optimizar por cantidad de líneas.

Optimizar por:

- claridad;
- separación de responsabilidades;
- seguridad;
- mantenibilidad;
- reutilización;
- testabilidad;
- escalabilidad;
- estabilidad;
- facilidad para agregar nuevas funciones.

Una aplicación de 4,000 líneas bien organizada puede ser mucho mejor que una aplicación de 2,000 líneas mal estructurada.

El objetivo es que el sistema pueda crecer sin volver a convertirse en un único archivo monolítico.

FIN DE AGENTS.md