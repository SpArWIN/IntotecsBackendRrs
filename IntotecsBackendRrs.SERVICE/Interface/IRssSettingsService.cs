using IntotecsBackendRrs.DOMAIN.Entities.AppsettingClass;
using IntotecsBackendRrs.DOMAIN.Response;

namespace IntotecsBackendRrs.SERVICE.Interface
{
    public interface IRssSettingsService
    {
        /// <summary>
        /// Получить настройки из json 
        /// </summary>
        /// <returns></returns>
        Task<BaseResponse<Settings>> GetCurrentSettingsAsync();
        Task<BaseResponse<Settings>> UpdateSettingsAsync(Settings newFeeds);
        Task<BaseResponse<Settings>> DeleteFeed(string url);
    }
}
