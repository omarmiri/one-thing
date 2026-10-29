# Fulfillment Status

Source: /#/python/x-redirect/JTI0bSUyRkZ1bGZpbGxtZW50U3RhdHVz

`to_ship` and `shipped` for physical orders, `digital_sent` for digital ones, `none` before payment.


# Enum Type Name

`FulfillmentStatus`


# Fields

| Name |
|  --- |
| `NONE` |
| `TO_SHIP` |
| `SHIPPED` |
| `DIGITAL_SENT` |


# Example

```python
from onethingapi.models.fulfillment_status import FulfillmentStatus

fulfillment_status = FulfillmentStatus.NONE
```



