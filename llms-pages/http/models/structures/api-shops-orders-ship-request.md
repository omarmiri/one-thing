# Api Shops Orders Ship Request

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyME9yZGVycyUyNTIwU2hpcCUyNTIwUmVxdWVzdA


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `carrier` | [`Carrier`](/llms-pages/http/models/enumerations/carrier.md) | Required | - |
| `carrierName` | `String` | Optional | Required when `carrier` is `OTHER`.<br><br>**Constraints**: *Maximum Length*: `60` |
| `trackingNumber` | `String` | Required | **Constraints**: *Minimum Length*: `4`, *Maximum Length*: `64` |


# Example (as JSON)

```json
{
  "carrier": "USPS",
  "carrierName": "carrierName4",
  "trackingNumber": "trackingNumber6"
}
```



