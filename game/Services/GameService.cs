using System;

namespace game.Services
{
    public class GameService
    {
        private readonly StateCheckerService _stateService;

        public GameService(StateCheckerService stateService)
        {
            _stateService = stateService;
        }
    }
}
