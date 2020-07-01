using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly GameHostService _hostService;
        private readonly ILogger<GameController> _logger;

        public GameController(GameHostService hostService, ILogger<GameController> logger)
        {
            _hostService = hostService;
            _logger = logger;
        }

        [HttpGet]
        [Route("[controller]/start")]
        public string StartGame()
        {
            var gameId = _hostService.CreateGame().ToString();
            _logger.Log(LogLevel.Information, $"Creating game: {gameId}");
            return gameId;
        }
    }
}