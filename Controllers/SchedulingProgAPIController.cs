using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using Lego.Module.HISDomain.ViewModel;
using Lego.Module.HISDomain.RepositoryInterfaces;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using Lego.Tools.InfraStructure;
using Lego.Module.HISManager;
using Lego.Domain;
using Newtonsoft.Json.Linq;

namespace Lego.Module.HISWeb.Controllers
{
    public class SchedulingProgAPIController : ApiController
    {
        private readonly ISchedulingProgRepository _schedulingProgRepository;
        int MenuItem = 0;
        int Systemid = 93;
        public SchedulingProgAPIController(ISchedulingProgRepository schedulingProgRepository)
        {
            _schedulingProgRepository = schedulingProgRepository;
        }
        private readonly ISchedulingProgRepository __schedulingProgRepository;
        public SchedulingProgAPIController()
        {
            _schedulingProgRepository = __schedulingProgRepository;
        }

        [HttpGet]
        public Task<string> SchedulingProgDetail_get(int DepartmentID, int WPID, int Version, string AccordingTo, int WeekNumber, int MenuItemId, int SystemId, int OnlineUserId)
        {
            return Task.Run(async () =>
            {
                try
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new JavaScriptConverter[] { new ExpandoJsonConverter() });
                    serializer.MaxJsonLength = Int32.MaxValue;

                    var profiles = await _schedulingProgRepository.GetSchedulingProgDetail(DepartmentID, WPID, Version, AccordingTo, WeekNumber, MenuItemId, SystemId, OnlineUserId).ConfigureAwait(true);

                    var manager = new ManagerDynamic();
                    var spreadPaymentItemList = manager.GetSchedulingProgDetail(profiles.ToList());
                    var json = serializer.Serialize(spreadPaymentItemList);

                    return json;

                }
                catch (LegoException exception)
                {
                    return null;
                }
            });
        }

        [HttpPost]
        public Task<string> ModifySchedulingProgItem([FromBody] JObject jsonSchedulingProgItem)
        {

			return Task.Run(async () =>
			{
				try
				{
					jsonSchedulingProgItem = JObject.Parse(jsonSchedulingProgItem["jsonSchedulingProgItem"].ToString());
					var SchedulingProgDetailList = jsonSchedulingProgItem["SchedulingProgDetailList"];
					var SchedulingProgDetailHead = jsonSchedulingProgItem["SchedulingProgDetailHead"];
                    var SchedulingProgDetailCartable = jsonSchedulingProgItem["SchedulingProgDetailCartable"];
                    
                    var headParams = new
					{
						wpid = Convert.ToInt32 (SchedulingProgDetailHead["WPID"]),
						id = Convert.ToInt32(SchedulingProgDetailHead["ID"]),
						confirm = Convert.ToInt32(SchedulingProgDetailHead["Confirm"]),
                        onlineUserId = Convert.ToInt32(SchedulingProgDetailHead["onlineUserId"])
                    };
                    char d = '"';

                    
                    ////////// کارتابل
                    var css = "{'Tb':" + SchedulingProgDetailCartable.ToString() + "}";

                    css = css.Replace("]}\"", "]}");
                    css = css.Replace("\"{", "{");
                    css = css.Replace("\"", d.ToString());
                    css = css.Replace("\r\n", "");
                    css = css.Replace("  ", "");
                    css = css.Replace(" ", "");
                    css = css.Replace(@"\", "");

                    css = css.Replace(d.ToString(), "'");
                    css = css.Replace("'[", "[");
                    css = css.Replace("]'", "]");


                    string cresultString = JsonConvert.DeserializeXNode(css, "Root").ToString();
                    cresultString = cresultString.Replace("\r\n", "");
                    cresultString = cresultString.Replace("  ", "");
                    cresultString = cresultString.Replace(" ", "");
                    if (cresultString != "" && cresultString != "<Root></Root>" && cresultString != "<Root><Tb></Tb></Root>")
                    {
                        cresultString = cresultString.Replace("</Root>", "<ActionTb><Action>1</Action></ActionTb></Root>");
                        cresultString = cresultString.Replace("<DocTypeID>", "<ActorDesc></ActorDesc><DocTypeID>");
                        var WorkTableResult = _schedulingProgRepository.ModifyCasingWorkTable("Confirm", cresultString, 0, 1, headParams.onlineUserId);
                        if (WorkTableResult.Count() > 1)
                        {
                            ResultError result = new ResultError();
                            result.Message = WorkTableResult[0].Message;
                            result.Success = 0;
                            var tresult = JsonConvert.SerializeObject(result, Formatting.Indented);
                            var tserializer = new JavaScriptSerializer();
                            tserializer.RegisterConverters(new JavaScriptConverter[] { new ExpandoJsonConverter() });
                            var tjson = tserializer.Serialize(tresult);
                            //return tjson;
                        }
                    }
                    ///////////////////
                    var ss = "{'jsonSchedulingProgItem':" + SchedulingProgDetailList.ToString() + "}";

					ss = ss.Replace("]}\"", "]}");
					ss = ss.Replace("\"{", "{");
					ss = ss.Replace("\"", d.ToString());
					ss = ss.Replace("\r\n", "");
					ss = ss.Replace("  ", "");
					ss = ss.Replace(" ", "");
					ss = ss.Replace(@"\", "");

					ss = ss.Replace(d.ToString(), "'");
					ss = ss.Replace("'[", "[");
					ss = ss.Replace("]'", "]");
					// در تبدیل نود های عددی به ایکس ام ال مشکل وجود دارد لذا آنها را حذف می کنیم
					for (int i = 0; i <= 3; i++)
						for (int j = 0; j < 10; j++)
						{
							ss = ss.Replace("'" + i.ToString() + j.ToString() + "'", "'RDay'");
						}

					var serializer = new JavaScriptSerializer();
					string resultString = JsonConvert.DeserializeXNode(ss, "Root").ToString();
					resultString = resultString.Replace("\r\n", "");
					resultString = resultString.Replace("  ", "");
					resultString = resultString.Replace(" ", "");
					serializer.RegisterConverters(new JavaScriptConverter[] { new ExpandoJsonConverter() });

					//var profiles = await _schedulingProgRepository.ModifySchedulingProg(resultString, Systemid, onlineUserId, WPID, ID, Confirm, CompanyID, SessionID).ConfigureAwait(true);
					var profiles = await _schedulingProgRepository.ModifySchedulingProg(resultString, Systemid, headParams.onlineUserId, headParams.wpid, headParams.id, headParams.confirm).ConfigureAwait(true);

					var json = serializer.Serialize(profiles);

					return json;

				}
				catch (LegoException exception)
				{
					return null;
				}
			});
		}

		[HttpGet]
        public Task<string> SpecialItems_get(int menuItemId, int systemId, int onlineUserId)
        {
            return Task.Run(async () =>
            {
                try
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new JavaScriptConverter[] { new ExpandoJsonConverter() });

                    var profiles = await _schedulingProgRepository.GetSpecialItems(menuItemId, systemId, onlineUserId).ConfigureAwait(true);

                    var json = serializer.Serialize(profiles);

                    return json;
                }
                catch (LegoException exception)
                {
                    return null;
                }
            });
        }

        [HttpGet]
        public Task<string> Structures_get(int menuItemId, int systemId, int onlineUserId, int wpId)
        {
            return Task.Run(async () =>
            {
                try
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new JavaScriptConverter[] { new ExpandoJsonConverter() });

                    var profiles = await _schedulingProgRepository.GetStructures(menuItemId, systemId, onlineUserId, wpId).ConfigureAwait(true);

                    var json = serializer.Serialize(profiles);
                    return json;
                }
                catch (LegoException exception)
                {
                    return null;
                }
            });
        }

        [HttpGet]
        public Task<string> GetCartable(int DepartmentID, int WPID, int Version, int MenuItemId, int SystemId, int OnlineUserId)
        {
            return Task.Run(async () =>
            {
                try
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new JavaScriptConverter[] { new ExpandoJsonConverter() });

                    var profiles = await _schedulingProgRepository.GetCartable(DepartmentID, WPID, Version, MenuItemId, SystemId, OnlineUserId).ConfigureAwait(true);

                    var json = serializer.Serialize(profiles);
                    return json;

                }
                catch (LegoException exception)
                {
                    return null;
                }
            });
        }

        [HttpGet]
        public Task<string> GetStructureOfDepartment_get(int DepartmentID, int WPID, int MenuItemId, int SystemId, int OnlineUserId)
        {
            return Task.Run(async () =>
            {
                try
                {
                    var serializer = new JavaScriptSerializer();
                    serializer.RegisterConverters(new JavaScriptConverter[] { new ExpandoJsonConverter() });

                    var profiles = await _schedulingProgRepository.GetStructureOfDepartment(DepartmentID, WPID, MenuItemId, SystemId, OnlineUserId).ConfigureAwait(true);

                    var manager = new ManagerDynamic();
                    var spreadPaymentItemList = manager.GetStructureOfDepartment(profiles.ToList());
                    var json = serializer.Serialize(spreadPaymentItemList);

                    return json;

                }
                catch (LegoException exception)
                {
                    return null;
                }
            });
        }
        [HttpPost]
        public Task<string> ModifyCasingWorkTable([FromBody] JObject jsonCasingWorkTable)
        {

            return Task.Run(async () =>
            {
                try
                {
                    jsonCasingWorkTable = JObject.Parse(jsonCasingWorkTable["jsonSchedulingProgItem"].ToString());
                    var SchedulingProgDetailHead = jsonCasingWorkTable["SchedulingProgDetailHead"];
                    var SchedulingProgDetailCartable = jsonCasingWorkTable["SchedulingProgDetailCartable"];
                    var SchedulingProgDetailCartableSetting = jsonCasingWorkTable["SchedulingProgDetailCartableSetting"];

                    string ActionType = Convert.ToString(SchedulingProgDetailCartableSetting["ActionType"]);
                    var headParams = new
                    {
                        wpid = Convert.ToInt32(SchedulingProgDetailHead["WPID"]),
                        id = Convert.ToInt32(SchedulingProgDetailHead["ID"]),
                        confirm = Convert.ToInt32(SchedulingProgDetailHead["Confirm"]),
                        onlineUserId = Convert.ToInt32(SchedulingProgDetailHead["onlineUserId"])
                    };
                    char d = '"';

                    ////////// کارتابل
                    var css = "{'Tb':" + SchedulingProgDetailCartable.ToString() + "}";

                    css = css.Replace("]}\"", "]}");
                    css = css.Replace("\"{", "{");
                    css = css.Replace("\"", d.ToString());
                    css = css.Replace("\r\n", "");
                    css = css.Replace("  ", "");
                    css = css.Replace(" ", "");
                    css = css.Replace(@"\", "");

                    css = css.Replace(d.ToString(), "'");
                    css = css.Replace("'[", "[");
                    css = css.Replace("]'", "]");


                    string cresultString = JsonConvert.DeserializeXNode(css, "Root").ToString();
                    cresultString = cresultString.Replace("\r\n", "");
                    cresultString = cresultString.Replace("  ", "");
                    cresultString = cresultString.Replace(" ", "");
                    if (cresultString != "" && cresultString != "<Root></Root>" && cresultString != "<Root><Tb></Tb></Root>")
                    {
                        if(ActionType=="Cancel")
                            cresultString = cresultString.Replace("</Root>", "<ActionTb><Action>-1</Action></ActionTb></Root>");

                        else
                            cresultString = cresultString.Replace("</Root>", "<ActionTb><Action>1</Action></ActionTb></Root>");

                        cresultString = cresultString.Replace("<DocTypeID>", "<ActorDesc></ActorDesc><DocTypeID>");
                        var WorkTableResult = await _schedulingProgRepository.ModifyCasingWorkTableAsync(ActionType, cresultString, 0, 1, headParams.onlineUserId).ConfigureAwait(true);

                        if (WorkTableResult.Count() >= 1)
                        {
                            ResultError result = new ResultError();
                            result.Message = WorkTableResult[0].Message;
                            result.Success = 0;
                            var tresult = JsonConvert.SerializeObject(result, Formatting.Indented);
                            var tserializer = new JavaScriptSerializer();
                            tserializer.RegisterConverters(new JavaScriptConverter[] { new ExpandoJsonConverter() });
                            var tjson = tserializer.Serialize(tresult);
                            return tjson;
                        }
                        else
                        {
                            ResultError result = new ResultError();
                            result.Message = "";
                            result.Success = 1;
                            var tresult = JsonConvert.SerializeObject(result, Formatting.Indented);
                            var tserializer = new JavaScriptSerializer();
                            tserializer.RegisterConverters(new JavaScriptConverter[] { new ExpandoJsonConverter() });
                            var tjson = tserializer.Serialize(tresult);
                            return tjson;
                        }
                    }
                    return null;
                }
                catch (LegoException exception)
                {
                    return null;
                }
            });
        }
    }
}