using System;
using System.Collections.Generic;
using game.Services;

namespace server.Services
{
    public class GameHostService
    {
        public Dictionary<Guid, GameService> Games;

        public GameHostService()
        {
            Games = new Dictionary<Guid, GameService>();
        }

        public Guid CreateGame()
        {
            var gameId = Guid.NewGuid();
            Games.Add(gameId, new GameService(new StateCheckerService()));
            return gameId;
        }
    }
}