using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Infrastructure;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly GameHostService _hostService;
        private readonly AppDbContext _context;

        public GameController(GameHostService hostService, AppDbContext context)
        {
            _hostService = hostService;
            _context = context;
        }

        [HttpGet]
        [Route("[controller]/start")]
        public string StartGame()
        {
            var gameId = _hostService.CreateGame().ToString();
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