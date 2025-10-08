using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Web;

[ApiController]
[Route("sitemap.xml")]
public class SitemapController : ControllerBase
{
    private readonly IUmbracoContextFactory _umbracoContextFactory;

    public SitemapController(IUmbracoContextFactory umbracoContextFactory)
        => _umbracoContextFactory = umbracoContextFactory;

    [HttpGet]
    public IActionResult GetSitemap()
    {
        using var cref = _umbracoContextFactory.EnsureUmbracoContext();

        var roots = cref.UmbracoContext?.Content?.GetAtRoot() ?? Enumerable.Empty<IPublishedContent>();
        if (!roots.Any())
            return NotFound();

        var urls = new List<string>();
        foreach (var root in roots)
            AddPageUrls(root, urls);

        var xml = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
            <urlset xmlns=""http://www.sitemaps.org/schemas/sitemap/0.9"">
                {string.Join("\n", urls.Select(u => $"  <url><loc>{u}</loc></url>"))}
            </urlset>";

        return Content(xml, "application/xml");
    }

    private void AddPageUrls(IPublishedContent node, List<string> urls)
    {
        var absolute = node.Url(mode: UrlMode.Absolute);
        if (!string.IsNullOrWhiteSpace(absolute))
            urls.Add(absolute);

        foreach (var child in node.Children())
            AddPageUrls(child, urls);
    }
}