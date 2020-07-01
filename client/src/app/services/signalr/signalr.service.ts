import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { Subject, BehaviorSubject } from 'rxjs';
import { GameBoard } from 'src/app/server-models/gameBoard';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  public gameNotFound: Subject<void>;
  public gameFull: Subject<void>;
  public addedToGame: Subject<number>; // Gives player number.
  public gameStart: Subject<void>;
  public invalidMove: Subject<void>;
  public gameBoard: Subject<GameBoard>;
  public nextToMove: Subject<number>; // Gives player number.
  public winningPlayer: Subject<number>; // Gives player number.

  private hub: HubConnection;

  constructor(hubConnectionBuilder: HubConnectionBuilder) {
    this.hub = hubConnectionBuilder
      .withUrl('https://loclahost:5001/gamehub')
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
    this.hub.invoke(gameId, row, column);
  }

  private addListeners = () => {
    this.hub.on('gameNotFound', () => this.gameNotFound.next());
    this.hub.on('gameFull', () => this.gameFull.next());
    this.hub.on('addedToGame', (playerNumber) => this.addedToGame.next(playerNumber));
    this.hub.on('gameStart', () => this.gameStart.next());
    this.hub.on('invalidMove', () => () => this.invalidMove.next());
    this.hub.on('gameBoard', (gameBoard) => this.gameBoard.next(gameBoard));
    this.hub.on('nextToMove', (playerNumber) => this.nextToMove.next(playerNumber));
    this.hub.on('winningPlayer', (winningPlayer) => this.winningPlayer.next(winningPlayer));
  }
}
