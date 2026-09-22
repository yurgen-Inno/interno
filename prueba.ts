<header class="table-custom-header">
  <!-- Izquierda: Título y subtítulo -->
  <div class="header-texts">
    <h2 class="title">Ranking</h2>
    <p class="subtitle">Compara tu posición con otros miembros del equipo</p>
  </div>

  <!-- Derecha: Rol (Badge) + Botón Flecha -->
  <div class="header-actions">
    <!-- Badge de rol (puedes pasarle el rol dinámico o estático) -->
    <span class="role-badge" [attr.data-role]="userRole">
      {{ userRole }}
    </span>

    <button type="button" class="btn-arrow" aria-label="Ver más">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  </div>
</header>


$text-title: #111827;
$text-sub: #6b7280;
$border-color: #e5e7eb;

.table-custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  border-bottom: 1px solid $border-color;

  .header-texts {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: $text-title;
      line-height: 1.2;
    }

    .subtitle {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 400;
      color: $text-sub;
      line-height: 1.4;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem; // Espacio entre el badge del rol y la flecha

    .btn-arrow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      background: transparent;
      border: none;
      border-radius: 50%;
      color: $text-sub;
      cursor: pointer;
      transition: background-color 0.15s ease, color 0.15s ease;

      &:hover {
        background-color: #f3f4f6;
        color: $text-title;
      }

      svg {
        display: block;
      }
    }
  }
}

/* Estilos de los roles con los tonos definidos previamente */
.role-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  border-radius: 9999px;
  border: 1px solid currentColor;
  text-transform: capitalize;

  // Senior -> Verde
  &[data-role="senior"],
  &[data-role="Senior"] {
    background-color: #ecfdf5;
    color: #047857;
    border-color: #a7f3d0;
  }

  // Semi-Senior -> Naranja
  &[data-role="semi-senior"],
  &[data-role="Semi-Senior"],
  &[data-role="semisenior"] {
    background-color: #fff7ed;
    color: #c2410c;
    border-color: #fed7aa;
  }

  // Junior -> Azul
  &[data-role="junior"],
  &[data-role="Junior"] {
    background-color: #eff6ff;
    color: #1d4ed8;
    border-color: #bfdbfe;
  }

  // Por defecto / Otros -> Gris
  &[data-role="neutral"],
  &:not([data-role]) {
    background-color: #f3f4f6;
    color: #4b5563;
    border-color: #e5e7eb;
  }
}


items = [
  { title: 'Design System', subtitle: 'Typography & color tokens', tagLabel: 'Design', tagType: 'design' }, //[cite: 2]
  { title: 'User Research', subtitle: 'Interview findings & insights', tagLabel: 'Research', tagType: 'research' }, //[cite: 2]
  { title: 'Prototype', subtitle: 'Interactive flow mockups', tagLabel: 'UX', tagType: 'ux' }, //[cite: 2]
  { title: 'Component Library', subtitle: 'Reusable UI elements', tagLabel: 'Dev', tagType: 'dev' }, //[cite: 2]
  { title: 'Brand Guidelines', subtitle: 'Logo, voice & visual identity', tagLabel: 'Brand', tagType: 'brand' } //[cite: 2]
];