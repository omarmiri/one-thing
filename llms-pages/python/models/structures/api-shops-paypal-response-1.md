# Api Shops Paypal Response 1

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFBheXBhbCUyNTIwUmVzcG9uc2Ux


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
    merchant_id='merchantId0',
    status=PayPalStatus(
        receivable=False,
        email_confirmed=False,
        checked_at=dateutil.parser.parse('2016-03-13T12:52:32.123Z')
    )
)
```



