using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.FileProviders;
using System;
using System.IO;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var projectRoot = Directory.GetParent(Directory.GetCurrentDirectory())!.FullName;
var staticPath = Path.Combine(projectRoot, "docs");

Console.WriteLine($"Serving static files from: {staticPath}");

app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = new PhysicalFileProvider(staticPath)
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(staticPath),
    RequestPath = ""
});

app.Run("http://localhost:8080");
