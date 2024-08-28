using IntotecsBackendRrs.DOMAIN.Entities.RrsChannel;
using IntotecsBackendRrs.DOMAIN.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace IntotecsBackendRrs.SERVICE.Interface
{
    public interface IRrsService
    {
        /// <summary>
        /// Метод получения списка элементов лент из массива
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        Task<BaseResponse<List<RrsFeed>>> GetRrsList(List<string> url);
    }
}
