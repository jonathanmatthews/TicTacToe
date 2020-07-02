import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameClient } from './services/game-api.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { NoughtCrossPipe } from './pipes/nought-cross/nought-cross.pipe';
import { GameBoardComponent } from './game-board/game-board.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    NoughtCrossPipe,
    GameBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    GameClient,
    HttpClient,
    HubConnectionBuilder
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
