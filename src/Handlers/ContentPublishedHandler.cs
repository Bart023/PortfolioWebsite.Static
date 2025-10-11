using Microsoft.Extensions.Options;
using MyPortfolioWebsite.Models.Settings;
using Sekmen.StaticSiteGenerator;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;

namespace MyPortfolioWebsite.Handlers;

public class ContentPublishedHandler : INotificationAsyncHandler<ContentPublishedNotification>
{
    private readonly StaticHtmlBuildSettings _settings;
    private readonly ILogger<ContentPublishedHandler> _logger;

    public ContentPublishedHandler(
        IOptions<StaticHtmlBuildSettings> settings,
        ILogger<ContentPublishedHandler> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task HandleAsync(ContentPublishedNotification notification, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Generating static website files...");
            await GenerateStaticSite();
            _logger.LogInformation("Static website generation completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Static export failed: {Message}", ex.Message);
        }
    }

    private async Task GenerateStaticSite()
    {
        using var client = new HttpClient(new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (_, _, _, _) => true
        });

        var cmd = new ExportCommand(
            SiteUrl: _settings.SiteUrl,
            AdditionalUrls: _settings.AdditionalUrls,
            TargetUrl: _settings.TargetUrl,
            OutputFolder: _settings.OutputFolder,
            StringReplacements: _settings.StringReplacements.Select(r => new StringReplacements(r.OldValue, r.NewValue)).ToArray()
        );

        await Functions.ExportWebsite(client, cmd);
    }
}
