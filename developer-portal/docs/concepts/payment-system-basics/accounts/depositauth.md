# Deposit Authorization

_(Added by the [DepositAuth amendment][].)_

Deposit Authorization is an optional [account](accounts.html) setting in the XRP Ledger. If enabled, Deposit Authorization blocks all transfers from strangers, including transfers of XRP and [tokens](tokens.html). An account with Deposit Authorization can only receive value in two ways:

- From accounts it has [preauthorized](#preauthorization).
- By sending a transaction to receive the funds. For example, an account with Deposit Authorization could finish an [Escrow](escrow.html) that was initiated by a stranger.

By default, new accounts have DepositAuth disabled and can receive XRP from anyone.

## Background

Financial services regulations and licenses may require that a business or entity must know the sender of all transactions it receives. This presents a challenge on a decentralized system like the XRP Ledger where participants are identified by pseudonyms which can be freely generated and the default behavior is for any address to be able to pay any other.

The Deposit Authorization flag introduces an option for those using the XRP Ledger to comply with such regulations without changing the fundamental nature of the decentralized ledger. With Deposit Authorization enabled, an account can only receive funds it explicitly approves by sending a transaction. The owner of an account using Deposit Authorization can perform the due diligence necessary to identify the sender of any funds _before_ sending the transaction that causes the account to receive the money.

When you have Deposit Authorization enabled, you can receive money from [Checks](known-amendments.html#checks), [Escrow](escrow.html), and [Payment Channels](known-amendments.html#paychan). In these transactions' "two-step" model, first the source sends a transaction to authorize sending funds, then the destination sends a transaction to authorize receiving those funds.

To receive money from [Payment transactions][] when you have Deposit Authorization enabled, you must [preauthorize](#preauthorization) the senders of those Payments. _(Added by the [DepositPreauth amendment][].)_

## Recommended Usage

To get the full effect of Deposit Authorization, Ripple recommends also doing the following:

- Always maintain an XRP balance higher than the minimum [reserve requirement](reserves.html).
- Keep the Default Ripple flag in its default (disabled) state. Do not enable [rippling](rippling.html) on any trust lines. When sending [TrustSet transactions][], always use the [`tfSetNoRipple` flag](trustset.html).
- Do not place [Offers](offercreate.html). It is impossible to know in advance which matching offers will be consumed to execute such a trade. <!-- STYLE_OVERRIDE: will -->

## Precise Semantics

An account with Deposit Authorization enabled:

- **Cannot** be the destination of [Payment transactions][], with **the following exceptions**:
    - If the destination has [preauthorized](#preauthorization) the sender of the Payment. _(Added by the [DepositPreauth amendment][])_
    - If the account's XRP balance is equal to or below the minimum account [reserve requirement](reserves.html), it can be the destination of an XRP Payment whose `Amount` is equal or less than the minimum account reserve (currently 10 XRP). This is to prevent an account from becoming "stuck" by being unable to send transactions but also unable to receive XRP. The account's owner reserve does not matter for this case.
- Can receive XRP from [PaymentChannelClaim transactions][] **only in the following cases**:
    - The sender of the PaymentChannelClaim transaction is the destination of the payment channel.
    - The destination of the PaymentChannelClaim transaction has [preauthorized](#preauthorization) the sender of the PaymentChannelClaim. _(Added by the [DepositPreauth amendment][])_
- Can receive XRP from [EscrowFinish transactions][] **only in the following cases**:
    - The sender of the EscrowFinish transaction is the destination of the escrow.
    - The destination of the EscrowFinish transaction has [preauthorized](#preauthorization) the sender of the EscrowFinish. _(Added by the [DepositPreauth amendment][])_
- **Can** receive XRP or tokens by sending a [CheckCash][] transaction. _(Added by the [Checks amendment][].)_
- **Can** receive XRP or tokens by sending [OfferCreate transactions][].
    - If the account sends an OfferCreate transaction that is not fully executed immediately, it **can** receive the rest of the ordered XRP or token later when the offer is consumed by other accounts' [Payment][] and [OfferCreate][] transactions.
- If the account has created any trust lines without the [No Ripple flag](rippling.html) enabled, or has enabled the Default Ripple flag and issued any currency, the account **can** receive the tokens of those trust lines in [Payment transactions][] as a result of rippling. It cannot be the destination of those transactions.
- In general, an account in the XRP Ledger **cannot** receive any non-XRP currencies in the XRP Ledger as long as all of the following are true. (This rule is not specific to the DepositAuth flag.)
    - The account has not created any trust lines with a nonzero limit.
    - The account has not issued tokens on trust lines created by others.
    - The account has not placed any offers.

The following table summarizes whether a transaction type can deposit money with DepositAuth enabled or disabled:

<table class="depauth">
<thead>
  <tr>
    <th>&nbsp;</th>
    <th colspan="2" class="depauth-status">DepositAuth Disabled</th>
    <th class="depauth-spacer">&nbsp;</th>
    <th colspan="2" class="depauth-status">DepositAuth Enabled</th>
  </tr>
  <tr>
    <th>Transaction Type</th>
    <th>Sent by Destination</th> <th>Sent by Others</th>
    <th class="depauth-spacer">&nbsp;</th>
    <th>Sent by Destination</th> <th>Sent by Others</th> <th>Sent by Preauthorized Others</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="depauth-txtype">AccountSet</td>
    <td colspan="6" class="depauth-na">(This transaction type never sends money.)</td>
  </tr>
  <tr>
    <td class="depauth-txtype">CheckCancel</td>
    <td colspan="6" class="depauth-na">(This transaction type never sends money.)</td>
  </tr>
  <tr>
    <td class="depauth-txtype">CheckCash</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-no">No Permission</td>
    <td class="depauth-spacer">&nbsp;</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-no">No Permission</td>
    <td class="depauth-no">No Permission</td>
  </tr>
  <tr>
    <td class="depauth-txtype">CheckCreate</td>
    <td colspan="6" class="depauth-na">(This transaction type never sends money.)</td>
  </tr>
  <tr>
    <td class="depauth-txtype">EscrowCancel</td>
    <td class="depauth-maybe" colspan="6">Can return XRP from an expired escrow</td>
  </tr>
  <tr>
    <td class="depauth-txtype">EscrowCreate</td>
    <td colspan="6" class="depauth-na">(This transaction type can only debit XRP, not credit it.)</td>
  </tr>
  <tr>
    <td class="depauth-txtype">EscrowFinish</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-spacer">&nbsp;</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-no">No Permission</td>
    <td class="depauth-ok">OK</td>
  </tr>
  <tr>
    <td class="depauth-txtype">OfferCancel</td>
    <td colspan="6" class="depauth-na">This transaction type never sends money.</td>
  </tr>
  <tr>
    <td class="depauth-txtype">OfferCreate</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-maybe">Only if account previously created a matching offer</td>
    <td class="depauth-spacer">&nbsp;</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-maybe">Only if account previously created a matching offer</td>
    <td class="depauth-maybe">Only if account previously created a matching offer</td>
  </tr>
  <tr>
    <td class="depauth-txtype">Payment <div class="depauth-subtype">(If account has more than the minimum XRP reserve, enables No Ripple on all trust lines, and places no offers)</div></td>
    <td class="depauth-maybe">Cross-currency only</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-spacer">&nbsp;</td>
    <td class="depauth-maybe">Cross-currency only <sup>1</sup></td>
    <td class="depauth-no">No Permission</td>
    <td class="depauth-ok">OK</td>
  </tr>
  <tr>
    <td class="depauth-txtype">Payment <div class="depauth-subtype">(If account XRP balance is below the minimum XRP reserve)</div></td>
    <td class="depauth-maybe">Cross-currency only</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-spacer">&nbsp;</td>
    <td class="depauth-maybe">Cross-currency only <sup>1</sup></td>
    <td class="depauth-maybe">XRP payments up to the minimum reserve</td>
    <td class="depauth-ok">OK</td>
  </tr>
  <tr>
    <td class="depauth-txtype">Payment <div class="depauth-subtype">(If account has any trust lines with No Ripple disabled)</div></td>
    <td class="depauth-maybe">Cross-currency only</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-spacer">&nbsp;</td>
    <td class="depauth-maybe">Cross-currency only <sup>1</sup></td>
    <td class="depauth-maybe">Balance changes from rippling</td>
    <td class="depauth-ok">OK</td>
  </tr>
  <tr>
    <td class="depauth-txtype">Payment <div class="depauth-subtype">(If account has placed offers)</div></td>
    <td class="depauth-maybe">Cross-currency only</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-spacer">&nbsp;</td>
    <td class="depauth-maybe">Cross-currency only <sup>1</sup></td>
    <td class="depauth-maybe">Balance changes from executing offers</td>
    <td class="depauth-ok">OK</td>
  </tr>
  <tr>
    <td class="depauth-txtype">PaymentChannelClaim</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-spacer">&nbsp;</td>
    <td class="depauth-ok">OK</td>
    <td class="depauth-no">No Permission</td>
    <td class="depauth-ok">OK</td>
  </tr>
  <tr>
    <td class="depauth-txtype">PaymentChannelCreate</td>
    <td colspan="6" class="depauth-na">(This transaction type can only debit XRP, not credit it.)</td>
  </tr>
  <tr>
    <td class="depauth-txtype">PaymentChannelFund</td>
    <td class="depauth-maybe" colspan="6">Can return XRP when closing a channel created by self</td>
  </tr>
  <tr>
    <td class="depauth-txtype">SetRegularKey</td>
    <td colspan="6" class="depauth-na">(This transaction type never sends money.)</td>
  </tr>
  <tr>
    <td class="depauth-txtype">SignerListSet</td>
    <td colspan="6" class="depauth-na">(This transaction type never sends money.)</td>
  </tr>
  <tr>
    <td class="depauth-txtype">TrustSet</td>
    <td colspan="6" class="depauth-na">(This transaction type never sends money.)</td>
  </tr>
</table>

<p class="depauth-subtype"><sup>1</sup>: The DepositPreauth amendment fixes a bug in DepositAuth which causes cross-currency payments to oneself to fail if the account requires deposit authorization. If the DepositPreauth amendment is not enabled, these cases result in "No Permission" instead.</p>

<style type="text/css">
.depauth-txtype {
  font-weight: bold;
}
.depauth-status {
  text-align: center;
}
.depauth-na {
  background-color: var(--gray-dark);
}
.depauth-ok {
  background-color: var(--success);
  color: black;
}
.depauth-no {
  background-color: var(--danger);
  color: black;
}
.depauth-maybe {
  background-color: var(--warning);
  color: black;
}
.depauth-subtype {
  font-weight: normal;
  font-size: 8pt;
}
.depauth-spacer {
  background-color: var(--secondary);
  padding: 2px !important;
  font-size: 2px;
  border: 1px solid var(--secondary);
}
</style>
<!---->


## Enabling or Disabling Deposit Authorization

An account can enable deposit authorization by sending an [AccountSet transaction][] with the `SetFlag` field set to the `asfDepositAuth` value (9). The account can disable deposit authorization by sending an [AccountSet transaction][] with the `ClearFlag` field set to the `asfDepositAuth` value (9). For more information on AccountSet flags, see [AccountSet flags](accountset.html).

## Checking Whether an Account Has DepositAuth Enabled

To see whether an account has Deposit Authorization enabled, use the [account_info method][] to look up the account. Compare the value of the `Flags` field (in the `result.account_data` object) with the [bitwise flags defined for an AccountRoot ledger object](accountroot.html).

If the result of the `Flags` value bitwise-AND the `lsfDepositAuth` flag value (`0x01000000`) is nonzero, then the account has DepositAuth enabled. If the result is zero, then the account has DepositAuth disabled.

## Preauthorization

_(Added by the [DepositPreauth amendment][].)_

Accounts with DepositAuth enabled can _preauthorize_ certain senders, to allow payments from those senders to succeed even with DepositAuth enabled. This allows specific senders to send funds directly without the receiver taking action on each transaction individually. Preauthorization is not required to use DepositAuth, but can make certain operations more convenient.

Preauthorization is currency-agnostic. You cannot preauthorize accounts for specific currencies only.

To preauthorize a particular sender, send a [DepositPreauth transaction][] with the address of another account to preauthorize in the `Authorize` field. To revoke preauthorization, provide the other account's address in the `Unauthorize` field instead. Specify your own address in the `Account` field as usual. You can preauthorize or unauthorize accounts even if you do not currently have DepositAuth enabled; the preauthorization status you set for other accounts is saved, but has no effect unless you enable DepositAuth. An account cannot preauthorize itself. Preauthorizations are one-directional, and have no effect on payments going the opposite direction.

Preauthorizing another account adds a [DepositPreauth object](depositpreauth-object.html) to the ledger, which increases the [owner reserve](reserves.html#owner-reserves) of the account providing the authorization. If the account revokes this preauthorization, doing so removes the object and decreases the owner reserve.

After the DepositPreauth transaction has been processed, the authorized account can send funds to your account, even if you have DepositAuth enabled, using any of the following transaction types:

- [Payment][]
- [EscrowFinish][]
- [PaymentChannelClaim][]

Preauthorization has no effect on the other ways to send money to an account with DepositAuth enabled. See [Precise Semantics](#precise-semantics) for the exact rules.

### Checking for Authorization

You can use the [deposit_authorized method][] to see if an account is authorized to deposit to another account. This method checks two things: <!-- STYLE_OVERRIDE: is authorized to -->

- Whether the destination account requires Deposit Authorization. (If it does not require authorization, then all source accounts are considered authorized.)
- Whether the source account is preauthorized to send money to the destination.


## See Also

- The [DepositPreauth transaction][] reference.
- The [DepositPreauth ledger object type](depositpreauth-object.html).
- The [deposit_authorized method][] of the [`rippled` API](rippled-api.html).
- The [Authorized Trust Lines](authorized-trust-lines.html) feature (`RequireAuth` flag) limits which counterparties can hold non-XRP currencies issued by an account.
- The `DisallowXRP` flag indicates that an account should not receive XRP. This is a softer protection than Deposit Authorization, and is not enforced by the XRP Ledger. (Client applications should honor this flag or at least warn about it.)
- The `RequireDest` flag indicates that an account can only receive currency amounts if the sending transaction specifies a [Destination Tag](become-an-xrp-ledger-gateway.html#source-and-destination-tags). This protects users from forgetting to indicate the purpose of a payment, but does not protect recipients from unknown senders, who can make up arbitrary destination tags.
- [Partial Payments](partial-payments.html) provide a way for accounts to return unwanted payments while subtracting [transfer fees](transfer-fees.html) and exchange rates from the amount delivered instead of adding them to the amount sent.
<!---->

<!---->
[DepositPreauth amendment]: known-amendments.html#depositpreauth
<!---->
[Address]: basic-data-types.html#addresses
[アドレス]: basic-data-types.html#アドレス
[admin command]: admin-rippled-methods.html
[base58]: base58-encodings.html
[common fields]: transaction-common-fields.html
[共通フィールド]: transaction-common-fields.html
[Currency Amount]: basic-data-types.html#specifying-currency-amounts
[通貨額]: basic-data-types.html#通貨額の指定
[通貨額の指定]: basic-data-types.html#通貨額の指定
[Currency Code]: currency-formats.html#currency-codes
[通貨コード]: currency-formats.html#通貨コード
[drops of XRP]: basic-data-types.html#specifying-currency-amounts
[fee levels]: transaction-cost.html#fee-levels
[XRPのdrop数]: basic-data-types.html#通貨額の指定
[Hash]: basic-data-types.html#hashes
[ハッシュ]: basic-data-types.html#ハッシュ
[identifying hash]: transaction-basics.html#identifying-transactions
[識別用ハッシュ]: transaction-basics.html#トランザクションの識別
[Internal Type]: serialization.html
[内部の型]: serialization.html
[Ledger Index]: basic-data-types.html#ledger-index
[ledger index]: basic-data-types.html#ledger-index
[レジャーインデックス]: basic-data-types.html#レジャーインデックス
[ledger format]: ledger-object-types.html
[レジャーフォーマット]: ledger-data-formats.html
[Marker]: markers-and-pagination.html
[マーカー]: markers-and-pagination.html
[node public key]: peer-protocol.html#node-key-pair
[ノード公開鍵]: peer-protocol.html#ノードキーペア
[node key pair]: peer-protocol.html#node-key-pair
[ノードキーペア]: peer-protocol.html#ノードキーペア
[peer reservation]: peer-protocol.html#fixed-peers-and-peer-reservations
[peer reservations]: peer-protocol.html#fixed-peers-and-peer-reservations
[ピアリザベーション]: peer-protocol.html#固定ピアとピアリザベーション
[public servers]: public-servers.html
[公開サーバー]: public-servers.html
[result code]: transaction-results.html
[seconds since the Ripple Epoch]: basic-data-types.html#specifying-time
[Reporting Mode]: rippled-server-modes.html#reporting-mode
[Rippleエポック以降の経過秒数]: basic-data-types.html#時間の指定
[Sequence Number]: basic-data-types.html#account-sequence
[シーケンス番号]: basic-data-types.html#アカウントシーケンス
[SHA-512Half]: basic-data-types.html#hashes
[SHA-512ハーフ]: basic-data-types.html#ハッシュ
[Specifying Currency Amounts]: basic-data-types.html#specifying-currency-amounts
[Specifying Ledgers]: basic-data-types.html#specifying-ledgers
[レジャーの指定]: basic-data-types.html#レジャーの指定
[Specifying Time]: basic-data-types.html#specifying-time
[時間の指定]: basic-data-types.html#時間の指定
[stand-alone mode]: rippled-server-modes.html#stand-alone-mode
[standard format]: response-formatting.html
[標準フォーマット]: response-formatting.html
[Transaction Cost]: transaction-cost.html
[transaction cost]: transaction-cost.html
[トランザクションコスト]: transaction-cost.html
[universal error types]: error-formatting.html#universal-errors
[汎用エラータイプ]: error-formatting.html#汎用エラー
[XRP, in drops]: basic-data-types.html#specifying-currency-amounts
[XRP、drop単位]: basic-data-types.html#通貨額の指定
[NFToken]: nftoken.html

<!-- API object types -->




[AccountRoot object]: accountroot.html
  



[Amendments object]: amendments.html
  



[Check object]: check.html
  



[DepositPreauth object]: depositpreauth.html
  



[DirectoryNode object]: directorynode.html
  



[Escrow object]: escrow.html
  



[FeeSettings object]: feesettings.html
  



[LedgerHashes object]: ledgerhashes.html
  



[NegativeUNL object]: negativeunl.html
  



[NFTokenOffer object]: nftokenoffer.html
  



[NFTokenPage object]: nftokenpage.html
  



[Offer object]: offer.html
  



[PayChannel object]: paychannel.html
  



[RippleState object]: ripplestate.html
  



[SignerList object]: signerlist.html
  



[Ticket object]: ticket.html
  




<!---->
[crypto-condition]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-04
[crypto-conditions]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-04
[Crypto-Conditions Specification]: https://tools.ietf.org/html/draft-thomas-crypto-conditions-04
[hexadecimal]: https://en.wikipedia.org/wiki/Hexadecimal
[Interledger Protocol]: https://interledger.org/
[RFC-1751]: https://tools.ietf.org/html/rfc1751
[ripple-lib]: https://github.com/XRPLF/xrpl.js

<!---->



[account_channels method]: account_channels.html
[account_channels command]: account_channels.html


[account_currencies method]: account_currencies.html
[account_currencies command]: account_currencies.html


[account_info method]: account_info.html
[account_info command]: account_info.html


[account_lines method]: account_lines.html
[account_lines command]: account_lines.html


[account_objects method]: account_objects.html
[account_objects command]: account_objects.html


[account_offers method]: account_offers.html
[account_offers command]: account_offers.html


[account_tx method]: account_tx.html
[account_tx command]: account_tx.html


[book_offers method]: book_offers.html
[book_offers command]: book_offers.html


[can_delete method]: can_delete.html
[can_delete command]: can_delete.html


[channel_authorize method]: channel_authorize.html
[channel_authorize command]: channel_authorize.html


[channel_verify method]: channel_verify.html
[channel_verify command]: channel_verify.html


[connect method]: connect.html
[connect command]: connect.html


[consensus_info method]: consensus_info.html
[consensus_info command]: consensus_info.html


[crawl_shards method]: crawl_shards.html
[crawl_shards command]: crawl_shards.html


[deposit_authorized method]: deposit_authorized.html
[deposit_authorized command]: deposit_authorized.html


[download_shard method]: download_shard.html
[download_shard command]: download_shard.html


[feature method]: feature.html
[feature command]: feature.html


[fee method]: fee.html
[fee command]: fee.html


[fetch_info method]: fetch_info.html
[fetch_info command]: fetch_info.html


[gateway_balances method]: gateway_balances.html
[gateway_balances command]: gateway_balances.html


[get_counts method]: get_counts.html
[get_counts command]: get_counts.html


[json method]: json.html
[json command]: json.html


[ledger method]: ledger.html
[ledger command]: ledger.html


[ledger_accept method]: ledger_accept.html
[ledger_accept command]: ledger_accept.html


[ledger_cleaner method]: ledger_cleaner.html
[ledger_cleaner command]: ledger_cleaner.html


[ledger_closed method]: ledger_closed.html
[ledger_closed command]: ledger_closed.html


[ledger_current method]: ledger_current.html
[ledger_current command]: ledger_current.html


[ledger_data method]: ledger_data.html
[ledger_data command]: ledger_data.html


[ledger_entry method]: ledger_entry.html
[ledger_entry command]: ledger_entry.html


[ledger_request method]: ledger_request.html
[ledger_request command]: ledger_request.html


[log_level method]: log_level.html
[log_level command]: log_level.html


[logrotate method]: logrotate.html
[logrotate command]: logrotate.html


[manifest method]: manifest.html
[manifest command]: manifest.html


[noripple_check method]: noripple_check.html
[noripple_check command]: noripple_check.html


[path_find method]: path_find.html
[path_find command]: path_find.html


[peer_reservations_add method]: peer_reservations_add.html
[peer_reservations_add command]: peer_reservations_add.html


[peer_reservations_del method]: peer_reservations_del.html
[peer_reservations_del command]: peer_reservations_del.html


[peer_reservations_list method]: peer_reservations_list.html
[peer_reservations_list command]: peer_reservations_list.html


[peers method]: peers.html
[peers command]: peers.html


[ping method]: ping.html
[ping command]: ping.html


[print method]: print.html
[print command]: print.html


[random method]: random.html
[random command]: random.html


[ripple_path_find method]: ripple_path_find.html
[ripple_path_find command]: ripple_path_find.html


[server_info method]: server_info.html
[server_info command]: server_info.html


[server_state method]: server_state.html
[server_state command]: server_state.html


[sign method]: sign.html
[sign command]: sign.html


[sign_for method]: sign_for.html
[sign_for command]: sign_for.html


[stop method]: stop.html
[stop command]: stop.html


[submit method]: submit.html
[submit command]: submit.html


[submit_multisigned method]: submit_multisigned.html
[submit_multisigned command]: submit_multisigned.html


[subscribe method]: subscribe.html
[subscribe command]: subscribe.html


[transaction_entry method]: transaction_entry.html
[transaction_entry command]: transaction_entry.html


[tx method]: tx.html
[tx command]: tx.html


[tx_history method]: tx_history.html
[tx_history command]: tx_history.html


[unsubscribe method]: unsubscribe.html
[unsubscribe command]: unsubscribe.html


[validation_create method]: validation_create.html
[validation_create command]: validation_create.html


[validation_seed method]: validation_seed.html
[validation_seed command]: validation_seed.html


[validator_info method]: validator_info.html
[validator_info command]: validator_info.html


[validator_list_sites method]: validator_list_sites.html
[validator_list_sites command]: validator_list_sites.html


[validators method]: validators.html
[validators command]: validators.html


[wallet_propose method]: wallet_propose.html
[wallet_propose command]: wallet_propose.html



<!---->



[Checks amendment]: known-amendments.html#checks

[CheckCashMakesTrustLine amendment]: known-amendments.html#checkcashmakestrustline

[CryptoConditions amendment]: known-amendments.html#cryptoconditions

[CryptoConditionsSuite amendment]: known-amendments.html#cryptoconditionssuite

[DeletableAccounts amendment]: known-amendments.html#deletableaccounts

[DepositAuth amendment]: known-amendments.html#depositauth

[DepositPreauth amendment]: known-amendments.html#depositpreauth

[EnforceInvariants amendment]: known-amendments.html#enforceinvariants

[Escrow amendment]: known-amendments.html#escrow

[FeeEscalation amendment]: known-amendments.html#feeescalation

[fix1201 amendment]: known-amendments.html#fix1201

[fix1368 amendment]: known-amendments.html#fix1368

[fix1373 amendment]: known-amendments.html#fix1373

[fix1512 amendment]: known-amendments.html#fix1512

[fix1513 amendment]: known-amendments.html#fix1513

[fix1515 amendment]: known-amendments.html#fix1515

[fix1523 amendment]: known-amendments.html#fix1523

[fix1528 amendment]: known-amendments.html#fix1528

[fix1543 amendment]: known-amendments.html#fix1543

[fix1571 amendment]: known-amendments.html#fix1571

[fix1578 amendment]: known-amendments.html#fix1578

[fix1623 amendment]: known-amendments.html#fix1623

[fixCheckThreading amendment]: known-amendments.html#fixcheckthreading

[fixMasterKeyAsRegularKey amendment]: known-amendments.html#fixmasterkeyasregularkey

[fixPayChanRecipientOwnerDir amendment]: known-amendments.html#fixpaychanrecipientownerdir

[fixQualityUpperBound amendment]: known-amendments.html#fixqualityupperbound

[fixTakerDryOfferRemoval amendment]: known-amendments.html#fixtakerdryofferremoval

[Flow amendment]: known-amendments.html#flow

[FlowCross amendment]: known-amendments.html#flowcross

[FlowV2 amendment]: known-amendments.html#flowv2

[MultiSign amendment]: known-amendments.html#multisign

[MultiSignReserve amendment]: known-amendments.html#multisignreserve

[NegativeUNL amendment]: known-amendments.html#negativeunl

[OwnerPaysFee amendment]: known-amendments.html#ownerpaysfee

[PayChan amendment]: known-amendments.html#paychan

[RequireFullyCanonicalSig amendment]: known-amendments.html#requirefullycanonicalsig

[SHAMapV2 amendment]: known-amendments.html#shamapv2

[SortedDirectories amendment]: known-amendments.html#sorteddirectories

[SusPay amendment]: known-amendments.html#suspay

[TicketBatch amendment]: known-amendments.html#ticketbatch

[Tickets amendment]: known-amendments.html#tickets

[TickSize amendment]: known-amendments.html#ticksize

[TrustSetAuth amendment]: known-amendments.html#trustsetauth
			





[AccountDelete]: accountdelete.html
[AccountDelete transaction]: accountdelete.html
[AccountDelete transactions]: accountdelete.html


[AccountSet]: accountset.html
[AccountSet transaction]: accountset.html
[AccountSet transactions]: accountset.html


[CheckCancel]: checkcancel.html
[CheckCancel transaction]: checkcancel.html
[CheckCancel transactions]: checkcancel.html


[CheckCash]: checkcash.html
[CheckCash transaction]: checkcash.html
[CheckCash transactions]: checkcash.html


[CheckCreate]: checkcreate.html
[CheckCreate transaction]: checkcreate.html
[CheckCreate transactions]: checkcreate.html


[DepositPreauth]: depositpreauth.html
[DepositPreauth transaction]: depositpreauth.html
[DepositPreauth transactions]: depositpreauth.html


[EscrowCancel]: escrowcancel.html
[EscrowCancel transaction]: escrowcancel.html
[EscrowCancel transactions]: escrowcancel.html


[EscrowCreate]: escrowcreate.html
[EscrowCreate transaction]: escrowcreate.html
[EscrowCreate transactions]: escrowcreate.html


[EscrowFinish]: escrowfinish.html
[EscrowFinish transaction]: escrowfinish.html
[EscrowFinish transactions]: escrowfinish.html


[NFTokenAcceptOffer]: nftokenacceptoffer.html
[NFTokenAcceptOffer transaction]: nftokenacceptoffer.html
[NFTokenAcceptOffer transactions]: nftokenacceptoffer.html


[NFTokenBurn]: nftokenburn.html
[NFTokenBurn transaction]: nftokenburn.html
[NFTokenBurn transactions]: nftokenburn.html


[NFTokenCancelOffer]: nftokencanceloffer.html
[NFTokenCancelOffer transaction]: nftokencanceloffer.html
[NFTokenCancelOffer transactions]: nftokencanceloffer.html


[NFTokenCreateOffer]: nftokencreateoffer.html
[NFTokenCreateOffer transaction]: nftokencreateoffer.html
[NFTokenCreateOffer transactions]: nftokencreateoffer.html


[NFTokenMint]: nftokenmint.html
[NFTokenMint transaction]: nftokenmint.html
[NFTokenMint transactions]: nftokenmint.html


[OfferCancel]: offercancel.html
[OfferCancel transaction]: offercancel.html
[OfferCancel transactions]: offercancel.html


[OfferCreate]: offercreate.html
[OfferCreate transaction]: offercreate.html
[OfferCreate transactions]: offercreate.html


[Payment]: payment.html
[Payment transaction]: payment.html
[Payment transactions]: payment.html


[PaymentChannelClaim]: paymentchannelclaim.html
[PaymentChannelClaim transaction]: paymentchannelclaim.html
[PaymentChannelClaim transactions]: paymentchannelclaim.html


[PaymentChannelCreate]: paymentchannelcreate.html
[PaymentChannelCreate transaction]: paymentchannelcreate.html
[PaymentChannelCreate transactions]: paymentchannelcreate.html


[PaymentChannelFund]: paymentchannelfund.html
[PaymentChannelFund transaction]: paymentchannelfund.html
[PaymentChannelFund transactions]: paymentchannelfund.html


[SetRegularKey]: setregularkey.html
[SetRegularKey transaction]: setregularkey.html
[SetRegularKey transactions]: setregularkey.html


[SignerListSet]: signerlistset.html
[SignerListSet transaction]: signerlistset.html
[SignerListSet transactions]: signerlistset.html


[TicketCreate]: ticketcreate.html
[TicketCreate transaction]: ticketcreate.html
[TicketCreate transactions]: ticketcreate.html


[TrustSet]: trustset.html
[TrustSet transaction]: trustset.html
[TrustSet transactions]: trustset.html




[EnableAmendment]: enableamendment.html
[EnableAmendment pseudo-transaction]: enableamendment.html
[EnableAmendment pseudo-transactions]: enableamendment.html
[EnableAmendment疑似トランザクション]: enableamendment.html

[SetFee]: setfee.html
[SetFee pseudo-transaction]: setfee.html
[SetFee pseudo-transactions]: setfee.html
[SetFee疑似トランザクション]: setfee.html

[UNLModify]: unlmodify.html
[UNLModify pseudo-transaction]: unlmodify.html
[UNLModify pseudo-transactions]: unlmodify.html
[UNLModify疑似トランザクション]: unlmodify.html
			
<!-- rippled release notes links -->




[New in: rippled 0.26.0]: https://github.com/ripple/rippled/releases/tag/0.26.0 "BADGE_BLUE"
[Introduced in: rippled 0.26.0]: https://github.com/ripple/rippled/releases/tag/0.26.0 "BADGE_BLUE"
[Updated in: rippled 0.26.0]: https://github.com/ripple/rippled/releases/tag/0.26.0 "BADGE_BLUE"
[Removed in: rippled 0.26.0]: https://github.com/ripple/rippled/releases/tag/0.26.0 "BADGE_RED"
[導入: rippled 0.26.0]: https://github.com/ripple/rippled/releases/tag/0.26.0 "BADGE_BLUE"
[新規: rippled 0.26.0]: https://github.com/ripple/rippled/releases/tag/0.26.0 "BADGE_BLUE"
[更新: rippled 0.26.0]: https://github.com/ripple/rippled/releases/tag/0.26.0 "BADGE_BLUE"
[削除: rippled 0.26.0]: https://github.com/ripple/rippled/releases/tag/0.26.0 "BADGE_RED"

[New in: rippled 0.26.1]: https://github.com/ripple/rippled/releases/tag/0.26.1 "BADGE_BLUE"
[Introduced in: rippled 0.26.1]: https://github.com/ripple/rippled/releases/tag/0.26.1 "BADGE_BLUE"
[Updated in: rippled 0.26.1]: https://github.com/ripple/rippled/releases/tag/0.26.1 "BADGE_BLUE"
[Removed in: rippled 0.26.1]: https://github.com/ripple/rippled/releases/tag/0.26.1 "BADGE_RED"
[導入: rippled 0.26.1]: https://github.com/ripple/rippled/releases/tag/0.26.1 "BADGE_BLUE"
[新規: rippled 0.26.1]: https://github.com/ripple/rippled/releases/tag/0.26.1 "BADGE_BLUE"
[更新: rippled 0.26.1]: https://github.com/ripple/rippled/releases/tag/0.26.1 "BADGE_BLUE"
[削除: rippled 0.26.1]: https://github.com/ripple/rippled/releases/tag/0.26.1 "BADGE_RED"

[New in: rippled 0.26.2]: https://github.com/ripple/rippled/releases/tag/0.26.2 "BADGE_BLUE"
[Introduced in: rippled 0.26.2]: https://github.com/ripple/rippled/releases/tag/0.26.2 "BADGE_BLUE"
[Updated in: rippled 0.26.2]: https://github.com/ripple/rippled/releases/tag/0.26.2 "BADGE_BLUE"
[Removed in: rippled 0.26.2]: https://github.com/ripple/rippled/releases/tag/0.26.2 "BADGE_RED"
[導入: rippled 0.26.2]: https://github.com/ripple/rippled/releases/tag/0.26.2 "BADGE_BLUE"
[新規: rippled 0.26.2]: https://github.com/ripple/rippled/releases/tag/0.26.2 "BADGE_BLUE"
[更新: rippled 0.26.2]: https://github.com/ripple/rippled/releases/tag/0.26.2 "BADGE_BLUE"
[削除: rippled 0.26.2]: https://github.com/ripple/rippled/releases/tag/0.26.2 "BADGE_RED"

[New in: rippled 0.26.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.3-sp1 "BADGE_BLUE"
[Introduced in: rippled 0.26.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.3-sp1 "BADGE_BLUE"
[Updated in: rippled 0.26.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.3-sp1 "BADGE_BLUE"
[Removed in: rippled 0.26.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.3-sp1 "BADGE_RED"
[導入: rippled 0.26.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.3-sp1 "BADGE_BLUE"
[新規: rippled 0.26.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.3-sp1 "BADGE_BLUE"
[更新: rippled 0.26.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.3-sp1 "BADGE_BLUE"
[削除: rippled 0.26.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.3-sp1 "BADGE_RED"

[New in: rippled 0.26.4]: https://github.com/ripple/rippled/releases/tag/0.26.4 "BADGE_BLUE"
[Introduced in: rippled 0.26.4]: https://github.com/ripple/rippled/releases/tag/0.26.4 "BADGE_BLUE"
[Updated in: rippled 0.26.4]: https://github.com/ripple/rippled/releases/tag/0.26.4 "BADGE_BLUE"
[Removed in: rippled 0.26.4]: https://github.com/ripple/rippled/releases/tag/0.26.4 "BADGE_RED"
[導入: rippled 0.26.4]: https://github.com/ripple/rippled/releases/tag/0.26.4 "BADGE_BLUE"
[新規: rippled 0.26.4]: https://github.com/ripple/rippled/releases/tag/0.26.4 "BADGE_BLUE"
[更新: rippled 0.26.4]: https://github.com/ripple/rippled/releases/tag/0.26.4 "BADGE_BLUE"
[削除: rippled 0.26.4]: https://github.com/ripple/rippled/releases/tag/0.26.4 "BADGE_RED"

[New in: rippled 0.26.4-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.4-sp1 "BADGE_BLUE"
[Introduced in: rippled 0.26.4-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.4-sp1 "BADGE_BLUE"
[Updated in: rippled 0.26.4-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.4-sp1 "BADGE_BLUE"
[Removed in: rippled 0.26.4-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.4-sp1 "BADGE_RED"
[導入: rippled 0.26.4-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.4-sp1 "BADGE_BLUE"
[新規: rippled 0.26.4-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.4-sp1 "BADGE_BLUE"
[更新: rippled 0.26.4-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.4-sp1 "BADGE_BLUE"
[削除: rippled 0.26.4-sp1]: https://github.com/ripple/rippled/releases/tag/0.26.4-sp1 "BADGE_RED"

[New in: rippled 0.27.0]: https://github.com/ripple/rippled/releases/tag/0.27.0 "BADGE_BLUE"
[Introduced in: rippled 0.27.0]: https://github.com/ripple/rippled/releases/tag/0.27.0 "BADGE_BLUE"
[Updated in: rippled 0.27.0]: https://github.com/ripple/rippled/releases/tag/0.27.0 "BADGE_BLUE"
[Removed in: rippled 0.27.0]: https://github.com/ripple/rippled/releases/tag/0.27.0 "BADGE_RED"
[導入: rippled 0.27.0]: https://github.com/ripple/rippled/releases/tag/0.27.0 "BADGE_BLUE"
[新規: rippled 0.27.0]: https://github.com/ripple/rippled/releases/tag/0.27.0 "BADGE_BLUE"
[更新: rippled 0.27.0]: https://github.com/ripple/rippled/releases/tag/0.27.0 "BADGE_BLUE"
[削除: rippled 0.27.0]: https://github.com/ripple/rippled/releases/tag/0.27.0 "BADGE_RED"

[New in: rippled 0.27.1]: https://github.com/ripple/rippled/releases/tag/0.27.1 "BADGE_BLUE"
[Introduced in: rippled 0.27.1]: https://github.com/ripple/rippled/releases/tag/0.27.1 "BADGE_BLUE"
[Updated in: rippled 0.27.1]: https://github.com/ripple/rippled/releases/tag/0.27.1 "BADGE_BLUE"
[Removed in: rippled 0.27.1]: https://github.com/ripple/rippled/releases/tag/0.27.1 "BADGE_RED"
[導入: rippled 0.27.1]: https://github.com/ripple/rippled/releases/tag/0.27.1 "BADGE_BLUE"
[新規: rippled 0.27.1]: https://github.com/ripple/rippled/releases/tag/0.27.1 "BADGE_BLUE"
[更新: rippled 0.27.1]: https://github.com/ripple/rippled/releases/tag/0.27.1 "BADGE_BLUE"
[削除: rippled 0.27.1]: https://github.com/ripple/rippled/releases/tag/0.27.1 "BADGE_RED"

[New in: rippled 0.27.2]: https://github.com/ripple/rippled/releases/tag/0.27.2 "BADGE_BLUE"
[Introduced in: rippled 0.27.2]: https://github.com/ripple/rippled/releases/tag/0.27.2 "BADGE_BLUE"
[Updated in: rippled 0.27.2]: https://github.com/ripple/rippled/releases/tag/0.27.2 "BADGE_BLUE"
[Removed in: rippled 0.27.2]: https://github.com/ripple/rippled/releases/tag/0.27.2 "BADGE_RED"
[導入: rippled 0.27.2]: https://github.com/ripple/rippled/releases/tag/0.27.2 "BADGE_BLUE"
[新規: rippled 0.27.2]: https://github.com/ripple/rippled/releases/tag/0.27.2 "BADGE_BLUE"
[更新: rippled 0.27.2]: https://github.com/ripple/rippled/releases/tag/0.27.2 "BADGE_BLUE"
[削除: rippled 0.27.2]: https://github.com/ripple/rippled/releases/tag/0.27.2 "BADGE_RED"

[New in: rippled 0.27.3]: https://github.com/ripple/rippled/releases/tag/0.27.3 "BADGE_BLUE"
[Introduced in: rippled 0.27.3]: https://github.com/ripple/rippled/releases/tag/0.27.3 "BADGE_BLUE"
[Updated in: rippled 0.27.3]: https://github.com/ripple/rippled/releases/tag/0.27.3 "BADGE_BLUE"
[Removed in: rippled 0.27.3]: https://github.com/ripple/rippled/releases/tag/0.27.3 "BADGE_RED"
[導入: rippled 0.27.3]: https://github.com/ripple/rippled/releases/tag/0.27.3 "BADGE_BLUE"
[新規: rippled 0.27.3]: https://github.com/ripple/rippled/releases/tag/0.27.3 "BADGE_BLUE"
[更新: rippled 0.27.3]: https://github.com/ripple/rippled/releases/tag/0.27.3 "BADGE_BLUE"
[削除: rippled 0.27.3]: https://github.com/ripple/rippled/releases/tag/0.27.3 "BADGE_RED"

[New in: rippled 0.27.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp1 "BADGE_BLUE"
[Introduced in: rippled 0.27.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp1 "BADGE_BLUE"
[Updated in: rippled 0.27.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp1 "BADGE_BLUE"
[Removed in: rippled 0.27.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp1 "BADGE_RED"
[導入: rippled 0.27.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp1 "BADGE_BLUE"
[新規: rippled 0.27.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp1 "BADGE_BLUE"
[更新: rippled 0.27.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp1 "BADGE_BLUE"
[削除: rippled 0.27.3-sp1]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp1 "BADGE_RED"

[New in: rippled 0.27.3-sp2]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp2 "BADGE_BLUE"
[Introduced in: rippled 0.27.3-sp2]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp2 "BADGE_BLUE"
[Updated in: rippled 0.27.3-sp2]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp2 "BADGE_BLUE"
[Removed in: rippled 0.27.3-sp2]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp2 "BADGE_RED"
[導入: rippled 0.27.3-sp2]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp2 "BADGE_BLUE"
[新規: rippled 0.27.3-sp2]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp2 "BADGE_BLUE"
[更新: rippled 0.27.3-sp2]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp2 "BADGE_BLUE"
[削除: rippled 0.27.3-sp2]: https://github.com/ripple/rippled/releases/tag/0.27.3-sp2 "BADGE_RED"

[New in: rippled 0.27.4]: https://github.com/ripple/rippled/releases/tag/0.27.4 "BADGE_BLUE"
[Introduced in: rippled 0.27.4]: https://github.com/ripple/rippled/releases/tag/0.27.4 "BADGE_BLUE"
[Updated in: rippled 0.27.4]: https://github.com/ripple/rippled/releases/tag/0.27.4 "BADGE_BLUE"
[Removed in: rippled 0.27.4]: https://github.com/ripple/rippled/releases/tag/0.27.4 "BADGE_RED"
[導入: rippled 0.27.4]: https://github.com/ripple/rippled/releases/tag/0.27.4 "BADGE_BLUE"
[新規: rippled 0.27.4]: https://github.com/ripple/rippled/releases/tag/0.27.4 "BADGE_BLUE"
[更新: rippled 0.27.4]: https://github.com/ripple/rippled/releases/tag/0.27.4 "BADGE_BLUE"
[削除: rippled 0.27.4]: https://github.com/ripple/rippled/releases/tag/0.27.4 "BADGE_RED"

[New in: rippled 0.28.0]: https://github.com/ripple/rippled/releases/tag/0.28.0 "BADGE_BLUE"
[Introduced in: rippled 0.28.0]: https://github.com/ripple/rippled/releases/tag/0.28.0 "BADGE_BLUE"
[Updated in: rippled 0.28.0]: https://github.com/ripple/rippled/releases/tag/0.28.0 "BADGE_BLUE"
[Removed in: rippled 0.28.0]: https://github.com/ripple/rippled/releases/tag/0.28.0 "BADGE_RED"
[導入: rippled 0.28.0]: https://github.com/ripple/rippled/releases/tag/0.28.0 "BADGE_BLUE"
[新規: rippled 0.28.0]: https://github.com/ripple/rippled/releases/tag/0.28.0 "BADGE_BLUE"
[更新: rippled 0.28.0]: https://github.com/ripple/rippled/releases/tag/0.28.0 "BADGE_BLUE"
[削除: rippled 0.28.0]: https://github.com/ripple/rippled/releases/tag/0.28.0 "BADGE_RED"

[New in: rippled 0.28.2]: https://github.com/ripple/rippled/releases/tag/0.28.2 "BADGE_BLUE"
[Introduced in: rippled 0.28.2]: https://github.com/ripple/rippled/releases/tag/0.28.2 "BADGE_BLUE"
[Updated in: rippled 0.28.2]: https://github.com/ripple/rippled/releases/tag/0.28.2 "BADGE_BLUE"
[Removed in: rippled 0.28.2]: https://github.com/ripple/rippled/releases/tag/0.28.2 "BADGE_RED"
[導入: rippled 0.28.2]: https://github.com/ripple/rippled/releases/tag/0.28.2 "BADGE_BLUE"
[新規: rippled 0.28.2]: https://github.com/ripple/rippled/releases/tag/0.28.2 "BADGE_BLUE"
[更新: rippled 0.28.2]: https://github.com/ripple/rippled/releases/tag/0.28.2 "BADGE_BLUE"
[削除: rippled 0.28.2]: https://github.com/ripple/rippled/releases/tag/0.28.2 "BADGE_RED"

[New in: rippled 0.29.0]: https://github.com/ripple/rippled/releases/tag/0.29.0 "BADGE_BLUE"
[Introduced in: rippled 0.29.0]: https://github.com/ripple/rippled/releases/tag/0.29.0 "BADGE_BLUE"
[Updated in: rippled 0.29.0]: https://github.com/ripple/rippled/releases/tag/0.29.0 "BADGE_BLUE"
[Removed in: rippled 0.29.0]: https://github.com/ripple/rippled/releases/tag/0.29.0 "BADGE_RED"
[導入: rippled 0.29.0]: https://github.com/ripple/rippled/releases/tag/0.29.0 "BADGE_BLUE"
[新規: rippled 0.29.0]: https://github.com/ripple/rippled/releases/tag/0.29.0 "BADGE_BLUE"
[更新: rippled 0.29.0]: https://github.com/ripple/rippled/releases/tag/0.29.0 "BADGE_BLUE"
[削除: rippled 0.29.0]: https://github.com/ripple/rippled/releases/tag/0.29.0 "BADGE_RED"

[New in: rippled 0.29.0-hf1]: https://github.com/ripple/rippled/releases/tag/0.29.0-hf1 "BADGE_BLUE"
[Introduced in: rippled 0.29.0-hf1]: https://github.com/ripple/rippled/releases/tag/0.29.0-hf1 "BADGE_BLUE"
[Updated in: rippled 0.29.0-hf1]: https://github.com/ripple/rippled/releases/tag/0.29.0-hf1 "BADGE_BLUE"
[Removed in: rippled 0.29.0-hf1]: https://github.com/ripple/rippled/releases/tag/0.29.0-hf1 "BADGE_RED"
[導入: rippled 0.29.0-hf1]: https://github.com/ripple/rippled/releases/tag/0.29.0-hf1 "BADGE_BLUE"
[新規: rippled 0.29.0-hf1]: https://github.com/ripple/rippled/releases/tag/0.29.0-hf1 "BADGE_BLUE"
[更新: rippled 0.29.0-hf1]: https://github.com/ripple/rippled/releases/tag/0.29.0-hf1 "BADGE_BLUE"
[削除: rippled 0.29.0-hf1]: https://github.com/ripple/rippled/releases/tag/0.29.0-hf1 "BADGE_RED"

[New in: rippled 0.30.0]: https://github.com/ripple/rippled/releases/tag/0.30.0 "BADGE_BLUE"
[Introduced in: rippled 0.30.0]: https://github.com/ripple/rippled/releases/tag/0.30.0 "BADGE_BLUE"
[Updated in: rippled 0.30.0]: https://github.com/ripple/rippled/releases/tag/0.30.0 "BADGE_BLUE"
[Removed in: rippled 0.30.0]: https://github.com/ripple/rippled/releases/tag/0.30.0 "BADGE_RED"
[導入: rippled 0.30.0]: https://github.com/ripple/rippled/releases/tag/0.30.0 "BADGE_BLUE"
[新規: rippled 0.30.0]: https://github.com/ripple/rippled/releases/tag/0.30.0 "BADGE_BLUE"
[更新: rippled 0.30.0]: https://github.com/ripple/rippled/releases/tag/0.30.0 "BADGE_BLUE"
[削除: rippled 0.30.0]: https://github.com/ripple/rippled/releases/tag/0.30.0 "BADGE_RED"

[New in: rippled 0.30.1]: https://github.com/ripple/rippled/releases/tag/0.30.1 "BADGE_BLUE"
[Introduced in: rippled 0.30.1]: https://github.com/ripple/rippled/releases/tag/0.30.1 "BADGE_BLUE"
[Updated in: rippled 0.30.1]: https://github.com/ripple/rippled/releases/tag/0.30.1 "BADGE_BLUE"
[Removed in: rippled 0.30.1]: https://github.com/ripple/rippled/releases/tag/0.30.1 "BADGE_RED"
[導入: rippled 0.30.1]: https://github.com/ripple/rippled/releases/tag/0.30.1 "BADGE_BLUE"
[新規: rippled 0.30.1]: https://github.com/ripple/rippled/releases/tag/0.30.1 "BADGE_BLUE"
[更新: rippled 0.30.1]: https://github.com/ripple/rippled/releases/tag/0.30.1 "BADGE_BLUE"
[削除: rippled 0.30.1]: https://github.com/ripple/rippled/releases/tag/0.30.1 "BADGE_RED"

[New in: rippled 0.31.0]: https://github.com/ripple/rippled/releases/tag/0.31.0 "BADGE_BLUE"
[Introduced in: rippled 0.31.0]: https://github.com/ripple/rippled/releases/tag/0.31.0 "BADGE_BLUE"
[Updated in: rippled 0.31.0]: https://github.com/ripple/rippled/releases/tag/0.31.0 "BADGE_BLUE"
[Removed in: rippled 0.31.0]: https://github.com/ripple/rippled/releases/tag/0.31.0 "BADGE_RED"
[導入: rippled 0.31.0]: https://github.com/ripple/rippled/releases/tag/0.31.0 "BADGE_BLUE"
[新規: rippled 0.31.0]: https://github.com/ripple/rippled/releases/tag/0.31.0 "BADGE_BLUE"
[更新: rippled 0.31.0]: https://github.com/ripple/rippled/releases/tag/0.31.0 "BADGE_BLUE"
[削除: rippled 0.31.0]: https://github.com/ripple/rippled/releases/tag/0.31.0 "BADGE_RED"

[New in: rippled 0.32.0]: https://github.com/ripple/rippled/releases/tag/0.32.0 "BADGE_BLUE"
[Introduced in: rippled 0.32.0]: https://github.com/ripple/rippled/releases/tag/0.32.0 "BADGE_BLUE"
[Updated in: rippled 0.32.0]: https://github.com/ripple/rippled/releases/tag/0.32.0 "BADGE_BLUE"
[Removed in: rippled 0.32.0]: https://github.com/ripple/rippled/releases/tag/0.32.0 "BADGE_RED"
[導入: rippled 0.32.0]: https://github.com/ripple/rippled/releases/tag/0.32.0 "BADGE_BLUE"
[新規: rippled 0.32.0]: https://github.com/ripple/rippled/releases/tag/0.32.0 "BADGE_BLUE"
[更新: rippled 0.32.0]: https://github.com/ripple/rippled/releases/tag/0.32.0 "BADGE_BLUE"
[削除: rippled 0.32.0]: https://github.com/ripple/rippled/releases/tag/0.32.0 "BADGE_RED"

[New in: rippled 0.32.1]: https://github.com/ripple/rippled/releases/tag/0.32.1 "BADGE_BLUE"
[Introduced in: rippled 0.32.1]: https://github.com/ripple/rippled/releases/tag/0.32.1 "BADGE_BLUE"
[Updated in: rippled 0.32.1]: https://github.com/ripple/rippled/releases/tag/0.32.1 "BADGE_BLUE"
[Removed in: rippled 0.32.1]: https://github.com/ripple/rippled/releases/tag/0.32.1 "BADGE_RED"
[導入: rippled 0.32.1]: https://github.com/ripple/rippled/releases/tag/0.32.1 "BADGE_BLUE"
[新規: rippled 0.32.1]: https://github.com/ripple/rippled/releases/tag/0.32.1 "BADGE_BLUE"
[更新: rippled 0.32.1]: https://github.com/ripple/rippled/releases/tag/0.32.1 "BADGE_BLUE"
[削除: rippled 0.32.1]: https://github.com/ripple/rippled/releases/tag/0.32.1 "BADGE_RED"

[New in: rippled 0.33.0]: https://github.com/ripple/rippled/releases/tag/0.33.0 "BADGE_BLUE"
[Introduced in: rippled 0.33.0]: https://github.com/ripple/rippled/releases/tag/0.33.0 "BADGE_BLUE"
[Updated in: rippled 0.33.0]: https://github.com/ripple/rippled/releases/tag/0.33.0 "BADGE_BLUE"
[Removed in: rippled 0.33.0]: https://github.com/ripple/rippled/releases/tag/0.33.0 "BADGE_RED"
[導入: rippled 0.33.0]: https://github.com/ripple/rippled/releases/tag/0.33.0 "BADGE_BLUE"
[新規: rippled 0.33.0]: https://github.com/ripple/rippled/releases/tag/0.33.0 "BADGE_BLUE"
[更新: rippled 0.33.0]: https://github.com/ripple/rippled/releases/tag/0.33.0 "BADGE_BLUE"
[削除: rippled 0.33.0]: https://github.com/ripple/rippled/releases/tag/0.33.0 "BADGE_RED"

[New in: rippled 0.50.0]: https://github.com/ripple/rippled/releases/tag/0.50.0 "BADGE_BLUE"
[Introduced in: rippled 0.50.0]: https://github.com/ripple/rippled/releases/tag/0.50.0 "BADGE_BLUE"
[Updated in: rippled 0.50.0]: https://github.com/ripple/rippled/releases/tag/0.50.0 "BADGE_BLUE"
[Removed in: rippled 0.50.0]: https://github.com/ripple/rippled/releases/tag/0.50.0 "BADGE_RED"
[導入: rippled 0.50.0]: https://github.com/ripple/rippled/releases/tag/0.50.0 "BADGE_BLUE"
[新規: rippled 0.50.0]: https://github.com/ripple/rippled/releases/tag/0.50.0 "BADGE_BLUE"
[更新: rippled 0.50.0]: https://github.com/ripple/rippled/releases/tag/0.50.0 "BADGE_BLUE"
[削除: rippled 0.50.0]: https://github.com/ripple/rippled/releases/tag/0.50.0 "BADGE_RED"

[New in: rippled 0.70.0]: https://github.com/ripple/rippled/releases/tag/0.70.0 "BADGE_BLUE"
[Introduced in: rippled 0.70.0]: https://github.com/ripple/rippled/releases/tag/0.70.0 "BADGE_BLUE"
[Updated in: rippled 0.70.0]: https://github.com/ripple/rippled/releases/tag/0.70.0 "BADGE_BLUE"
[Removed in: rippled 0.70.0]: https://github.com/ripple/rippled/releases/tag/0.70.0 "BADGE_RED"
[導入: rippled 0.70.0]: https://github.com/ripple/rippled/releases/tag/0.70.0 "BADGE_BLUE"
[新規: rippled 0.70.0]: https://github.com/ripple/rippled/releases/tag/0.70.0 "BADGE_BLUE"
[更新: rippled 0.70.0]: https://github.com/ripple/rippled/releases/tag/0.70.0 "BADGE_BLUE"
[削除: rippled 0.70.0]: https://github.com/ripple/rippled/releases/tag/0.70.0 "BADGE_RED"

[New in: rippled 0.70.2]: https://github.com/ripple/rippled/releases/tag/0.70.2 "BADGE_BLUE"
[Introduced in: rippled 0.70.2]: https://github.com/ripple/rippled/releases/tag/0.70.2 "BADGE_BLUE"
[Updated in: rippled 0.70.2]: https://github.com/ripple/rippled/releases/tag/0.70.2 "BADGE_BLUE"
[Removed in: rippled 0.70.2]: https://github.com/ripple/rippled/releases/tag/0.70.2 "BADGE_RED"
[導入: rippled 0.70.2]: https://github.com/ripple/rippled/releases/tag/0.70.2 "BADGE_BLUE"
[新規: rippled 0.70.2]: https://github.com/ripple/rippled/releases/tag/0.70.2 "BADGE_BLUE"
[更新: rippled 0.70.2]: https://github.com/ripple/rippled/releases/tag/0.70.2 "BADGE_BLUE"
[削除: rippled 0.70.2]: https://github.com/ripple/rippled/releases/tag/0.70.2 "BADGE_RED"

[New in: rippled 0.80.0]: https://github.com/ripple/rippled/releases/tag/0.80.0 "BADGE_BLUE"
[Introduced in: rippled 0.80.0]: https://github.com/ripple/rippled/releases/tag/0.80.0 "BADGE_BLUE"
[Updated in: rippled 0.80.0]: https://github.com/ripple/rippled/releases/tag/0.80.0 "BADGE_BLUE"
[Removed in: rippled 0.80.0]: https://github.com/ripple/rippled/releases/tag/0.80.0 "BADGE_RED"
[導入: rippled 0.80.0]: https://github.com/ripple/rippled/releases/tag/0.80.0 "BADGE_BLUE"
[新規: rippled 0.80.0]: https://github.com/ripple/rippled/releases/tag/0.80.0 "BADGE_BLUE"
[更新: rippled 0.80.0]: https://github.com/ripple/rippled/releases/tag/0.80.0 "BADGE_BLUE"
[削除: rippled 0.80.0]: https://github.com/ripple/rippled/releases/tag/0.80.0 "BADGE_RED"

[New in: rippled 0.80.1]: https://github.com/ripple/rippled/releases/tag/0.80.1 "BADGE_BLUE"
[Introduced in: rippled 0.80.1]: https://github.com/ripple/rippled/releases/tag/0.80.1 "BADGE_BLUE"
[Updated in: rippled 0.80.1]: https://github.com/ripple/rippled/releases/tag/0.80.1 "BADGE_BLUE"
[Removed in: rippled 0.80.1]: https://github.com/ripple/rippled/releases/tag/0.80.1 "BADGE_RED"
[導入: rippled 0.80.1]: https://github.com/ripple/rippled/releases/tag/0.80.1 "BADGE_BLUE"
[新規: rippled 0.80.1]: https://github.com/ripple/rippled/releases/tag/0.80.1 "BADGE_BLUE"
[更新: rippled 0.80.1]: https://github.com/ripple/rippled/releases/tag/0.80.1 "BADGE_BLUE"
[削除: rippled 0.80.1]: https://github.com/ripple/rippled/releases/tag/0.80.1 "BADGE_RED"

[New in: rippled 0.90.0]: https://github.com/ripple/rippled/releases/tag/0.90.0 "BADGE_BLUE"
[Introduced in: rippled 0.90.0]: https://github.com/ripple/rippled/releases/tag/0.90.0 "BADGE_BLUE"
[Updated in: rippled 0.90.0]: https://github.com/ripple/rippled/releases/tag/0.90.0 "BADGE_BLUE"
[Removed in: rippled 0.90.0]: https://github.com/ripple/rippled/releases/tag/0.90.0 "BADGE_RED"
[導入: rippled 0.90.0]: https://github.com/ripple/rippled/releases/tag/0.90.0 "BADGE_BLUE"
[新規: rippled 0.90.0]: https://github.com/ripple/rippled/releases/tag/0.90.0 "BADGE_BLUE"
[更新: rippled 0.90.0]: https://github.com/ripple/rippled/releases/tag/0.90.0 "BADGE_BLUE"
[削除: rippled 0.90.0]: https://github.com/ripple/rippled/releases/tag/0.90.0 "BADGE_RED"

[New in: rippled 1.0.0]: https://github.com/ripple/rippled/releases/tag/1.0.0 "BADGE_BLUE"
[Introduced in: rippled 1.0.0]: https://github.com/ripple/rippled/releases/tag/1.0.0 "BADGE_BLUE"
[Updated in: rippled 1.0.0]: https://github.com/ripple/rippled/releases/tag/1.0.0 "BADGE_BLUE"
[Removed in: rippled 1.0.0]: https://github.com/ripple/rippled/releases/tag/1.0.0 "BADGE_RED"
[導入: rippled 1.0.0]: https://github.com/ripple/rippled/releases/tag/1.0.0 "BADGE_BLUE"
[新規: rippled 1.0.0]: https://github.com/ripple/rippled/releases/tag/1.0.0 "BADGE_BLUE"
[更新: rippled 1.0.0]: https://github.com/ripple/rippled/releases/tag/1.0.0 "BADGE_BLUE"
[削除: rippled 1.0.0]: https://github.com/ripple/rippled/releases/tag/1.0.0 "BADGE_RED"

[New in: rippled 1.1.0]: https://github.com/ripple/rippled/releases/tag/1.1.0 "BADGE_BLUE"
[Introduced in: rippled 1.1.0]: https://github.com/ripple/rippled/releases/tag/1.1.0 "BADGE_BLUE"
[Updated in: rippled 1.1.0]: https://github.com/ripple/rippled/releases/tag/1.1.0 "BADGE_BLUE"
[Removed in: rippled 1.1.0]: https://github.com/ripple/rippled/releases/tag/1.1.0 "BADGE_RED"
[導入: rippled 1.1.0]: https://github.com/ripple/rippled/releases/tag/1.1.0 "BADGE_BLUE"
[新規: rippled 1.1.0]: https://github.com/ripple/rippled/releases/tag/1.1.0 "BADGE_BLUE"
[更新: rippled 1.1.0]: https://github.com/ripple/rippled/releases/tag/1.1.0 "BADGE_BLUE"
[削除: rippled 1.1.0]: https://github.com/ripple/rippled/releases/tag/1.1.0 "BADGE_RED"

[New in: rippled 1.2.0]: https://github.com/ripple/rippled/releases/tag/1.2.0 "BADGE_BLUE"
[Introduced in: rippled 1.2.0]: https://github.com/ripple/rippled/releases/tag/1.2.0 "BADGE_BLUE"
[Updated in: rippled 1.2.0]: https://github.com/ripple/rippled/releases/tag/1.2.0 "BADGE_BLUE"
[Removed in: rippled 1.2.0]: https://github.com/ripple/rippled/releases/tag/1.2.0 "BADGE_RED"
[導入: rippled 1.2.0]: https://github.com/ripple/rippled/releases/tag/1.2.0 "BADGE_BLUE"
[新規: rippled 1.2.0]: https://github.com/ripple/rippled/releases/tag/1.2.0 "BADGE_BLUE"
[更新: rippled 1.2.0]: https://github.com/ripple/rippled/releases/tag/1.2.0 "BADGE_BLUE"
[削除: rippled 1.2.0]: https://github.com/ripple/rippled/releases/tag/1.2.0 "BADGE_RED"

[New in: rippled 1.2.1]: https://github.com/ripple/rippled/releases/tag/1.2.1 "BADGE_BLUE"
[Introduced in: rippled 1.2.1]: https://github.com/ripple/rippled/releases/tag/1.2.1 "BADGE_BLUE"
[Updated in: rippled 1.2.1]: https://github.com/ripple/rippled/releases/tag/1.2.1 "BADGE_BLUE"
[Removed in: rippled 1.2.1]: https://github.com/ripple/rippled/releases/tag/1.2.1 "BADGE_RED"
[導入: rippled 1.2.1]: https://github.com/ripple/rippled/releases/tag/1.2.1 "BADGE_BLUE"
[新規: rippled 1.2.1]: https://github.com/ripple/rippled/releases/tag/1.2.1 "BADGE_BLUE"
[更新: rippled 1.2.1]: https://github.com/ripple/rippled/releases/tag/1.2.1 "BADGE_BLUE"
[削除: rippled 1.2.1]: https://github.com/ripple/rippled/releases/tag/1.2.1 "BADGE_RED"

[New in: rippled 1.3.1]: https://github.com/ripple/rippled/releases/tag/1.3.1 "BADGE_BLUE"
[Introduced in: rippled 1.3.1]: https://github.com/ripple/rippled/releases/tag/1.3.1 "BADGE_BLUE"
[Updated in: rippled 1.3.1]: https://github.com/ripple/rippled/releases/tag/1.3.1 "BADGE_BLUE"
[Removed in: rippled 1.3.1]: https://github.com/ripple/rippled/releases/tag/1.3.1 "BADGE_RED"
[導入: rippled 1.3.1]: https://github.com/ripple/rippled/releases/tag/1.3.1 "BADGE_BLUE"
[新規: rippled 1.3.1]: https://github.com/ripple/rippled/releases/tag/1.3.1 "BADGE_BLUE"
[更新: rippled 1.3.1]: https://github.com/ripple/rippled/releases/tag/1.3.1 "BADGE_BLUE"
[削除: rippled 1.3.1]: https://github.com/ripple/rippled/releases/tag/1.3.1 "BADGE_RED"

[New in: rippled 1.4.0]: https://github.com/ripple/rippled/releases/tag/1.4.0 "BADGE_BLUE"
[Introduced in: rippled 1.4.0]: https://github.com/ripple/rippled/releases/tag/1.4.0 "BADGE_BLUE"
[Updated in: rippled 1.4.0]: https://github.com/ripple/rippled/releases/tag/1.4.0 "BADGE_BLUE"
[Removed in: rippled 1.4.0]: https://github.com/ripple/rippled/releases/tag/1.4.0 "BADGE_RED"
[導入: rippled 1.4.0]: https://github.com/ripple/rippled/releases/tag/1.4.0 "BADGE_BLUE"
[新規: rippled 1.4.0]: https://github.com/ripple/rippled/releases/tag/1.4.0 "BADGE_BLUE"
[更新: rippled 1.4.0]: https://github.com/ripple/rippled/releases/tag/1.4.0 "BADGE_BLUE"
[削除: rippled 1.4.0]: https://github.com/ripple/rippled/releases/tag/1.4.0 "BADGE_RED"

[New in: rippled 1.5.0]: https://github.com/ripple/rippled/releases/tag/1.5.0 "BADGE_BLUE"
[Introduced in: rippled 1.5.0]: https://github.com/ripple/rippled/releases/tag/1.5.0 "BADGE_BLUE"
[Updated in: rippled 1.5.0]: https://github.com/ripple/rippled/releases/tag/1.5.0 "BADGE_BLUE"
[Removed in: rippled 1.5.0]: https://github.com/ripple/rippled/releases/tag/1.5.0 "BADGE_RED"
[導入: rippled 1.5.0]: https://github.com/ripple/rippled/releases/tag/1.5.0 "BADGE_BLUE"
[新規: rippled 1.5.0]: https://github.com/ripple/rippled/releases/tag/1.5.0 "BADGE_BLUE"
[更新: rippled 1.5.0]: https://github.com/ripple/rippled/releases/tag/1.5.0 "BADGE_BLUE"
[削除: rippled 1.5.0]: https://github.com/ripple/rippled/releases/tag/1.5.0 "BADGE_RED"

[New in: rippled 1.6.0]: https://github.com/ripple/rippled/releases/tag/1.6.0 "BADGE_BLUE"
[Introduced in: rippled 1.6.0]: https://github.com/ripple/rippled/releases/tag/1.6.0 "BADGE_BLUE"
[Updated in: rippled 1.6.0]: https://github.com/ripple/rippled/releases/tag/1.6.0 "BADGE_BLUE"
[Removed in: rippled 1.6.0]: https://github.com/ripple/rippled/releases/tag/1.6.0 "BADGE_RED"
[導入: rippled 1.6.0]: https://github.com/ripple/rippled/releases/tag/1.6.0 "BADGE_BLUE"
[新規: rippled 1.6.0]: https://github.com/ripple/rippled/releases/tag/1.6.0 "BADGE_BLUE"
[更新: rippled 1.6.0]: https://github.com/ripple/rippled/releases/tag/1.6.0 "BADGE_BLUE"
[削除: rippled 1.6.0]: https://github.com/ripple/rippled/releases/tag/1.6.0 "BADGE_RED"

[New in: rippled 1.7.0]: https://github.com/ripple/rippled/releases/tag/1.7.0 "BADGE_BLUE"
[Introduced in: rippled 1.7.0]: https://github.com/ripple/rippled/releases/tag/1.7.0 "BADGE_BLUE"
[Updated in: rippled 1.7.0]: https://github.com/ripple/rippled/releases/tag/1.7.0 "BADGE_BLUE"
[Removed in: rippled 1.7.0]: https://github.com/ripple/rippled/releases/tag/1.7.0 "BADGE_RED"
[導入: rippled 1.7.0]: https://github.com/ripple/rippled/releases/tag/1.7.0 "BADGE_BLUE"
[新規: rippled 1.7.0]: https://github.com/ripple/rippled/releases/tag/1.7.0 "BADGE_BLUE"
[更新: rippled 1.7.0]: https://github.com/ripple/rippled/releases/tag/1.7.0 "BADGE_BLUE"
[削除: rippled 1.7.0]: https://github.com/ripple/rippled/releases/tag/1.7.0 "BADGE_RED"

[New in: rippled 1.7.2]: https://github.com/ripple/rippled/releases/tag/1.7.2 "BADGE_BLUE"
[Introduced in: rippled 1.7.2]: https://github.com/ripple/rippled/releases/tag/1.7.2 "BADGE_BLUE"
[Updated in: rippled 1.7.2]: https://github.com/ripple/rippled/releases/tag/1.7.2 "BADGE_BLUE"
[Removed in: rippled 1.7.2]: https://github.com/ripple/rippled/releases/tag/1.7.2 "BADGE_RED"
[導入: rippled 1.7.2]: https://github.com/ripple/rippled/releases/tag/1.7.2 "BADGE_BLUE"
[新規: rippled 1.7.2]: https://github.com/ripple/rippled/releases/tag/1.7.2 "BADGE_BLUE"
[更新: rippled 1.7.2]: https://github.com/ripple/rippled/releases/tag/1.7.2 "BADGE_BLUE"
[削除: rippled 1.7.2]: https://github.com/ripple/rippled/releases/tag/1.7.2 "BADGE_RED"

[New in: rippled 1.8.1]: https://github.com/ripple/rippled/releases/tag/1.8.1 "BADGE_BLUE"
[Introduced in: rippled 1.8.1]: https://github.com/ripple/rippled/releases/tag/1.8.1 "BADGE_BLUE"
[Updated in: rippled 1.8.1]: https://github.com/ripple/rippled/releases/tag/1.8.1 "BADGE_BLUE"
[Removed in: rippled 1.8.1]: https://github.com/ripple/rippled/releases/tag/1.8.1 "BADGE_RED"
[導入: rippled 1.8.1]: https://github.com/ripple/rippled/releases/tag/1.8.1 "BADGE_BLUE"
[新規: rippled 1.8.1]: https://github.com/ripple/rippled/releases/tag/1.8.1 "BADGE_BLUE"
[更新: rippled 1.8.1]: https://github.com/ripple/rippled/releases/tag/1.8.1 "BADGE_BLUE"
[削除: rippled 1.8.1]: https://github.com/ripple/rippled/releases/tag/1.8.1 "BADGE_RED"
