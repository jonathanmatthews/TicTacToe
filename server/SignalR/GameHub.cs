using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using game.Services;
using Microsoft.AspNetCore.SignalR;
using server.Services;

namespace server.SignalR
{
    public class GameHub : Hub
    {
        private readonly GameHostService _hostService;

        public GameHub(GameHostService hostService)
        {
            _hostService = hostService;
        }

        public async Task ConnectToGame(Guid gameId)
        {
            GameService game;
            try
            {
                game = _hostService.Games[gameId];
            }
            catch (KeyNotFoundException)
            {
                await Clients.Caller.SendAsync("gameNotFound");
                return;
            }
            
            if (game.ClientId1 == null)
            {
                game.ClientId1 = Context.ConnectionId;
                await Clients.Caller.SendAsync("addedToGame", 1);
                return;
            }
            else if (game.ClientId2 == null)
            {
                game.ClientId2 = Context.ConnectionId;
                await Clients.Caller.SendAsync("addedToGame", 2);
                await Clients.Clients(game.ClientId1, game.ClientId2).SendAsync("gameStart");
                return;
            }
            else
            {
                await Clients.Caller.SendAsync("gameFull");
                return;
            }
        }

        public async Task MakeMove(Guid gameId, int playerNumber, int row, int column)
        {

        }
    }
}