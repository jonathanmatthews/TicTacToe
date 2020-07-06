using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using server.Infrastructure;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly GameHostService _hostService;
        private readonly ILogger<GameController> _logger;
        private readonly AppDbContext _context;

        public GameController(GameHostService hostService, ILogger<GameController> logger, AppDbContext context)
        {
            _hostService = hostService;
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        [Route("[controller]/start")]
        public string StartGame()
        {
            var gameId = _hostService.CreateGame().ToString();
            _logger.Log(LogLevel.Information, $"Creating game: {gameId}");
            return gameId;
        }

        [HttpGet]
        [Route("[controller]/leaderboard")]
        public async Task<PlayerRecord[]> GetLeaderboard()
        {
            return await _context.PlayerRecords
                .OrderBy(p => p.Wins)
                .Take(15)
                .ToArrayAsync();
        }
    }
}