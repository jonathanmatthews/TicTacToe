import { Injectable } from '@angular/core';
import { SignalrService } from '../signalr/signalr.service';
import { GameClient } from '../game-api.service';
import { GameBoard } from 'src/app/server-models/gameBoard';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public inGame = false;
  // Means that game is in play, service may still be connected to a
  // game that hasn't started yet or that has finished if false.

  public playerNumber: number;
  public myTurn: boolean;
  public victory: boolean;
  public game = new BehaviorSubject<GameBoard>(null);
  public connectionError: Subject<string>;
  public invalidMoveError: Subject<void>;

  private gameId: string;

  constructor(private api: GameClient, private signalr: SignalrService) {
    this.registerErrorMessages();
    this.registerGameEvents();
  }

  createGame() {
    this.api.startGame().subscribe(gameId => {
      this.gameId = gameId;
      this.signalr.connectToGame(gameId);
    });
  }

  makeMove() {

  }

  leaveGame() {
    throw new Error('Not implemented.');
  }

  private registerErrorMessages() {
    this.signalr.gameNotFound.subscribe(() => this.connectionError.next('Could not connect to the specified game (not found).'));
    this.signalr.gameFull.subscribe(() => this.connectionError.next('Could not connect to the specified game (already full).'));
    this.invalidMoveError = this.signalr.invalidMove; // Pass through.
  }

  private registerGameEvents() {
    this.signalr.addedToGame.subscribe(playerNumber => this.playerNumber = playerNumber);
    this.signalr.gameStart.subscribe(() => this.inGame = true);
    this.signalr.nextToMove.subscribe(nextNumber => this.myTurn = nextNumber == this.playerNumber);
    this.signalr.winningPlayer.subscribe(winnerNumber => this.victory = winnerNumber == this.playerNumber);
  }
}
