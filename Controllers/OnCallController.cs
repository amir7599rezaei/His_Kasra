using Lego.Domain;
using Lego.Module.HISDomain.RepositoryInterfaces;
using Lego.Module.HISDomain.ViewModel;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Lego.Module.HISWeb.Controllers
{
    public class OnCallController : Controller
    {
        private readonly int _menuitemId = 93002;
        private int _systemId = 93;

        private readonly IOncallRepository _onCallRepository;
        public OnCallController(IOncallRepository onCallRepository)
        {
            _onCallRepository = onCallRepository;
        }

        // GET: OnCall
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult OncallCodeSetting_Create( int CategoryStructureID, string CategoryStructureTitle)
        {
            if (Request["SystemId"] != null)
                _systemId = Convert.ToInt32(Request["SystemId"]);
            ViewData["SystemId"] = _systemId.ToString();

            var onlineUserId = Convert.ToInt32(User.Identity.GetUserId());

            var profiles = _onCallRepository.GetOncallCodeSettings(CategoryStructureID, _systemId, onlineUserId, _menuitemId);

            ViewData["OncallCodeSettingList"] = profiles.ToList();

            var result = new OnCallViewModel();
            result.CategoryStructureTitle = CategoryStructureTitle;
            result.CategoryStructureID = CategoryStructureID;
            result.OncallCodeSettingList = profiles.ToList();
 
            return View(result);

        }

        public string SaveOncallCodeSetting(string strpbl)
        {
            string node = JsonConvert.DeserializeXNode(strpbl, "Root").ToString();
            // , writeArrayAttribute: true
            var onlineUserId = Convert.ToInt32(User.Identity.GetUserId());
            var r = _onCallRepository.SaveOncallCodeSetting(node,_systemId, onlineUserId, _menuitemId);

            return r;
        }


    }
}
