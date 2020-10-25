using System.Web.Mvc;

namespace Lego.Module.HISWeb
{
    public class HISAreaRegistration : AreaRegistration
    {
        /// <summary>
        /// نام ماژول
        /// </summary>
        public override string AreaName
        {
            get
            {
                return "HIS";
            }
        }
        /// <summary>
        /// متد تعیین مسیر ماژول 
        /// </summary>
        /// <param name="context"> برای اضافه کردن روت مناسب به مجموعه روت های</param>
        public override void RegisterArea(AreaRegistrationContext context)
        {
            RouteConfig.RegisterRoutes(context);
            WebApiConfig.Register(context);
        }
    }
}