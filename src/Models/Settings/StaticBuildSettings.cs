namespace MyPortfolioWebsite.Models.Settings;

public class StaticHtmlBuildSettings
{
    public string TargetUrl { get; set; } = "/";
    public string[] AdditionalUrls { get; set; } = Array.Empty<string>();
    public string SiteUrl { get; set; } = "";
    public string OutputFolder { get; set; } = "";
    public List<StringReplacement> StringReplacements { get; set; } = new();
}

public class StringReplacement
{
    public string OldValue { get; set; } = "";
    public string NewValue { get; set; } = "";
}
