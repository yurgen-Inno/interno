<div class="nv-container nv-p-4">

  <!-- Tarjeta de Perfil y Puntaje Global -->
  <nv-card-container elevation="1" class="nv-mb-4">
    <nv-card-body>
      <div class="nv-d-flex nv-justify-content-between nv-align-items-center">
        
        <!-- Información del Usuario -->
        <div class="nv-d-flex nv-align-items-center">
          <nv-avatar 
            size="lg" 
            src="url-foto-usuario.jpg" 
            alt="Foto de perfil">
          </nv-avatar>
          <div class="nv-ml-3">
            <h2 class="nv-text-heading-sm nv-m-0">Luis Gómez</h2>
            <p class="nv-text-body-sm nv-text-secondary nv-m-0">usuario@correo.com.co</p>
            <p class="nv-text-caption nv-text-secondary nv-m-0">Digital - Fábrica de software</p>
          </div>
        </div>

        <!-- Resumen de Puntaje -->
        <div class="nv-d-flex nv-align-items-center">
          <div class="nv-text-right nv-mr-4">
            <span class="nv-text-caption nv-text-secondary nv-d-block">PUNTAJE GLOBAL</span>
            <span class="nv-text-display-md nv-font-bold">79.72</span>
            <div class="nv-text-caption nv-text-secondary">
              <span>Ranking <strong>#325</strong></span> · <span class="nv-text-success">Top 12%</span>
            </div>
          </div>

          <!-- Sub-tarjeta para el nivel -->
          <nv-card-container variant="subtle" class="nv-p-2">
            <nv-card-body class="nv-p-0">
              <div class="nv-d-flex nv-justify-content-between nv-align-items-center nv-gap-2">
                <span class="nv-text-caption nv-font-medium">79.72 / 100</span>
                <nv-tag variant="neutral" size="sm">Semi Senior</nv-tag>
              </div>
              <div class="nv-text-caption nv-text-secondary nv-mt-1">Nivel 3 de 5</div>
            </nv-card-body>
          </nv-card-container>
        </div>

      </div>
    </nv-card-body>
  </nv-card-container>

  <!-- Navegación por Pestañas -->
  <nv-tabs-container class="nv-mb-4" active-tab="ranking">
    <nv-tab id="general" label="General"></nv-tab>
    <nv-tab id="ranking" label="Ranking"></nv-tab>
  </nv-tabs-container>

  <!-- Filtro Superior -->
  <div class="nv-d-flex nv-justify-content-between nv-align-items-center nv-mb-3">
    <div>
      <h3 class="nv-text-heading-xs nv-m-0">Ranking de Evaluaciones</h3>
      <span class="nv-text-caption nv-text-secondary">Compara tu rendimiento general</span>
    </div>

    <div style="width: 250px;">
      <nv-select 
        label="Filtrar por" 
        value="all" 
        placeholder="Todos los niveles">
        <nv-select-option value="all">Todos los niveles</nv-select-option>
        <nv-select-option value="senior">Senior</nv-select-option>
        <nv-select-option value="semi-senior">Semi Senior</nv-select-option>
        <nv-select-option value="junior">Junior</nv-select-option>
      </nv-select>
    </div>
  </div>

  <!-- Contenedor de Tabla de Posiciones -->
  <nv-card-container class="nv-p-0">
    <nv-table-container>
      <table class="nv-table">
        <thead class="nv-table-head">
          <tr class="nv-table-row">
            <th class="nv-table-header-cell">Posición</th>
            <th class="nv-table-header-cell">Nombre</th>
            <th class="nv-table-header-cell">Rol</th>
            <th class="nv-table-header-cell">Nivel</th>
            <th class="nv-table-header-cell">Puntaje</th>
            <th class="nv-table-header-cell nv-text-right">Acción</th>
          </tr>
        </thead>
        <tbody class="nv-table-body">
          <!-- Top 3 -->
          <tr class="nv-table-row">
            <td class="nv-table-cell">#1</td>
            <td class="nv-table-cell">Carolina Méndez</td>
            <td class="nv-table-cell">Tech Lead</td>
            <td class="nv-table-cell"><nv-tag variant="brand" size="sm">Senior</nv-tag></td>
            <td class="nv-table-cell">95.40</td>
            <td class="nv-table-cell nv-text-right">
              <nv-icon-button icon="nv-icon-chevron-right" size="sm" aria-label="Ver"></nv-icon-button>
            </td>
          </tr>
          <tr class="nv-table-row">
            <td class="nv-table-cell">#2</td>
            <td class="nv-table-cell">Juan Pérez</td>
            <td class="nv-table-cell">Arquitecto Software</td>
            <td class="nv-table-cell"><nv-tag variant="brand" size="sm">Senior</nv-tag></td>
            <td class="nv-table-cell">93.12</td>
            <td class="nv-table-cell nv-text-right">
              <nv-icon-button icon="nv-icon-chevron-right" size="sm" aria-label="Ver"></nv-icon-button>
            </td>
          </tr>
          <tr class="nv-table-row">
            <td class="nv-table-cell">#3</td>
            <td class="nv-table-cell">María Londoño</td>
            <td class="nv-table-cell">CDE</td>
            <td class="nv-table-cell"><nv-tag variant="brand" size="sm">Senior</nv-tag></td>
            <td class="nv-table-cell">91.85</td>
            <td class="nv-table-cell nv-text-right">
              <nv-icon-button icon="nv-icon-chevron-right" size="sm" aria-label="Ver"></nv-icon-button>
            </td>
          </tr>

          <!-- Separador: Tu Posición -->
          <tr class="nv-table-row nv-bg-highlight">
            <td colspan="6" class="nv-table-cell nv-text-caption nv-font-bold">
              TU POSICIÓN <span class="nv-float-right nv-text-secondary">TOP 12%</span>
            </td>
          </tr>

          <!-- Posición del Usuario Logueado -->
          <tr class="nv-table-row nv-table-row-selected">
            <td class="nv-table-cell nv-font-bold">#325</td>
            <td class="nv-table-cell nv-font-bold">Luis Gómez (Tú)</td>
            <td class="nv-table-cell">CDE</td>
            <td class="nv-table-cell"><nv-tag variant="neutral" size="sm">Semi Senior</nv-tag></td>
            <td class="nv-table-cell nv-font-bold">79.72</td>
            <td class="nv-table-cell nv-text-right">
              <nv-icon-button icon="nv-icon-chevron-right" size="sm" aria-label="Ver"></nv-icon-button>
            </td>
          </tr>
          <tr class="nv-table-row">
            <td class="nv-table-cell">#326</td>
            <td class="nv-table-cell">Carlos Restrepo</td>
            <td class="nv-table-cell">QA Engineer</td>
            <td class="nv-table-cell"><nv-tag variant="neutral" size="sm">Semi Senior</nv-tag></td>
            <td class="nv-table-cell">79.50</td>
            <td class="nv-table-cell nv-text-right">
              <nv-icon-button icon="nv-icon-chevron-right" size="sm" aria-label="Ver"></nv-icon-button>
            </td>
          </tr>
        </tbody>
      </table>
    </nv-table-container>

    <!-- Paginación -->
    <nv-card-footer class="nv-d-flex nv-justify-content-between nv-align-items-center">
      <span class="nv-text-caption nv-text-secondary">Mostrando 1-12 de 328 elementos</span>
      <nv-pagination 
        total="328" 
        items-per-page="12" 
        current-page="1">
      </nv-pagination>
    </nv-card-footer>
  </nv-card-container>

</div>