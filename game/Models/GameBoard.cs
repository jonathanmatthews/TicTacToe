namespace game.Models
{
    public class GameBoard
    {
        // Currently just use numbers to denote players 1 and 2, could make more tidy with player classes.
        public int[][] Rows { get; private set; } = new int[3][] { new int[3], new int[3], new int[3] };

        public int this[int a, int b]
        {
            get => Rows[a][b];
            set => Rows[a][b] = value;
        }
    }
}