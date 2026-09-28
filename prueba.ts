Actúa como frontend developer senior en Angular.Necesito actualizar el consumo de reportes en este módulo siguiendo estrictamente nuestra arquitectura.

Contexto del cambio:
1. El listado de tipos de reporte cambió: antes retornaba["proveedores", "smart"], ahora retorna["proveedores:mes", "smart:rango"].
2. Actualmente ya existe la implementación funcional para "mes" que consume:
GET / proveedores ? region = { region } & date={ YYYY - MM }
3. Debemos integrar el nuevo endpoint para "smart:rango":
GET / smart ? region = { region } & startDate={ YYYY - MM - DD }& endDate={ YYYY - MM - DD }

Manejo del Selector de Fechas(UI y Lógica):
- Revisa cómo está construido actualmente el selector de fechas para "mes".
- Si el selector solo permite elegir mes(YYYY - MM): mediante el Mapper, calcula automáticamente el rango para "smart"(startDate = primer día del mes YYYY - MM-01, endDate = último día del mes YYYY - MM - DD).
- Si el componente debe permitir o ya permite seleccionar rango(startDate y endDate): adapta el selector / formulario en el HTML para que cuando el usuario elija "smart:rango" pueda ingresar / visualizar ambas fechas, o alternar entre selector de mes simple y datepicker de rango según el reporte activo.
- Asegúrate de que el formato enviado en los query params sea estrictamente YYYY - MM para mes y YYYY - MM - DD para rango.

Reglas obligatorias de arquitectura y calidad de código:
- CERO MAGIC STRINGS Y CERO MAGIC NUMBERS:
  * Prohibido usar cadenas o números literales quemados en código(componente, mapper, servicio o HTML).
  * Todo tipo de reporte('proveedores:mes', 'smart:rango'), nombres de query params('region', 'date', 'startDate', 'endDate'), rutas base de endpoints('/proveedores', '/smart'), separadores(ej: ':'), y formatos o valores numéricos por defecto deben residir en el archivo de Constantes usando `as const` o`enum`.
  * En la plantilla HTML y en los métodos TypeScript, hacer referencia exclusivamente a las constantes importadas o expuestas.
- Signals: Reactividad 100 % con Signals de Angular.
- Nomenclatura obligatoria: TODOS los Signals DEBEN empezar con "$"(ej: public readonly $selectedReport = signal(REPORT_TYPES.PROVEEDORES_MES); public readonly $startDate = signal(''); public readonly$isLoading = signal(false);).
- Plantilla HTML: Invocar los signals como funciones con prefijo "$"(ej: $isLoading(), $selectedReport()).Usar sintaxis moderna(@if, @for).Sin pipes | async.
- Separación de capas:
  * Constantes: Declarar los identificadores, nombres de parámetros, rutas y formatos centralizados.
  * Modelos: Definir interfaces para los filtros de búsqueda(ProveedoresMesFilter, SmartRangoFilter) y las respuestas DTO.
  * Mapper: Crear funciones puras para parsear el tipo de reporte y transformar / formatear las fechas a los formatos requeridos por la API.
  * Servicio: Exponer los métodos getProveedores(filter) y getSmart(filter) armando HttpParams a partir de las constantes.
  * Componente: Orquestar la llamada reactiva al cambiar de opción o de fechas, actualizando los signals correspondientes.

Por favor, inspecciona los archivos existentes del módulo, toma como referencia lo que ya está hecho para "mes" y replica el patrón para "smart:rango".