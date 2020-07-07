using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using game.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using server.Infrastructure;
using server.Models;
using server.Services;

namespace server.SignalR
{
    public class GameHub : Hub
    {
        private readonly GameHostService _hostService;
        private readonly AppDbContext _context;
        private readonly ILogger<GameHub> _logger;

        public GameHub(GameHostService hostService, AppDbContext context, ILogger<GameHub> logger)
        {
            _context = context;
            _hostService = hostService;
            _logger = logger;
        }

        public async Task ConnectToGame(string gameId)
        {
            var game = _hostService.GetGame(gameId);

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
            var game = _hostService.GetGame(gameId);

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
                return;
            }

            await Clients.Caller
                .SendAsync("validMove");
            await Clients.Clients(game.ClientId1, game.ClientId2)
                .SendAsync("gameBoard", game.Game);


            if (game.WinningPlayer != 0)
            {
                await Clients.Clients(game.ClientId1, game.ClientId2)
                    .SendAsync("winningPlayer", game.WinningPlayer);
            }
            else
            {
                await Clients.Clients(game.ClientId1, game.ClientId2)
                    .SendAsync("nextToMove", game.NextToMove);
            }
        }

        public async Task UpdateLeaderboard(string gameId, string playerName)
        {
            var game = _hostService.GetGame(gameId);

            if (game == null)
            {
                await Clients.Caller.SendAsync("gameNotFound");
                return;
            }

            int playerNumber;

            if (Context.ConnectionId == game.ClientId1)
            {
                playerNumber = 1;
            }
            else if (Context.ConnectionId == game.ClientId2)
            {
                playerNumber = 2;
            }
            else
            {
                await Clients.Caller.SendAsync("gameFull");
                return;
            }

            var player = _context.PlayerRecords
                .Where(p => p.Name == playerName.Trim())
                .FirstOrDefault();

            if (player == null)
            {
                player = new PlayerRecord
                {
                    Name = playerName.Trim(),
                    Wins = game.WinningPlayer == playerNumber ? 1 : 0,
                    Losses = game.WinningPlayer == playerNumber ? 0 : 1,
                    Draws = game.WinningPlayer == -1 ? 1 : 0
                };

                _context.PlayerRecords.Add(player);
            }
            else
            {
                if (game.WinningPlayer == -1)
                {
                    player.Draws++;
                }
                else if (playerNumber == game.WinningPlayer)
                {
                    player.Wins++;
                }
                else
                {
                    player.Losses++;
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}