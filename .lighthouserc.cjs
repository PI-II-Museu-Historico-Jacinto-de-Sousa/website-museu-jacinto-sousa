module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:4173/"],
      startServerCommand: "npm run build && npm run preview",
    },
    assert: {
      assertions: {
        "categories:performance": ["off"],
        "categories:accessibility": ["off"],
        "best-practices": ["off"],
        "categories:seo": ["off"],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
