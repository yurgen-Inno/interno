import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AuthorRanking {
  position: number;
  previousPosition?: number;
  name: string;
  level: string;
  filial: string;
  score: number;
  metricOfInterest: number;
  trend: 'up' | 'down' | 'equal';
}

@Component({
  selector: 'app-ranking',
  imports: [CommonModule],
  templateUrl: './ranking.html',
  styleUrl: './ranking.scss',
})
export class Ranking {
  activeTab: 'perfil' | 'ranking' = 'ranking';

  authors: AuthorRanking[] = [
    { position: 1, name: 'Karen González', level: 'Senior', filial: 'CDE INGENIERIA DE TI DEV', score: 96.8, metricOfInterest: 96.8, trend: 'up', previousPosition: 2 },
    { position: 2, name: 'Armando Pérez', level: 'Semi-Senior', filial: 'CDE INGENIERIA DE TI DEV', score: 94.5, metricOfInterest: 94.5, trend: 'up', previousPosition: 4 },
    { position: 3, name: 'Flavio López', level: 'Senior', filial: 'CDE INGENIERIA DE TI DEV', score: 93.2, metricOfInterest: 93.2, trend: 'equal', previousPosition: 3 },
    { position: 4, name: 'Elena Martínez', level: 'Senior', filial: 'CDE INGENIERIA DE TI DEV', score: 91.0, metricOfInterest: 91.0, trend: 'down', previousPosition: 1 },
    { position: 5, name: 'Juan Castro', level: 'Semi-Senior', filial: 'seniority_scoring', score: 88.7, metricOfInterest: 88.7, trend: 'up', previousPosition: 7 },
    { position: 6, name: 'Alejandra Ramírez', level: 'Senior', filial: 'seniority_scoring', score: 87.4, metricOfInterest: 87.4, trend: 'equal', previousPosition: 6 },
    { position: 7, name: 'Diego Suárez', level: 'Semi-Senior', filial: 'seniority_scoring', score: 85.9, metricOfInterest: 85.9, trend: 'down', previousPosition: 5 },
    { position: 8, name: 'Lina Torres', level: 'Senior', filial: 'seniority_scoring', score: 84.1, metricOfInterest: 84.1, trend: 'up', previousPosition: 10 },
    { position: 9, name: 'Byron Jiménez', level: 'Semi-Senior', filial: 'seniority_scoring', score: 82.3, metricOfInterest: 82.3, trend: 'equal', previousPosition: 9 },
    { position: 10, name: 'Carlos Mendoza', level: 'Senior', filial: 'seniority_scoring', score: 80.6, metricOfInterest: 80.6, trend: 'down', previousPosition: 8 },
    { position: 11, name: 'Wilson Arias', level: 'datos insuficientes proyecto', filial: 'seniority_scoring', score: 79.6, metricOfInterest: 79.6, trend: 'down', previousPosition: 316 },
    { position: 12, name: 'Fabiola Gómez', level: 'Semi-Senior', filial: 'seniority_scoring', score: 78.4, metricOfInterest: 78.4, trend: 'up', previousPosition: 14 },
    { position: 13, name: 'David Palacios', level: 'Semi-Senior', filial: 'seniority_scoring', score: 76.9, metricOfInterest: 76.9, trend: 'equal', previousPosition: 13 },
    { position: 14, name: 'Gabriel Ortiz', level: 'Senior', filial: 'seniority_scoring', score: 75.2, metricOfInterest: 75.2, trend: 'up', previousPosition: 16 },
    { position: 15, name: 'Jessica Espinal', level: 'Semi-Senior', filial: 'seniority_scoring', score: 73.8, metricOfInterest: 73.8, trend: 'down', previousPosition: 12 },
  ];
}

export default Ranking;





