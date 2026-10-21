# Referral

Source: /#/python/x-redirect/JTI0bSUyRlJlZmVycmFs

A recommended Channel3 product. Buy links are Channel3-tracked, credited to this shop.


# Class Name

`Referral`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `product_id` | `str` | Required | - |
| `title` | `str` | Required | - |
| `brand` | `str` | Optional | - |
| `image` | `str` | Optional | - |
| `offers` | [`List[Offer]`](/llms-pages/python/models/structures/offer.md) | Required | - |


# Example

```python
from onethingapi.models.offer import Offer
from onethingapi.models.referral import Referral

referral = Referral(
    product_id='productId6',
    title='title8',
    offers=[
        Offer(
            domain='domain0',
            url='url8',
            price=134.28,
            currency='currency4',
            in_stock=False,
            commission=2.62
        )
    ],
    brand='brand6',
    image='image4'
)
```



