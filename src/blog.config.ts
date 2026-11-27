import type { SiteConfig } from "@/features/config/site-config.schema";

export const blogConfig = {
  title: "站点名称",
  author: "作者",
  description:
    "这是我的个人网站和博客。在这里，我主要分享与技术和生活相关的内容。欢迎阅读！",
  social: [
    { platform: "github", url: "https://github.com/example" },
    { platform: "email", url: "mailto:example@email.com" },
    { platform: "rss", url: "/rss.xml" },
  ],
  navLinks: [],
  homePopup: {
    enabled: false,
    title: "精选页面",
    description: "这里展示后台配置的嵌入页面，并会在打开首页时自动弹出。",
    embedCode: "",
  },
  icons: {
    faviconSvg: "/favicon.svg",
    favicon96: "/favicon-96x96.png",
    appleTouchIcon: "/apple-touch-icon.png",
    webApp192: "/web-app-manifest-192x192.png",
    webApp512: "/web-app-manifest-512x512.png",
  },
  bannerImage: "/images/home-bg.webp",
  bannerFocus: { x: 50, y: 50 },
  avatar: "/images/avatar.png",
  primaryHue: 250,
  brandMark: "default",
  tagline: "",
  theme: {
    id: "classic",
    options: {},
  },
} as const satisfies SiteConfig;
