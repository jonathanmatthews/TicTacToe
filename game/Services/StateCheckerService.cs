using System;
using System.Linq;
using game.Models;

namespace game.Services
{
    public class StateCheckerService
    {
        public int CheckGameState(GameBoard game)
        {
            // Returns winning player number if there is a winner, -1 if draw, 0 if still in progress.
            var winner =  _checkColumns(game) + _checkDiagonals(game) + _checkRows(game);
            return winner > 0 ? winner : (_gameOver(game) ? -1 : 0);
        }

        private int _checkDiagonals(GameBoard game)
        {
            if (game[1, 1] == 0)
            {
                return 0;
            }

            var diag1 = game[0, 0] == game[1, 1] && game[1, 1] == game[2, 2];
            var diag2 = game[0, 2] == game[1, 1] && game[1, 1] == game[2, 0];

            return diag1 || diag2 ? game[1, 1] : 0;
        }

        private int _checkColumns(GameBoard game)
        {
            var columns = new int[3][];

            for (int i = 0; i < 3; i++)
            {
                columns[i] = game.Rows.Select(r => r[i]).ToArray();
            }

            foreach (var column in columns)
            {
                if (column[2] != 0 &&
                    column[0] == column[1] &&
                    column[1] == column[2])
                {
                    return column[2];
                }
            }

            return 0;
        }

        private int _checkRows(GameBoard game)
        {
            foreach (var row in game.Rows)
            {
                if (row[2] != 0 &&
                    row[0] == row[1] &&
                    row[1] == row[2])
                {
                    return row[2];
                }
            }

            return 0;
        }

        private bool _gameOver(GameBoard game)
        {
            foreach (var row in game.Rows)
            {
                foreach (var cell in row)
                {
                    if (cell == 0)
                    {
                        return false;
                    }
                }
            }

            return true;
        }
    }
}
