using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace IntotecsBackendRrs.DOMAIN.Entities.RrsChannel
{
    public class RssImage
    {
        [XmlElement("link")]
        public string Link { get; set; } = string.Empty;

        [XmlElement("url")]
        public string Url { get; set; } = string.Empty;

        [XmlElement("title")]
        public string Title { get; set; } = string.Empty;
    }
}
