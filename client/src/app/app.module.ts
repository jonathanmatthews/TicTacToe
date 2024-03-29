import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameClient, API_BASE_URL } from './services/game-api.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { NoughtCrossPipe } from './pipes/nought-cross/nought-cross.pipe';
import { GameBoardComponent } from './game-board/game-board.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { TotalGamesPipe } from './pipes/total-games/total-games.pipe';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    NoughtCrossPipe,
    GameBoardComponent,
    LeaderboardComponent,
    TotalGamesPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule
  ],
  providers: [
    GameClient,
    HttpClient,
    HubConnectionBuilder,
    { provide: API_BASE_URL, useValue: environment.apiRoot }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
