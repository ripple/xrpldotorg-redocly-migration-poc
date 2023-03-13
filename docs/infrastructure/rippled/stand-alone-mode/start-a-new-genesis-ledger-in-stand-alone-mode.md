---
html: start-a-new-genesis-ledger-in-stand-alone-mode.html
parent: use-stand-alone-mode.html
blurb: Start from a fresh genesis ledger in stand-alone mode.
labels:
  - Core Server
---
# Start a New Genesis Ledger in Stand-Alone Mode

In stand-alone mode, you can have `rippled` create a new genesis ledger. This provides a known state, with none of the ledger history from the production XRP Ledger. (This is very useful for unit tests, among other things.)

* To start `rippled` in stand-alone mode with a new genesis ledger, use the `-a` and `--start` options:

```
rippled -a --start --conf=/path/to/rippled.cfg
```

For more information on the options you can use when starting `rippled` in stand-alone mode, see [Commandline Usage: Stand-Alone Mode Options](../../../references/http-websocket-apis/commandline-usage.md#stand-alone-mode-options).

In a genesis ledger, the genesis address holds all 100 billion XRP. The keys of the genesis address are hardcoded as follows:

**Address:** `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh`

**Secret:** `snoPBrXtMeMyMHUVTgbuqAfg1SUTb` ("`masterpassphrase`")

## Settings in New Genesis Ledgers

In a new genesis ledger, the hard-coded default reserve is **200 XRP** minimum for funding a new address, with an increment of **50 XRP** per object in the ledger. These values are higher than the current reserve requirements of the production network. (See also: [Fee Voting](../../../concepts/understanding-xrpl/xrpl/fee-voting.md))

By default, a new genesis ledger has no amendments enabled. If you start a new genesis ledger with `--start`, the genesis ledger contains an [EnableAmendment pseudo-transaction](../../../references/protocol-reference/transactions/pseudo-transaction-types/enableamendment.md) to turn on all amendments natively supported by the `rippled` server, except for amendments that you explicitly disable in the config file. The effects of those amendments are available starting from the very next ledger version. (Reminder: in stand-alone mode, you must [advance the ledger manually](advance-the-ledger-in-stand-alone-mode.md).)

## See Also

- **Understanding the XRPL:**
    - [The `rippled` Server](../../../concepts/understanding-xrpl/server/rippled-server.md)
        - [`rippled` Server Modes](../../rippled-server-modes.md)
    - [Parallel Networks](../../../concepts/understanding-xrpl/networks/parallel-networks.md)
    - [Fee Voting](../../../concepts/understanding-xrpl/xrpl/fee-voting.md)
- **Amendments:**
    - [Amendments](../../../amendments/amendments.md)
- **API Reference:**
    - [ledger_accept method][]
    - [server_info method][]
    - [`rippled` Commandline Usage](../../../references/http-websocket-apis/commandline-usage.md)
- **Use Cases:**
    - [Contribute Code to the XRP Ledger](../../../../community/contribute-code.md)

<!--{# common link defs #}-->
<!-- {% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %} -->
