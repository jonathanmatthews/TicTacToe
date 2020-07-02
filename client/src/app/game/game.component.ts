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
  ngOnInit(): void {
    this.game.game.subscribe(val => {
      if (val) {
        console.log(`${val[0][0]} ${val[0][1]} ${val[0][2]}`);
        console.log(`${val[1][0]} ${val[1][1]} ${val[1][2]}`);
        console.log(`${val[2][0]} ${val[2][1]} ${val[2][2]}`);
        console.log('\n');
      }
    });
  }

  createGame(): void {
    this.game.createGame();
  }

  joinGame(): void {
    this.game.joinGame(this.gameIdInput);
  }
}
