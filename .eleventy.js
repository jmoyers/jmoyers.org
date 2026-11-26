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
    "src/site.webmanifest": "/",
  });

  // Copy images from blog posts
  // This will copy from src/content/posts/*/images/* to posts/*/images/*
  eleventyConfig.addPassthroughCopy({
    "src/content/posts": "posts",
  });

  // Watch SCSS files
  eleventyConfig.addWatchTarget("src/assets/scss/");
  eleventyConfig.addWatchTarget("assets/scss/");
  eleventyConfig.addWatchTarget("src/content/posts/**/*.svg");

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
    // Front matter dates are parsed as UTC midnight, so read them back in
    // UTC. Local getters show the day before in US timezones.
    const day = String(d.getUTCDate()).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${months[d.getUTCMonth()]} ${day}, ${year}`;
  });

  // Current year shortcode
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Excerpt/summary filter
  eleventyConfig.addFilter("excerpt", (content) => {
    // First check for manual excerpt marker
    if (content.includes("<!--more-->")) {
      return content.split("<!--more-->")[0].trim();
    }

    // Strip HTML and get first 520 chars
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

  // Inline visualizations. In a post, write
  //   <figure class="viz" data-src="loop.svg"><figcaption>…</figcaption></figure>
  // and the SVG file next to the post is inlined into the figure, so it
  // picks up the site's fonts and the .viz-* classes in blog.scss.
  eleventyConfig.addTransform("viz-inline", function (content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html") || !this.inputPath) {
      return content;
    }
    const fs = require("fs");
    const path = require("path");
    const dir = path.dirname(this.inputPath);
    return content.replace(
      /<figure class="viz" data-src="([^"]+)">/g,
      (match, src) => {
        const file = path.resolve(dir, src);
        if (!file.startsWith(path.resolve(dir) + path.sep) || !fs.existsSync(file)) {
          throw new Error(`viz: ${src} not found next to ${this.inputPath}`);
        }
        const svg = fs.readFileSync(file, "utf8").replace(/<\?xml[^>]*\?>\s*/, "");
        return `<figure class="viz">${svg}`;
      }
    );
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
    breaks: false,
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
