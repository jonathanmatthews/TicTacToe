import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameClient, PlayerRecord } from '../services/game-api.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent implements OnInit {
  public playerRecords = new BehaviorSubject<PlayerRecord[]>([]);

  constructor(private api: GameClient) {
    this.api.getLeaderboard()
      .subscribe(data => {
        this.playerRecords.next(data);
      });
  }

  ngOnInit(): void {
  }
}
