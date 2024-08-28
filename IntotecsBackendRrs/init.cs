using IntotecsBackendRrs.SERVICE.implementation;
using IntotecsBackendRrs.SERVICE.Interface;

namespace IntotecsBackendRrs
{
    public static class init
    {
        public static void InitializeRepositoriyes(this IServiceCollection services)
        {
            services.AddScoped<IRrsService,RrsService>();
        }
        public static void InitializeServices(this IServiceCollection services)
        {
            services.AddScoped<IRssSettingsService, RssSettingsService>();
            services.AddHttpClient();

        }
    }
}
