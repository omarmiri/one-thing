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
| `checked_at` | `datetime` | Required | - |


# Example

```python
import dateutil.parser

from onethingapi.models.pay_pal_status import PayPalStatus

pay_pal_status = PayPalStatus(
    receivable=False,
    email_confirmed=False,
    checked_at=dateutil.parser.parse('2016-03-13T12:52:32.123Z')
)
```



