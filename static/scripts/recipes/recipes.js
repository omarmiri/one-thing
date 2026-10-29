document.addEventListener("DOMContentLoaded", (event) => {
  APIMaticDevPortal.ready(async ({ registerWorkflow }) => {
    const { default: AnAiAgentBuysAProduct } = await import("./AnAiAgentBuysAProduct.js");
    registerWorkflow("page:recipes/AnAiAgentBuysAProduct", "An AI agent buys a product", AnAiAgentBuysAProduct);
  });
});