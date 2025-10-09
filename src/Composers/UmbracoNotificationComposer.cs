using MyPortfolioWebsite.Handlers;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Notifications;

namespace MyPortfolioWebsite.Composers;

public class UmbracoNotificationComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.AddNotificationAsyncHandler<ContentPublishedNotification, ContentPublishedHandler>();
    }
}