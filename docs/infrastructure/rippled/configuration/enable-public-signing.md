---
html: enable-public-signing.html
parent: configure-rippled.html
blurb: Allow others to use your server to sign transactions. (Not recommended)
labels:
  - Core Server
  - Security
---
# Enable Public Signing

By default, the signing methods for `rippled` are limited to administrative connections. If you want to allow signing methods to be used as public API methods (like with versions of `rippled` before v1.1.0), you can enable it with a configuration change.

This enables the following methods to be used on "public" JSON-RPC and WebSocket connections, if your server accepts them:

- [sign][sign method]
- [sign_for][sign_for method]
- [submit][submit method] (in "sign-and-submit" mode)

You _do not_ need to enable public signing to use these methods from an admin connection.

**Caution:** Ripple does not recommend enabling public signing. Like the [wallet_propose method][], the signing commands do not perform any actions that would require administrative-level permissions, but restricting them to admin connections protects users from irresponsibly sending or receiving secret keys over unsecured communications, or to servers they do not control.

To enable public signing, perform the following steps:

1. Edit your `rippled` config file.

        vim /etc/opt/ripple/rippled.cfg

    The [recommended installation](../installation/index.mdx) uses the config file `/etc/opt/ripple/rippled.cfg` by default. Other places you can put a config file include `$HOME/.config/ripple/rippled.cfg` (where `$HOME` is the home directory of the user running `rippled`), `$HOME/.local/ripple/rippled.cfg`, or the current working directory from where you start `rippled`.

2. Add the following stanza to your config file, and save the changes:

        [signing_support]
        true

3. Restart your `rippled` server:

        systemctl restart rippled

## See Also

- **Understanding the XRPL:**
    - [Transaction Basics](transaction-basics.html)
    - [Cryptographic Keys](../../../concepts/understanding-xrpl/accounts/cryptographic-keys.md)
- **Tutorials:**
    - [Set Up Secure Signing](set-up-secure-signing.html)
    - [Get Started Using JavaScript](get-started-using-javascript.html)
    - [Get Started Using HTTP / WebSocket APIs](get-started-using-http-websocket-apis.html)
- **API Reference:**
    - [sign method][]
    - [sign_for method][]
    - [submit method][]


<!--{# common link defs #}-->
<!-- {% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %} -->
