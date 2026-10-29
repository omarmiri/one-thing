# Api Shops Paypal Response 1

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFBheXBhbCUyNTIwUmVzcG9uc2Ux

The shop's PayPal connection.


# Class Name

`ApiShopsPaypalResponse1`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `merchant_id` | `str` | Required | The seller's PayPal merchant id. |
| `status` | [PayPalStatus](/llms-pages/python/models/structures/pay-pal-status.md) \| None | Required | This is a container for one-of cases. |


# Example

```python
import dateutil.parser

from onethingapi.models.api_shops_paypal_response_1 import ApiShopsPaypalResponse1
from onethingapi.models.pay_pal_status import PayPalStatus

api_shops_paypal_response_1 = ApiShopsPaypalResponse1(
    merchant_id='7MZJ4QXN8K2LA',
    status=PayPalStatus(
        receivable=True,
        email_confirmed=True,
        checked_at=dateutil.parser.parse('2026-10-22T02:41:37Z')
    )
)
```



