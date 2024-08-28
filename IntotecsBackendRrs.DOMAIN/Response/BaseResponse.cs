namespace IntotecsBackendRrs.DOMAIN.Response
{
    public class BaseResponse<T> : IBaseResponse<T>
    {
        public string? Description { get; set; }
        public bool? Success { get; set; }
        public T? Data { get; set; }


    }
    public interface IBaseResponse<T>
    {
        string? Description { get; }
        T? Data { get; }
        bool? Success { get; }
    }
}
