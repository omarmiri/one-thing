# Api Shops Paypal Response 1

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFBheXBhbCUyNTIwUmVzcG9uc2Ux

The shop's PayPal connection.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `merchantId` | `String` | Required | The seller's PayPal merchant id. |
| `status` | [`Pay Pal Status`](/llms-pages/http/models/oneof-anyof-definitions/api-shops-paypal-response-1-status.md) | Required | What PayPal last said; null when nothing is connected. |


# Example (as JSON)

```json
{
  "merchantId": "7MZJ4QXN8K2LA",
  "status": {
    "receivable": true,
    "emailConfirmed": true,
    "checkedAt": "2026-10-22T02:41:37Z"
  }
}
```



