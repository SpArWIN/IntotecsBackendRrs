using IntotecsBackendRrs.DOMAIN.Entities.RrsChannel;
using IntotecsBackendRrs.DOMAIN.Response;
using IntotecsBackendRrs.SERVICE.Interface;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace IntotecsBackendRrs.SERVICE.implementation
{
    public class RrsService : IRrsService
    {
       
        private readonly IConfiguration _configuration;

        private readonly Dictionary<string, HttpClient> _httpClients;
        public RrsService(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClients = new Dictionary<string, HttpClient>();

            // Настройка HttpClient для каждой ленты
            var feeds = _configuration.GetSection("RssSettings:Feeds").GetChildren();
            foreach (var feed in feeds)
            {
                var url = feed.GetValue<string>("url");
                var proxyAddress = feed.GetSection("Proxy:Address").Value;
                var proxyUsername = feed.GetSection("Proxy:Username").Value;
                var proxyPassword = feed.GetSection("Proxy:Password").Value;

                var handler = new HttpClientHandler();

                if (!string.IsNullOrEmpty(proxyAddress))
                {
                    var proxy = new WebProxy(proxyAddress)
                    {
                        Credentials = new NetworkCredential(proxyUsername, proxyPassword)
                    };

                    handler.Proxy = proxy;
                    handler.UseProxy = true;
                }

                // Создание HttpClient и добавление в словарь
                var httpClient = new HttpClient(handler);
                _httpClients[url] = httpClient; // Используем URL как ключ
            }
        }
        public async Task<BaseResponse<List<RrsFeed>>> GetRrsList(List<string> urls)
        {
            var baseResponse = new BaseResponse<List<RrsFeed>>();
            var response = new List<RrsFeed>();

            try
            {
                foreach (var url in urls)
                {
                    RrsFeed? rssFeed = null;

                    // Попытка получить данные с использованием прокси
                    if (_httpClients.TryGetValue(url, out var httpClient))
                    {
                        try
                        {
                            var xmData = await httpClient.GetStringAsync(url);
                            Console.WriteLine($"Полученные данные для {url} с прокси: {xmData}");

                            // Парсинг данных
                            var serializer = new XmlSerializer(typeof(RrsFeed));
                            using var reader = new StringReader(xmData);
                            rssFeed = serializer.Deserialize(reader) as RrsFeed;

                            // Если существует поле Channel и Items, обработаем их
                            rssFeed?.Channel?.ProcessItems(); 
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Ошибка при получении данных с прокси для {url}: {ex.Message}");
                        }
                    }

                    // Если получение с прокси не удалось, пробуем без прокси
                    if (rssFeed == null)
                    {
                        try
                        {
                            var httpClientWithoutProxy = new HttpClient(); // Создаем новый HttpClient без прокси
                            var xmData = await httpClientWithoutProxy.GetStringAsync(url);
                            Console.WriteLine($"Полученные данные для {url} без прокси: {xmData}");

                            // Парсинг данных
                            var serializer = new XmlSerializer(typeof(RrsFeed));
                            using var reader = new StringReader(xmData);
                            rssFeed = serializer.Deserialize(reader) as RrsFeed;

                            // Если существует поле Channel и Items, обработаем их
                            rssFeed?.Channel?.ProcessItems(); // Используем оператор безопасного доступа
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Ошибка при получении данных без прокси для {url}: {ex.Message}");
                        }
                    }

                    if (rssFeed != null)
                    {
                        response.Add(rssFeed);
                    }
                }

                baseResponse.Data = response;
                baseResponse.Success = true;
                baseResponse.Description = "Список лент успешно получен";
            }
            catch (Exception ex)
            {
                baseResponse.Data = new List<RrsFeed>();
                baseResponse.Success = false;
                baseResponse.Description = $"Ошибка при получении лент: {ex.Message}"; // Добавляем описание ошибки
            }

            return baseResponse;
        }
    }
}
