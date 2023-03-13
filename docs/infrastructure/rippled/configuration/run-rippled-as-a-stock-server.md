---
html: run-rippled-as-a-stock-server.html
parent: configure-rippled.html
blurb: A multipurpose configuration for anyone integrating XRP.
labels:
  - Core Server
---
# Run rippled as a Stock Server

A stock server is a multipurpose configuration for `rippled`. With a stock server, you can submit transactions to the XRP Ledger, access ledger history, and use the latest tools to integrate with XRP. It is also a server that you can use to connect a wallet with the XRPL.


A stock server does all of the following:

- Connects to a network of peers

- Relays cryptographically signed transactions

- Maintains a local copy of the complete shared global ledger


To participate in the consensus process as a validator, run rippled as a validator instead. See [Run rippled as a validator](run-rippled-as-a-validator.md)


## Install and run `rippled`

The default package installation installs a stock server with a small amount of transaction history. For installation steps, see [Install `rippled`](../installation/index.mdx).

After installation, you can adjust how much history your server stores at a time. For steps on how to do this, see [Configure Online Deletion](../configuration/configure-online-deletion.md).

## Troubleshooting

For more information, see [Troubleshooting `rippled`](../troubleshooting/index.mdx)


## See Also

- **Understanding the XRPL:**
    - [XRP Ledger Overview](xrp-ledger-overview.html)
    - [Consensus Network](consensus-network.html)
    - [The `rippled` Server](../../../concepts/understanding-xrpl/server/rippled-server.md)
- **XRPL Infrastructure:**
    - [Cluster rippled Servers](../configure-peering/cluster-rippled-servers.md)
    - [Install `rippled`](../installation/index.mdx)
    - [Capacity Planning](../installation/capacity-planning.md)
- **Tutorials**
    - [XRP Ledger Businesses](xrp-ledger-businesses.html)
- **API Reference:**
    - [Validator Keys Tool Guide](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md)
    - [consensus_info method][]
    - [validator_list_sites method][]
    - [validators method][]


<!--{# common link defs #}-->
<!-- {% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %} -->
