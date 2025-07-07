module.exports = {
  permalink: (data) => {
    // For posts, remove the 'content' prefix from the URL
    if (data.tags && data.tags.includes("posts")) {
      // Remove 'content/' from the beginning and '/index' from the end
      const stem = data.page.filePathStem
        .replace("/content", "")
        .replace("/index", "");
      return stem + "/";
    }
    // For other pages, use default permalink
    return data.permalink;
  },
};
