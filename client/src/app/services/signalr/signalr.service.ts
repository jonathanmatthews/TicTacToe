import { Injectable, OnInit, Optional, Inject } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { Subject, BehaviorSubject } from 'rxjs';
import { GameBoard } from 'src/app/server-models/gameBoard';
import { API_BASE_URL } from '../game-api.service';

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

  constructor(hubConnectionBuilder: HubConnectionBuilder, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    baseUrl = baseUrl ? baseUrl : 'https://localhost:5001';

    this.hub = hubConnectionBuilder
      .withUrl(`${baseUrl}/gamehub`)
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

  updateLeaderboard = (gameId: string, playerName: string): void => {
    this.hub.invoke('updateLeaderboard', playerName);
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
  }
}
