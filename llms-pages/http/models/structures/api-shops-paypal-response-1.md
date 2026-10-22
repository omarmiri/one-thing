# Api Shops Paypal Response 1

Source: /#/http/x-redirect/JTI0bSUyRkFwaSUyNTIwU2hvcHMlMjUyMFBheXBhbCUyNTIwUmVzcG9uc2Ux


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `merchantId` | `String` | Required | The seller's PayPal merchant id. |
| `status` | [`Pay Pal Status`](/llms-pages/http/models/oneof-anyof-definitions/api-shops-paypal-response-1-status.md) | Required | - |


# Example (as JSON)

```json
{
  "merchantId": "merchantId0",
  "status": {
    "receivable": false,
    "emailConfirmed": false,
    "checkedAt": "2016-03-13T12:52:32.123Z"
  }
}
```



