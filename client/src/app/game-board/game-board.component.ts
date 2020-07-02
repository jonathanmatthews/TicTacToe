import { Component, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoardComponent implements OnInit {
  @Input() rows: number[][];
  @Output() move = new EventEmitter<number[]>();

  constructor() { }

  ngOnInit(): void {
  }

}
