module.exports = function override(config) {
    config.module.rules = config.module.rules.map(rule => {
      if (rule.use) {
        rule.use = rule.use.map(loader => {
          if (loader.loader && loader.loader.includes("source-map-loader")) {
            loader.options = {
              ...loader.options,
              exclude: [/node_modules\/timeago-react/],
            };
          }
          return loader;
        });
      }
      return rule;
    });
    return config;
  };
  