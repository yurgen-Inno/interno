import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

interface PilarItem {
  nombre: string;
  valor: number | null;
  estado: 'Excelente' | 'Bueno' | 'Regular' | 'En desarrollo';
  color: string;
}

@Component({
  selector: 'app-pilares-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './pilares-chart.component.html',
  styleUrls: ['./pilares-chart.component.scss']
})
export class PilaresChartComponent {
  public chartType: ChartType = 'bar';

  items: PilarItem[] = [
    { nombre: 'Pilar 1', valor: 79, estado: 'Bueno', color: '#00c389' },
    { nombre: 'Pilar 2', valor: 81, estado: 'Excelente', color: '#00c389' },
    { nombre: 'Pilar 3', valor: 79, estado: 'Bueno', color: '#00c389' },
    { nombre: 'Pilar 4', valor: 47, estado: 'Regular', color: '#f59e0b' },
    { nombre: 'Pilar 5', valor: 46, estado: 'Regular', color: '#f59e0b' },
    { nombre: 'Pilar 6', valor: null, estado: 'En desarrollo', color: '#9ca3af' },
  ];

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

  getChartData(item: PilarItem): ChartData<'bar'> {
    const progreso = item.valor ?? 0;
    const fondo = 100 - progreso;

    return {
      labels: [''],
      datasets: [
        {
          data: [progreso],
          backgroundColor: item.color,
          barThickness: 5,
          borderRadius: 3,
          stack: 'bar'
        },
        {
          data: [fondo],
          backgroundColor: '#262930', // Gris oscuro de fondo de la barra
          barThickness: 5,
          borderRadius: 3,
          stack: 'bar'
        }
      ]
    };
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Excelente':
      case 'Bueno':
        return 'badge-green';
      case 'Regular':
        return 'badge-yellow';
      default:
        return 'badge-gray';
    }
  }
}












<div class="card">
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








.card {
  background-color: #f7f9fb;
  border-radius: 8px;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #212529;

  .header {
    margin-bottom: 20px;

    .title-row {
      display: flex;
      align-items: center;
      gap: 8px;

      .icon {
        font-size: 16px;
      }

      h3 {
        font-size: 15px;
        font-weight: 700;
        margin: 0;
      }
    }

    .subtitle {
      font-size: 12px;
      color: #6c757d;
      margin: 4px 0 0 0;
    }
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 14px;

    .item {
      display: flex;
      flex-direction: column;

      .info-row {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12.5px;
        margin-bottom: 4px;

        .name {
          font-weight: 500;
          min-width: 140px;
          color: #374151;
        }

        .value {
          font-weight: 600;
          color: #4b5563;
          min-width: 55px;
        }

        .badge {
          font-size: 11px;
          font-weight: 500;
          padding: 1px 10px;
          border-radius: 12px;

          &.badge-green {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
          }

          &.badge-yellow {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
          }

          &.badge-gray {
            background-color: #e5e7eb;
            color: #374151;
            border: 1px solid #d1d5db;
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