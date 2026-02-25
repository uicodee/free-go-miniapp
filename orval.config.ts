module.exports = {
  main: {
    input: {
      target: "./src/shared/api/schema.json",
    },
    output: {
      mode: "tags-split",
      target: "./src/shared/api/generated",
      schemas: "./src/shared/api/model",
      client: "axios",
      tslint: true,
      override: {
        mutator: {
          path: "./src/shared/api/http/index.ts",
          name: "createInstance",
        },
      },
    },
  },
};
