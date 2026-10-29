# Pay Pal Status

Source: /#/http/x-redirect/JTI0bSUyRlBheVBhbFN0YXR1cw

What PayPal last said about a connected seller account.


# Fields

| Name | Type | Tags | Description |
|  --- | --- | --- | --- |
| `receivable` | `Boolean` | Required | The account can receive payments. |
| `emailConfirmed` | `Boolean` | Required | The seller has confirmed their email with PayPal. |
| `checkedAt` | `DateTime` | Required | When OneThing last asked PayPal. |


# Example (as JSON)

```json
{
  "receivable": true,
  "emailConfirmed": true,
  "checkedAt": "2026-10-22T02:41:37Z"
}
```



