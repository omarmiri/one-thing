# Product Card

Source: /#/python/x-redirect/JTI0bSUyRlByb2R1Y3RDYXJk


# Class Name

`ProductCard`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Required | - |
| `title` | `str` | Required | - |
| `brand` | `str` | Optional | - |
| `image` | `str` | Required | - |
| `price` | `float` | Required | - |
| `currency` | `str` | Required | - |
| `retailer` | `str` | Required | The store with the best offer. |
| `retailers` | `int` | Required | - |
| `commission` | `float` | Required | Best commission rate across offers, 0–1. |


# Example

```python
from onethingapi.models.product_card import ProductCard

product_card = ProductCard(
    id='id8',
    title='title4',
    image='image8',
    price=180.66,
    currency='currency8',
    retailer='retailer8',
    retailers=178,
    commission=56.32,
    brand='brand2'
)
```



