using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Timers;
using game.Models;
using game.Services;
using Microsoft.Extensions.Logging;

namespace server.Services
{
    public class GameHostService
    {
        private static int TimeToLive = 600; // Seconds
        private Dictionary<Guid, GameService> _games;
        private Timer _gameGcTimer;
        private Func<GameService> _createGameService;
        private readonly ILogger<GameHostService> _logger;

        public GameHostService(IServiceProvider serviceProvider, ILogger<GameHostService> logger)
        {
            _games = new Dictionary<Guid, GameService>();
            _logger = logger;
            _createGameService = () => (GameService)serviceProvider
                .GetService(typeof(GameService));

            _gameGcTimer = new Timer(30 * 1000); // Check every 30 seconds.
            _gameGcTimer.Elapsed += (Object source, ElapsedEventArgs e) =>
            {
                foreach (var entry in _games)
                {
                    if (entry.Value.CreationTime + TimeSpan.FromSeconds(TimeToLive) <= DateTime.Now)
                    {
                        logger.Log(LogLevel.Warning, $"Deleting game: {entry.Key}");
                        _games.Remove(entry.Key);
                    }
                }
            };
            _gameGcTimer.AutoReset = true;
            _gameGcTimer.Enabled = true;

        }

        public Guid CreateGame()
        {
            var gameId = Guid.NewGuid();
            _games.Add(gameId, _createGameService());
            _logger.Log(LogLevel.Information, $"Creating game: {gameId}");
            return gameId;
        }

        public GameService GetGame(string gameId)
        {
            Guid gameGuid;

            if (!Guid.TryParse(gameId, out gameGuid))
            {
                return null;
            }

            try
            {
                return _games[gameGuid];
            }
            catch (KeyNotFoundException)
            {

                return null;
            }
        }
    }
}