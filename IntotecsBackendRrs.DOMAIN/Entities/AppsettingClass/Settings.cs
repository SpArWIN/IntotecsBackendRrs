using Newtonsoft.Json;

namespace IntotecsBackendRrs.DOMAIN.Entities.AppsettingClass
{
    public class Settings
    {
        //Общие настройки всех лент
        [JsonProperty("feeds")]
        public List <Feed> Feeds { get; set; } = new List <Feed> ();

    }
}
