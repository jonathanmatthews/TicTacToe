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

        public async Task ConnectToGame(string gameId)
        {
            Guid guid;
            GameService game = null;

            if (Guid.TryParse(gameId, out guid))
            {
                game = _hostService.GetGame(Guid.Parse(gameId));
            }

            if (game == null)
            {
                await Clients.Caller.SendAsync("gameNotFound");
                return;
            }

            if (game.ClientId1 == null)
            {
                game.ClientId1 = Context.ConnectionId;
                await Clients.Caller.SendAsync("addedToGame", 1);
                await Clients.Caller.SendAsync("gameBoard", game.Game);
                return;
            }
            else if (game.ClientId2 == null)
            {
                game.ClientId2 = Context.ConnectionId;
                await Clients.Caller.SendAsync("addedToGame", 2);
                await Clients.Caller.SendAsync("gameBoard", game.Game);
                await Clients.Clients(game.ClientId1, game.ClientId2)
                    .SendAsync("nextToMove", game.NextToMove);
                await Clients.Clients(game.ClientId1, game.ClientId2)
                    .SendAsync("gameStart");
                return;
            }
            else
            {
                await Clients.Caller.SendAsync("gameFull");
                return;
            }
        }

        public async Task MakeMove(string gameId, int row, int column)
        {
            Guid guid;
            GameService game = null;

            if (Guid.TryParse(gameId, out guid))
            {
                game = _hostService.GetGame(Guid.Parse(gameId));
            }

            if (game == null)
            {
                await Clients.Caller.SendAsync("gameNotFound");
                return;
            }

            try
            {
                game.MakeMove(Context.ConnectionId, row, column);
            }
            catch (InvalidOperationException e)
            {
                await Clients.Caller.SendAsync("invalidMove", e.Message);
            }
            catch (ArgumentOutOfRangeException e)
            {
                await Clients.Caller.SendAsync("invalidMove", e.Message);
            }

            await Clients.Caller
                .SendAsync("validMove");
            await Clients.Clients(game.ClientId1, game.ClientId2)
                .SendAsync("gameBoard", game.Game);
            await Clients.Clients(game.ClientId1, game.ClientId2)
                .SendAsync("nextToMove", game.NextToMove);
            
            if (game.WinningPlayer > 0)
            {
                await Clients.Clients(game.ClientId1, game.ClientId2)
                    .SendAsync("winningPlayer", game.WinningPlayer);
            }
        }
    }
}