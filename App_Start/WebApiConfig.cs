using System.Web.Http;
using System.Web.Mvc;

namespace Lego.Module.HISWeb
{
    public static class WebApiConfig
    {
        public static void Register(AreaRegistrationContext context)
        {
            context.Routes.MapHttpRoute("HIS_WebApi",
              "api/HIS/{controller}/{action}/{id}",
              new { id = RouteParameter.Optional });
        }
    }
}
