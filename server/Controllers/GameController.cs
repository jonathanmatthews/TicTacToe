using System;
using Microsoft.AspNetCore.Mvc;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly GameHostService _hostService;

        public GameController(GameHostService hostService)
        {
            _hostService = hostService;
        }

        [HttpGet]
        [Route("[controller]/start")]
        public Guid StartGame()
        {
            return _hostService.CreateGame();
        }
    }
}