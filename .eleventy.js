const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({ "themes/jmoyers/static/image": "image" });
  eleventyConfig.addPassthroughCopy({ "themes/jmoyers/static/font": "font" });
  eleventyConfig.addPassthroughCopy({ "themes/jmoyers/static/*.png": "/" });
  eleventyConfig.addPassthroughCopy({ "themes/jmoyers/static/*.ico": "/" });
  eleventyConfig.addPassthroughCopy({
    "themes/jmoyers/static/site.webmanifest": "/",
  });

  // Copy images from blog posts
  // This will copy from src/content/posts/*/images/* to posts/*/images/*
  eleventyConfig.addPassthroughCopy({
    "src/content/posts": "posts",
  });

  // Watch SCSS files
  eleventyConfig.addWatchTarget("src/assets/scss/");
  eleventyConfig.addWatchTarget("assets/scss/");

  // Date formatting filter (similar to Hugo)
  eleventyConfig.addFilter("dateFormat", (date, format) => {
    const d = new Date(date);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${months[d.getMonth()]} ${day}, ${year}`;
  });

  // Current year shortcode
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Excerpt/summary filter
  eleventyConfig.addFilter("excerpt", (content) => {
    // First check for manual excerpt marker
    if (content.includes("<!--more-->")) {
      return content.split("<!--more-->")[0].trim();
    }

    // Parse the HTML content to extract text
    const cheerio = require("cheerio");
    const $ = cheerio.load(content);

    // Get all paragraph elements
    const paragraphs = $("p");

    if (paragraphs.length > 0) {
      let excerptText = "";
      const maxLength = 585; // Increased by 30% from 450

      // Combine text from multiple paragraphs until we reach max length
      for (let i = 0; i < paragraphs.length; i++) {
        const paraText = $(paragraphs[i]).text().trim();

        // If adding this paragraph would exceed our limit, truncate it
        if (excerptText.length + paraText.length + 1 > maxLength) {
          const remainingSpace = maxLength - excerptText.length - 1;
          if (remainingSpace > 50) {
            // Only add if we have meaningful space left
            let truncatedPara = paraText.substring(0, remainingSpace);
            const lastSpace = truncatedPara.lastIndexOf(" ");
            if (lastSpace > 0) {
              truncatedPara = truncatedPara.substring(0, lastSpace);
            }
            excerptText += (excerptText ? " " : "") + truncatedPara;
          }
          break;
        }

        // Add the full paragraph
        excerptText += (excerptText ? " " : "") + paraText;
      }

      return excerptText + "...";
    }

    // Fallback - strip HTML and get first 520 chars
    const plainText = content.replace(/<[^>]*>/g, "").trim();
    let excerpt = plainText.substring(0, 520);
    const lastSpace = excerpt.lastIndexOf(" ");
    if (lastSpace > 0) {
      excerpt = excerpt.substring(0, lastSpace);
    }
    return excerpt + "...";
  });

  // Remove Hugo shortcodes
  eleventyConfig.addFilter("removeShortcodes", (content) => {
    return content.replace(/{{[<>].*?[<>]}}/g, "");
  });

  // Minify HTML in production
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
      if (outputPath && outputPath.endsWith(".html")) {
        return htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        });
      }
      return content;
    });
  }

  // Configure markdown
  const markdownIt = require("markdown-it");
  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true,
  };
  eleventyConfig.setLibrary("md", markdownIt(markdownItOptions));

  // Collections
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/content/posts/**/*.md")
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
};
