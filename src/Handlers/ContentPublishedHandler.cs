using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using Sekmen.StaticSiteGenerator;

namespace MyPortfolioWebsite.Handlers;

public class ContentPublishedHandler : INotificationAsyncHandler<ContentPublishedNotification>
{
    public async Task HandleAsync(ContentPublishedNotification notification, CancellationToken cancellationToken)
    {
        try
        {
            Console.WriteLine("--- Generating static site...");

            await GenerateStaticSite();

            Console.WriteLine("--- Static site generated");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"--- Static export failed: {ex.Message}");
        }
    }

    private async Task GenerateStaticSite()
    {
        using var client = new HttpClient(new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (_, _, _, _) => true
        });

        var cmd = new ExportCommand(
            TargetUrl: "/",
            AdditionalUrls: ["/"],
            SiteUrl: "localhost:44376",
            OutputFolder: "C:\\Projects\\MyPortfolioWebsite\\docs",
            StringReplacements: [
                new StringReplacements("http://localhost:52519/", "/"),
                new StringReplacements("https://localhost:44376/", "/")
            ]
        );

        await Functions.ExportWebsite(client, cmd);
    }

}
