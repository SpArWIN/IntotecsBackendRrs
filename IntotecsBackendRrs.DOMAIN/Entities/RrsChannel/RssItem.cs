using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace IntotecsBackendRrs.DOMAIN.Entities.RrsChannel
{
    public class RssItem
    {
        [XmlElement("guid")]
        public string Guid { get; set; } = string.Empty;
        [XmlElement("title")]
        public string Title { get; set; } = string.Empty;

        [XmlElement("link")]
        public string Link { get; set; } = string.Empty;

        [XmlElement("description")]
        public string Description { get; set; } = string.Empty;

        [XmlElement("pubDate")]
        public string PubDateString { get; set; } = string.Empty;
        [XmlElement("image")]
        public RssImage Image { get; set; } = new RssImage();

        // Метод для извлечения изображений

        public void ExtractImageFromDescription()
        {
            // Regex для поиска тега <img> и атрибута src
            var regex = new Regex(@"<img[^>]+src=""([^""]+)""", RegexOptions.IgnoreCase);
            var match = regex.Match(Description);
            var imgTagPattern = @"<img[^>]+src=""([^""]+)""";
            if (match.Success)
            {
                Image.Url = match.Groups[1].Value; // Извлечение URL
                Description = Regex.Replace(Description, imgTagPattern, string.Empty);
            }
        }


        public void CleanDescription()
        {
            // Убираем все теги <img> из описания
            Description = Regex.Replace(Description, @"<img[^>]*>", string.Empty);
        }




        [IgnoreDataMember]
        public DateTime PubDate
        {
            get
            {
                // Преобразование строки в DateTime, если это возможно
                if (DateTime.TryParse(PubDateString, null, System.Globalization.DateTimeStyles.RoundtripKind, out DateTime pubDate))
                {
                    return pubDate;
                }
                throw new FormatException($"Невозможно преобразовать дату: {PubDateString}");
            }
        }


        [XmlElement("dc:creator", Namespace = "http://purl.org/dc/elements/1.1/")]
        public string Creator { get; set; } = string.Empty;
        [Column(TypeName = "text[]")]
        [XmlElement("category")]
        public virtual List<string> Categories { get; set; } = new List<string>();

    }
}

