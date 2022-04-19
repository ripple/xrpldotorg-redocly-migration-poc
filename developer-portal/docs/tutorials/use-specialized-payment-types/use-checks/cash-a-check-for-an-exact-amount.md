# Cash a Check for an Exact Amount

_Added by the [Checks amendment][]._

As long as the Check is in the ledger and not expired, the specified recipient can cash it to receive any exact amount up to the amount specified in the Check by sending a [CheckCash transaction][] with an `Amount` field. You would cash a Check this way if you want to receive a specific amount, for example to pay off an invoice or bill exactly.

The specified recipient can also [cash the check for a flexible amount](cash-a-check-for-a-flexible-amount.html).



## Prerequisites

The prerequisites for cashing a check are the same whether you are cashing it for an exact amount or a flexible amount.

- You need the ID of a Check object currently in the ledger.
    - For example, the ID of one Check in these examples is `838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334`, although you must use a different ID to go through these steps yourself.
- The **address** and **secret key** of the Check's stated recipient. The address must match the `Destination` address in the Check object.
- If the Check is for a [token](tokens.html), you (the recipient) must have a [trust line](trust-lines-and-issuing.html) to the issuer. Your limit on that trust line must be high enough to hold your previous balance plus the amount you would receive.
- A [secure way to sign transactions](set-up-secure-signing.html).
- A [client library](client-libraries.html) that can connect to the XRP Ledger, or [any HTTP or WebSocket client](get-started-using-http-websocket-apis.html). <!--#{ fix md highlighting_ #}-->

## 1. Prepare the CheckCash transaction

Figure out the values of the [CheckCash transaction][] fields. To cash a check for an exact amount, the following fields are the bare minimum; everything else is either optional or can be [auto-filled](transaction-common-fields.html#auto-fillable-fields) when signing:

| Field             | Value                     | Description                  |
|:------------------|:--------------------------|:-----------------------------|
| `TransactionType` | String                    | The value `CheckCash` indicates this is a CheckCash transaction. |
| `Account`         | String (Address)          | The address of the sender who is cashing the Check. (In other words, your address.) |
| `CheckID`         | String                    | The ID of the Check object in the ledger to cash. You can get this information by looking up the metadata of the CheckCreate transaction using the [tx method][] or by looking for Checks using the [account_objects method][]. |
| `Amount`          | String or Object (Amount) | The amount to redeem from the Check. For XRP, this must be a string specifying drops of XRP. For tokens, this is an object with `currency`, `issuer`, and `value` fields. The `currency` and `issuer` fields must match the corresponding fields in the Check object, and the `value` must be less than or equal to the amount in the Check object. (For currencies with transfer fees, you must cash the Check for less than its `SendMax` so the transfer fee can be paid by the `SendMax`.) If you cannot receive this much, cashing the Check fails, leaving the Check in the ledger so you can try again. For more information on specifying currency amounts, see [Specifying Currency Amounts][]. |


### Example CheckCash Preparation for an exact amount

The following examples show how to prepare a transaction to cash a Check for a fixed amount.

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC, WebSocket, or Commandline*

```json
{
  "Account": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
  "TransactionType": "CheckCash",
  "Amount": "100000000",
  "CheckID": "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
  "Fee": "12"
}
```

*ripple-lib 1.x*

```js
'use strict'
const RippleAPI = require('ripple-lib').RippleAPI

// This example connects to a public Test Net server
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect().then(() => {
  console.log('Connected')

  const sender = 'rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis'
  const options = {
    // Allow up to 60 ledger versions (~5 min) instead of the default 3 versions
    // before this transaction fails permanently.
    "maxLedgerVersionOffset": 60
  }
  return api.prepareCheckCash(sender, {
    "checkID": "84C61BE9B39B2C4A2267F67504404F1EC76678806C1B901EA781D1E3B4CE0CD9",
    "amount": {
      "currency": "XRP",
      "value": "95" // Cash for exactly 95 XRP
    }
  }, options)

}).then(prepared => {
  console.log("txJSON:", prepared.txJSON);

// Disconnect and return
}).then(() => {
  api.disconnect().then(() => {
    console.log('Disconnected')
    process.exit()
  })
}).catch(console.error)


// Example output:
//
// Connected
// txJSON: {"Account":"rGPnRH1EBpHeTF2QG8DCAgM7z5pb75LAis",
//   "TransactionType":"CheckCash",
//   "CheckID":"84C61BE9B39B2C4A2267F67504404F1EC76678806C1B901EA781D1E3B4CE0CD9",
//   "Amount":"95000000",
//   "Flags":2147483648,
//   "LastLedgerSequence":8006841,
//   "Fee":"12",
//   "Sequence":5}
// Disconnected
```

<!-- MULTICODE_BLOCK_END -->

## 2. Sign the CheckCash transaction

The most secure way to sign a transaction is to do it locally with a [client library](client-libraries.html). Alternatively, if you run your own `rippled` node you can sign the transaction using the [sign method](sign.html), but this must be done through a trusted and encrypted connection, or through a local (same-machine) connection.

In all cases, note the signed transaction's identifying hash for later. <!--#{ fix md highlighting_ #}-->

### Example Request

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```bash
rippled sign s████████████████████████████ '{
  "Account": "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
  "TransactionType": "CheckCash",
  "Amount": "100000000",
  "CheckID": "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
  "Fee": "12"
}'
```

<!-- MULTICODE_BLOCK_END -->


### Example Response

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```json
Loading: "/etc/opt/ripple/rippled.cfg"
2018-Jan-24 01:17:54 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "status" : "success",
      "tx_blob" : "120011228000000024000000015018838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334614000000005F5E10068400000000000000C732102F135B14C552968B0ABE8493CC4C5795A7484D73F6BFD01379F73456F725F66ED74473045022100C64278AC90B841CD3EA9889A4847CAB3AC9927057A34130810FAA7FAC0C6E3290220347260A4C0A6DC9B699DA12510795B2B3414E1FA222AF743226345FBAAEF937C811449FF0C73CA6AF9733DA805F76CA2C37776B7C46B",
      "tx_json" : {
         "Account" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
         "Amount" : "100000000",
         "CheckID" : "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
         "Fee" : "12",
         "Flags" : 2147483648,
         "Sequence" : 1,
         "SigningPubKey" : "02F135B14C552968B0ABE8493CC4C5795A7484D73F6BFD01379F73456F725F66ED",
         "TransactionType" : "CheckCash",
         "TxnSignature" : "3045022100C64278AC90B841CD3EA9889A4847CAB3AC9927057A34130810FAA7FAC0C6E3290220347260A4C0A6DC9B699DA12510795B2B3414E1FA222AF743226345FBAAEF937C",
         "hash" : "0521707D510858BC8AF69D2227E1D1ADA7DB7C5B4B74115BCD0D91B62AFA8EDC"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->


## 3. Submit the signed CheckCash transaction


Take the signed transaction blob from the previous step and submit it to a `rippled` server. You can do this safely even if you do not run the `rippled` server. The response contains a provisional result, which should be `tesSUCCESS`, but this result is [usually not final](finality-of-results.html). A provisional response of `terQUEUED` is also OK, since [queued transactions](transaction-cost.html#queued-transactions) are generally included in the next open ledger version (usually about 10 seconds after submission).

**Tip:** If the preliminary result is `tefMAX_LEDGER`, the transaction has failed permanently because its `LastLedgerSequence` parameter is lower than the current ledger. This happens when you take longer than the expected number of ledger versions between preparing and submitting the transaction. If this occurs, [start over from step 1](#1-prepare-the-checkcash-transaction) with a higher `LastLedgerSequence` value. <!--#{ fix md highlighting_ #}-->

### Example Request

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```bash
rippled submit 120011228000000024000000015018838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334614000000005F5E10068400000000000000C732102F135B14C552968B0ABE8493CC4C5795A7484D73F6BFD01379F73456F725F66ED74473045022100C64278AC90B841CD3EA9889A4847CAB3AC9927057A34130810FAA7FAC0C6E3290220347260A4C0A6DC9B699DA12510795B2B3414E1FA222AF743226345FBAAEF937C811449FF0C73CA6AF9733DA805F76CA2C37776B7C46B
```

<!-- MULTICODE_BLOCK_END -->


### Example Response

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```json
Loading: "/etc/opt/ripple/rippled.cfg"
2018-Jan-24 01:17:54 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
  "result" : {
    "engine_result" : "tesSUCCESS",
    "engine_result_code" : 0,
    "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
    "status" : "success",
    "tx_blob" : "120011228000000024000000015018838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334614000000005F5E10068400000000000000C732102F135B14C552968B0ABE8493CC4C5795A7484D73F6BFD01379F73456F725F66ED74473045022100C64278AC90B841CD3EA9889A4847CAB3AC9927057A34130810FAA7FAC0C6E3290220347260A4C0A6DC9B699DA12510795B2B3414E1FA222AF743226345FBAAEF937C811449FF0C73CA6AF9733DA805F76CA2C37776B7C46B",
    "tx_json" : {
      "Account" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
      "Amount" : "100000000",
      "CheckID" : "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
      "Fee" : "12",
      "Flags" : 2147483648,
      "Sequence" : 1,
      "SigningPubKey" : "02F135B14C552968B0ABE8493CC4C5795A7484D73F6BFD01379F73456F725F66ED",
      "TransactionType" : "CheckCash",
      "TxnSignature" : "3045022100C64278AC90B841CD3EA9889A4847CAB3AC9927057A34130810FAA7FAC0C6E3290220347260A4C0A6DC9B699DA12510795B2B3414E1FA222AF743226345FBAAEF937C",
      "hash" : "0521707D510858BC8AF69D2227E1D1ADA7DB7C5B4B74115BCD0D91B62AFA8EDC"
    }
  }
}
```

<!-- MULTICODE_BLOCK_END -->

## 4. Wait for validation

On a live network (including Mainnet, Testnet, or Devnet), you can wait 4-7 seconds for the ledger to close automatically.

If you're running `rippled` in stand-alone mode, use the [ledger_accept method][] to manually close the ledger. <!--#{ fix md highlighting_ #}-->

## 5. Confirm final result

Use the [tx method][] with the CheckCash transaction's identifying hash to check its status. Look for a `"TransactionResult": "tesSUCCESS"` field in the transaction's metadata, indicating that the transaction succeeded, and the field `"validated": true` in the result, indicating that this result is final.

If the check was cashed for an exact `Amount` and succeeded, you can assume that the recipient was credited for exactly that amount (with possible rounding for very large or very small amounts of tokens).

If cashing the Check failed, the Check remains in the ledger so you can try cashing again later. You may want to [cash the Check for a flexible amount](cash-a-check-for-a-flexible-amount.html) instead.

### Example Request

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```bash
rippled tx 0521707D510858BC8AF69D2227E1D1ADA7DB7C5B4B74115BCD0D91B62AFA8EDC
```

<!-- MULTICODE_BLOCK_END -->


### Example Response

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```json
Loading: "/etc/opt/ripple/rippled.cfg"
2018-Jan-24 01:18:39 HTTPClient:NFO Connecting to 127.0.0.1:5005

{
   "result" : {
      "Account" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
      "Amount" : "100000000",
      "CheckID" : "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334",
      "Fee" : "12",
      "Flags" : 2147483648,
      "Sequence" : 1,
      "SigningPubKey" : "02F135B14C552968B0ABE8493CC4C5795A7484D73F6BFD01379F73456F725F66ED",
      "TransactionType" : "CheckCash",
      "TxnSignature" : "3045022100C64278AC90B841CD3EA9889A4847CAB3AC9927057A34130810FAA7FAC0C6E3290220347260A4C0A6DC9B699DA12510795B2B3414E1FA222AF743226345FBAAEF937C",
      "date" : 570071920,
      "hash" : "0521707D510858BC8AF69D2227E1D1ADA7DB7C5B4B74115BCD0D91B62AFA8EDC",
      "inLedger" : 9,
      "ledger_index" : 9,
      "meta" : {
         "AffectedNodes" : [
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "Owner" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "RootIndex" : "032D861D151E38E86F46805ED1896D1A50144F65459717B6D12470A9E6E3B66E"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "032D861D151E38E86F46805ED1896D1A50144F65459717B6D12470A9E6E3B66E"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Account" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "Balance" : "1000099999988",
                     "Flags" : 0,
                     "OwnerCount" : 0,
                     "Sequence" : 2
                  },
                  "LedgerEntryType" : "AccountRoot",
                  "LedgerIndex" : "38E1EF3284A45B090D549EFFB014ACF68927FE0884CDAF01CE3629DF90542D66",
                  "PreviousFields" : {
                     "Balance" : "1000000000000",
                     "Sequence" : 1
                  },
                  "PreviousTxnID" : "3E14D859F6B4BE923323EFC94571606455921E65173147A89BC6EDDA4374B294",
                  "PreviousTxnLgrSeq" : 5
               }
            },
            {
               "DeletedNode" : {
                  "FinalFields" : {
                     "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "Destination" : "rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy",
                     "DestinationNode" : "0000000000000000",
                     "DestinationTag" : 1,
                     "Expiration" : 570113521,
                     "Flags" : 0,
                     "InvoiceID" : "6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B",
                     "OwnerNode" : "0000000000000000",
                     "PreviousTxnID" : "0FD9F719CDE29E6F6DF752B93EB9AC6FBB493BF989F2CB63B8C0E73A8DCDF61A",
                     "PreviousTxnLgrSeq" : 8,
                     "SendMax" : "100000000",
                     "Sequence" : 4
                  },
                  "LedgerEntryType" : "Check",
                  "LedgerIndex" : "838766BA2B995C00744175F69A1B11E32C3DBC40E64801A4056FCBD657F57334"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "Owner" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "RootIndex" : "AD136EC2A266027D8F202C97D294BBE32F6FC2AD5501D9853F785FE77AB94C94"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "AD136EC2A266027D8F202C97D294BBE32F6FC2AD5501D9853F785FE77AB94C94"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Account" : "rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo",
                     "Balance" : "4999899999952",
                     "Flags" : 0,
                     "OwnerCount" : 1,
                     "Sequence" : 5
                  },
                  "LedgerEntryType" : "AccountRoot",
                  "LedgerIndex" : "D3A1DBAA28717975A9119EC4CBC891BA9A66236C484F03C9911F463AD3B66DE0",
                  "PreviousFields" : {
                     "Balance" : "4999999999952",
                     "OwnerCount" : 2
                  },
                  "PreviousTxnID" : "0FD9F719CDE29E6F6DF752B93EB9AC6FBB493BF989F2CB63B8C0E73A8DCDF61A",
                  "PreviousTxnLgrSeq" : 8
               }
            }
         ],
         "TransactionIndex" : 0,
         "TransactionResult" : "tesSUCCESS"
      },
      "status" : "success",
      "validated" : true
   }
}
```

<!-- MULTICODE_BLOCK_END -->

<!---->





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
