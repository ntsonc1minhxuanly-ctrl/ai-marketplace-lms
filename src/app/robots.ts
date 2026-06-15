import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://antigravity.vn";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/checkout/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
