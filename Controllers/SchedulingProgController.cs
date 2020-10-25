using Lego.Domain.Business.ViewModel;
using Lego.Domain.RepositoryInterface;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Lego.Domain.Business.RepositoryInterface;

namespace Lego.Module.HISWeb.Controllers
{
    public class SchedulingProgController : Controller
    {
        private int onlineUserId;
        private readonly IPersonRepository _PersonRepository;

        public SchedulingProgController(IPersonRepository PersonRepository)
        {
            _PersonRepository = PersonRepository;
        }
        // GET: SchedulingProg
        public ActionResult SchedulingProg(int DepartmentID=0, string DepartmentName="", int WPID=1)
        {
            onlineUserId = Convert.ToInt32(User.Identity.GetUserId());
            List<PersonViewModel> result;

            if (DepartmentID == 0) {
                result = _PersonRepository.GetUserLoginInfo(onlineUserId, 0);
                if (result.Count > 0) { 
                    DepartmentID = (result[0]).DepartmentId;
                    DepartmentName = (result[0]).DepartmentName;
                }
            }
            
            ViewData["OnlienUserId"] = onlineUserId;
            ViewData["DepartmentID"] = DepartmentID;
            ViewData["DepartmentName"] = DepartmentName;
            ViewData["WPID"] = WPID;

            return View();
        }
    }
}