using Newtonsoft.Json;

namespace IntotecsBackendRrs.DOMAIN.Entities.AppsettingClass
{
    public class ProxySettings
    {
        [JsonProperty("address")]
        public string? Address { get; set; } = string.Empty;
        [JsonProperty("username")]
        public string ? Username { get; set; } = string.Empty;
        [JsonProperty("password")]
        public string? Password { get; set; } = string.Empty;
    }
}
