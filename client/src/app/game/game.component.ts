import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameClient } from '../services/game-api.service';
import { GameService } from '../services/game/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {
  public gameIdInput: string;

  constructor(public game: GameService) { }
  ngOnInit(): void { }

  createGame(): void {
    console.log("try to start");
    this.game.createGame();
  }

  joinGame(): void {
    this.game.joinGame(this.gameIdInput);
  }
}
