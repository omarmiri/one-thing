# Referral

Source: /#/python/x-redirect/JTI0bSUyRlJlZmVycmFs

A recommended Channel3 product. Buy links are Channel3-tracked, credited to this shop.


# Class Name

`Referral`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `product_id` | `str` | Required | Channel3's product id. |
| `title` | `str` | Required | The product's name. |
| `brand` | `str` | Optional | The brand, when known. |
| `image` | `str` | Optional | The product image's URL. |
| `offers` | [`List[Offer]`](/llms-pages/python/models/structures/offer.md) | Required | Stores that sell it, with tracked links. |


# Example

```python
from onethingapi.models.offer import Offer
from onethingapi.models.referral import Referral

referral = Referral(
    product_id='ch3_7f2a9c1e',
    title='Trail Running Vest 5L',
    offers=[
        Offer(
            domain='rei.com',
            url='https://buy.trychannel3.com/r/abc123',
            price=240,
            currency='USD',
            in_stock=True,
            commission=0.08
        )
    ],
    brand='Salomon',
    image='https://images.example.com/vest.jpg'
)
```



