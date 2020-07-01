import { Component, OnInit } from '@angular/core';
import { GameClient } from '../game-api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private api: GameClient) { }

  ngOnInit(): void {
    this.api.startGame().subscribe(result => console.log(result));
  }
}
