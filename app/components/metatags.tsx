type TagsData = {
  title?: string,
  description?: string,
  keywords?: string,
  image?: string,
  cardType?: "summary_small_image" | "summary_large_image",
}

export const defaults: TagsData = {
  title: "sshiiden.dev",
  description: "Nicholas Santos Shiden (sshiiden) is a web developer and UI/UX designer. He is the founder of Blazium Games, a game development studio.",
  keywords: "webdev, blazium, games, ui, ux, minecraft",
  image: "/sshiiden.png",
  cardType: "summary_small_image",
}

export function MetaTags({
  title = defaults.title,
  description = defaults.description,
  keywords = defaults.keywords,
  image = defaults.image,
  cardType = defaults.cardType,
}: TagsData) {

  return (<>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta property="og:image" content={image} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:card" content={cardType} />
  </>);
}