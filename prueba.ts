.bottom-card-container {
  position: relative;
  display: block;
  width: 100%;

  cb-card-content {
    display: block;
    width: 100%;
  }

  .thresholds-row {
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 2;
    pointer-events: none; // Permite clicks a través si fuera necesario

    .threshold-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 16px;
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