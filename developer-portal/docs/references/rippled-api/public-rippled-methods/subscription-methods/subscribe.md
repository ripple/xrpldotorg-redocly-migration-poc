# subscribe
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Subscribe.cpp "Source")

The `subscribe` method requests periodic notifications from the server when certain events happen.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*Subscribe to accounts*

```json
{
  "id": "Example watch Bitstamp's hot wallet",
  "command": "subscribe",
  "accounts": ["rrpNnNLKrartuEqfJGpqyDwPj1AFPg9vn1"]
}
```

*Subscribe to order book*

```json
{
    "id": "Example subscribe to XRP/GateHub USD order book",
    "command": "subscribe",
    "books": [
        {
            "taker_pays": {
                "currency": "XRP"
            },
            "taker_gets": {
                "currency": "USD",
                "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq"
            },
            "snapshot": true
        }
    ]
}
```

*Subscribe to ledger stream*

```json
{
  "id": "Example watch for new validated ledgers",
  "command": "subscribe",
  "streams": ["ledger"]
}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#subscribe)

The request includes the following parameters:

| `Field`             | Type   | Description                                   |
|:--------------------|:-------|:----------------------------------------------|
| `streams`           | Array  | _(Optional)_ Array of string names of generic streams to subscribe to, as explained below |
| `accounts`          | Array  | _(Optional)_ Array with the unique addresses of accounts to monitor for validated transactions. The addresses must be in the XRP Ledger's [base58][] format. The server sends a notification for any transaction that affects at least one of these accounts. |
| `accounts_proposed` | Array  | _(Optional)_ Like `accounts`, but include transactions that are not yet finalized. |
| `books`             | Array  | _(Optional)_ Array of objects defining [order books](http://www.investopedia.com/terms/o/order-book.asp) to monitor for updates, as detailed below. |
| `url`               | String | (Optional for Websocket; Required otherwise) URL where the server sends a JSON-RPC callbacks for each event. *Admin-only.* |
| `url_username`      | String | _(Optional)_ Username to provide for basic authentication at the callback URL. |
| `url_password`      | String | _(Optional)_ Password to provide for basic authentication at the callback URL. |

The following parameters are deprecated and may be removed without further notice: `user`, `password`, `rt_accounts`.

The `streams` parameter provides access to the following default streams of information:

- `consensus` - Sends a message whenever the server changes phase in the consensus cycle (open, establish, accepted, and so forth)
- `ledger` - Sends a message whenever the consensus process declares a new validated ledger
- `manifests` - Sends a message whenever the server receives an update to a validator's ephemeral signing key.
- `peer_status` - **(Admin only)** Information about connected peer `rippled` servers, especially with regards to the consensus process.
- `transactions` - Sends a message whenever a transaction is included in a closed ledger
- `transactions_proposed` - Sends a message whenever a transaction is included in a closed ledger, as well as some transactions that have not yet been included in a validated ledger and may never be. Not all proposed transactions appear before validation.
    **Note:** [Even some transactions that don't succeed are included](transaction-results.html) in validated ledgers, because they take the anti-spam transaction fee.
- `server` - Sends a message whenever the status of the `rippled` server (for example, network connectivity) changes
- `validations` - Sends a message whenever the server receives a validation message, regardless of if the server trusts the validator. (An individual `rippled` declares a ledger validated when the server receives validation messages from at least a quorum of trusted validators.)

**Note:** The following streams are not available from servers in [Reporting Mode][]: `server`, `peer_status`, `consensus`. Reporting Mode servers return the error `reportingUnsupported` if you request one of these streams. [Updated in: rippled 1.8.1][]

Each member of the `books` array, if provided, is an object with the following fields:

| `Field`      | Type    | Description                                         |
|:-------------|:--------|:----------------------------------------------------|
| `taker_gets` | Object  | Specification of which currency the account taking the Offer would receive, as a [currency object with no amount](currency-formats.html#specifying-without-amounts). |
| `taker_pays` | Object  | Specification of which currency the account taking the Offer would pay, as a [currency object with no amount](currency-formats.html#specifying-without-amounts). |
| `taker`      | String  | Unique [account address](accounts.html) to use as a perspective for viewing offers, in the XRP Ledger's [base58][] format. (This affects the funding status and fees of [Offers](offers.html).) |
| `snapshot`   | Boolean | _(Optional)_ If `true`, return the current state of the order book once when you subscribe before sending updates. The default is `false`. |
| `both`       | Boolean | _(Optional)_ If `true`, return both sides of the order book. The default is `false`. |

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "Example watch Bitstamp's hot wallet",
  "status": "success",
  "type": "response",
  "result": {}
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][]. The fields contained in the response vary depending on what subscriptions were included in the request.

* `accounts` and `accounts_proposed` - No fields returned.
* *Stream: `server`* - Information about the server status, such as `load_base` (the current load level of the server), `random` (a randomly-generated value), and others, subject to change.
* *Stream: `transactions`*, *Stream: `transactions_proposed`*, *Stream: `validations`*, and *Stream: `consensus`* - No fields returned.
* *Stream: `ledger`* - Information about the ledgers on hand and current fee schedule. This includes the same fields as a [ledger stream message](#ledger-stream), except that it omits the `type` and `txn_count` fields.
* `books` - No fields returned by default. If `"snapshot": true` is set in the request, returns `offers` (an array of offer definition objects defining the order book).

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `noPermission` - The request included the `url` field, but you are not connected as an admin.
* `unknownStream` - One or more the members of the `streams` field of the request is not a valid stream name.
* `malformedStream` - The `streams` field of the request is not formatted properly.
* `malformedAccount` - One of the addresses in the `accounts` or `accounts_proposed` fields of the request is not a properly-formatted XRP Ledger address. (**Note:**: You _can_ subscribe to the stream of an address that does not yet have an entry in the global ledger to get a message when that address becomes funded.)
* `srcCurMalformed` - One or more `taker_pays` sub-fields of the `books` field in the request is not formatted properly.
* `dstAmtMalformed` - One or more `taker_gets` sub-fields of the `books` field in the request is not formatted properly.
* `srcIsrMalformed` - The `issuer` field of one or more `taker_pays` sub-fields of the `books` field in the request is not valid.
* `dstIsrMalformed` - The `issuer` field of one or more `taker_gets` sub-fields of the `books` field in the request is not valid.
* `badMarket` - One or more desired order books in the `books` field does not exist; for example, offers to exchange a currency for itself.

When you subscribe to a particular stream, you receive periodic responses on that stream until you unsubscribe or close the WebSocket connection. The content of those responses depends on what you subscribed to. Here are some examples:

## Ledger Stream

The `ledger` stream only sends `ledgerClosed` messages when [the consensus process](consensus.html) declares a new validated ledger. The message identifies the ledger and provides some information about its contents.

```json
{
  "type": "ledgerClosed",
  "fee_base": 10,
  "fee_ref": 10,
  "ledger_hash": "687F604EF6B2F67319E8DCC8C66EF49D84D18A1E18F948421FC24D2C7C3DB464",
  "ledger_index": 7125358,
  "ledger_time": 455751310,
  "reserve_base": 20000000,
  "reserve_inc": 5000000,
  "txn_count": 7,
  "validated_ledgers": "32570-7125358"
}
```

The fields from a ledger stream message are as follows:

| `Field`             | Type                      | Description                |
|:--------------------|:--------------------------|:---------------------------|
| `type`              | String                    | `ledgerClosed` indicates this is from the ledger stream |
| `fee_base`          | Number                    | The [reference transaction cost](transaction-cost.html#reference-transaction-cost) as of this ledger version, in [drops of XRP][]. If this ledger version includes a [SetFee pseudo-transaction](setfee.html) the new transaction cost applies starting with the following ledger version. |
| `fee_ref`           | Number                    | The [reference transaction cost](transaction-cost.html#reference-transaction-cost) in "fee units". |
| `ledger_hash`       | String - [Hash][]         | The identifying hash of the ledger version that was closed. |
| `ledger_index`      | Number - [Ledger Index][] | The ledger index of the ledger that was closed. |
| `ledger_time`       | Number                    | The time this ledger was closed, in [seconds since the Ripple Epoch][] |
| `reserve_base`      | Number                    | The minimum [reserve](reserves.html), in [drops of XRP][], that is required for an account. If this ledger version includes a [SetFee pseudo-transaction](setfee.html) the new base reserve applies starting with the following ledger version. |
| `reserve_inc`       | Number                    | The [owner reserve](reserves.html#owner-reserves) for each object an account owns in the ledger, in [drops of XRP][]. If the ledger includes a [SetFee pseudo-transaction](setfee.html) the new owner reserve applies after this ledger. |
| `txn_count`         | Number                    | Number of new transactions included in this ledger version. |
| `validated_ledgers` | String                    | _(May be omitted)_ Range of ledgers that the server has available. This may be a disjoint sequence such as `24900901-24900984,24901116-24901158`. This field is not returned if the server is not connected to the network, or if it is connected but has not yet obtained a ledger from the network. |


## Validations Stream

[New in: rippled 0.29.0][]

The validations stream sends messages whenever it receives validation messages, also called validation votes, regardless of whether or not the validation message is from a trusted validator. The message looks like the following:

```json
{
    "type": "validationReceived",
    "amendments":[
        "42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE",
        "4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373",
        "6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC",
        "C1B8D934087225F509BEB5A8EC24447854713EE447D277F69545ABFA0E0FD490",
        "DA1BD556B42D85EA9C84066D028D355B52416734D3283F85E216EA5DA6DB7E13"
    ],
    "base_fee":10,
    "flags":2147483649,
    "full":true,
    "ledger_hash":"EC02890710AAA2B71221B0D560CFB22D64317C07B7406B02959AD84BAD33E602",
    "ledger_index":"6",
    "load_fee":256000,
    "master_key": "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
    "reserve_base":20000000,
    "reserve_inc":5000000,
    "signature":"3045022100E199B55643F66BC6B37DBC5E185321CF952FD35D13D9E8001EB2564FFB94A07602201746C9A4F7A93647131A2DEB03B76F05E426EC67A5A27D77F4FF2603B9A528E6",
    "signing_time":515115322,
    "validation_public_key":"n94Gnc6svmaPPRHUAyyib1gQUov8sYbjLoEwUBYPH39qHZXuo8ZT"
}
```

The fields from a validations stream message are as follows:

| `Field`                 | Type             | Description                     |
|:------------------------|:-----------------|:--------------------------------|
| `type`                  | String           | The value `validationReceived` indicates this is from the validations stream. |
| `amendments`            | Array of Strings | _(May be omitted)_ The [amendments](amendments.html) this server wants to be added to the protocol. [New in: rippled 0.32.0][] |
| `base_fee`              | Integer          | _(May be omitted)_ The unscaled transaction cost (`reference_fee` value) this server wants to set by [Fee Voting](fee-voting.html). [New in: rippled 0.32.0][] |
| `cookie`                | String - Number  | _(May be omitted)_ An arbitrary value chosen by the server at startup. If the same validation key pair signs validations with different cookies concurrently, that usually indicates that multiple servers are incorrectly configured to use the same validation key pair. [New in: rippled 1.8.1][] |
| `flags`                 | Number           | Bit-mask of flags added to this validation message. The flag `0x80000000` indicates that the validation signature is fully-canonical. The flag `0x00000001` indicates that this is a full validation; otherwise it's a partial validation. Partial validations are not meant to vote for any particular ledger. A partial validation indicates that the validator is still online but not keeping up with consensus. [New in: rippled 0.32.0][] |
| `full`                  | Boolean          | If `true`, this is a full validation. Otherwise, this is a partial validation. Partial validations are not meant to vote for any particular ledger. A partial validation indicates that the validator is still online but not keeping up with consensus. [New in: rippled 0.32.0][] |
| `ledger_hash`           | String           | The identifying hash of the proposed ledger is being validated. |
| `ledger_index`          | String - Number  | The [Ledger Index][] of the proposed ledger. [New in: rippled 0.31.0][] |
| `load_fee`              | Integer          | _(May be omitted)_ The local load-scaled transaction cost this validator is currently enforcing, in fee units. [New in: rippled 0.32.0][] |
| `master_key`            | String           | _(May be omitted)_ The validator's master public key, if the validator is using a validator token, in the XRP Ledger's [base58][] format. (See also: [Enable Validation on your `rippled` Server](run-rippled-as-a-validator.html#3-enable-validation-on-your-rippled-server).) [New in: rippled 1.4.0][] |
| `reserve_base`          | Integer          | _(May be omitted)_ The minimum reserve requirement (`account_reserve` value) this validator wants to set by [Fee Voting](fee-voting.html). [New in: rippled 0.32.0][] |
| `reserve_inc`           | Integer          | _(May be omitted)_ The increment in the reserve requirement (`owner_reserve` value) this validator wants to set by [Fee Voting](fee-voting.html). [New in: rippled 0.32.0][] |
| `server_version`        | String - Number  | _(May be omitted)_ An 64-bit integer that encodes the version number of the validating server. For example, `"1745990410175512576"`. Only provided once every 256 ledgers. [New in: rippled 1.8.1][] |
| `signature`             | String           | The signature that the validator used to sign its vote for this ledger. |
| `signing_time`          | Number           | When this validation vote was signed, in [seconds since the Ripple Epoch][]. [New in: rippled 0.32.0][] |
| `validated_hash`        | String           | The unique hash of the proposed ledger this validation applies to. [New in: rippled 1.8.1][] |
| `validation_public_key` | String           | The public key from the key-pair that the validator used to sign the message, in the XRP Ledger's [base58][] format. This identifies the validator sending the message and can also be used to verify the `signature`. If the validator is using a token, this is an ephemeral public key. |


## Transaction Streams

Many subscriptions result in messages about transactions, including the following:

* The `transactions` stream
* The `transactions_proposed` stream
* `accounts` subscriptions
* `accounts_proposed` subscriptions
* `book` (Order Book) subscriptions

The `transactions_proposed` stream, strictly speaking, is a superset of the `transactions` stream: it includes all validated transactions, as well as some suggested transactions that have not yet been included in a validated ledger and may never be. You can identify these "in-flight" transactions by their fields:

* The `validated` field is missing or has a value of `false`.
* There is no `meta` or `metadata` field.
* Instead of `ledger_hash` and `ledger_index` fields specifying in which ledger version the transactions were finalized, there is a `ledger_current_index` field specifying in which ledger version they are currently proposed.

Otherwise, the messages from the `transactions_proposed` stream are the same as ones from the `transactions` stream.

Since the only thing that can modify an account or an order book is a transaction, the messages that are sent as a result of subscribing to particular `accounts` or `books` also take the form of transaction messages, the same as the ones in the `transactions` stream. The only difference is that you only receive messages for transactions that affect the accounts or order books you're watching.

The `accounts_proposed` subscription works the same way, except it also includes unconfirmed transactions, like the `transactions_proposed` stream, for the accounts you're watching.

```json
{
  "status": "closed",
  "type": "transaction",
  "engine_result": "tesSUCCESS",
  "engine_result_code": 0,
  "engine_result_message": "The transaction was applied.",
  "ledger_hash": "989AFBFD65D820C6BD85301B740F5D592F060668A90EEF5EC1815EBA27D58FE8",
  "ledger_index": 7125442,
  "meta": {
    "AffectedNodes": [
      {
        "ModifiedNode": {
          "FinalFields": {
            "Flags": 0,
            "IndexPrevious": "0000000000000000",
            "Owner": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
            "RootIndex": "ABD8CE2D1205D0C062876E9E1F3CBDC902ED8EF4E8D3D071B962C7ED0E113E68"
          },
          "LedgerEntryType": "DirectoryNode",
          "LedgerIndex": "0BBDEE7D0BE120F7BF27640B5245EBFE0C5FD5281988BA823C44477A70262A4D"
        }
      },
      {
        "DeletedNode": {
          "FinalFields": {
            "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
            "BookDirectory": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE",
            "BookNode": "0000000000000000",
            "Flags": 0,
            "OwnerNode": "000000000000006E",
            "PreviousTxnID": "58A17D95770F8D07E08B81A85896F4032A328B6C2BDCDEC0A00F3EF3914DCF0A",
            "PreviousTxnLgrSeq": 7125330,
            "Sequence": 540691,
            "TakerGets": "4401967683",
            "TakerPays": {
              "currency": "BTC",
              "issuer": "rNPRNzBB92BVpAhhZr4iXDTveCgV5Pofm9",
              "value": "0.04424"
            }
          },
          "LedgerEntryType": "Offer",
          "LedgerIndex": "386B7803A9210747941B0D079BB408F31ACB1CB98832184D0287A1CBF4FE6D00"
        }
      },
      {
        "DeletedNode": {
          "FinalFields": {
            "ExchangeRate": "4A03920BFC5E99BE",
            "Flags": 0,
            "RootIndex": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE",
            "TakerGetsCurrency": "0000000000000000000000000000000000000000",
            "TakerGetsIssuer": "0000000000000000000000000000000000000000",
            "TakerPaysCurrency": "0000000000000000000000004254430000000000",
            "TakerPaysIssuer": "92D705968936C419CE614BF264B5EEB1CEA47FF4"
          },
          "LedgerEntryType": "DirectoryNode",
          "LedgerIndex": "892E892DC63D8F70DCF5C9ECF29394FF7DD3DC6F47DB8EB34A03920BFC5E99BE"
        }
      },
      {
        "ModifiedNode": {
          "FinalFields": {
            "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
            "Balance": "11133297300",
            "Flags": 0,
            "OwnerCount": 9,
            "Sequence": 540706
          },
          "LedgerEntryType": "AccountRoot",
          "LedgerIndex": "A6C2532E1008A513B3F822A92B8E5214BD0D413DC20AD3631C1A39AD6B36CD07",
          "PreviousFields": {
            "Balance": "11133297310",
            "OwnerCount": 10,
            "Sequence": 540705
          },
          "PreviousTxnID": "484D57DFC4E446DA83B4540305F0CE836D4E007361542EC12CC0FFB5F0A1BE3A",
          "PreviousTxnLgrSeq": 7125358
        }
      }
    ],
    "TransactionIndex": 1,
    "TransactionResult": "tesSUCCESS"
  },
  "transaction": {
    "Account": "rRh634Y6QtoqkwTTrGzX66UYoCAvgE6jL",
    "Fee": "10",
    "Flags": 2147483648,
    "OfferSequence": 540691,
    "Sequence": 540705,
    "SigningPubKey": "030BB49C591C9CD65C945D4B78332F27633D7771E6CF4D4B942D26BA40748BB8B4",
    "TransactionType": "OfferCancel",
    "TxnSignature": "30450221008223604A383F3AED25D53CE7C874700619893A6EEE4336508312217850A9722302205E0614366E174F2DFF78B879F310DB0B3F6DA1967E52A32F65E25DCEC622CD68",
    "date": 455751680,
    "hash": "94CF924C774DFDBE474A2A7E40AEA70E7E15D130C8CBEF8AF1D2BE97A8269F14"
  },
  "validated": true
}
```

Transaction stream messages have the following fields:

| `Field`                 | Type                      | Description            |
|:------------------------|:--------------------------|:-----------------------|
| `type`                  | String                    | `transaction` indicates this is the notification of a transaction, which could come from several possible streams. |
| `engine_result`         | String                    | String [Transaction result code](transaction-results.html) |
| `engine_result_code`    | Number                    | Numeric [transaction response code](transaction-results.html), if applicable. |
| `engine_result_message` | String                    | Human-readable explanation for the transaction response |
| `ledger_current_index`  | Number - [Ledger Index][] | _(Unvalidated transactions only)_ The ledger index of the current in-progress [ledger version](ledgers.html) for which this transaction is currently proposed. |
| `ledger_hash`           | String - [Hash][]         | _(Validated transactions only)_ The identifying hash of the ledger version that includes this transaction |
| `ledger_index`          | Number - [Ledger Index][] | _(Validated transactions only)_ The ledger index of the ledger version that includes this transaction. |
| `meta`                  | Object                    | _(Validated transactions only)_ The [transaction metadata](transaction-metadata.html), which shows the exact outcome of the transaction in detail. |
| `transaction`           | Object                    | The [definition of the transaction](transaction-formats.html) in JSON format |
| `validated`             | Boolean                   | If `true`, this transaction is included in a validated ledger and its outcome is final. Responses from the `transaction` stream should always be validated. |


## Peer Status Stream

The admin-only `peer_status` stream reports a large amount of information on the activities of other `rippled` servers to which this server is connected, in particular their status in the consensus process.

Example of a Peer Status stream message:

```json
{
    "action": "CLOSING_LEDGER",
    "date": 508546525,
    "ledger_hash": "4D4CD9CD543F0C1EF023CC457F5BEFEA59EEF73E4552542D40E7C4FA08D3C320",
    "ledger_index": 18853106,
    "ledger_index_max": 18853106,
    "ledger_index_min": 18852082,
    "type": "peerStatusChange"
}
```

Peer Status stream messages represent some event where the status of the peer `rippled` server changed. These messages are JSON objects with the following fields:

| `Field`            | Value  | Description                                    |
|:-------------------|:-------|:-----------------------------------------------|
| `type`             | String | `peerStatusChange` indicates this comes from the Peer Status stream. |
| `action`           | String | The type of event that prompted this message. See [Peer Status Events](#peer-status-events) for possible values. |
| `date`             | Number | The time this event occurred, in [seconds since the Ripple Epoch][]. |
| `ledger_hash`      | String | (May be omitted) The identifying [Hash][] of a ledger version to which this message pertains. |
| `ledger_index`     | Number | (May be omitted) The [Ledger Index][] of a ledger version to which this message pertains. |
| `ledger_index_max` | Number | (May be omitted) The largest [Ledger Index][] the peer has currently available. |
| `ledger_index_min` | Number | (May be omitted) The smallest [Ledger Index][] the peer has currently available. |

### Peer Status Events

The `action` field of a Peer Status stream message can have the following values:

| `Value`           | Meaning                                                  |
|:------------------|:---------------------------------------------------------|
| `CLOSING_LEDGER`  | The peer closed a ledger version with this [Ledger Index][], which usually means it is about to start consensus. |
| `ACCEPTED_LEDGER` | The peer built this ledger version as the result of a consensus round. **Note:** This ledger is still not certain to become immutably validated. |
| `SWITCHED_LEDGER` | The peer concluded it was not following the rest of the network and switched to a different ledger version. |
| `LOST_SYNC`       | The peer fell behind the rest of the network in tracking which ledger versions are validated and which are undergoing consensus. |


## Order Book Streams

When you subscribe to one or more order books with the `books` field, you get back any transactions that affect those order books.

Example order book stream message:

```json
{
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "ledger_hash": "08547DD866F099CCB3666F113116B7AA2DF520FA2E3011DD1FF9C9C04A6C7C3E",
    "ledger_index": 18852105,
    "meta": {
        "AffectedNodes": [{
            "ModifiedNode": {
                "FinalFields": {
                    "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                    "AccountTxnID": "D295E2BE50E3B78AED24790D7B9096996DAF43F095BF17DB83EEACC283D14050",
                    "Balance": "3070332374272",
                    "Flags": 0,
                    "OwnerCount": 23,
                    "RegularKey": "r9S56zu6QeJD5d8A7QMfLAeYavgB9dhaX4",
                    "Sequence": 12142921
                },
                "LedgerEntryType": "AccountRoot",
                "LedgerIndex": "2880A9B4FB90A306B576C2D532BFE390AB3904642647DCF739492AA244EF46D1",
                "PreviousFields": {
                    "AccountTxnID": "3CA3422B0E42D76A7A677B0BA0BE72DFCD93676E0C80F8D2EB27C04BD8457A0F",
                    "Balance": "3070332385272",
                    "Sequence": 12142920
                },
                "PreviousTxnID": "3CA3422B0E42D76A7A677B0BA0BE72DFCD93676E0C80F8D2EB27C04BD8457A0F",
                "PreviousTxnLgrSeq": 18852102
            }
        }, {
            "ModifiedNode": {
                "FinalFields": {
                    "Flags": 0,
                    "IndexPrevious": "00000000000022D2",
                    "Owner": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                    "RootIndex": "F435FBBEC9654204D7151A01E686BAA8CB325A472D7B61C7916EA58B59355767"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "29A543B6681AD7FC8AFBD1386DAE7385F02F9B8C4756A467DF6834AB54BBC9DB"
            }
        }, {
            "ModifiedNode": {
                "FinalFields": {
                    "ExchangeRate": "4C1BA999A513EF78",
                    "Flags": 0,
                    "RootIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78",
                    "TakerGetsCurrency": "0000000000000000000000000000000000000000",
                    "TakerGetsIssuer": "0000000000000000000000000000000000000000",
                    "TakerPaysCurrency": "0000000000000000000000005553440000000000",
                    "TakerPaysIssuer": "2ADB0B3959D60A6E6991F729E1918B7163925230"
                },
                "LedgerEntryType": "DirectoryNode",
                "LedgerIndex": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78"
            }
        }, {
            "CreatedNode": {
                "LedgerEntryType": "Offer",
                "LedgerIndex": "92E235EE80D2B28A89BEE2C905D4545C2A004FD5D4097679C8A3FB25507FD9EB",
                "NewFields": {
                    "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                    "BookDirectory": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78",
                    "Expiration": 508543674,
                    "OwnerNode": "00000000000022F4",
                    "Sequence": 12142920,
                    "TakerGets": "6537121438",
                    "TakerPays": {
                        "currency": "USD",
                        "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
                        "value": "50.9"
                    }
                }
            }
        }, {
            "DeletedNode": {
                "FinalFields": {
                    "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
                    "BookDirectory": "79C54A4EBD69AB2EADCE313042F36092BE432423CC6A4F784C1BA999A513EF78",
                    "BookNode": "0000000000000000",
                    "Expiration": 508543133,
                    "Flags": 0,
                    "OwnerNode": "00000000000022F4",
                    "PreviousTxnID": "58B3279C2D56AAC3D9B06106E637C01E3D911E9D31E2FE4EA0D886AC9F4DEE1E",
                    "PreviousTxnLgrSeq": 18851945,
                    "Sequence": 12142889,
                    "TakerGets": "6537121438",
                    "TakerPays": {
                        "currency": "USD",
                        "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
                        "value": "50.9"
                    }
                },
                "LedgerEntryType": "Offer",
                "LedgerIndex": "D3436CE21925E1CB12C5C444963B47D7EA0CD9A0E387926DC76B23FE5CD1C15F"
            }
        }],
        "TransactionIndex": 26,
        "TransactionResult": "tesSUCCESS"
    },
    "status": "closed",
    "transaction": {
        "Account": "rfCFLzNJYvvnoGHWQYACmJpTgkLUaugLEw",
        "Expiration": 508543674,
        "Fee": "11000",
        "Flags": 2147483648,
        "LastLedgerSequence": 18852106,
        "OfferSequence": 12142889,
        "Sequence": 12142920,
        "SigningPubKey": "034841BF24BD72C7CC371EBD87CCBF258D8ADB05C18DE207130364A97D8A3EA524",
        "TakerGets": "6537121438",
        "TakerPays": {
            "currency": "USD",
            "issuer": "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
            "value": "50.9"
        },
        "TransactionType": "OfferCreate",
        "TxnSignature": "3045022100B9AD678A773FB61F8F9B565713C80CBF187A2F9EB8E9CE0DAC7B839CA6F4B04C02200613D173A0636CD9BE13F2E3EBD13A16932B5B7D8A96BB5F6D561CA5CDBC4AD3",
        "date": 508543090,
        "hash": "D295E2BE50E3B78AED24790D7B9096996DAF43F095BF17DB83EEACC283D14050",
        "owner_funds": "3070197374272"
    },
    "type": "transaction",
    "validated": true
}
```

The format of an order book stream message is the same as that of [transaction stream messages](#transaction-streams), except that `OfferCreate` transactions also contain the following field:

| `Field`                   | Value  | Description                             |
|:--------------------------|:-------|:----------------------------------------|
| `transaction.owner_funds` | String | Numeric amount of the `TakerGets` currency that the `Account` sending this OfferCreate transaction has after executing this transaction. This does not check whether the currency amount is [frozen](freezes.html). |


## Consensus Stream

[New in: rippled 1.4.0][]

The `consensus` stream sends `consensusPhase` messages when [the consensus process](consensus.html) changes phase. The message contains the new phase of consensus the server is in.

```json
{
  "type": "consensusPhase",
  "consensus": "accepted"
}
```

The fields from a consensus stream message are as follows:

| `Field`             | Type                      | Description                |
|:--------------------|:--------------------------|:---------------------------|
| `type`              | String                    | `consensusPhase` indicates this is from the consensus stream |
| `consensus`         | String                    | The new consensus phase the server is in. Possible values are open, establish, and accepted. |


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
