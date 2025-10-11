using Microsoft.Extensions.Options;
using MyPortfolioWebsite.Handlers;
using MyPortfolioWebsite.Models.Settings;
using StaticHostLib;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.Configure<StaticHtmlBuildSettings>(builder.Configuration.GetSection("x-static-build"));
builder.Services.Configure<StaticHtmlHostSettings>(builder.Configuration.GetSection("x-static-host"));
builder.Services.AddSingleton<StaticHostServer>();

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();

app.UseRouting();

app.MapControllers();

app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

if (app.Environment.IsDevelopment())
{
    app.Lifetime.ApplicationStarted.Register(async () => {

        // Generate static site on start
        var buildSettings = app.Services.GetRequiredService<IOptions<StaticHtmlBuildSettings>>();
        var logger = app.Services.GetRequiredService<ILogger<ContentPublishedHandler>>();
        var handler = new ContentPublishedHandler(buildSettings, logger);
        await handler.HandleAsync(default!, default);

        // Run static host
        await Task.Delay(100);
        var staticHost = app.Services.GetRequiredService<StaticHostServer>();
        var hostSettings = app.Services.GetRequiredService<IOptions<StaticHtmlHostSettings>>().Value;
        var root = Path.Combine(Directory.GetParent(app.Environment.ContentRootPath)!.FullName, "docs");
        await staticHost.StartAsync(hostSettings.Url, root);
    });
}

await app.RunAsync();
