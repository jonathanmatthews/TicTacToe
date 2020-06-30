namespace game.Models
{
    public class GameBoard
    {
        public int[][] Rows { get; private set; } = new int[3][3];

        public int this[int a, int b]
        {
            get => _rows[a][b];
            set => _rows[a][b] = value;
        }
    }
}