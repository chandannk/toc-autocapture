using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using toc_autocapture.Helper;
using toc_autocapture.Models;

namespace toc_autocapture.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public TocResponse SessionId(bool autoCapture)
        {
            _logger.LogWarning("starting session id");
            var apiKey = "d1e15e6eeab44925b1cfcde84fe763e1";
            var url = "https://sandbox-api.7oc.cl/session-manager/v1/session-id";
            var helper = new TocHelper().GetSessionID(apiKey, url,autoCapture);
            return helper.Result;
        }

        [HttpPost]
        public string Validate([FromBody]DocumentValidationModel validationData) {
            var apiKey= "d1e15e6eeab44925b1cfcde84fe763e1";
            var url = "https://sandbox-api.7oc.cl/v2/face-and-document";

            var result = new TocHelper().ValidateFaceAndDocuemnt(apiKey, url, validationData);
            return result.Result;
        }
    }
}
