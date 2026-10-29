# Api Channel 3 Search Response

Source: /#/python/x-redirect/JTI0bSUyRkFwaSUyNTIwQ2hhbm5lbDMlMjUyMFNlYXJjaCUyNTIwUmVzcG9uc2U

The products found.


# Class Name

`ApiChannel3SearchResponse`


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `products` | [`List[ProductCard]`](/llms-pages/python/models/structures/product-card.md) | Required | Products, best match first. |


# Example

```python
from onethingapi.models.api_channel_3_search_response import ApiChannel3SearchResponse
from onethingapi.models.product_card import ProductCard

api_channel_3_search_response = ApiChannel3SearchResponse(
    products=[
        ProductCard(
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
    ]
)
```



