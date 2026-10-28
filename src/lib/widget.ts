import "server-only";
import { appUrl } from "./ids";

// The card ChatGPT (and other MCP Apps hosts) draws under search_shops, get_product and
// create_order: photos, price, option pickers and a Pay with PayPal button, instead of trusting
// the chat to render show_buyer's Markdown images. One template for all three; it picks a layout
// from the tool result's shape. Bump the version in the URI when the HTML changes: hosts cache it.
export const WIDGET_URI = "ui://onething/shop-card-v1.html";
export const WIDGET_MIME = "text/html;profile=mcp-app";

/** The template's _meta: where its images come from and where its buttons may send the buyer. */
export function widgetMeta() {
  const origin = new URL(appUrl()).origin;
  const paypal = ["https://www.paypal.com", "https://www.sandbox.paypal.com"];
  return {
    ui: { csp: { connectDomains: [], resourceDomains: [origin] }, prefersBorder: true },
    // ChatGPT's own keys: openExternal only opens links to redirect_domains.
    "openai/widgetCSP": { connect_domains: [], resource_domains: [origin], redirect_domains: [origin, ...paypal] },
    "openai/widgetDescription": "A OneThing product card: photo, price, options and a Pay with PayPal button.",
  };
}

/** What a tool linked to the card adds to its tools/list entry. */
export const widgetToolMeta = (invoking: string, invoked: string) => ({
  ui: { resourceUri: WIDGET_URI },
  "openai/outputTemplate": WIDGET_URI,
  "openai/widgetAccessible": true, // the card calls create_order itself
  "openai/toolInvocation/invoking": invoking,
  "openai/toolInvocation/invoked": invoked,
});

// The tool result arrives one of two ways, so the script listens for both: ChatGPT's
// window.openai.toolOutput (and its openai:set_globals event), and the MCP Apps postMessage
// bridge (ui/initialize, then ui/notifications/tool-result). Seller text only ever goes into
// textContent, never innerHTML.
export const WIDGET_HTML = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root{--bg:#fff;--fg:#16161a;--muted:#6b6b76;--line:#e6e6ea;--chip:#f4f4f6;--accent:#0070e0;--accent-fg:#fff;--ok:#1a7f37}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#1b1b1f;--fg:#f2f2f5;--muted:#a0a0ab;--line:#33333a;--chip:#26262c;--accent:#4aa3ff;--accent-fg:#0b0b0d;--ok:#4ac26b}}
:root[data-theme="dark"]{--bg:#1b1b1f;--fg:#f2f2f5;--muted:#a0a0ab;--line:#33333a;--chip:#26262c;--accent:#4aa3ff;--accent-fg:#0b0b0d;--ok:#4ac26b}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
#app{padding:12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.tile{border:1px solid var(--line);border-radius:12px;overflow:hidden;cursor:pointer;background:var(--bg);text-align:left;padding:0;color:inherit;font:inherit}
.tile:hover{border-color:var(--accent)}
.tile img,.hero{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:var(--chip)}
.tile div{padding:8px 10px}.tile .blank{aspect-ratio:1;padding:0;background:var(--chip)}
.name{font-weight:600}.muted{color:var(--muted)}.price{font-weight:600}
.card{display:grid;grid-template-columns:minmax(0,200px) 1fr;gap:14px;align-items:start}
@media (max-width:460px){.card{grid-template-columns:1fr}}
.hero{border-radius:12px}
h2{font-size:17px;margin:0 0 2px}
.opt{margin:10px 0 0}.opt b{display:block;font-size:12px;color:var(--muted);font-weight:600;margin-bottom:4px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chips button{border:1px solid var(--line);background:var(--chip);color:var(--fg);border-radius:999px;padding:4px 10px;font:inherit;cursor:pointer}
.chips button[aria-pressed="true"]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.chips button:disabled{opacity:.4;text-decoration:line-through;cursor:default}
.pay{margin-top:12px;width:100%;border:0;border-radius:999px;padding:10px 14px;background:var(--accent);color:var(--accent-fg);font-family:inherit;font-size:15px;font-weight:600;cursor:pointer}
.pay:disabled{opacity:.5;cursor:default}
.note{margin-top:8px;font-size:12px;color:var(--muted)}.err{color:#d1242f}.paid{color:var(--ok);font-weight:600}
</style></head>
<body><div id="app"><p class="muted">Loading…</p></div>
<script>
(function(){
  var app=document.getElementById("app"), shown=null, nextId=1, pending={};
  var oa=function(){return window.openai||null};
  function theme(){var t=oa()&&oa().theme;if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}

  // ---- host bridge ----
  function rpc(method,params){
    var id=nextId++;
    window.parent.postMessage({jsonrpc:"2.0",id:id,method:method,params:params},"*");
    return new Promise(function(res,rej){pending[id]={res:res,rej:rej};setTimeout(function(){if(pending[id]){delete pending[id];rej(new Error("timeout"))}},20000)});
  }
  function notify(method,params){window.parent.postMessage({jsonrpc:"2.0",method:method,params:params||{}},"*")}
  window.addEventListener("message",function(e){
    if(e.source!==window.parent)return;var m=e.data;if(!m||m.jsonrpc!=="2.0")return;
    if(m.id!=null&&pending[m.id]&&!m.method){var p=pending[m.id];delete pending[m.id];m.error?p.rej(new Error(m.error.message||"error")):p.res(m.result);return}
    if(m.method==="ui/notifications/tool-result")show(m.params&&m.params.structuredContent);
  });
  window.addEventListener("openai:set_globals",function(e){theme();var g=e.detail&&e.detail.globals;if(g&&g.toolOutput)show(g.toolOutput)});
  rpc("ui/initialize",{appInfo:{name:"onething-card",version:"1"},appCapabilities:{},protocolVersion:"2026-01-26"})
    .then(function(){notify("ui/notifications/initialized")},function(){});
  theme();if(oa()&&oa().toolOutput)show(oa().toolOutput);

  function callTool(name,args){
    var p=oa()&&oa().callTool?oa().callTool(name,args):rpc("tools/call",{name:name,arguments:args});
    return p.then(function(r){r=r||{};var sc=r.structuredContent||(r.result&&r.result.structuredContent);
      if(r.isError||!sc){var t=r.content&&r.content[0]&&r.content[0].text;try{t=JSON.parse(t).error}catch(_){}throw new Error(t||"That didn't work. Try again.")}
      return sc});
  }
  function open(url){
    if(oa()&&oa().openExternal)return oa().openExternal({href:url,redirectUrl:false});
    rpc("ui/open-link",{url:url}).catch(function(){window.open(url,"_blank","noopener")});
  }
  function say(text){
    if(oa()&&oa().sendFollowUpMessage)return oa().sendFollowUpMessage({prompt:text});
    rpc("ui/message",{role:"user",content:[{type:"text",text:text}]}).catch(function(){});
  }
  function resized(){notify("ui/notifications/size-changed",{width:document.body.scrollWidth,height:document.body.scrollHeight});if(oa()&&oa().notifyIntrinsicHeight)oa().notifyIntrinsicHeight(document.body.scrollHeight)}
  if(window.ResizeObserver)new ResizeObserver(resized).observe(document.body);

  // ---- drawing ----
  function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=String(text);return n}
  function money(n,c){try{return new Intl.NumberFormat(undefined,{style:"currency",currency:c}).format(n)}catch(_){return n.toFixed(2)+" "+c}}
  function img(src,cls){if(!src||!/^https?:/i.test(src))return null;var i=el("img",cls);i.src=src;i.alt="";i.loading="lazy";i.onerror=function(){i.remove()};return i}
  function show(data){
    if(!data||typeof data!=="object")return;var key=JSON.stringify(data);if(key===shown)return;shown=key;
    app.textContent="";
    if(Array.isArray(data.shops))list(data.shops);
    else if(data.pay_url)order(data);
    else if(data.shop&&data.name)product(data);
    else app.appendChild(el("p","muted",data.show_buyer||""));
    resized();
  }
  function list(shops){
    if(!shops.length){app.appendChild(el("p","muted","Nothing in the OneThing gallery matches that yet."));return}
    var g=el("div","grid");
    shops.forEach(function(s){
      var t=el("button","tile");t.type="button";t.appendChild(img(s.image)||el("div","blank"));
      var d=el("div");d.appendChild(el("div","name",s.name));if(s.price)d.appendChild(el("div","price",s.price));d.appendChild(el("div","muted",s.headline));
      t.appendChild(d);t.onclick=function(){say("Show me "+s.name+" (OneThing shop \\""+s.shop+"\\").")};g.appendChild(t);
    });
    app.appendChild(g);
  }
  function product(p){
    var c=el("div","card"),i=img(p.images&&p.images[0],"hero");if(i)c.appendChild(i);
    var b=el("div");b.appendChild(el("h2",null,p.name));
    if(p.price)b.appendChild(el("div","price",p.price.label+(p.shipping&&p.shipping.amount?" + "+money(p.shipping.amount,p.shipping.currency)+" shipping":"")));
    b.appendChild(el("div","muted",p.headline));
    if(p.offers){
      p.offers.forEach(function(o){var x=el("button","pay","Buy at "+o.retailer+" ("+o.price+" "+o.currency+")");x.type="button";x.onclick=function(){open(o.url)};b.appendChild(x)});
      c.appendChild(b);app.appendChild(c);return;
    }
    var opts=p.options||[],pick={},note=el("div","note"),btn=el("button","pay");btn.type="button";
    var sold=function(){return (p.variants||[]).some(function(v){return opts.every(function(o){return v.choice[o.name]===pick[o.name]})&&v.availability==="sold_out"})};
    function refresh(){
      var missing=opts.filter(function(o){return !pick[o.name]});
      btn.disabled=p.availability==="sold_out"||missing.length>0||sold();
      btn.textContent=p.availability==="sold_out"?"Sold out":missing.length?"Choose "+missing.map(function(o){return o.name.toLowerCase()}).join(" and "):sold()?"Sold out":"Buy with PayPal"+(p.total?" · "+money(p.total.amount,p.total.currency):"");
    }
    opts.forEach(function(o){
      var w=el("div","opt");w.appendChild(el("b",null,o.name));var row=el("div","chips");
      o.values.forEach(function(v){var x=el("button",null,v);x.type="button";x.setAttribute("aria-pressed","false");
        x.onclick=function(){pick[o.name]=v;Array.prototype.forEach.call(row.children,function(y){y.setAttribute("aria-pressed",y===x?"true":"false")});refresh()};row.appendChild(x)});
      w.appendChild(row);b.appendChild(w);
    });
    btn.onclick=function(){
      btn.disabled=true;btn.textContent="Starting checkout…";note.textContent="";
      callTool("create_order",opts.length?{shop:p.shop,options:pick}:{shop:p.shop}).then(function(o){shown=null;show(o)},function(err){note.className="note err";note.textContent=err.message;refresh()});
    };
    refresh();b.appendChild(btn);note.textContent=p.delivery||"";b.appendChild(note);c.appendChild(b);app.appendChild(c);
  }
  function order(o){
    var b=el("div");b.appendChild(el("h2",null,"Ready to pay"));
    var opts=o.options?Object.keys(o.options).map(function(k){return o.options[k]}).join(" · "):"";
    b.appendChild(el("div","muted",(opts?opts+" · ":"")+o.total+" total"));
    var btn=el("button","pay","Pay "+o.total+" with PayPal");btn.type="button";btn.onclick=function(){open(o.pay_url)};b.appendChild(btn);
    var done=el("button","pay","I've paid");done.type="button";done.style.background="var(--chip)";done.style.color="var(--fg)";
    done.onclick=function(){say("I've paid for order "+o.order_id+".")};b.appendChild(done);
    b.appendChild(el("div","note","You pay at PayPal. Nothing is charged until you approve it there."));
    app.appendChild(b);
  }
})();
</script></body></html>`;
