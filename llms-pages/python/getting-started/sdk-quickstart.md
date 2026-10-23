# SDK Quickstart

Source: /#/python/x-redirect/JTI0aCUyRl9fZ2V0dGluZ19zdGFydGVk


# Introduction

OneThing turns a photo, a link or a picked product into a live one-product shop that takes
PayPal payments, or a recommendation page that earns referral commissions through Channel3.

**How a shop is made**

1. `createShop`: start from a photo, a link, or a Channel3 product. Gemini guesses what it
   is, how it's delivered, the price, a short link and the page design. You get back the
   shop's link name and an **admin token**.
2. `updateShop`: correct anything the AI guessed, then set `status: live`.
3. Buyers pay on `https://<host>/<slug>` with PayPal. Sellers read orders and ship them.

**Auth.** Seller endpoints take the shop's admin token in the `x-admin-token` header, or a
**platform API key** (`Authorization: Bearer ot_sk_…`) for marketplaces that make shops for
their own sellers. Buyer endpoints (checkout, access-code verification, downloads) are public.

**Access codes.** A digital product can unlock an app or game instead of shipping a file.
Each paid order gets a code such as `K7QF-M2XP-9HTD`; your app calls `verifyAccessCode`
before unlocking. Raptor Rush on miriogames.com is a live example.

**Agent-ready.** Every live shop is also published for AI shopping agents: an MCP server at
`/api/mcp` with `search_shops`, `get_product`, `create_order` and `get_order`, and the same
four as plain GETs for assistants that can only fetch URLs (`listAgentShops`,
`getAgentProduct`, `orderByLink`, `getAgentOrder`), with `/llms.txt` as the starting point.
An agent can find and order, but the buyer still approves every payment at PayPal.

All money moves through PayPal (sandbox in this deployment). OneThing never holds card data.


# Install the Package

The package is compatible with Python versions `3.7+`.
Install the package from PyPi using the following pip command:

```bash
pip install one-thing-sdk==1.0.0
```

You can also view the package at:
https://pypi.python.org/pypi/one-thing-sdk/1.0.0


# Environments

The SDK can be configured to use a different environment for making API calls. Available environments are:

## Fields

| Name | Description |
|  --- | --- |
| PRODUCTION | **Default** Hackathon deployment (PayPal sandbox) |
| LOCAL | Local development |


# Initialize the API Client

The following parameters are configurable for the API Client:

| Parameter | Type | Description |
|  --- | --- | --- |
| environment | [`Environment`](/llms-pages/python/getting-started/sdk-quickstart/environments.md) | The API environment. <br> **Default: `Environment.PRODUCTION`** |
| http_client_instance | `Union[Session, HttpClientProvider]` | The Http Client passed from the sdk user for making requests |
| override_http_client_configuration | `bool` | The value which determines to override properties of the passed Http Client from the sdk user |
| http_call_back | `HttpCallBack` | The callback value that is invoked before and after an HTTP call is made to an endpoint |
| timeout | `float` | The value to use for connection timeout. <br> **Default: 60** |
| max_retries | `int` | The number of times to retry an endpoint call if it fails. <br> **Default: 0** |
| backoff_factor | `float` | A backoff factor to apply between attempts after the second try. <br> **Default: 2** |
| retry_statuses | `Array of int` | The http statuses on which retry is to be done. <br> **Default: [408, 413, 429, 500, 502, 503, 504, 521, 522, 524, 408, 413, 429, 500, 502, 503, 504, 521, 522, 524]** |
| retry_methods | `Array of string` | The http methods on which retry is to be done. <br> **Default: ["GET", "PUT", "GET", "PUT"]** |
| proxy_settings | [`ProxySettings`](/llms-pages/python/sdk-infrastructure/configuration/proxysettings.md) | Optional proxy configuration to route HTTP requests through a proxy server. |
| admin_token_credentials | [`AdminTokenCredentials`](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) | The credential object for Custom Header Signature |
| platform_key_credentials | [`PlatformKeyCredentials`](/llms-pages/python/getting-started/sdk-quickstart/authorization.md) | The credential object for OAuth 2 Bearer token |

The API client can be initialized as follows:

## Code-Based Client Initialization

```python
from onethingapi.configuration import Environment
from onethingapi.http.auth.admin_token import AdminTokenCredentials
from onethingapi.http.auth.platform_key import PlatformKeyCredentials
from onethingapi.onethingapi_client import OnethingapiClient

client = OnethingapiClient(
    admin_token_credentials=AdminTokenCredentials(
        x_admin_token='x-admin-token'
    ),
    platform_key_credentials=PlatformKeyCredentials(
        access_token='AccessToken'
    ),
    environment=Environment.PRODUCTION
)
```

## Environment-Based Client Initialization

```python
from onethingapi.onethingapi_client import OnethingapiClient

# Specify the path to your .env file if it’s located outside the project’s root directory.
client = OnethingapiClient.from_environment(dotenv_path='/path/to/.env')
```

See the [Environment-Based Client Initialization](/llms-pages/python/sdk-infrastructure/configuration/environment-based-client-initialization.md) section for details.


# Authorization

This API uses the following authentication schemes.

* [`AdminToken (Custom Header Signature)`](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)
* [`PlatformKey (OAuth 2 Bearer token)`](/llms-pages/python/getting-started/sdk-quickstart/authorization.md)

## AdminToken (Custom Header Signature)



Documentation for accessing and setting credentials for AdminToken.

### Auth Credentials

| Name | Type | Description | Getter |
|  --- | --- | --- | --- |
| x-admin-token | `str` | The shop's admin token, returned once by `createShop`. Keep it secret. | `x_admin_token` |



**Note:** Auth credentials can be set using `AdminTokenCredentials` object, passed in as named parameter `admin_token_credentials` in the client initialization.

### Usage Example

#### Client Initialization

You must provide credentials in the client as shown in the following code snippet.

```python
from onethingapi.http.auth.admin_token import AdminTokenCredentials
from onethingapi.onethingapi_client import OnethingapiClient

client = OnethingapiClient(
    admin_token_credentials=AdminTokenCredentials(
        x_admin_token='x-admin-token'
    )
)
```

## PlatformKey (OAuth 2 Bearer token)



Documentation for accessing and setting credentials for PlatformKey.

### Auth Credentials

| Name | Type | Description | Getter |
|  --- | --- | --- | --- |
| AccessToken | `str` | The OAuth 2.0 Access Token to use for API requests. | `access_token` |



**Note:** Auth credentials can be set using `PlatformKeyCredentials` object, passed in as named parameter `platform_key_credentials` in the client initialization.

### Usage Example

#### Client Initialization

You must provide credentials in the client as shown in the following code snippet.

```python
from onethingapi.http.auth.platform_key import PlatformKeyCredentials
from onethingapi.onethingapi_client import OnethingapiClient

client = OnethingapiClient(
    platform_key_credentials=PlatformKeyCredentials(
        access_token='AccessToken'
    )
)
```




