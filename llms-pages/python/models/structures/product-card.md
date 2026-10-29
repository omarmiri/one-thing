# Product Card

Source: /#/python/x-redirect/JTI0bSUyRlByb2R1Y3RDYXJk

A Channel3 product in search results.


# Class Name

`ProductCard`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `id` | `str` | Required | Channel3's product id: pass it to `createShop` as `productId`. |
| `title` | `str` | Required | The product's name. |
| `brand` | `str` | Optional | The brand, when known. |
| `image` | `str` | Required | The product image's URL. |
| `price` | `float` | Required | The best offer's price. |
| `currency` | `str` | Required | ISO 4217 currency code. |
| `retailer` | `str` | Required | The store with the best offer. |
| `retailers` | `int` | Required | How many stores sell it. |
| `commission` | `float` | Required | Best commission rate across offers, 0–1. |


# Example

```python
from onethingapi.models.product_card import ProductCard

product_card = ProductCard(
    id='ch3_7f2a9c1e',
    title='Trail Running Vest 5L',
    image='https://images.example.com/vest.jpg',
    price=240,
    currency='USD',
    retailer='rei.com',
    retailers=4,
    commission=0.08,
    brand='Salomon'
)
```



