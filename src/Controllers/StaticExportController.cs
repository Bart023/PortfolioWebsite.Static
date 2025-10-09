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
            TargetUrl: "/",
            OutputFolder: "C:\\Projects\\MyPortfolioWebsite\\docs",
            StringReplacements: new[] {
                new StringReplacements("http://localhost:52519/", "/"),
                new StringReplacements("https://localhost:44376/", "/")
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
