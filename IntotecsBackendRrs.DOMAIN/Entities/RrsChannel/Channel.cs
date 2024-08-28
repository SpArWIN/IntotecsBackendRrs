using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace IntotecsBackendRrs.DOMAIN.Entities.RrsChannel
{
    public class Channel
    {

        [XmlElement("title")]
        public string Title { get; set; } = string.Empty;

        [XmlElement("link")]
        public string Link { get; set; } = string.Empty;

        [XmlElement("description")]
        public string Description { get; set; } = string.Empty;

        [XmlElement("language")]
        public string Language { get; set; } = string.Empty;

        [XmlElement("pubDate")]
        public string PubDateString { get; set; } = string.Empty;



        [IgnoreDataMember]
        public DateTime PubDate
        {
            get
            {
                if (string.IsNullOrWhiteSpace(PubDateString))
                {
                    return DateTime.MinValue;
                }
                // Пробуем преобразовать строку в DateTime, если это возможно
                if (DateTime.TryParse(PubDateString, null, System.Globalization.DateTimeStyles.RoundtripKind, out DateTime pubDate))
                {
                    return pubDate;
                }
                Console.WriteLine($"Ошибка преобразования даты: {PubDateString}");

                // Определение формата для RFC 1123
                string format = "ddd, dd MMM yyyy HH:mm:ss z"; // Формат для RFC 1123
                if (DateTime.TryParseExact(PubDateString, format, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out DateTime pub))
                {
                    return pub; 
                }

                throw new FormatException($"Невозможно преобразовать дату: {PubDateString}");
            }
        }
    
    public void ProcessItems()
        {
            foreach (var item in Items)
            {
                item.ExtractImageFromDescription(); // Извлекаем изображение из описания
                item.CleanDescription();
            }
        }

        [XmlElement("item")]
        public virtual List<RssItem> Items { get; set; } = new List<RssItem>();

    }
}
