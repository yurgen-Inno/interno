import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface UserRank {
  position: number;
  name: string;
  role: string;
  level: 'Senior' | 'Semi Senior' | 'Junior';
  score: number;
  isCurrentUser?: boolean;
}

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent {
  // Datos del perfil superior
  currentUser = signal({
    name: 'Luis García',
    email: 'lgarcia@empresa.com.co',
    company: 'Digital / Fábrica de software',
    avatar: 'https://i.pravatar.cc/150?img=11',
    score: 79.72,
    maxScore: 100,
    rank: 325,
    topPercent: 12,
    level: 'Semi Senior',
    currentLevelStep: 3,
    totalLevelSteps: 5
  });

  // Filtro
  selectedLevel = signal<string>('all');

  // Listado general del ranking
  rankings = signal<UserRank[]>([
    { position: 1, name: 'Carolina Mendez', role: 'Tech Lead', level: 'Senior', score: 95.40 },
    { position: 2, name: 'Andrés Gómez', role: 'Arquitecto Software', level: 'Senior', score: 93.12 },
    { position: 3, name: 'María Londoño', role: 'CDE', level: 'Senior', score: 91.85 },
    { position: 4, name: 'Pedro Morales', role: 'Product Manager', level: 'Senior', score: 89.60 },
    { position: 5, name: 'Laura Restrepo', role: 'QA Lead', level: 'Senior', score: 88.20 },
    { position: 6, name: 'Santiago Ruiz', role: 'UX Designer', level: 'Senior', score: 86.40 },
    { position: 7, name: 'Felipe Vargas', role: 'DevOps Engineer', level: 'Senior', score: 84.90 },
    { position: 8, name: 'Daniela Marín', role: 'Data Analyst', level: 'Senior', score: 83.15 },
    { position: 9, name: 'Camilo Torres', role: 'CDE', level: 'Senior', score: 81.80 },
    { position: 10, name: 'Juan Castrillón', role: 'QA Engineer', level: 'Senior', score: 80.40 }
  ]);

  // Contexto del usuario logueado en la tabla
  userContextRankings = signal<UserRank[]>([
    { position: 325, name: 'Luis García', role: 'CDE', level: 'Semi Senior', score: 79.72, isCurrentUser: true },
    { position: 326, name: 'Marta Pérez', role: 'QA Engineer', level: 'Semi Senior', score: 79.50 },
    { position: 327, name: 'Carlos Ortega', role: 'Desarrollador', level: 'Semi Senior', score: 78.90 },
    { position: 328, name: 'Sofía Castro', role: 'Analista', level: 'Junior', score: 75.20 }
  ]);

  // Rankings filtrados
  filteredRankings = computed(() => {
    const filter = this.selectedLevel();
    if (filter === 'all') return this.rankings();
    return this.rankings().filter(item => item.level.toLowerCase() === filter.toLowerCase());
  });

  onFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedLevel.set(select.value);
  }
}










<div class="ranking-wrapper">
  <!-- Cabecera principal -->
  <header class="page-header">
    <div class="header-titles">
      <h1>Tu Ranking</h1>
      <p>Consulta tu posición y el listado general en tiempo real</p>
    </div>
  </header>

  <!-- Tarjeta de Perfil / Scorecard -->
  <section class="user-card">
    <div class="profile-info">
      <img [src]="currentUser().avatar" alt="Avatar" class="avatar" />
      <div class="info-text">
        <h2 class="name">{{ currentUser().name }}</h2>
        <span class="email">{{ currentUser().email }}</span>
        <span class="meta">{{ currentUser().company }}</span>
      </div>
    </div>

    <div class="profile-metrics">
      <div class="score-block">
        <span class="label">PUNTAJE GLOBAL</span>
        <div class="score-row">
          <span class="primary-score">{{ currentUser().score | number:'1.2-2' }}</span>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="(currentUser().score / currentUser().maxScore) * 100"></div>
            </div>
            <div class="progress-labels">
              <span>{{ currentUser().score }} / {{ currentUser().maxScore }}</span>
              <span>{{ currentUser().level }}</span>
            </div>
          </div>
        </div>
        <div class="rank-subtext">
          <span>Ranking <strong>#{{ currentUser().rank }}</strong></span>
          <span class="badge-top">Top {{ currentUser().topPercent }}%</span>
          <span class="steps">Nivel {{ currentUser().currentLevelStep }} de {{ currentUser().totalLevelSteps }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Pestañas de navegación -->
  <nav class="sub-nav">
    <button class="nav-tab active">Ranking</button>
  </nav>

  <!-- Contenedor del Listado y Filtros -->
  <section class="table-container">
    <div class="table-toolbar">
      <div class="toolbar-title">
        <h3>Ranking General</h3>
        <span class="company-tag">{{ currentUser().company }}</span>
      </div>

      <div class="toolbar-actions">
        <label for="levelFilter">Filtrar por:</label>
        <select id="levelFilter" (change)="onFilterChange($event)">
          <option value="all">Todos los niveles</option>
          <option value="senior">Senior</option>
          <option value="semi senior">Semi Senior</option>
          <option value="junior">Junior</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-responsive">
      <table class="ranking-table">
        <thead>
          <tr>
            <th class="col-pos">Posición</th>
            <th class="col-name">Nombre</th>
            <th class="col-role">Rol</th>
            <th class="col-level">Nivel</th>
            <th class="col-score">Puntaje</th>
            <th class="col-action">Acción</th>
          </tr>
        </thead>
        <tbody>
          <!-- Filas de top ranking -->
          @for (item of filteredRankings(); track item.position) {
            <tr>
              <td class="col-pos">#{{ item.position }}</td>
              <td class="col-name font-medium">{{ item.name }}</td>
              <td class="col-role text-muted">{{ item.role }}</td>
              <td class="col-level">
                <span class="pill-badge" [attr.data-level]="item.level">{{ item.level }}</span>
              </td>
              <td class="col-score font-medium">{{ item.score | number:'1.2-2' }}</td>
              <td class="col-action">
                <button class="btn-arrow" aria-label="Ver detalles">&rsaquo;</button>
              </td>
            </tr>
          }

          <!-- Separador: TU POSICIÓN -->
          <tr class="separator-row">
            <td colspan="6">
              <div class="separator-content">
                <span>TU POSICIÓN</span>
                <span class="top-tag">TOP {{ currentUser().topPercent }}%</span>
              </div>
            </td>
          </tr>

          <!-- Filas relativas a la posición del usuario -->
          @for (item of userContextRankings(); track item.position) {
            <tr [class.highlighted]="item.isCurrentUser">
              <td class="col-pos">#{{ item.position }}</td>
              <td class="col-name font-medium">{{ item.name }}</td>
              <td class="col-role text-muted">{{ item.role }}</td>
              <td class="col-level">
                <span class="pill-badge" [attr.data-level]="item.level">{{ item.level }}</span>
              </td>
              <td class="col-score font-medium">{{ item.score | number:'1.2-2' }}</td>
              <td class="col-action">
                <button class="btn-arrow" aria-label="Ver detalles">&rsaquo;</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <footer class="table-footer">
      <span class="counter-text">Mostrando 1-14 de 328 elementos</span>
      <div class="pagination">
        <button class="page-btn" aria-label="Anterior">&lsaquo;</button>
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
        <button class="page-btn" aria-label="Siguiente">&rsaquo;</button>
      </div>
    </footer>
  </section>
</div>


$bg-main: #f9fafb;
$card-bg: #ffffff;
$accent-yellow: #f8c232;
$accent-soft-yellow: #fef9e7;
$border-color: #ebecef;
$text-main: #23272f;
$text-muted: #737b8b;
$pill-bg-green: #e6f7f2;
$pill-text-green: #0a8f69;
$pill-bg-yellow: #fef6e7;
$pill-text-yellow: #b27300;
$pill-bg-blue: #eef4ff;
$pill-text-blue: #3563e9;

.ranking-wrapper {
  background-color: $bg-main;
  min-height: 100vh;
  padding: 2.5rem 3rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: $text-main;
}

// Cabecera superior
.page-header {
  margin-bottom: 2rem;
  .header-titles {
    h1 {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0;
      color: $text-main;
    }
    p {
      color: $text-muted;
      margin-top: 0.25rem;
      font-size: 0.9rem;
    }
  }
}

// Tarjeta de perfil
.user-card {
  background: $card-bg;
  border-radius: 12px;
  border: 1px solid $border-color;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);

  .profile-info {
    display: flex;
    align-items: center;
    gap: 1.25rem;

    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      object-fit: cover;
    }

    .info-text {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;

      .name {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
      }
      .email, .meta {
        font-size: 0.85rem;
        color: $text-muted;
      }
    }
  }

  .profile-metrics {
    .score-block {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;

      .label {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        color: $text-muted;
      }

      .score-row {
        display: flex;
        align-items: center;
        gap: 1.5rem;

        .primary-score {
          font-size: 2.2rem;
          font-weight: 800;
        }

        .progress-container {
          width: 170px;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;

          .progress-bar {
            height: 10px;
            background: #edeef2;
            border-radius: 999px;
            overflow: hidden;

            .progress-fill {
              background: $accent-yellow;
              height: 100%;
              border-radius: 999px;
            }
          }

          .progress-labels {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: $text-muted;
          }
        }
      }

      .rank-subtext {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.8rem;
        color: $text-muted;

        strong {
          color: $text-main;
        }

        .badge-top {
          background-color: #f1f3f5;
          padding: 2px 6px;
          border-radius: 4px;
        }
      }
    }
  }
}

// Navegación de pestañas
.sub-nav {
  margin-top: 2rem;
  border-bottom: 2px solid $border-color;
  display: flex;

  .nav-tab {
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    color: $text-muted;
    position: relative;
    top: 2px;

    &.active {
      color: $text-main;
      border: 1px solid $border-color;
      border-bottom: 2px solid $accent-yellow;
      background: $card-bg;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
}

// Tabla contenedora
.table-container {
  background: $card-bg;
  border: 1px solid $border-color;
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 1.5rem;

  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    .toolbar-title {
      h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
      }
      .company-tag {
        font-size: 0.85rem;
        color: $text-muted;
      }
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: $text-muted;

      select {
        border: 1px solid $border-color;
        border-radius: 6px;
        padding: 0.35rem 0.75rem;
        outline: none;
        background: $card-bg;
        font-size: 0.85rem;
        color: $text-main;
      }
    }
  }
}

.table-responsive {
  overflow-x: auto;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th {
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    border-bottom: 1px solid $border-color;
  }

  td {
    padding: 1rem;
    font-size: 0.9rem;
    border-bottom: 1px solid #f2f3f5;
  }

  .font-medium {
    font-weight: 600;
  }

  .text-muted {
    color: $text-muted;
  }

  .col-action {
    text-align: right;
  }

  .btn-arrow {
    background: transparent;
    border: none;
    font-size: 1.25rem;
    color: $text-muted;
    cursor: pointer;
    line-height: 1;
    &:hover {
      color: $text-main;
    }
  }

  // Badges por nivel
  .pill-badge {
    padding: 0.3rem 0.85rem;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 500;
    display: inline-block;

    &[data-level='Senior'] {
      background-color: $pill-bg-green;
      color: $pill-text-green;
    }
    &[data-level='Semi Senior'] {
      background-color: $pill-bg-yellow;
      color: $pill-text-yellow;
    }
    &[data-level='Junior'] {
      background-color: $pill-bg-blue;
      color: $pill-text-blue;
    }
  }

  // Fila divisoria: "TU POSICIÓN"
  .separator-row td {
    background: #fbfbfc;
    padding: 0.6rem 1rem;
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;

    .separator-content {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      font-weight: 700;
      color: $text-muted;

      .top-tag {
        color: $text-main;
      }
    }
  }

  // Fila destacada del usuario actual
  tr.highlighted td {
    background-color: $accent-soft-yellow;
    font-weight: 600;
  }
}

// Paginador
.table-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: $text-muted;

  .pagination {
    display: flex;
    gap: 0.35rem;

    .page-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid transparent;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.85rem;
      color: $text-muted;
      transition: all 0.2s ease;

      &.active {
        border-color: $accent-yellow;
        background: $accent-soft-yellow;
        color: $text-main;
        font-weight: 600;
      }

      &:hover:not(.active) {
        background-color: #f1f3f5;
      }
    }
  }
}

