using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace IntotecsBackendRrs.DOMAIN.Entities.RrsChannel
{
    [XmlRoot("rss")]
    public class RrsFeed
    {
        [XmlElement("channel")]
        public Channel Channel { get; set; } = new Channel();
    }
}
