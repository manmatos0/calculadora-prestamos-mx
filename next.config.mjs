const basePath = process.env.PAGES_BASE_PATH ?? "";

const config = {
  basePath,
  ...(process.env.GITHUB_PAGES === "true" && { output: "export", trailingSlash: true }),
};

export default config;
