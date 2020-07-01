import { Injectable } from '@angular/core';
import { SignalrService } from '../signalr/signalr.service';
import { GameClient } from '../game-api.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private api: GameClient, private signalr: SignalrService) { }

  
}
