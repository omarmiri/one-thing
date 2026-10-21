# Check Link Name

Source: /#/python/x-redirect/JTI0ZSUyRkxpbmtzJTJGY2hlY2tMaW5rTmFtZQ

Normalises a proposed link name and says whether a new shop can use it.

:information_source: **Note** This endpoint does not require authentication.

```python
def check_link_name(self,
                   name)
```


# Parameters

| Parameter | Type | Tags | Description |
|  --- | --- | --- | --- |
| `name` | `str` | Query, Required | Anything; it is normalised (`Raptor Rush` becomes `raptor-rush`). |


# Response Type

**200**: The normalised name and whether it can be used.

[`ApiSlugsCheckResponse`](/llms-pages/python/models/structures/api-slugs-check-response.md)


# Example Usage

```python
name = 'name0'

result = links_api.check_link_name(name)
print(result)
```



