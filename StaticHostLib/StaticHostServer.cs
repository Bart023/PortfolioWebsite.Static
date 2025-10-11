using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace StaticHostLib;

public sealed class StaticHostServer
{
    private WebApplication? _app;
    private bool _running;

    public bool IsRunning => _running;

    public async Task StartAsync(string hostUrl, string servingPath, CancellationToken ct = default)
    {
        Console.WriteLine("Starting static host...");
        
        if (_running) {
            Console.WriteLine("Static host already running");
            return;
        }

        if (string.IsNullOrWhiteSpace(servingPath) || !Directory.Exists(servingPath))
            throw new DirectoryNotFoundException($"Static root not found: {servingPath}");

        var waOpts = new WebApplicationOptions
        {
            EnvironmentName = Environments.Production,
            ContentRootPath = AppContext.BaseDirectory
        };

        var builder = WebApplication.CreateBuilder(waOpts);

        builder.Logging.ClearProviders();
        builder.WebHost
            .UseKestrel()
            .UseUrls(hostUrl);

        var app = builder.Build();

        app.UseDefaultFiles(new DefaultFilesOptions
        {
            FileProvider = new PhysicalFileProvider(servingPath)
        });

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(servingPath),
            RequestPath = ""
        });

        await app.StartAsync(ct);
        _app = app;
        _running = true;

        Console.WriteLine($"Static host serving on {hostUrl} - from {servingPath}");
    }

    public async Task StopAsync(CancellationToken ct = default)
    {
        if (!_running || _app is null) return;
        await _app.StopAsync(ct);
        await _app.DisposeAsync();
        _running = false;
        _app = null;
    }
}
