import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameClient } from '../services/game-api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {

  constructor(private api: GameClient) { }

  ngOnInit(): void {
    this.api.startGame().subscribe(result => console.log(result));
  }
}
