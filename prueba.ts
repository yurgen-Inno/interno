<app-dashboard-bars [data]="$overviewData()?.pillarComparison" />



import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

// Usando los mismos tipos definidos en tu archivo de interfaces
export type ScoreStatus = 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'BAD' | 'CRITICAL' | 'IN_DEVELOPMENT';

export interface PillarComparisonItem {
  id: string;
  name: string;
  percentage: number | null;
  status: ScoreStatus;
  statusLabel: string;
}

export interface PillarComparisonData {
  cutoffDate?: string;
  items?: PillarComparisonItem[];
}

@Component({
  selector: 'app-dashboard-bars',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard-bars.component.html',
  styleUrls: ['./dashboard-bars.component.scss']
})
export class DashboardBarsComponent {
  // Input Signal de Angular (o @Input() data: PillarComparisonData | undefined)
  data = input<PillarComparisonData | undefined>();

  public chartType: ChartType = 'bar';

  public barOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        stacked: true,
        display: false,
        min: 0,
        max: 100
      },
      y: {
        stacked: true,
        display: false
      }
    }
  };

  getChartData(item: PillarComparisonItem): ChartData<'bar'> {
    const progreso = item.percentage ?? 0;
    const fondo = 100 - progreso;

    return {
      labels: [''],
      datasets: [
        {
          data: [progreso],
          backgroundColor: this.getBarColor(item.status),
          barThickness: 5,
          borderRadius: 3,
          stack: 'bar'
        },
        {
          data: [fondo],
          backgroundColor: '#262930', // Fondo oscuro de la barra
          barThickness: 5,
          borderRadius: 3,
          stack: 'bar'
        }
      ]
    };
  }

  getBarColor(status: ScoreStatus): string {
    switch (status) {
      case 'EXCELLENT':
      case 'GOOD':
        return '#00c389';
      case 'REGULAR':
        return '#f59e0b';
      case 'BAD':
      case 'CRITICAL':
        return '#ef4444';
      case 'IN_DEVELOPMENT':
      default:
        return '#9ca3af';
    }
  }

  getBadgeClass(status: ScoreStatus): string {
    switch (status) {
      case 'EXCELLENT':
      case 'GOOD':
        return 'badge-green';
      case 'REGULAR':
        return 'badge-yellow';
      case 'BAD':
      case 'CRITICAL':
        return 'badge-red';
      case 'IN_DEVELOPMENT':
      default:
        return 'badge-gray';
    }
  }
}



<div class="table-content" *ngIf="data() as comparison">
  <div class="header">
    <div class="title-row">
      <span class="icon">☺</span>
      <h3>
        Comparativa de pilares
        <ng-container *ngIf="comparison.cutoffDate">
          - Medición al {{ comparison.cutoffDate | date: "d MMM y" }}
        </ng-container>
      </h3>
    </div>
    <p class="subtitle">
      Porcentaje de cumplimiento por pilar. El color del estado indica el nivel alcanzado según el valor objetivo.
    </p>
  </div>

  <div class="list">
    <div class="item" *ngFor="let item of comparison.items">
      <div class="info-row">
        <span class="name">{{ item.name }}</span>
        <span class="value">{{ item.percentage !== null ? item.percentage + ' %' : 'Sin dato' }}</span>
        <span class="badge" [ngClass]="getBadgeClass(item.status)">{{ item.statusLabel }}</span>
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
          min-width: 60px;
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

          &.badge-red {
            background-color: #ffebee;
            color: #c62828;
            border: 1px solid #ffcdd2;
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

