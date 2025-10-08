using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Sekmen.StaticSiteGenerator;
using System.Net.Http;

[ApiController]
[Route("umbraco/api/static-exporter")]
public class StaticExportController : ControllerBase
{
    private readonly IConfiguration _config;

    public StaticExportController(IConfiguration config)
    {
        _config = config;
    }

    //[HttpPost("run")]
    //public async Task<IActionResult> Run()
    //{
    //    var cmd = new ExportCommand(
    //        SiteUrl: "localhost:52519",
    //        AdditionalUrls: new[] { "/" },
    //        TargetUrl: "http://localhost:52519/",
    //        OutputFolder: "C:\\Projects\\MyPortfolioWebsite\\wwwroot\\export",
    //        StringReplacements: [new("http://localhost:52519/", "http://localhost:52519/")]
    //    );

    //    await Functions.ExportWebsite(new HttpClient(), cmd);
    //    return Ok("✅ Export complete!");
    //}

    // use: https://localhost:44376/umbraco/api/static-exporter/run
    [HttpPost("run")]
    public async Task<IActionResult> Run()
    {
        var cmd = new ExportCommand(
            SiteUrl: "localhost:44376",
            AdditionalUrls: new[] { "/" },
            TargetUrl: "https://bartvanderburg.net/",
            OutputFolder: "C:\\Projects\\MyPortfolioWebsite\\x-static-site-html",
            StringReplacements: new[] {
                new StringReplacements("http://localhost:52519/", "https://bartvanderburg.net/"),
                new StringReplacements("https://localhost:44376/", "https://bartvanderburg.net/")
            }
        );

        var handler = new HttpClientHandler {
            ServerCertificateCustomValidationCallback = (_, _, _, _) => true
        };

        using var http = new HttpClient(handler);
        await Functions.ExportWebsite(http, cmd);

        return Ok("Export complete!");
    }
}
