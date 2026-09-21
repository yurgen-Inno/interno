<div class="ranking-wrapper" >

  <!--Estado de Carga Global(Opcional con nv - preloader)-- >
    <!-- < div class="loading-overlay" > <nv-preloader size = "lg" > </nv-preloader></div > -->

      <!--Tarjeta Superior: Perfil y Puntaje-- >
        <nv-card - container class="profile-card" >
          <div class="profile-content" >

            <!--Datos Usuario-- >
              <div class="user-info" >
                <div class="user-avatar" >
                  <img src="https://via.placeholder.com/64" alt = "Foto de perfil" />
                    </div>
                    < div class="user-details" >
                      <h2 class="user-name" > Luis Gómez </h2>
                        < p class="user-email" > usuario@correo.com.co</p>
                          < p class="user-area" > Digital · Fábrica de software </p>
                            </div>
                            </div>

                            < !--Métricas del Puntaje-- >
                              <div class="score-summary" >
                                <div class="score-main" >
                                  <span class="score-label" > PUNTAJE GLOBAL </span>
                                    < span class="score-value" > 79.72 </span>
                                      < div class="score-meta" >
                                        <span>Ranking < strong >#325 < /strong></span >
                                          <span class="score-top" > Top 12 % </span>
                                            </div>
                                            </div>

                                            < div class="score-badge-box" >
                                              <div class="badge-row" >
                                                <span class="points-ratio" > 79.72 / 100 </span>
                                                  < span class="pill-badge pill-neutral" >
                                                    <nv-status variant = "warning" > </nv-status>
              Semi Senior
  </span>
  </div>
  < span class="level-indicator" > Nivel 3 de 5 </span>
    </div>
    </div>

    </div>
    </nv-card-container>

    < !--Pestañas Manuales-- >
      <nav class="custom-tabs" >
        <button type="button" class="tab-btn" > General </button>
          < button type = "button" class="tab-btn active" > Ranking </button>
            </nav>

            < !--Cabecera de la Tabla y Filtros-- >
              <div class="table-controls" >
                <div class="control-title" >
                  <h3>Ranking de Evaluaciones </h3>
                    < span > Compara tu rendimiento general </span>
                      </div>

                      < div class="control-filter" >
                        <label for= "level-filter" > Filtrar por: </label>
                          < div class="select-wrapper" >
                            <select id="level-filter" >
                              <option value="all" > Todos los niveles </option>
                                < option value = "senior" > Senior </option>
                                  < option value = "semi-senior" > Semi Senior </option>
                                    < option value = "junior" > Junior </option>
                                      </select>
                                      < span class="chevron-icon" > </span>
                                        </div>
                                        </div>
                                        </div>

                                        < !--Contenedor de la Tabla-- >
                                          <nv-card - container class="table-card" >
                                            <div class="table-responsive" >
                                              <table class="ranking-table" >
                                                <thead>
                                                <tr>
                                                <th>Posición </th>
                                                < th > Nombre </th>
                                                < th > Rol </th>
                                                < th > Nivel </th>
                                                < th > Puntaje </th>
                                                < th class="text-right" > Acción </th>
                                                  </tr>
                                                  </thead>
                                                  < tbody >
                                                  <!--Top Ranking-- >
                                                    <tr>
                                                    <td>#1 </td>
                                                      < td class="font-medium" > Carolina Méndez </td>
                                                        < td > Tech Lead </td>
                                                          < td >
                                                          <span class="pill-badge pill-senior" >
                                                            <nv-status variant = "success" > </nv-status>
Senior
  </span>
  </td>
  < td class="font-medium" > 95.40 </td>
    < td class="text-right" > <button type="button" class="row-arrow" >& rsaquo; </button></td >
      </tr>
      < tr >
      <td>#2 </td>
        < td class="font-medium" > Juan Pérez </td>
          < td > Arquitecto Software </td>
            < td >
            <span class="pill-badge pill-senior" >
              <nv-status variant = "success" > </nv-status>
Senior
  </span>
  </td>
  < td class="font-medium" > 93.12 </td>
    < td class="text-right" > <button type="button" class="row-arrow" >& rsaquo; </button></td >
      </tr>
      < tr >
      <td>#3 </td>
        < td class="font-medium" > María Londoño </td>
          < td > CDE </td>
          < td >
          <span class="pill-badge pill-senior" >
            <nv-status variant = "success" > </nv-status>
Senior
  </span>
  </td>
  < td class="font-medium" > 91.85 </td>
    < td class="text-right" > <button type="button" class="row-arrow" >& rsaquo; </button></td >
      </tr>

      < !--Divisor: Tu Posición-- >
        <tr class="highlight-header" >
          <td colspan="6" >
            <span>TU POSICIÓN </span>
              < span class="float-right" > TOP 12 % </span>
                </td>
                </tr>

                < !--Registro del Usuario Actual-- >
                  <tr class="user-row-active" >
                    <td class="font-bold" >#325 </td>
                      < td class="font-bold" > Luis Gómez(Tú) </td>
                        < td > CDE </td>
                        < td >
                        <span class="pill-badge pill-neutral" >
                          <nv-status variant = "warning" > </nv-status>
                Semi Senior
  </span>
  </td>
  < td class="font-bold" > 79.72 </td>
    < td class="text-right" > <button type="button" class="row-arrow" >& rsaquo; </button></td >
      </tr>

      < tr >
      <td>#326 </td>
        < td class="font-medium" > Carlos Restrepo </td>
          < td > QA Engineer </td>
            < td >
            <span class="pill-badge pill-neutral" >
              <nv-status variant = "warning" > </nv-status>
                Semi Senior
  </span>
  </td>
  < td class="font-medium" > 79.50 </td>
    < td class="text-right" > <button type="button" class="row-arrow" >& rsaquo; </button></td >
      </tr>
      </tbody>
      </table>
      </div>

      < !--Paginador Manual-- >
        <div class="custom-pagination" >
          <span class="pagination-info" > Mostrando 1 - 12 de 328 elementos </span>
            < div class="pagination-nav" >
              <button type="button" class="page-arrow" disabled >& lsaquo; </button>
                < button type = "button" class="page-num active" > 1 </button>
                  < button type = "button" class="page-num" > 2 </button>
                    < button type = "button" class="page-num" > 3 </button>
                      < button type = "button" class="page-arrow" >& rsaquo; </button>
                        </div>
                        </div>
                        </nv-card-container>

                        </div>








$primary-yellow: #fd2;
$text-dark: #2c2a29;
$text-muted: #6c757d;
$border-light: #e9ecef;
$bg-highlight: #fff9e6;

.ranking-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: inherit;
  color: $text-dark;

  // NV Card overrides & setups
  nv-card-container {
    display: block;
    background: #fff;
    border-radius: 8px;
    border: 1px solid $border-light;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  }

  .profile-card {
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    .profile-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;

      .user-avatar img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        object-fit: cover;
      }

      .user-name {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 700;
      }
      .user-email, .user-area {
        margin: 0;
        font-size: 0.85rem;
        color: $text-muted;
      }
    }

    .score-summary {
      display: flex;
      align-items: center;
      gap: 2rem;

      .score-main {
        text-align: right;

        .score-label {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.5px;
          color: $text-muted;
          font-weight: 600;
        }

        .score-value {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.1;
        }

        .score-meta {
          font-size: 0.8rem;
          color: $text-muted;
          .score-top {
            color: #28a745;
            margin-left: 0.5rem;
            font-weight: 600;
          }
        }
      }

      .score-badge-box {
        background: #f8f9fa;
        border: 1px solid $border-light;
        padding: 0.6rem 1rem;
        border-radius: 6px;

        .badge-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .points-ratio {
            font-size: 0.85rem;
            font-weight: 600;
          }
        }

        .level-indicator {
          display: block;
          font-size: 0.75rem;
          color: $text-muted;
          margin-top: 0.25rem;
        }
      }
    }
  }

  // Pestañas
  .custom-tabs {
    display: flex;
    gap: 1rem;
    border-bottom: 1px solid $border-light;
    margin-bottom: 1.5rem;

    .tab-btn {
      background: none;
      border: none;
      padding: 0.75rem 1.25rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      color: $text-muted;
      position: relative;

      &.active {
        color: $text-dark;

        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background: $primary-yellow;
        }
      }
    }
  }

  // Cabecera Controles
  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    .control-title {
      h3 { margin: 0; font-size: 1.05rem; }
      span { font-size: 0.8rem; color: $text-muted; }
    }

    .control-filter {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;

      .select-wrapper {
        position: relative;

        select {
          appearance: none;
          background: #fff;
          border: 1px solid #ced4da;
          padding: 0.4rem 2rem 0.4rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .chevron-icon {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid $text-dark;
          pointer-events: none;
        }
      }
    }
  }

  // Tabla
  .table-card {
    overflow: hidden;

    .ranking-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.85rem;

      th {
        padding: 0.85rem 1.25rem;
        background: #fafafa;
        color: $text-muted;
        font-weight: 600;
        border-bottom: 1px solid $border-light;
      }

      td {
        padding: 0.85rem 1.25rem;
        border-bottom: 1px solid #f1f3f5;
      }

      .highlight-header td {
        background: #fdfae7;
        font-size: 0.75rem;
        font-weight: 700;
        color: $text-dark;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }

      .user-row-active td {
        background: $bg-highlight;
        border-bottom: 1px solid #f3e5b5;
      }

      .row-arrow {
        background: none;
        border: none;
        font-size: 1.25rem;
        color: #adb5bd;
        cursor: pointer;
        &:hover { color: $text-dark; }
      }
    }
  }

  // Paginación
  .custom-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-top: 1px solid $border-light;
    font-size: 0.8rem;
    color: $text-muted;

    .pagination-nav {
      display: flex;
      gap: 0.25rem;

      button {
        min-width: 28px;
        height: 28px;
        padding: 0 0.4rem;
        border: 1px solid transparent;
        background: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;

        &.active {
          border-color: #ced4da;
          background: #fff;
          font-weight: 700;
          color: $text-dark;
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }
      }
    }
  }

  // Badges con nv-status
  .pill-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;

    &.pill-senior {
      background: #eef2ff;
      color: #3b5998;
    }

    &.pill-neutral {
      background: #e9ecef;
      color: $text-dark;
    }
  }

  // Clases utilitarias
  .font-bold { font-weight: 700; }
  .font-medium { font-weight: 500; }
  .text-right { text-align: right; }
  .float-right { float: right; }
}



