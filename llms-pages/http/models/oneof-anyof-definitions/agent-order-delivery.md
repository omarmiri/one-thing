# Agent Order Delivery

Source: /#/http/x-redirect/JTI0bSUyRkFnZW50T3JkZXJEZWxpdmVyeQ


# Data Type

`Agent Delivery Access Code | Agent Delivery Download | Agent Delivery Shipping`


# Cases

| Type |
|  --- |
| [`Agent Delivery Access Code`](/llms-pages/http/models/structures/agent-delivery-access-code.md) |
| [`Agent Delivery Download`](/llms-pages/http/models/structures/agent-delivery-download.md) |
| [`Agent Delivery Shipping`](/llms-pages/http/models/structures/agent-delivery-shipping.md) |


# Agent Delivery Access Code

## Initialization Code

### Example

```bash
{
  "type": "access_code",
  "access_code": "K7QF-M2XP-9HTD",
  "start_url": "https://www.miriogames.com/raptor-rush/?code=K7QF-M2XP-9HTD"
}
```


# Agent Delivery Download

## Initialization Code

### Example

```bash
{
  "type": "download",
  "download_url": "https://one-thing-ash0.onrender.com/api/download/dl_4mQ8sT2vX9",
  "note": "Works 5 times over 14 days."
}
```


# Agent Delivery Shipping

## Initialization Code

### Example

```bash
{
  "type": "shipping",
  "ship_to": {
    "name": "Sam Rivera",
    "address": "1 Main St, Springfield, IL, 62701, US"
  },
  "fulfillment": "to_ship",
  "tracking": {
    "carrier": "USPS",
    "number": "9400111899223197428490"
  }
}
```



