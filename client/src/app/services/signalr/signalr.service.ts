import { Injectable, OnInit } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { Subject, BehaviorSubject } from 'rxjs';
import { GameBoard } from 'src/app/server-models/gameBoard';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public gameNotFound = new Subject<void>();
  public gameFull = new Subject<void>();
  public addedToGame = new Subject<number>(); // Gives player number.
  public gameStart = new Subject<void>();
  public invalidMove = new Subject<void>();
  public validMove = new Subject<void>();
  public gameBoard = new Subject<GameBoard>();
  public nextToMove = new Subject<number>(); // Gives player number.
  public winningPlayer = new Subject<number>(); // Gives player number.

  private hub: HubConnection;

  constructor(hubConnectionBuilder: HubConnectionBuilder) {
    this.hub = hubConnectionBuilder
      .withUrl('https://localhost:5001/gamehub')
      .build();

    this.hub
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.log('Error while starting SignalR connection: ' + err));

    this.addListeners();
  }

  connectToGame = (gameId: string): void => {
    this.hub.invoke('connectToGame', gameId);
  }

  makeMove = (gameId: string, row: number, column: number): void => {
    this.hub.invoke('makeMove', gameId, row, column);
  }

  private addListeners = (): void => {
    this.hub.on('gameNotFound', () => this.gameNotFound.next());
    this.hub.on('gameFull', () => this.gameFull.next());
    this.hub.on('addedToGame', (playerNumber) => this.addedToGame.next(playerNumber));
    this.hub.on('gameStart', () => this.gameStart.next());
    this.hub.on('invalidMove', () => () => this.invalidMove.next());
    this.hub.on('validMove', () => this.validMove.next());
    this.hub.on('nextToMove', (playerNumber) => this.nextToMove.next(playerNumber));
    this.hub.on('winningPlayer', (winningPlayer) => this.winningPlayer.next(winningPlayer));
    this.hub.on('gameBoard', (gameBoard) => this.gameBoard.next(gameBoard));
    // this.hub.on('gameBoard', (gameBoard: GameBoard) => {
    //   console.log(gameBoard);
    //   this.gameBoard.next(gameBoard);
    // });
  }
}
