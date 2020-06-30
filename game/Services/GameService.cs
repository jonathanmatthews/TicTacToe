using System;
using game.Models;

namespace game.Services
{
    public class GameService
    {
        public string ClientId1;
        public string ClientId2;
        private readonly StateCheckerService _stateService;
        private readonly GameBoard _game;

        public GameService(StateCheckerService stateService)
        {
            _stateService = stateService;
            _game = new GameBoard();
        }
    }
}
