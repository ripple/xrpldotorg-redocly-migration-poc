# Transaction Malleability

A transaction is "malleable" if it can be changed in any way after being signed, without the keys to sign it. In the XRP Ledger, the **functionality** of a signed transaction cannot change, but in some circumstances a third party _could_ change the signature and identifying hash of a transaction.

If vulnerable software submits malleable transactions and assumes they can only execute under the original hash, it may lose track of transactions. In the worst case, malicious actors could take advantage of this to steal money from the vulnerable system.

On the XRP Ledger mainnet, only **multi-signed transactions** can be malleable, if they have more signatures than necessary, or if an authorized signer provides an additional signature beyond what is necessary. Good operational security can protect against these problems. See [Mitigations for Multi-Signature Malleability](#mitigations-for-multi-signature-malleability) for guidelines.

Before 2014, single-signed transactions could be malleable due to properties of the default signing algorithm, ECDSA with the secp256k1 curve. For compatibility with legacy signing tools, it was possible to create and submit malleable single-signed transactions until the [RequireFullyCanonicalSig amendment][] became enabled on 2020-07-03. (Transactions [signed with Ed25519 keys](cryptographic-keys.html#signing-algorithms) were never vulnerable to this problem.)



## Background

In the XRP Ledger, a transaction cannot execute unless:

- All [fields of a transaction](transaction-common-fields.html) are signed, except the signature itself.
- The key pair(s) used to sign the transaction are [authorized to send transactions on behalf of that account](transaction-basics.html#authorizing-transactions).
- The signature is _canonical_ and matches the transaction instructions.

Any change to the signed fields, no matter how small, would invalidate the signature, so no part of the transaction can be malleable except for the signature itself. In most cases, any change to a signature itself also invalidates the signature, but there are some specific exceptions, described below.

Since the signature is among the data used to compute a transaction's identifying hash, any changes to a malleable transaction result in a different hash.

### Alternate secp256k1 Signatures

To be "canonical", signatures created with the ECDSA algorithm and secp256k1 curve (the default) must meet the following requirements:

- The signature must be properly [DER-encoded data](https://en.wikipedia.org/wiki/X.690#DER_encoding).
- The signature must not have any padding bytes outside the DER-encoded data.
- The signature's component integers must not be negative, and they must not be larger than the secp256k1 group order. <!-- STYLE_OVERRIDE: component -->

Generally speaking, any standard ECDSA implementation handles these requirements automatically. However, with secp256k1, those requirements are insufficient to prevent malleability. Thus, the XRP Ledger has a concept of "fully canonical" signatures which do not have the same problem.

An ECDSA signature consists of two integers, called R and S. The secp256k1 _group order_, called N, is a constant value for all secp256k1 signatures. Specifically, N is the value `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141`. For any given signature `(R,S)`, the signature `(R, N-S)` (that is, using N minus S in place of S) is also valid.

Thus, to have _fully_ canonical signatures, one must choose which of the two possibilities is preferred and declare the other to be invalid. The creators of the XRP Ledger decided arbitrarily to prefer the _smaller_ of the two possible values, `S` or `N-S`. A transaction is considered _fully canonical_ if it uses the preferred (smaller) value of `S`, and follows all the normal rules for being canonical. To calculate a fully-canonical ECDSA signature, one must compare S and N-S to determine which is smaller, then use that value in the `Signature` field of the transaction.

With the [RequireFullyCanonicalSig amendment][] (enabled in 2020), all transactions must use _fully canonical_ signatures only.

Between 2014 and 2020, the XRP Ledger was compatible with legacy software that did not always generate fully canonical signatures, but used a flag on transactions called [**`tfFullyCanonicalSig`**](transaction-common-fields.html#global-flags) to protect compatible software from transaction malleability. This flag, which compatible signing software enables by default, required that the transaction use a _fully-canonical_ signature to be valid. Now that the [RequireFullyCanonicalSig amendment][] is enabled, the flag is no longer necessary, but there is no harm in enabling it anyway.


### Malleability with Multi-Signatures

An important, explicit feature of multi-signing is that multiple different possible configurations can make a transaction valid. For example, an account can be configured so that signatures from any three of five signers could authorize a transaction. However, this inherently means that there can be several different variations of a valid transaction, each with a different identifying hash.

All of the following cases can lead to transaction malleability:

- If a transaction still has enough signatures to meet its quorum after removing one or more. Any third party could remove a signature and re-submit the transaction without it.
- If one can add a valid signature to a transaction that already has a quorum. Only an authorized signer of the sending account could create such a signature.
- If one can replace one signature from a transaction with another valid signature while maintaining a quorum. Only an authorized signer of the sending account could create such a signature.

Even if your authorized signers are not intentionally malicious, confusion or poor coordination could cause several signers to submit different valid versions of the same transaction.

#### Mitigations for Multi-Signature Malleability

**Good operational security can protect against these problems.** Generally, you can avoid transaction malleability problems when multi-signing if you follow good operational security practices, including the following:

- Do not collect more signatures than necessary.
- Either appoint one party to assemble a transaction after collecting the necessary number of signatures, or instruct signers pass the transaction instructions forward to be signed in a set order.
- Do not add unnecessary or untrusted signers to your multi-signing lists, even if the `weight` values associated with their keys are insufficient to authorize a transaction.
- Be prepared for the possibility that a transaction executes with a different hash and set of signatures than you expected. Carefully monitor your account's sent transactions (for example, using the [account_tx method][]).
- Monitor the `Sequence` number of your account (for example, using the [account_info method][]). This number always increases by exactly one when your account sends a transaction successfully, and never any other way. If the number does not match what you expect, you should check your recent transactions to confirm why. (Aside from malleable transactions, there are other ways this could happen, too. Perhaps you configured another application to send transactions for you. Maybe a malicious user gained access to your secret key. Or perhaps your application lost data and forgot about a transaction you sent already.)
- If you re-create transactions to be multi-signed, _do not_ change the `Sequence` number unless you have manually confirmed that the intended actions have not already executed.
- Confirm that the `tfFullyCanonicalSig` flag is enabled before signing.

For greater security, these guidelines provide multiple layers of protection.


## Exploit With Malleable Transactions

If the software you use to interface with the XRP Ledger sends malleable transactions, a malicious actor may be able to trick your software into losing track of a transaction's final outcome and potentially (in the worst case) sending equivalent payments multiple times.

If you use single-signatures only, you are not vulnerable to this exploit. If you use multi-signatures, you may be vulnerable if you or your signers provide more signatures than necessary.

### Exploit Scenario Steps

The process to exploit a vulnerable system follows a series of steps like the following:

1. The vulnerable system constructs a multi-signed transaction and collects more than the necessary number of signatures.

    If an authorized signer is malicious or irresponsible, the transaction could also be vulnerable if that signer's signature is not included but could be added.

2. The system notes the identifying hash of the vulnerable transaction, submits it to the XRP Ledger network, then begins monitoring for that hash to be included in a validated ledger version.

3. A malicious actor sees the transaction propagating through the network before it becomes confirmed.

4. The malicious actor removes an extra signature from the vulnerable transaction.

    Unlike creating a signature for different transaction instructions, this does not require a large amount of computational work. It can be done in much less time than it takes to generate a signature in the first place.

    Alternatively, an authorized signer whose signature is not already part of the transaction could add their signature to the vulnerable transaction's list of signatures. Depending on the sender's multi-signing settings, this can be instead of or in addition to removing other signatures from the transaction.

    The modified list of signatures results in a different identifying hash. (You do not have to calculate the hash before you submit to the network, but knowing the hash makes it easier to check the transaction's status later.)

5. The malicious actor submits the modified transaction to the network.

    This creates a "race" between the transaction as originally submitted and the modified version submitted by the malicious actor. The two transactions are mutually exclusive. Both are valid, but they have the same exact transaction data, including the `Sequence` number, so at most one of them can ever be included in a validated ledger.

    Servers in the peer-to-peer network have no way of knowing which one "came first" or was intended by its original sender. Delays or other coincidences in network connectivity could result in validators seeing only one or the other by the time they finalize their consensus proposals, so either one could "win the race".

    A malicious actor could increase the chances of getting non-canonical transactions confirmed if they controlled some number of well-connected servers in the peer-to-peer network, even if those servers are not trusted as validators.

    If the malicious actor controls the only server to which the vulnerable system submitted the transaction, the malicious actor can easily control which version is distributed to the rest of the network.

6. The malicious actor's version of the transaction achieves consensus and becomes included in a validated ledger.

    At this point, the transaction has executed and cannot be reversed. Its effects (such as sending XRP) are final. The original version of the transaction is no longer valid because its `Sequence` number has been used.

    The effects of the transaction in the XRP Ledger are exactly the same as if the original version had executed.

7. The vulnerable system does not see the transaction hash it is expecting, and erroneously concludes that the transaction did not execute.

    If the transaction included the `LastLedgerSequence` field, this would occur after the specified ledger index has passed.

    If the transaction omitted the `LastLedgerSequence` field, this could be wrong in another way: if no other transaction from the same sender uses the same `Sequence` number, then the transaction could theoretically succeed later regardless of how much time has passed. (See [Reliable Transaction Submission](reliable-transaction-submission.html) for details.)

8. The vulnerable system takes action assuming that the transaction has failed.

    For example, it may refund (or not debit) a customer's balance in its own system, to account for the funds that it thinks have not been sent in the XRP Ledger.

    Worse, the vulnerable system might construct a new transaction to replace the transaction, picking new `Sequence`, `LastLedgerSequence`, and `Fee` parameters based on the current state of the network, but keeping the rest of the transaction the same as the original. If this new transaction is also malleable, the system could be exploited in the same way an indefinite number of times.


## See Also

- **Concepts:**
    - [Transaction Basics](transaction-basics.html)
    - [Finality of Results](finality-of-results.html)
- **Tutorials:**
    - [Look Up Transaction Results](look-up-transaction-results.html)
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
- **References:**
    - [Basic Data Types - Hashes](basic-data-types.html#hashes)
    - [Transaction Common Fields - Global Flags](transaction-common-fields.html#global-flags)
    - [Transaction Results](transaction-results.html)
    - [Serialization Format](serialization.html)

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
