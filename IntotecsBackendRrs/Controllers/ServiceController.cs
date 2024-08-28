using IntotecsBackendRrs.DOMAIN.Entities.AppsettingClass;
using IntotecsBackendRrs.SERVICE.Interface;
using Microsoft.AspNetCore.Mvc;

namespace IntotecsBackendRrs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : Controller
    {
        private readonly IConfiguration _configuration;

        private readonly IRssSettingsService _service;
       
        public ServiceController(IRssSettingsService service, IConfiguration conf)
        {
            _service = service;
            _configuration = conf;
          

        }


        [HttpGet]
        public IActionResult GetSettings()
        {
            var Setting = _service.GetCurrentSettingsAsync();


            return Ok(Setting.Result);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateFeeds([FromBody] Settings feeds)
        {
            var response = await _service.UpdateSettingsAsync(feeds);
            if (response.Success == true)
            {
                return Ok(response.Data);
            }
            return BadRequest(response.Description);

        }
        [HttpDelete] public async Task<IActionResult> DeleteFeed([FromBody] string url)
        {
            var setting = await _service.DeleteFeed(url);
            if (setting.Success == true)
            {

                return Ok(setting.Data);
            }

            return BadRequest(setting.Description);
        } 
    }
}

