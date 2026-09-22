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
  templateUrl: './ranking.html',
  styleUrls: ['./ranking.scss']
})
export class RankingComponent {
  // Datos del perfil superior
  currentUser = signal({
    name: 'Luis García',
    email: 'lgarcia@empresa.com.co',
    role: 'CDE',
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