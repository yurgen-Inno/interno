.table-content {
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 16px;
  margin-top: 24px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #2b2b2b;

  .header {
    margin-bottom: 20px;

    .title-row {
      display: flex;
      align-items: center;
      gap: 8px;

      .icon {
        font-size: 16px;
        color: #616161;
      }

      h3 {
        font-size: 15px;
        font-weight: 700;
        margin: 0;
        color: #212529;
      }
    }

    .subtitle {
      font-size: 12px;
      color: #757575;
      margin: 4px 0 0 0;
    }
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .item {
      display: flex;
      flex-direction: column;

      .info-row {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 13px;
        margin-bottom: 4px;

        .name {
          font-weight: 500;
          min-width: 140px;
          color: #333333;
        }

        .value {
          font-weight: 600;
          color: #424242;
          min-width: 55px;
        }

        .badge {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 10px;
          border-radius: 12px;

          &.badge-green {
            background-color: #e8f5e9;
            color: #1b5e20;
            border: 1px solid #c8e6c9;
          }

          &.badge-yellow {
            background-color: #fff9c4;
            color: #827717;
            border: 1px solid #fff59d;
          }

          &.badge-gray {
            background-color: #f5f5f5;
            color: #616161;
            border: 1px solid #e0e0e0;
          }
        }
      }

      .bar-container {
        height: 6px;
        width: 100%;
      }
    }
  }
}



<div class="table-content">
  <div class="header">
    <div class="title-row">
      <span class="icon">☺</span>
      <h3>Comparativa de pilares - Medición al 30 sep 2026</h3>
    </div>
    <p class="subtitle">
      Porcentaje de cumplimiento por pilar. El color del estado indica el nivel alcanzado según el valor objetivo.
    </p>
  </div>

  <div class="list">
    <div class="item" *ngFor="let item of items">
      <div class="info-row">
        <span class="name">{{ item.nombre }}</span>
        <span class="value">{{ item.valor !== null ? item.valor + ' %' : 'Sin dato' }}</span>
        <span class="badge" [ngClass]="getBadgeClass(item.estado)">{{ item.estado }}</span>
      </div>

      <div class="bar-container">
        <canvas
          baseChart
          [data]="getChartData(item)"
          [options]="barOptions"
          [type]="chartType">
        </canvas>
      </div>
    </div>
  </div>
</div>