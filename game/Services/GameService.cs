using System;
using game.Models;

namespace game.Services
{
    public class GameService
    {
        public string ClientId1 { get; set; }
        public string ClientId2 { get; set; }
        public GameBoard Game { get; private set; }
        public int NextToMove { get; private set; }
        public int WinningPlayer { get; private set; }
        private readonly StateCheckerService _stateService;

        public GameService(StateCheckerService stateService)
        {
            _stateService = stateService;
            Game = new GameBoard();
            WinningPlayer = 0;
            NextToMove = 1;
        }

        public void MakeMove(string clientId, int row, int column)
        {
            if (clientId == ClientId1)
            {
                _playerMove(1, row, column);
            }
            else if (clientId == ClientId2)
            {
                _playerMove(2, row, column);
            }
            else
            {
                throw new Exception("Client is not part of this game.");
            }
        }

        private void _playerMove(int playerNumber, int row, int column)
        {
            _validateMove(playerNumber, row, column);
            Game[row, column] = playerNumber;
            WinningPlayer = _stateService.CheckGameState(Game);
            NextToMove = WinningPlayer > 0 ? 0 :
                (NextToMove == 1 ? 2 : 1);
        }

        private void _validateMove(int playerNumber, int row, int column)
        {
            if (playerNumber != NextToMove)
            {
                throw new InvalidOperationException($"It is not player {playerNumber}'s turn to move.");
            }
            if (Game[row, column] != 0)
            {
                throw new InvalidOperationException("This position is already marked.");
            }
            if (row > 2 || column > 2 || row < 0 || column < 0)
            {
                throw new ArgumentOutOfRangeException("Row and column index must be between 0 and 2 inclusive.");
            }
        }
    }
}
