:host {
  display: block;
  width: 100%;
}

.cards-layout {
  display: flex;
  flex-direction: column;
  width: 100%;

  .card-row {
    display: flex;
    width: 100%;

    cb-card-content {
      display: block;
      width: 100%;
    }

    // Estilos para la card superior con fondo azul
    &--top {
      cb-card-content {
        // Variables CSS de Bancolombia Design System para penetrar Shadow DOM
        --bc-card-background-color: #002f6c;
        --bc-card-bg: #002f6c;
        --card-background: #002f6c;
        --background-color: #002f6c;

        // Variables para títulos y textos en blanco/claro
        --bc-card-title-color: #ffffff;
        --bc-card-subtitle-color: #e2e8f0;
        --bc-card-text-color: #cbd5e1;
        --bc-icon-color: #ffffff;

        // Sobrescritura en caso de renderizado en DOM regular
        ::ng-deep {
          .bc-card-content,
          .bc-card-container,
          .card-content-wrapper {
            background-color: #002f6c !important;
            border-color: #002452 !important;

            h1, h2, h3, h4, h5, h6,
            .bc-card-title,
            .card-title {
              color: #ffffff !important;
            }

            p, span,
            .bc-card-subtitle,
            .card-description {
              color: #e2e8f0 !important;
            }

            bc-icon, cb-icon, svg {
              fill: #ffffff !important;
              color: #ffffff !important;
            }
          }
        }
      }
    }
  }

  // Grid central preservando tus estilos exactos
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    width: 100%;
    margin-top: 16px;
    margin-bottom: 24px;

    &__item {
      position: relative;
      display: flex;
      width: 100%;
      background-color: #ffffff;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        cursor: pointer;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background-color: #59cbe8;
        z-index: 2;
      }

      cb-card-primary {
        width: 100%;
        background: transparent;
        border: none;
      }
    }
  }
}


<div class="card-row card-row--top">
  <cb-card-content [dataConfiguration]="$topCardConfiguration()" />
</div>