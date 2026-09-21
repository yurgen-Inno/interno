<div class="bc-container bc-p-4">

  <!-- Tarjeta de Perfil y Puntaje Global -->
  <bc-card elevation="1" class="bc-mb-4">
    <div class="bc-d-flex bc-justify-content-between bc-align-items-center">
      
      <!-- Información del Usuario -->
      <div class="bc-d-flex bc-align-items-center">
        <bc-avatar 
          size="lg" 
          src="url-foto-usuario.jpg" 
          alt="Foto de perfil">
        </bc-avatar>
        <div class="bc-ml-3">
          <h2 class="bc-h4 bc-m-0">Luis Gómez</h2>
          <p class="bc-text-muted bc-m-0">usuario@correo.com.co</p>
          <p class="bc-text-caption bc-m-0">Digital - Fábrica de software</p>
        </div>
      </div>

      <!-- Resumen de Puntaje -->
      <div class="bc-d-flex bc-align-items-center">
        <div class="bc-text-right bc-mr-4">
          <span class="bc-text-caption bc-text-muted bc-d-block">PUNTAJE GLOBAL</span>
          <span class="bc-display-4 bc-font-weight-bold">79.72</span>
          <div class="bc-text-caption bc-text-muted">
            <span>Ranking <strong>#325</strong></span> · <span class="bc-text-success">Top 12%</span>
          </div>
        </div>

        <bc-card variant="neutral" class="bc-p-2 bc-bg-light">
          <div class="bc-d-flex bc-justify-content-between">
            <span class="bc-text-caption">79.72 / 100</span>
            <bc-badge variant="secondary" text="Semi Senior"></bc-badge>
          </div>
          <div class="bc-text-caption bc-text-muted bc-mt-2">Nivel 3 de 5</div>
        </bc-card>
      </div>

    </div>
  </bc-card>

  <!-- Pestañas (Tabs) -->
  <bc-tabs class="bc-mb-4">
    <bc-tab label="General"></bc-tab>
    <bc-tab label="Ranking" active></bc-tab>
  </bc-tabs>

  <!-- Controles y Filtros -->
  <div class="bc-d-flex bc-justify-content-between bc-align-items-center bc-mb-3">
    <div>
      <h3 class="bc-h5 bc-m-0">Ranking de Evaluaciones</h3>
      <small class="bc-text-muted">Compara tu rendimiento general</small>
    </div>

    <div style="width: 260px;">
      <bc-select 
        label="Filtrar por" 
        value="all" 
        placeholder="Todos los niveles">
        <bc-option value="all">Todos los niveles</bc-option>
        <bc-option value="senior">Senior</bc-option>
        <bc-option value="semi-senior">Semi Senior</bc-option>
        <bc-option value="junior">Junior</bc-option>
      </bc-select>
    </div>
  </div>

  <!-- Tabla de Posiciones -->
  <bc-card elevation="1" class="bc-p-0 bc-overflow-hidden">
    <table class="bc-table bc-table-hover bc-table-striped-custom">
      <thead>
        <tr>
          <th>Posición</th>
          <th>Nombre</th>
          <th>Rol</th>
          <th>Nivel</th>
          <th>Puntaje</th>
          <th class="bc-text-right">Acción</th>
        </tr>
      </thead>
      <tbody>
        <!-- Filas del Top -->
        <tr>
          <td>#1</td>
          <td>Carolina Méndez</td>
          <td>Tech Lead</td>
          <td><bc-badge variant="info" text="Senior"></bc-badge></td>
          <td>95.40</td>
          <td class="bc-text-right">
            <bc-icon-button icon="chevron-right" size="sm"></bc-icon-button>
          </td>
        </tr>
        <tr>
          <td>#2</td>
          <td>Juan Pérez</td>
          <td>Arquitecto Software</td>
          <td><bc-badge variant="info" text="Senior"></bc-badge></td>
          <td>93.12</td>
          <td class="bc-text-right">
            <bc-icon-button icon="chevron-right" size="sm"></bc-icon-button>
          </td>
        </tr>
        <tr>
          <td>#3</td>
          <td>María Londoño</td>
          <td>CDE</td>
          <td><bc-badge variant="info" text="Senior"></bc-badge></td>
          <td>91.85</td>
          <td class="bc-text-right">
            <bc-icon-button icon="chevron-right" size="sm"></bc-icon-button>
          </td>
        </tr>
      </tbody>

      <!-- Sección Destacada: Tu Posición -->
      <tbody class="bc-border-top-thick">
        <tr class="bc-bg-warning-light">
          <td colspan="6" class="bc-text-caption bc-font-weight-bold bc-py-1">
            TU POSICIÓN <span class="bc-float-right bc-text-muted">TOP 12%</span>
          </td>
        </tr>
        <!-- Fila del usuario activo -->
        <tr class="bc-table-row-selected">
          <td class="bc-font-weight-bold">#325</td>
          <td class="bc-font-weight-bold">Luis Gómez (Tú)</td>
          <td>CDE</td>
          <td><bc-badge variant="warning" text="Semi Senior"></bc-badge></td>
          <td class="bc-font-weight-bold">79.72</td>
          <td class="bc-text-right">
            <bc-icon-button icon="chevron-right" size="sm"></bc-icon-button>
          </td>
        </tr>
        <tr>
          <td>#326</td>
          <td>Carlos Restrepo</td>
          <td>QA Engineer</td>
          <td><bc-badge variant="warning" text="Semi Senior"></bc-badge></td>
          <td>79.50</td>
          <td class="bc-text-right">
            <bc-icon-button icon="chevron-right" size="sm"></bc-icon-button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <div class="bc-d-flex bc-justify-content-between bc-align-items-center bc-p-3 bc-border-top">
      <span class="bc-text-caption bc-text-muted">Mostrando 1-12 de 328 elementos</span>
      <bc-pagination 
        total-pages="3" 
        current-page="1">
      </bc-pagination>
    </div>
  </bc-card>

</div>