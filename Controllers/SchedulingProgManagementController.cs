using Lego.Domain.RepositoryInterface;
using Lego.Domain.Tools;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using Lego.Domain;
using Lego.Module.HISRepository;
using Lego.Module.HISDomain.RepositoryInterfaces;

namespace Lego.Module.HISWeb.Controllers
{
    public class SchedulingProgManagementController : Controller
    {
        // GET: SchedulingProgManagement
        private const int MenuitemId = 93003;
        private const int SystemId = 93;
        private int onlineUserId;

        private static ISchedulingProgManagementRepository _iSchedulingProgManagementRepository;

        public SchedulingProgManagementController(ISchedulingProgManagementRepository iSchedulingProgManagementRepository) {
            _iSchedulingProgManagementRepository = iSchedulingProgManagementRepository;
        }


        public ActionResult SchedulingProgManagement_show()
        {
            onlineUserId = Convert.ToInt32(User.Identity.GetUserId());
            ViewData["OnlienUserId"] = onlineUserId;

            return View();
        }

        public Task<JsonResult> ReadGrid([DataSourceRequest] DataSourceRequest request, int departmentId, int wpId, int statusId)
        {
            return Task.Run(async () =>
            {
                try
                {
                    var onlineUserId = Convert.ToInt32(User.Identity.GetUserId());
                    var profiles = await _iSchedulingProgManagementRepository.fetchGridData(departmentId, wpId, statusId).ConfigureAwait(true);
                    return Json(profiles.ToDataSourceResult(request));
                }
                catch (LegoException exception)
                {
                    return Json(new { exception.Message });
                }
            });
        }
    }
}