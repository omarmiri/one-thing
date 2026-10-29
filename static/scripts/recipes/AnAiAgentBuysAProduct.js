// An API Recipe (guided walkthrough) for the docs portal, in the format `apimatic portal recipe new`
// writes. It's registered under "recipes" in APIMATIC-BUILD.json and listed in content/toc.yml.
export default function AnAiAgentBuysAProduct(workflowCtx, portal) {
  const verify = (response, setError) => {
    if (response.StatusCode == 200) return true;
    setError("The call didn't return 200. Check the parameters and try again.");
    return false;
  };
  return {
    "Step 1": {
      name: "How an agent buys",
      stepCallback: async () => {
        return workflowCtx.showContent(`## How an agent buys

An AI assistant can buy from any OneThing shop with plain GET requests: no plugin, no API key and no
account. It finds the product, sends the buyer a PayPal link, and the buyer approves the payment at
PayPal. The agent never handles money or card details.

The same four steps are also MCP tools (\`search_shops\`, \`get_product\`, \`create_order\`,
\`get_order\`) at \`https://one-thing-ash0.onrender.com/api/mcp\`, for assistants that support MCP.

Each next step calls the live sandbox app. Press **Try it out** to make the call.`);
      },
    },
    "Step 2": {
      name: "Find a shop",
      stepCallback: async () => {
        return workflowCtx.showEndpoint({
          description:
            "Search the gallery the way an agent does when a buyer says \"find me a dinosaur game\". Set `q` to `raptor`. Each result has the shop's `slug`, price, photo and order links.",
          endpointPermalink: "$e/Agents/listAgentShops",
          verify,
        });
      },
    },
    "Step 3": {
      name: "Read the product",
      stepCallback: async () => {
        return workflowCtx.showEndpoint({
          description:
            "Read one product before ordering: price, shipping, `total`, stock, any sizes or colours to ask the buyer about, and the `order_url` to use. Set `slug` to `raptor-rush`, a browser game sold with access codes.",
          endpointPermalink: "$e/Agents/getAgentProduct",
          verify,
        });
      },
    },
    "Step 4": {
      name: "Place the order",
      stepCallback: async () => {
        return workflowCtx.showEndpoint({
          description:
            "Order with a link: set `slug` to `raptor-rush` and leave `Size` empty (the game has no options). The reply has a PayPal `pay_url` for the buyer and a `status_url` to check later. Open `pay_url` and approve with a PayPal sandbox buyer account to pay.",
          endpointPermalink: "$e/Agents/orderByLink",
          verify,
        });
      },
    },
    "Step 5": {
      name: "Check the order",
      stepCallback: async () => {
        return workflowCtx.showEndpoint({
          description:
            "Paste the `order_id` from the last step. Before the buyer pays, `status` is `awaiting_buyer_approval`. Once paid it's `paid`, and `delivery` holds what the buyer gets: for Raptor Rush, an access code that unlocks the game.",
          endpointPermalink: "$e/Agents/getAgentOrder",
          verify,
        });
      },
    },
    "Step 6": {
      name: "Try it with your own assistant",
      stepCallback: async () => {
        return workflowCtx.showContent(`## Try it with your own assistant

Ask Grok or Kimi: *"Buy me the Dragon Flight T-Shirt from one-thing-ash0.onrender.com/dragon-flight-t-shirt"*.
It makes the calls you just made and sends you the PayPal link.

For ChatGPT, Gemini, Claude, Cursor or VS Code, add the MCP server with the steps at
[one-thing-ash0.onrender.com/mcp](https://one-thing-ash0.onrender.com/mcp). Agents without either can
start from [/llms.txt](https://one-thing-ash0.onrender.com/llms.txt).

The seller sees each agent order on their manage page, credited to the assistant that placed it.`);
      },
    },
  };
}
