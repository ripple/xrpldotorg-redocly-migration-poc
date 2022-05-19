# List XRP as an Exchange

This document describes the steps that an exchange needs to take to list XRP. These steps are targeted at _custodial exchanges_ that holds fund on behalf of users, and allows users to deposit, withdraw, and trade other digital assets, fiat currencies, or other types of assets.

## Alpha Exchange

For illustrative purposes, this document uses a fictitious business called _Alpha Exchange_ to explain the high-level steps required to list XRP. For the purposes of this document, Alpha Exchange:

* Currently specializes in listing BTC/USD

* Wants to add BTC/XRP and XRP/USD trading pairs

* Maintains balances for all of its customers

* Maintains balances for each of its supported currencies

### User Benefits

Alpha Exchange wants to list BTC/XRP and XRP/USD trading pairs partially because listing these pairs benefits its users. Specifically, this support wants to enable its users to:

* Deposit XRP _to_ Alpha Exchange _from_ the XRP Ledger

* Withdraw XRP _from_ Alpha Exchange _to_ the XRP Ledger

* Trade XRP with other currencies, such as BTC, USD, among others

## Prerequisites for Supporting XRP

To support XRP, Alpha Exchange must:

* Create and maintain new [accounts](#accounts)

* Create and maintain [balance sheets](#balance-sheets)

See also:

* [Gateway Compliance](become-an-xrp-ledger-gateway.html#gateway-compliance) — Gateways and exchanges are different, but exchanges should also ensure that they are complying with local regulations and reporting to the appropriate agencies.

* [Requirements for Sending to XRP Ledger](become-an-xrp-ledger-gateway.html#requirements-for-sending-to-xrp-ledger)

* [Requirements for Receiving from XRP Ledger](become-an-xrp-ledger-gateway.html#requirements-for-receiving-from-xrp-ledger)

* [Gateway Precautions](become-an-xrp-ledger-gateway.html#precautions)

### Partial Payments

Before integrating, exchanges should be aware of the [partial payments](partial-payments.html) feature. This feature allows XRP Ledger users to send successful payments that reduce the amount received instead of increasing the `SendMax`. This feature can be useful for [returning payments](become-an-xrp-ledger-gateway.html#bouncing-payments) without incurring additional cost as the sender.

#### Partial Payments Warning

When the [`tfPartialPayment` flag](payment.html#payment-flags) is enabled, the `Amount` field **_is not guaranteed to be the amount received_**. The `delivered_amount` field of a payment's metadata indicates the amount of currency actually received by the destination account. When receiving a payment, use `delivered_amount` instead of the Amount field to determine how much your account received instead.

:::warning Warning

Be aware that malicious actors could exploit this. For more information, see [Partial Payments](partial-payments.html).

:::

### Accounts

XRP is held in _accounts_ (also referred to as _wallets_ or _addresses_  ) on the XRP Ledger. Accounts on the XRP Ledger are different than accounts on other blockchain ledgers, such as Bitcoin, where accounts incur little to no overhead. In the XRP Ledger, account state is stored per ledger and accounts are [not easy to delete](accounts.html#deletion-of-accounts). To offset the costs associated with storing accounts, each account must hold a separate [reserve of XRP](reserves.html) that cannot be sent to others. For these reasons, Ripple recommends that institutions not create excessive or needless accounts.

<!-- STYLE_OVERRIDE: hot wallet, warm wallet, cold wallet, wallet, easy -->

To follow Ripple's recommended best practices, Alpha Exchange should create at least two new accounts on the XRP Ledger. To minimize the risks associated with a compromised secret key, Ripple recommends creating [_cold_, _hot_, and _warm_ accounts](issuing-and-operational-addresses.html) (these are sometimes referred to, respectively, as cold, hot, and warm wallets). The hot/warm/cold model is intended to balance security and convenience. Exchanges listing XRP should create the following accounts:

* A [_cold wallet_](issuing-and-operational-addresses.html#issuing-address) to securely hold the majority of XRP and customers' funds. For exchanges, this is also the address to which its users send [deposits](#deposit-xrp-into-exchange).   To provide optimal security, this account's secret key should be offline.

    If a malicious actor compromises an exchange's cold wallet, the possible consequences are:

    * The malicious actor gets full access to all XRP in the cold wallet.

    * If the master key is compromised, the malicious actor can irrevocably take control of the cold wallet forever (by disabling the master key and setting a new regular key or signer list). This would also give the malicious actor control over all future XRP received by the cold wallet.

        * If this happens, the exchange has to make a new cold wallet address and tell its customers the new address.

    * If the regular key or signer list are compromised, the exchange can regain control of the cold wallet. However, some of a malicious actor's actions cannot easily be undone: <!-- STYLE_OVERRIDE: easily -->

        * The malicious actor could issue currency in the XRP Ledger by using the cold wallet, but that currency should not be valued by anyone (unless the exchange explicitly stated it was also a gateway).

        * If a malicious actor sets the `asfRequireAuth` flag for the account, that cannot be unset, although this only relates to issuing currency and should not affect an exchange that is not also a gateway. Any other settings a malicious actor changes with a master key can be reverted.

* One or more [_hot wallets_](issuing-and-operational-addresses.html#operational-addresses) to conduct the day-to-day business of managing customers' XRP withdrawals and deposits. For example, with a hot wallet, exchanges can securely support these types of automated XRP transfers. Hot wallets need to be online to service instant withdrawal requests.

    For more information about the possible consequences of a compromised hot wallet, see [Operational Account Compromise](issuing-and-operational-addresses.html#operational-address-compromise).

* Optionally, one or more warm wallets to provide an additional layer of security between the cold and hot wallets. Unlike a hot wallet, the secret key of a warm wallet does not need to be online. Additionally, you can distribute the secret keys for the warm wallet to several different people and implement [multi-signing](multi-signing.html) to increase security.

    For more information about the possible consequences of a compromised warm wallet, see [Standby Account Compromise](issuing-and-operational-addresses.html#standby-address-compromise).


See also:

* ["Suggested Business Practices" in the _Gateway Guide_](become-an-xrp-ledger-gateway.html#suggested-business-practices)

* [Issuing and Operational Addresses](issuing-and-operational-addresses.html)

* [Creating Accounts](accounts.html#creating-accounts)

* [Reserves](reserves.html)

### Balance Sheets

To custody its customers' XRP, Alpha Exchange must track each customer's XRP balance and its own holdings. To do this, Alpha Exchange must create and maintain an additional balance sheet or accounting system. The following table illustrates what this balance sheet might look like.

The new XRP Ledger accounts (_Alpha Hot_, _Alpha Warm_, _Alpha Cold_) are in the *User* column of the *XRP Balances on XRP Ledger* table.

The *Alpha Exchange XRP Balances* table represents new, additional balance sheet. Alpha Exchange’s software manages their users’ balances of XRP on this accounting system.


<table>
  <tr>
    <td><b><i>XRP Balances
on XRP Ledger</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
XRP Balances</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>Account #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td>0</td>
  </tr>
  <tr>
    <td><i>Alpha Hot</i></td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Warm</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Cold</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>

#### XRP Amounts

Amounts of XRP are represented on the XRP Ledger as an unsigned integer count of _drops_, where one XRP is 1,000,000 drops. Ripple recommends that software store XRP balances as integer amounts of drops, and perform integer arithmetic on these values. However, user interfaces should present balances in units of XRP.

One drop (.000001 XRP) cannot be further subdivided. Keep this in mind when calculating and displaying FX rates between XRP and other assets.

For more information, see [Specifying Currency Amounts][].

#### On-Ledger and Off-Ledger

With exchanges like _Alpha Exchange_, XRP can be "on-ledger" or "off-ledger":

* **On-Ledger XRP**: XRP that can be queried through the public XRP Ledger by specifying the public [address](accounts.html#addresses) of the XRP holder. The counterparty to these balances is the XRP Ledger. For more information, see [XRP](xrp.html).

* **Off-Ledger XRP**: XRP that is held by the accounting system of an exchange and can be queried through the exchange interface. Off-ledger XRP balances are credit-based. The counterparty is the exchange holding the XRP.

    Off-ledger XRP balances are traded between the participants of an exchange. To support these trades, the exchange must hold a balance of _on-ledger XRP_ equal to the aggregate amount of _off-ledger XRP_ that it makes available for trade.


## Flow of Funds

The remaining sections describe how funds flow through the accounts managed by Alpha Exchange as its users begin to deposit, trade, and redeem XRP balances. To illustrate the flow of funds, this document uses the tables introduced in the ["Balance Sheets" section](#balance-sheets).

There are four main steps involved in an exchange's typical flow of funds:

1. [Deposit XRP into Exchange](#deposit-xrp-into-exchange)

2. [Rebalance XRP Holdings](#rebalance-xrp-holdings)

3. [Withdraw XRP from Exchange](#withdraw-xrp-from-exchange)

4. [Trade XRP on the Exchange](#trade-xrp-on-the-exchange)


This list does not include the [prerequisites](#prerequisites-for-supporting-xrp) required of an exchange.

At this point, _Alpha Exchange_ has created [hot, warm, and cold wallets](#accounts) on the XRP Ledger and added them to its balance sheet, but has not accepted any deposits from its users.


<table>
  <tr>
    <td><b><i>XRP Balances
on XRP Ledger</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
XRP Balances</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>Account #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td>0</td>
  </tr>
  <tr>
    <td><i>Alpha Hot</i></td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Warm</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Cold</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>


### Deposit XRP into Exchange

To track [off-ledger XRP balances](#on-ledger-and-off-ledger), exchanges need to create new [balance sheets](#balance-sheets) (or similar accounting systems). The following table illustrates the balance changes that take place on Alpha Exchange's new balance sheet as users begin to deposit XRP.

A user named Charlie wants to deposit 50,000 XRP to Alpha Exchange. Doing this involves the following steps:

1. Charlie submits a payment of 50,000  XRP to Alpha Exchange's [cold wallet](#accounts).

    a. Charlie adds an identifier (in this case, `789`) to the payment to associate it with his account at Alpha Exchange. This is called a [_destination tag_](become-an-xrp-ledger-gateway.html#source-and-destination-tags). (To use this, Alpha Exchange should have set the `asfRequireDest` flag on all of its accounts to require all incoming payments to have a destination tag like Charlie's. For more information, see [AccountSet Flags](accountset.html#accountset-flags)).

2. The software at Alpha Exchange detects the incoming payment, and recognizes `789` as the destination tag for Charlie’s account.

3. When it detects the incoming payment, Alpha Exchange's software updates its balance sheet to indicate that the 50,000 XRP it received is controlled by Charlie.

    Charlie can now use up to 50,000 XRP on the exchange. For example, he can create offers to trade XRP with BTC or any of the other currencies Alpha Exchange supports.

<table>
  <tr>
    <td><b><i>XRP Balances
on XRP Ledger</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
XRP Balances</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>Account #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td><s>100,000</s>
<br>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td><s>0</s>
<br>50,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Hot</td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Warm</td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Cold</td>
    <td><s>0</s>
<br>50,000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>


### Trade XRP on the Exchange

Alpha Exchange users (like Charlie) can trade credit-based balances on Alpha Exchange. Alpha Exchange should keep track of user balances on its new balance sheet as these trades are made. These trades are _off-ledger_ and independent from the XRP Ledger, so the balance changes are not recorded on the XRP Ledger.

Customers who hold XRP in their own XRP Ledger accounts can also use the distributed exchange built into the XRP Ledger to trade currencies issued by gateways. For more information about trading _on_ the XRP Ledger, see [Lifecycle of an Offer](offers.html#lifecycle-of-an-offer).


### Rebalance XRP Holdings

Exchanges can adjust the balances between their hot and cold wallets at any time. Each balance adjustment consumes a [transaction cost](transaction-cost.html), but does not otherwise affect the aggregate balance of all the accounts. The aggregate, on-ledger balance should always exceed the total balance available for trade on the exchange. (The excess should be enough to cover the XRP Ledger's transaction costs.)

The following table demonstrates a balance adjustment of 80,000 XRP (via a [Payment transaction][] on the XRP Ledger) between Alpha Exchange's cold wallet and its hot wallet, where the cold wallet was debited and the hot wallet was credited. If the payment were reversed (debiting the hot wallet and crediting the cold wallet), the hot wallet balance would decrease. Balance adjustments like these allow an exchange to limit the risks associated with holding XRP in online hot wallets.


<table>
  <tr>
    <td><b><i>Alpha Exchange XRP
Off-Ledger Balances</i></b></td>
    <td></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange XRP On-Ledger Balances</i></b></td>
    <td></td>
  </tr>
  <tr>
    <td><b>Account #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>XRP Ledger Account</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>123</td>
    <td>Alice</td>
    <td>80,000</td>
    <td></td>
    <td>Hot</td>
    <td><s>0</s>
<br>80,000</td>
  </tr>
  <tr>
    <td>456</td>
    <td>Bob</td>
    <td>50,000</td>
    <td></td>
    <td>Warm</td>
    <td>0</td>
  </tr>
  <tr>
    <td>….</td>
    <td></td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
  </tr>
  <tr>
    <td>789</td>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>Cold</td>
    <td><s>180,000</s>
<br>100,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
  </tr>
</table>


### Withdraw XRP from Exchange

Withdrawals allow an exchange's users to move XRP from the exchange's off-ledger balance sheet to an account on the XRP Ledger.

In this example, Charlie withdraws 25,000 XRP from Alpha Exchange. This involves the following steps:

1. Charlie initiates the process on Alpha Exchange’s website. He provides instructions to transfer 25,000 XRP to a specific account on the XRP Ledger (named "Charlie XRP Ledger" in the following table).

2. In response to Charlie’s instructions, Alpha Exchange does the following:

    a. Debits the amount (25,000 XRP) from Charlie’s account on its off-ledger balance sheet

    b. Submits a payment on the XRP Ledger for the same amount (25,000 XRP), from Alpha Exchange's hot wallet to Charlie’s XRP Ledger account


<table>
  <tr>
    <td><b><i>XRP Ledger On-Ledger XRP Balances</td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange XRP
Off-Ledger Balances</td>
    <td></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange XRP On-Ledger Balances</td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</td>
    <td><b>Balance</td>
    <td></td>
    <td><b>Account #</td>
    <td><b>User</td>
    <td><b>Balance</td>
    <td></td>
    <td><b>XRP Ledger Account</td>
    <td><b>Balance</td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>80,000</td>
    <td></td>
    <td>Hot</td>
    <td><s>80,000</s>
<br>55,000</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>50,000</td>
    <td></td>
    <td>Warm</td>
    <td>0</td>
  </tr>
  <tr>
    <td>….</td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
  </tr>
  <tr>
    <td>Charlie XRP Ledger</td>
    <td><s>50,000</s>
<br>75,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td><s>50,000</s>
<br>25,000</td>
    <td></td>
    <td>Cold</td>
    <td>100,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
  </tr>
</table>


## See Also

- **Concepts:**
    - [Accounts](accounts.html)
    - [Direct XRP Payments](direct-xrp-payments.html)
    - [Partial Payments](partial-payments.html)
    - [Source and Destination Tags](source-and-destination-tags.html)
- **Tutorials:**
    - [Install `rippled`](install-rippled.html)
    - [Send XRP](send-xrp.html)
    - [Set Up Secure Signing](set-up-secure-signing.html)
    - [Monitor Incoming Payments with WebSocket](monitor-incoming-payments-with-websocket.html)
- **References:**
    - [Payment transaction][]
    - [account_info method][]
    - [AccountRoot object](accountroot.html)


<!---->
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
