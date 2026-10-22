# Api Shops Paypal Request

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFBheXBhbCUyNTIwUmVxdWVzdA


# Class Name

`ApiShopsPaypalRequest`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `return_url` | `str` | Optional | Platform key only. Where to send the seller after PayPal. |


# Example

```python
from onethingapi.models.api_shops_paypal_request import ApiShopsPaypalRequest

api_shops_paypal_request = ApiShopsPaypalRequest(
    return_url='https://www.miriogames.com/market/manage/?g=7Hq2'
)
```



