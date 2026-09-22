<div class="card-list">
  <div class="card-item" *ngFor="let item of items">
    <div class="card-info">
      <span class="card-title">{{ item.title }}</span>
      <span class="card-subtitle">{{ item.subtitle }}</span>
    </div>

    <div class="card-actions">
      <span class="badge" [attr.data-tag]="item.tagType">
        {{ item.tagLabel }}
      </span>

      <!-- Icono de 6 puntos (drag handle) en SVG nativo -->
      <button type="button" class="drag-handle" aria-label="Reordenar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <circle cx="8" cy="6" r="1.5" />
          <circle cx="16" cy="6" r="1.5" />
          <circle cx="8" cy="12" r="1.5" />
          <circle cx="16" cy="12" r="1.5" />
          <circle cx="8" cy="18" r="1.5" />
          <circle cx="16" cy="18" r="1.5" />
        </svg>
      </button>
    </div>
  </div>
</div>


$text-title: #2d3748;
$text-sub: #718096;
$border-card: #e2e8f0;
$bg-card: #ffffff;
$bg-hover: #f8fafc;

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Espacio entre cada tarjeta */
  width: 100%;
}

.card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background-color: $bg-card;
  border: 1px solid $border-card;
  border-radius: 0.75rem; /* Bordes suaves */
  transition: background-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background-color: $bg-hover;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .card-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    .card-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: $text-title;
      line-height: 1.25;
    }

    .card-subtitle {
      font-size: 0.8125rem;
      font-weight: 400;
      color: $text-sub;
      line-height: 1.25;
    }
  }

  .card-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}

/* Badges con tonos pastel */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;

  &[data-tag="design"] {
    background-color: #e0e7ff;
    color: #4338ca;
  }

  &[data-tag="research"] {
    background-color: #e0f2fe;
    color: #0369a1;
  }

  &[data-tag="ux"] {
    background-color: #f1f5f9;
    color: #475569;
  }

  &[data-tag="dev"] {
    background-color: #fef3c7;
    color: #b45309;
  }

  &[data-tag="brand"] {
    background-color: #fce7f3;
    color: #be185d;
  }
}

/* Botón de arrastre */
.drag-handle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0.25rem;
  color: #94a3b8;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    color: #475569;
  }
}