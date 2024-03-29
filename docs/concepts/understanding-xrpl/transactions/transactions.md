# Transactions

_Transactions_ allow accounts to modify the XRP Ledger.

Transactions can do more than transfer currency. In addition to supporting various payment types, transactions in the XRP Ledger can rotate cryptographic keys, manage other settings, and trade in the XRP Ledger's decentralized exchange.

## Transaction Structure

### Example Unsigned Transaction

Here is an example of an unsigned `Payment` transaction in JSON:

```json
{
  "TransactionType" : "Payment",
  "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "Amount" : {
     "currency" : "USD",
     "value" : "1",
     "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  },
  "Fee": "12",
  "Flags": 2147483648,
  "Sequence": 2,
}
```

| Field Name      | Description |
|-----------------|-------------|
| TransactionType |             |
| Account         |             |
| Destination     |             |
| Amount          |             |
| currency        |             |
| value           |             |
| issuer          |             |
| Fee             |             |
| Flags           |             |
| Sequence        |             |

### Signing and Submitting Transactions

Sending a transaction to the XRP Ledger involves several steps:

1. Create an [unsigned transaction in JSON format](#example-unsigned-transaction).
2. Use one or more signatures to [authorize the transaction](#authorizing-transactions).
3. Submit a transaction to an XRP Ledger server (usually a [`rippled` instance](../server/server-modes.md)). If the transaction is properly formed, the server provisionally applies the transaction to its current version of the ledger and relays the transaction to other members of the peer-to-peer network.
4. The [consensus process](../xrpl/consensus.md) determines which provisional transactions get included in the next validated ledger.
5. The servers apply those transactions to the previous ledger in a canonical order and share their results.
6. If enough [trusted validators](../server/server-modes.md#validators) created the exact same ledger, that ledger is declared _validated_ and the <!-- * --> results of the transactions in that ledger are immutable.

<!-- * [results of the transactions](transaction-results.html) -->

### Example Executed Transaction Response with Metadata

After a transaction has been executed, the XRP Ledger adds <!-- * --> metadata to show the transaction's final outcome and all the changes that the transaction made to the shared state of the XRP Ledger.

<!-- * [metadata](transaction-metadata.html) -->

You can check a transaction's status using the API, for example using the `tx` command.

The results of a transaction, including all its metadata, are not final until the transaction appears in a **validated** ledger.

Example response from the `tx` command:

```json
{
  "id": 6,
  "status": "success",
  "type": "response",
  "result": {
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Amount": {
      "currency": "USD",
      "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "value": "1"
    },
    "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "10",
    "Flags": 2147483648,
    "Sequence": 2,
    "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
    "TransactionType": "Payment",
    "TxnSignature": "3045022100D64A32A506B86E880480CCB846EFA3F9665C9B11FDCA35D7124F53C486CC1D0402206EC8663308D91C928D1FDA498C3A2F8DD105211B9D90F4ECFD75172BAE733340",
    "date": 455224610,
    "hash": "33EA42FC7A06F062A7B843AF4DC7C0AB00D6644DFDF4C5D354A87C035813D321",
    "inLedger": 7013674,
    "ledger_index": 7013674,
    "meta": {
      "AffectedNodes": [
        {
          "ModifiedNode": {
            "FinalFields": {
              "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
              "Balance": "99999980",
              "Flags": 0,
              "OwnerCount": 0,
              "Sequence": 3
            },
            "LedgerEntryType": "AccountRoot",
            "LedgerIndex": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
            "PreviousFields": {
              "Balance": "99999990",
              "Sequence": 2
            },
            "PreviousTxnID": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E",
            "PreviousTxnLgrSeq": 6979192
          }
        },
        {
          "ModifiedNode": {
            "FinalFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "2"
              },
              "Flags": 65536,
              "HighLimit": {
                "currency": "USD",
                "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value": "0"
              },
              "HighNode": "0000000000000000",
              "LowLimit": {
                "currency": "USD",
                "issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                "value": "100"
              },
              "LowNode": "0000000000000000"
            },
            "LedgerEntryType": "RippleState",
            "LedgerIndex": "96D2F43BA7AE7193EC59E5E7DDB26A9D786AB1F7C580E030E7D2FF5233DA01E9",
            "PreviousFields": {
              "Balance": {
                "currency": "USD",
                "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
                "value": "1"
              }
            },
            "PreviousTxnID": "7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E",
            "PreviousTxnLgrSeq": 6979192
          }
        }
      ],
      "TransactionIndex": 0,
      "TransactionResult": "tesSUCCESS"
    },
    "validated": true
  }
}
```

## Identifying Transactions

Every signed transaction has a unique `"hash"` that identifies it. The server provides the hash in the response when you submit the transaction; you can also look up a transaction in an account's transaction history with the `account_tx` command.

The transaction hash can be used as a "proof of payment" since anyone can <!-- * --> look up the transaction by its hash to verify its final status.

<!-- *  [look up the transaction by its hash](look-up-transaction-results.html) -->

<!--
{% include '_snippets/setfee_uniqueness_note.md' %}
<!--_ -->


## Claimed Cost Justification

Although it might seem unfair to charge a [transaction cost](transaction-cost.md) for a failed transaction, the `tec` class of errors exists for good reasons:

* Transactions submitted after the failed one do not have to have their Sequence values renumbered. Incorporating the failed transaction into a ledger uses up the transaction's sequence number, preserving the expected sequence.
* Distributing the transaction throughout the network increases network load. Enforcing a cost makes it harder for attackers to abuse the network with failed transactions.
* The transaction cost is generally very small in real-world value, so it should not harm users unless they are sending large quantities of transactions.

## Authorizing Transactions

In the decentralized XRP Ledger, a digital signature proves that a transaction is authorized to do a specific set of actions. Only signed transactions can be submitted to the network and included in a validated ledger. A signed transaction is immutable: its contents cannot change, and the signature is not valid for any other transaction.

Transactions are authorized by any of the following signature types:

* A single signature from the master private key that is mathematically associated with the sending address. You can disable or enable the master key pair using an `AccountSet` transaction.
* A single signature that matches the regular private key associated with the address. You can add, remove, or replace a regular key pair using a `SetRegularKey` transaction.
* A [multi-signature](multi-signing.md) that matches a list of signers owned by the address. You can add, remove, or replace a list of signers using a `SignerListSet` transaction.

Any signature type can authorize any type of transaction, with the following exceptions:

* Only the master private key can <!-- * -->disable the master public key.
* Only the master private key can [permanently give up the ability to freeze](../tokens/freezing-tokens.md#no-freeze).
* You can never remove the last method of signing transactions from an address.

<!-- [disable the master public key](accountset.html) -->

For more information about master and regular key pairs, see [Cryptographic Keys](../accounts/cryptographic-keys.md).

<!--{# Add this reference after signatures concept doc is published. For more information about signatures, see [Understanding Signatures](concept-signatures.html). #}-->

<!--

## See Also

- **Concepts:**
    - [Payment Types](payment-types.html)
    - [Consensus Network](consensus-network.html)
- **Tutorials:**
    - [Set Up Secure Signing](set-up-secure-signing.html)
    - [Send XRP](send-xrp.html)
    - [Look Up Transaction Results](look-up-transaction-results.html)
    - [Monitor Incoming Payments with WebSocket](monitor-incoming-payments-with-websocket.html)
    - [Cancel or Skip a Transaction](cancel-or-skip-a-transaction.html)
    - [Reliable Transaction Submission](reliable-transaction-submission.html)
- **References:**
    - [Transaction Common Fields](transaction-common-fields.html)
    - [Transaction Types](transaction-types.html)
    - [Transaction Metadata](transaction-metadata.html)
    - [account_tx method][]
    - [tx method][]
    - [submit method][]
    - [submit_multisigned method][] 
    
-->
    
