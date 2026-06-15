import { MetadataRoute } from "next";
import { MOCK_PRODUCTS, MOCK_BLOG_POSTS } from "@/lib/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://antigravity.vn";

  // Danh sách trang tĩnh
  const staticPages = [
    "",
    "/shop",
    "/ai-tools",
    "/ai-studio-hub",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/refund",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Danh sách trang sản phẩm động
  const productPages = MOCK_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/shop/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Danh sách trang bài viết động
  const postPages = MOCK_BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...postPages];
}
