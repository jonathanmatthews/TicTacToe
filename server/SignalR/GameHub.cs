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
            var game = await _getGame(gameId);
            
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

        public async Task MakeMove(Guid gameId, int row, int column)
        {
            var game = await _getGame(gameId);
            game.MakeMove(Context.ConnectionId, row, column);
        }

        private async Task<GameService> _getGame(Guid gameId)
        {
            GameService game;
            try
            {
                game = _hostService.Games[gameId];
            }
            catch (KeyNotFoundException)
            {
                await Clients.Caller.SendAsync("gameNotFound");
                return null;
            }

            return game;
        }
    }
}