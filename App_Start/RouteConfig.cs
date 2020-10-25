using System.Web.Mvc; 

namespace Lego.Module.HISWeb
{
    public class RouteConfig
    {
        public static void RegisterRoutes(AreaRegistrationContext context)
        { 
            context.MapRoute(
            "HIS_default",
               "HIS/{controller}/{action}/{id}",
               new { controller = "Home", action = "Index", id = UrlParameter.Optional },
               new[] { "Lego.Module.HISWeb.Controllers" });
        }
    }
}
