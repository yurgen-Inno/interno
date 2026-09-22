import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RankingComponent } from './ranking/ranking';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RankingComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'angular-app';
}

