# Pay Pal Status

Source: /#/python/x-redirect/JTI0bSUyRlBheVBhbFN0YXR1cw

What PayPal last said about a connected seller account.


# Class Name

`PayPalStatus`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `receivable` | `bool` | Required | The account can receive payments. |
| `email_confirmed` | `bool` | Required | The seller has confirmed their email with PayPal. |
| `checked_at` | `datetime` | Required | When OneThing last asked PayPal. |


# Example

```python
import dateutil.parser

from onethingapi.models.pay_pal_status import PayPalStatus

pay_pal_status = PayPalStatus(
    receivable=True,
    email_confirmed=True,
    checked_at=dateutil.parser.parse('2026-10-22T02:41:37Z')
)
```



