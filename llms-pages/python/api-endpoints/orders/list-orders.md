# List Orders

Source: /#/python/x-redirect/JTI0ZSUyRk9yZGVycyUyRmxpc3RPcmRlcnM

Newest first. Checkouts that were never approved are left out.

```python
def list_orders(self,
               slug)
```


# Authentication

This endpoint requires [AdminToken](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) **OR** [PlatformKey](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `slug` | `str` | Template, Required | The shop's link name (current or former). |


# Response Type

**200**: Orders.

[`List[Order]`](/llms-pages/python/models/structures/order.md)


# Example Usage

```python
slug = 'raptorrush'

result = orders_api.list_orders(slug)
print(result)
```


# Errors

| HTTP Status Code | Error Description | Exception Class |
|  --- | --- | --- |
| 404 | No such shop, or the admin token or API key doesn't match it. | [`ErrorException`](/llms-pages/python/models/exceptions/error.md) |



