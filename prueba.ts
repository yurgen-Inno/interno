.bottom-card-container {
  position: relative;
  display: block;
  width: 100%;

  cb-card-content {
    display: block;
    width: 100%;
  }

  .thresholds-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    z-index: 2;

    /* En pantallas de escritorio / pantallas grandes: flotan dentro de la tarjeta */
    @media (min-width: 992px) {
      position: absolute;
      left: 64px;
      bottom: 14px;
      padding-right: 24px;
      pointer-events: none;
    }

    /* En tablets y móviles (cuando el texto ocupa más líneas o no cabe en una fila) */
    @media (max-width: 991px) {
      position: static;
      margin-top: 10px;
      padding-left: 16px;
      padding-bottom: 8px;
    }

    .threshold-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;

      &.badge-success {
        background-color: #e8f5e9;
        color: #1b5e20;
        border: 1px solid #c8e6c9;
      }

      &.badge-warning {
        background-color: #fff9c4;
        color: #827717;
        border: 1px solid #fff59d;
      }

      &.badge-danger {
        background-color: #ffebee;
        color: #c62828;
        border: 1px solid #ffcdd2;
      }

      &.badge-neutral {
        background-color: #f5f5f5;
        color: #616161;
        border: 1px solid #e0e0e0;
      }
    }
  }
}