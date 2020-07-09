import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { GameClient, PlayerRecord } from '../services/game-api.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaderboardComponent implements OnInit {
  public playerRecords = new BehaviorSubject<PlayerRecord[]>([]);
  @Input() public reload: Subject<void>;

  constructor(private api: GameClient) {
  }
  ngOnInit(): void {
    this.reload.subscribe(() =>
      this.api.getLeaderboard()
        .subscribe(data => this.playerRecords.next(data))
    );

    // Make initial API call on load.
    this.reload.next();
  }
}
