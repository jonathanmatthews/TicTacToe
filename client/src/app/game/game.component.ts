import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameClient } from '../services/game-api.service';
import { GameService } from '../services/game/game.service';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {
  public gameIdInput: string;
  public playerNameInput = '';
  public statusMessage = new BehaviorSubject<string>('');
  public reloadLeaderboard = new Subject<void>();

  constructor(public game: GameService) { }
  ngOnInit(): void {
    // The order of these matters.
    this.game.error.subscribe(err => alert(err));
    this.game.gameId.subscribe(id => {
      if (id === '') {
      this.statusMessage.next('');
      }
    });
    this.game.victory.subscribe(win => {
      this.statusMessage.next(win ? 'You win!' : 'You Lose!');
      if (this.playerNameInput !== '') {
        this.game.submitScore(this.playerNameInput);
        setTimeout(() => this.reloadLeaderboard.next(), 1000);
      }
    });
    this.game.myTurn.subscribe(myTurn => this.statusMessage.next(myTurn ? 'Your Turn' : 'Waiting for Opponent'));
    this.game.draw.subscribe(draw => {
      if (draw) {
        this.statusMessage.next('It\'s a draw!');
        if (this.playerNameInput !== '') {
          this.game.submitScore(this.playerNameInput);
          setTimeout(() => this.reloadLeaderboard.next(), 1000);
        }
      }
    });
  }

  createGame(): void {
    this.game.createGame();
  }

  joinGame(): void {
    this.game.joinGame(this.gameIdInput);
  }

  move(position: number[]): void {
    this.game.makeMove(position[0], position[1]);
  }

  disconnect() {
    this.gameIdInput = '';
    this.game.leaveGame();
  }
}
