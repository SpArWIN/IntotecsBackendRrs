using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntotecsBackendRrs.DOMAIN.Entities.AppsettingClass
{
   
    public class Feed
    {
        [JsonProperty("url")]
        public string? Url { get; set; } = string.Empty;
        [JsonProperty("enabled")]
        public bool ?Enabled { get; set; }
        [JsonProperty("updateFrequency")]
        public int? UpdateFrequency { get; set; }
        [JsonProperty("proxy")]
        public ProxySettings ? Proxy { get; set; } = new ProxySettings();
    }
}
