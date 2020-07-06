import { Pipe, PipeTransform } from '@angular/core';
import { PlayerRecord } from 'src/app/services/game-api.service';

@Pipe({
  name: 'totalGames'
})
export class TotalGamesPipe implements PipeTransform {

  transform(playerRecord: PlayerRecord): number {
    return playerRecord.wins + playerRecord.losses + playerRecord.draws;
  }

}
