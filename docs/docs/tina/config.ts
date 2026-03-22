import { defineConfig } from "tinacms"

export default defineConfig({
  branch: process.env.GIT_BRANCH || "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "static"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "static"
    }
  },
  schema: {
    collections: [
      {
        name: "productDocs",
        label: "Product Docs",
        path: "content/product",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "description", label: "Description" },
          { type: "string", name: "slug", label: "Slug" },
          {
            type: "string",
            name: "status",
            label: "Status",
            options: ["draft", "review", "published"],
            required: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ]
      },
      {
        name: "tutorials",
        label: "Tutorials",
        path: "content/tutorials",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "description", label: "Description" },
          { type: "number", name: "order", label: "Order" },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ]
      },
      {
        name: "faq",
        label: "FAQ",
        path: "content/faq",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Question", isTitle: true, required: true },
          {
            type: "rich-text",
            name: "body",
            label: "Answer",
            isBody: true
          }
        ]
      },
      {
        name: "blog",
        label: "Blog",
        path: "blog",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Date", required: true },
          { type: "string", name: "authors", label: "Authors", list: true },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true
          }
        ]
      }
    ]
  }
})