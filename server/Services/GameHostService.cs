using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using game.Models;
using game.Services;

namespace server.Services
{
    public class GameHostService
    {
        private Dictionary<Guid, GameService> _games;
        private Func<GameService> _createGameService;

        public GameHostService(IServiceProvider serviceProvider)
        {
            _games = new Dictionary<Guid, GameService>();
            _createGameService = () => (GameService)serviceProvider
                .GetService(typeof(GameService));
        }

        public Guid CreateGame()
        {
            var gameId = Guid.NewGuid();
            _games.Add(gameId, _createGameService());
            return gameId;
        }

        public GameService GetGame(Guid gameId)
        {
            GameService game;
            try
            {
                game = _games[gameId];
            }
            catch (KeyNotFoundException)
            {
                
                return null;
            }

            return game;
        }
    }
}