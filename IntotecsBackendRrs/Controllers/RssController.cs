using IntotecsBackendRrs.SERVICE.Interface;
using Microsoft.AspNetCore.Mvc;

namespace IntotecsBackendRrs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RssController : Controller
    {
        private readonly IRrsService _rrsService;
        private readonly IRssSettingsService _services;
        public RssController(IRrsService servuce, IRssSettingsService services)
        {
            _rrsService = servuce;
            _services = services;

        }
        [HttpGet] public async Task<IActionResult> GetRrsFeed(string ? url = null)
        {
            var settingsResponse = await _services.GetCurrentSettingsAsync();

            if ( settingsResponse.Data == null)
            {
                return BadRequest("Не удалось получить настройки.");
            }


            // Извлекаем все URL из настроек
            var urls = settingsResponse.Data.Feeds
                .Where(feed => (bool)feed.Enabled) // Учитываем только включенные ленты
                .Select(feed => feed.Url)
                .ToList();
            //Если нужно по времени обновить и передан параметр url, то вытаскиваем только его
            if (!string.IsNullOrEmpty(url))
            {
                //В таком случае в массиве будет только один url :)
                var feed = settingsResponse.Data.Feeds
           .FirstOrDefault(feed => feed.Url.Equals(url, StringComparison.OrdinalIgnoreCase));
                // Если лента не найдена или она отключена, возвращаем ошибку
                if ( feed == null || !(bool)feed.Enabled)
                {
                    return BadRequest("Лента отключена или не найдена.");
                }
                urls = new List<string> { url };
            }

            var response = await _rrsService.GetRrsList(urls);
            return Ok(response);
        }
    }
}
