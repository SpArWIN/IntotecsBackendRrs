using IntotecsBackendRrs.DOMAIN.Entities.AppsettingClass;
using IntotecsBackendRrs.DOMAIN.Response;
using IntotecsBackendRrs.SERVICE.Interface;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text.Json;

namespace IntotecsBackendRrs.SERVICE.implementation
{
    public class RssSettingsService : IRssSettingsService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        public string ConfigFilePath { get; set; } = "appsettings.json";
        public RssSettingsService(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;

            _httpClient = httpClient;
        }

        public async Task<BaseResponse<Settings>> GetCurrentSettingsAsync()
        {
            try
            {
                var settingsSection = _configuration.GetSection("RssSettings").Get<Settings>();
                if (settingsSection != null)
                {
                    foreach (var feed in settingsSection.Feeds)
                    {
                        // Проверяем доступность URL
                        var isUrlAvailable = await CheckUrlAsync(feed.Url);
                        if (!isUrlAvailable)
                        {
                            feed.Enabled = false; // Устанавливаем Enabled в false, если URL недоступен
                          await  SaveConfigurationAsync(settingsSection);

                        }
                    }

                    return new BaseResponse<Settings>
                    {
                        Data = settingsSection,
                        Success = true
                    };
                }

                return new BaseResponse<Settings>
                {
                    Success = false,
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Ошибка при получении текущих настроек", ex);
            }
        }
        /// <summary>
        /// Метод проверки на существование url
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        private async Task<bool> CheckUrlAsync(string url)
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                return response.IsSuccessStatusCode; // Возвращаем true, если ответ успешный
            }
            catch
            {
                return false; // Возвращаем false в случае ошибки
            }
        }
    
    public async Task<BaseResponse<Settings>> UpdateSettingsAsync(Settings newSettings)
        {
            try
            {
                var currentSettingsResponse = await GetCurrentSettingsAsync();

                // Проверяем, что currentSettingsResponse не null и содержит данные
                if (currentSettingsResponse == null || currentSettingsResponse.Data == null)
                {
                    return new BaseResponse<Settings>
                    {
                        Success = false,
                        Description = "Не удалось получить текущие настройки.",
                        Data = null
                    };
                }

                var currentFeeds = currentSettingsResponse.Data.Feeds; // Получаем текущие ленты

                foreach (var newFeed in newSettings.Feeds)
                {
                    var currentFeed = currentFeeds.FirstOrDefault(f => f.Url == newFeed.Url);

                    if (currentFeed != null)
                    {
                        // Обновляем существующую ленту
                        currentFeed.Enabled = newFeed.Enabled;
                        currentFeed.UpdateFrequency = newFeed.UpdateFrequency;
                        currentFeed.Proxy = newFeed.Proxy;
                    }
                    else
                    {
                        // Добавляем новую ленту
                        currentFeeds.Add(newFeed);
                    }
                }

                // Обновляем текущие настройки
                await SaveConfigurationAsync(currentSettingsResponse.Data);

                return new BaseResponse<Settings>()
                {
                    Success = true,
                    Description = "Настройки успешно обновлены.",
                    Data = currentSettingsResponse.Data // Возвращаем обновленные настройки
                };
            }
            catch (Exception ex)
            {
                // Обработка ошибок
                return new BaseResponse<Settings>()
                {
                    Success = false,
                    Description = $"Ошибка при обновлении настроек RSS: {ex.Message}",
                    Data = null // В случае ошибки данные не возвращаются
                };
            }
        }

        private async Task SaveConfigurationAsync(Settings settings)
        {
            var settingsToSave = new
            {
                RssSettings = new
                {
                    Feeds = settings.Feeds.Select(feed => new
                    {
                        Url = feed.Url,
                        UpdateFrequency = feed.UpdateFrequency,
                        Enabled = feed.Enabled,
                        Proxy = new
                        {
                            Address = feed.Proxy.Address,
                            Username = feed.Proxy.Username,
                            Password = feed.Proxy.Password
                        }
                    }).ToList()
                }
            };

            var json = JsonSerializer.Serialize(settingsToSave, new JsonSerializerOptions { WriteIndented = true });
            await System.IO.File.WriteAllTextAsync(ConfigFilePath, json);
        }

        public async Task<BaseResponse<Settings>> DeleteFeed(string url)
        {
            try
            {
                var currentSettingsResponse = await GetCurrentSettingsAsync();

                // Проверяем, что currentSettingsResponse не null и содержит данные
                if (currentSettingsResponse == null || currentSettingsResponse.Data == null)
                {
                    return new BaseResponse<Settings>
                    {
                        Success = false,
                        Description = "Не удалось получить текущие настройки.",
                        Data = null
                    };
                }

                var currentFeeds = currentSettingsResponse.Data.Feeds; // Получаем все настройки ленты

                // Находим ленту по URL
                var feedToRemove = currentFeeds.FirstOrDefault(f => f.Url == url);

                if (feedToRemove != null)
                {
                    // Удаляем ленту из списка
                    currentFeeds.Remove(feedToRemove);

                    // Обновляем текущие настройки
                    await SaveConfigurationAsync(currentSettingsResponse.Data);

                    return new BaseResponse<Settings>()
                    {
                        Success = true,
                        Description = "Лента успешно удалена.",
                        Data = currentSettingsResponse.Data // Возвращаем обновленные настройки
                    };
                }
                else
                {
                    return new BaseResponse<Settings>
                    {
                        Success = false,
                        Description = "Лента с указанным URL не найдена.",
                        Data = null
                    };
                }
            }
            catch (Exception ex)
            {
                // Обработка ошибок
                return new BaseResponse<Settings>()
                {
                    Success = false,
                    Description = $"Ошибка при удалении ленты: {ex.Message}",
                    Data = null 
                };
            }
        }

    }
}

