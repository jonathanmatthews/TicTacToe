import { Injectable } from '@angular/core';
import { SignalrService } from '../signalr/signalr.service';
import { GameClient } from '../game-api.service';
import { GameBoard } from 'src/app/server-models/gameBoard';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public inGame = new BehaviorSubject(false);
  // Means that game is in play, service may still be connected to a
  // game that hasn't started yet or that has finished if false.

  public playerNumber: number;
  public myTurn = new BehaviorSubject<boolean>(false);
  public victory = new BehaviorSubject<boolean>(false);
  public draw = new BehaviorSubject<boolean>(false);
  public game = new BehaviorSubject<GameBoard>(new GameBoard());
  public error = new  Subject<string>();
  public gameId = new BehaviorSubject<string>('');

  private validMove = new Subject<boolean>();

  constructor(private api: GameClient, private signalr: SignalrService) {
    this.registerErrorMessages();
    this.registerGameEvents();
  }

  createGame(): void {
    this.api.startGame().subscribe(gameId => {
      this.gameId.next(gameId);
      this.signalr.connectToGame(gameId);
      this.myTurn.next(false);
    });
  }

  joinGame(gameId: string): void {
    this.gameId.next(gameId);
    this.signalr.connectToGame(gameId);
  }

  makeMove(row: number, column: number): Observable<boolean> {
    if (this.inGame.value) {
      this.signalr.makeMove(this.gameId.value, row, column);
      return this.validMove.pipe(take(1));
    } else {
      this.error.next('Unable to make move, not in game.');
      return of(false);
    }
  }

  leaveGame() {
    this.gameId.next('');
    this.victory.next(false);
    this.draw.next(false);
    this.myTurn.next(false);
    this.game.next(new GameBoard());
  }

  submitScore(playerName: string) {
    this.signalr.updateLeaderboard(this.gameId.value, playerName);
    alert(`Score submitted for ${playerName}`);
  }

  private registerErrorMessages(): void {
    this.signalr.gameFull.subscribe(() => this.error.next('Could not connect to the specified game (already full).'));
    this.signalr.invalidMove.subscribe(() => this.validMove.next(false));
    this.signalr.gameNotFound.subscribe(() => {
      this.error.next('Could not connect to the specified game (not found).');
      this.inGame.next(false);
      this.game.next(new GameBoard());
      this.playerNumber = null;
      this.gameId.next('');
    });
  }

  private registerGameEvents(): void {
    this.signalr.addedToGame.subscribe(playerNumber => this.playerNumber = playerNumber);
    this.signalr.gameStart.subscribe(() => this.inGame.next(true));
    this.signalr.nextToMove.subscribe(nextNumber => this.myTurn.next(nextNumber === this.playerNumber));
    this.signalr.validMove.subscribe(() => this.validMove.next(true));
    this.signalr.gameBoard.subscribe(gameBoard => this.game.next(gameBoard));
    this.signalr.winningPlayer.subscribe(winnerNumber => {
      if (winnerNumber > 0) {
        this.victory.next(winnerNumber === this.playerNumber);
      } else if (winnerNumber === -1) {
        this.draw.next(true);
      }

      this.inGame.next(false);
    });
  }
}
