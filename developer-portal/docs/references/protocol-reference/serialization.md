# Serialization Format
[[Source]](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/STObject.cpp#L696-L718 "Source")

This page describes the XRP Ledger's canonical binary format for transactions and other data. This binary format is necessary to create and verify digital signatures of those transactions' contents, and is also used in other places including in the [peer-to-peer communications between servers](peer-protocol.html). The [`rippled` APIs](rippled-api.html) typically use JSON to communicate with client applications. However, JSON is unsuitable as a format for serializing transactions for being digitally signed, because JSON can represent the same data in many different but equivalent ways.

The process of serializing a transaction from JSON or any other representation into their canonical binary format can be summarized with these steps:

1. Make sure all required fields are provided, including any required but ["auto-fillable" fields](transaction-common-fields.html#auto-fillable-fields).

    The [Transaction Formats Reference](transaction-formats.html) defines the required and optional fields for XRP Ledger transactions.

    **Note:** The `SigningPubKey` must also be provided at this step. When signing, you can [derive this key](cryptographic-keys.html#key-derivation) from the secret key that is provided for signing.

2. Convert each field's data into its ["internal" binary format](#internal-format).

3. Sort the fields in [canonical order](#canonical-field-order).

4. Prefix each field with a [Field ID](#field-ids).

5. Concatenate the fields (including prefixes) in their sorted order.

The result is a single binary blob that can be signed using well-known signature algorithms such as ECDSA (with the secp256k1 elliptic curve) and Ed25519. For purposes of the XRP Ledger, you must also [hash][Hash] the data with the appropriate prefix (`0x53545800` if single-signing, or `0x534D5400` if multi-signing). After signing, you must re-serialize the transaction with the `TxnSignature` field included. <!---->

**Note:** The XRP Ledger uses the same serialization format to represent other types of data, such as [ledger objects](ledger-object-types.html) and processed transactions. However, only certain fields are appropriate for including in a transaction that gets signed. (For example, the `TxnSignature` field, containing the signature itself, should not be present in the binary blob that you sign.) Thus, some fields are designated as "Signing" fields, which are included in objects when those objects are signed, and "non-signing" fields, which are not.

### Examples

Both signed and unsigned transactions can be represented in both JSON and binary formats. The following samples show the same signed transaction in its JSON and binary formats:

**JSON:**

```json
{
  "Account": "rMBzp8CgpE441cp5PVyA9rpVV7oT8hP3ys",
  "Expiration": 595640108,
  "Fee": "10",
  "Flags": 524288,
  "OfferSequence": 1752791,
  "Sequence": 1752792,
  "SigningPubKey": "03EE83BB432547885C219634A1BC407A9DB0474145D69737D09CCDC63E1DEE7FE3",
  "TakerGets": "15000000000",
  "TakerPays": {
    "currency": "USD",
    "issuer": "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
    "value": "7072.8"
  },
  "TransactionType": "OfferCreate",
  "TxnSignature": "30440220143759437C04F7B61F012563AFE90D8DAFC46E86035E1D965A9CED282C97D4CE02204CFD241E86F17E011298FC1A39B63386C74306A5DE047E213B0F29EFA4571C2C",
  "hash": "73734B611DDA23D3F5F62E20A173B78AB8406AC5015094DA53F53D39B9EDB06C"
}
```

**Binary (represented as hexadecimal):**

```text
120007220008000024001ABED82A2380BF2C2019001ABED764D55920AC9391400000000000000000000000000055534400000000000A20B3C85F482532A9578DBB3950B85CA06594D165400000037E11D60068400000000000000A732103EE83BB432547885C219634A1BC407A9DB0474145D69737D09CCDC63E1DEE7FE3744630440220143759437C04F7B61F012563AFE90D8DAFC46E86035E1D965A9CED282C97D4CE02204CFD241E86F17E011298FC1A39B63386C74306A5DE047E213B0F29EFA4571C2C8114DD76483FACDEE26E60D8A586BB58D09F27045C46
```

## Sample Code

The serialization processes described here are implemented in multiple places and programming languages:

- In C++ [in the `rippled` code base](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/STObject.cpp).
- In JavaScript in the [`ripple-binary-codec`](https://github.com/ripple/ripple-binary-codec/) package.
- In Python 3 in [this repository's code samples section](https://github.com/XRPLF/xrpl-dev-portal/blob/master/content/_code-samples/tx-serialization/serialize.py).

Additionally, many [client libraries](client-libraries.html) provide serialization support under permissive open-source licenses, so you can import, use, or adapt the code for your needs.



## Internal Format

Each field has an "internal" binary format used in the `rippled` source code to represent that field when signing (and in most other cases). The internal formats for all fields are defined in the source code of [`SField.cpp`](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/SField.cpp). (This file also includes fields other than transaction fields.) The [Transaction Format Reference](transaction-formats.html) also lists the internal formats for all transaction fields.

For example, the `Flags` [common transaction field](transaction-common-fields.html) becomes a UInt32 (32-bit unsigned integer).

### Definitions File

The following JSON file defines the important constants you need for serializing XRP Ledger data to its binary format and deserializing it from binary:

**<https://github.com/ripple/ripple-binary-codec/blob/master/src/enums/definitions.json>**

The following table defines the top-level fields from the definitions file:

| Field                 | Contents                                             |
|:----------------------|:-----------------------------------------------------|
| `TYPES`               | Map of data types to their ["type code"](#type-codes) for constructing field IDs and sorting fields in canonical order. Codes below 1 should not appear in actual data; codes above 10000 represent special "high-level" object types such as "Transaction" that cannot be serialized inside other objects. See the [Type List](#type-list) for details of how to serialize each type. |
| `LEDGER_ENTRY_TYPES`  | Map of [ledger objects](ledger-object-types.html) to their data type. These appear in ledger state data, and in the "affected nodes" section of processed transactions' [metadata](transaction-metadata.html). |
| `FIELDS`              | A sorted array of tuples representing all fields that may appear in transactions, ledger objects, or other data. The first member of each tuple is the string name of the field and the second member is an object with that field's properties. (See the "Field properties" table below for definitions of those fields.) |
| `TRANSACTION_RESULTS` | Map of [transaction result codes](transaction-results.html) to their numeric values. Result types not included in ledgers have negative values; `tesSUCCESS` has numeric value 0; [`tec`-class codes](tec-codes.html) represent failures that are included in ledgers. |
| `TRANSACTION_TYPES`   | Map of all [transaction types](transaction-types.html) to their numeric values. |

For purposes of serializing transactions for signing and submitting, the `FIELDS`, `TYPES`, and `TRANSACTION_TYPES` fields are necessary.

The field definition objects in the `FIELDS` array have the following fields:

| Field            | Type    | Contents                                        |
|:-----------------|:--------|:------------------------------------------------|
| `nth`            | Number  | The [field code](#field-codes) of this field, for use in constructing its [Field ID](#field-ids) and ordering it with other fields of the same data type. |
| `isVLEncoded`    | Boolean | If `true`, this field is [length-prefixed](#length-prefixing). |
| `isSerialized`   | Boolean | If `true`, this field should be encoded into serialized binary data. When this field is `false`, the field is typically reconstructed on demand rather than stored. |
| `isSigningField` | Boolean | If `true` this field should be serialized when preparing a transaction for signing. If `false`, this field should be omitted from the data to be signed. (It may not be part of transactions at all.) |
| `type`           | String  | The internal data type of this field. This maps to a key in the `TYPES` map, which gives the [type code](#type-codes) for this field. |

### Field IDs

[[Source - Encoding]](https://github.com/seelabs/rippled/blob/cecc0ad75849a1d50cc573188ad301ca65519a5b/src/ripple/protocol/impl/Serializer.cpp#L117-L148 "Source")
[[Source - Decoding]](https://github.com/seelabs/rippled/blob/cecc0ad75849a1d50cc573188ad301ca65519a5b/src/ripple/protocol/impl/Serializer.cpp#L484-L509 "Source")

When you combine a field's type code and field code, you get the field's unique identifier, which is prefixed before the field in the final serialized blob. The size of the Field ID is one to three bytes depending on the type code and field codes it combines. See the following table:

|                  | Type Code < 16                                                                | Type Code >= 16 |
|:-----------------|:------------------------------------------------------------------------------|:--|
| **Field Code < 16**  | ![1 byte: high 4 bits define type; low 4 bits define field.](img/field-id-common-type-common-field.png) | ![2 bytes: low 4 bits of the first byte define field; next byte defines type.](img/field-id-uncommon-type-common-field.png) |
| **Field Code >= 16** | ![2 bytes: high 4 bits of the first byte define type; low 4 bits of first byte are 0; next byte defines field](img/field-id-common-type-uncommon-field.png) | ![3 bytes: first byte is `0x00`, second byte defines type; third byte defines field](img/field-id-uncommon-type-uncommon-field.png) |

When decoding, you can tell how many bytes the field ID is by which bits **of the first byte** are zeroes. This corresponds to the cases in the above table:

|                  | High 4 bits are nonzero                                                                | High 4 bits are zero |
|:-----------------|:------------------------------------------------------------------------------|:--|
| **Low 4 bits are nonzero**  | 1 byte: high 4 bits define type; low 4 bits define field.                     | 2 bytes: low 4 bits of the first byte define field; next byte defines type |
| **Low 4 bits are zero** | 2 bytes: high 4 bits of the first byte define type; low 4 bits of first byte are 0; next byte defines field | 3 bytes: first byte is `0x00`, second byte defines type; third byte defines field |

**Caution:** Even though the Field ID consists of the two elements that are used to sort fields, you should not sort by the serialized Field ID itself, because the byte structure of the Field ID changes the sort order.

### Length Prefixing

Some types of variable-length fields are prefixed with a length indicator. `Blob` fields (containing arbitrary binary data) are one such type. For a list of which types are length-prefixed, see the [Type List](#type-list) table.

**Note:** Some types of fields that vary in length are not length-prefixed. Those types have other ways of indicating the end of their contents.

The length prefix consists of one to three bytes indicating the length of the field immediately after the type prefix and before the contents.

- If the field contains 0 to 192 bytes of data, the first byte defines the length of the contents, then that many bytes of data follow immediately after the length byte.

- If the field contains 193 to 12480 bytes of data, the first two bytes indicate the length of the field with the following formula:

        193 + ((byte1 - 193) * 256) + byte2

- If the field contains 12481 to 918744 bytes of data, the first three bytes indicate the length of the field with the following formula:

        12481 + ((byte1 - 241) * 65536) + (byte2 * 256) + byte3

- A length-prefixed field cannot contain more than 918744 bytes of data.

When decoding, you can tell from the value of the first length byte whether there are 0, 1, or 2 additional length bytes:

- If the first length byte has a value of 192 or less, then that's the only length byte and it contains the exact length of the field contents in bytes.
- If the first length byte has a value of 193 to 240, then there are two length bytes.
- If the first length byte has a value of 241 to 254, then there are three length bytes.


## Canonical Field Order

All fields in a transaction are sorted in a specific order based first on the field's type (specifically, a numeric "type code" assigned to each type), then on the field itself (a "field code"). (Think of it as sorting by family name, then given name, where the family name is the field's type and the given name is the field itself.)

### Type Codes

Each field type has an arbitrary type code, with lower codes sorting first. These codes are defined in [`SField.h`](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/SField.h#L57-L74).

For example, [UInt32 has type code 2](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/SField.h#L59), so all UInt32 fields come before all [Amount fields, which have type code 6](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/SField.h#L63).

The [definitions file](#definitions-file) lists the type codes for each type in the `TYPES` map.

### Field Codes

Each field has a field code, which is used to sort fields that have the same type as one another, with lower codes sorting first. These fields are defined in [`SField.cpp`](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L72-L266).

For example, the `Account` field of a [Payment transaction][] [has sort code 1](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L219), so it comes before the `Destination` field which [has sort code 3](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L221).

Field codes are reused for fields of different field types, but fields of the same type never have the same field code. When you combine the type code with the field code, you get the field's unique [Field ID](#field-ids).



## Type List

Transaction instructions may contain fields of any of the following types:

| Type Name     | Type Code | Bit Length | [Length-prefixed]? | Description    |
|:--------------|:----------|:-----------|:-------------------|----------------|
| [AccountID][] | 8         | 160        | Yes             | The unique identifier for an [account](accounts.html). |
| [Amount][]    | 6         | 64 or 384  | No               | An amount of XRP or tokens. The length of the field is 64 bits for XRP or 384 bits (64+160+160) for tokens. |
| [Blob][]      | 7         | Variable   | Yes                                 | Arbitrary binary data. One important such field is `TxnSignature`, the signature that authorizes a transaction. |
| [Hash128][]   | 4         | 128        | No                                  | A 128-bit arbitrary binary value. The only such field is `EmailHash`, which is intended to store the MD-5 hash of an account owner's email for purposes of fetching a [Gravatar](https://www.gravatar.com/). |
| [Hash160][]   | 17        | 160        | No                                  | A 160-bit arbitrary binary value. This may define a currency code or issuer. |
| [Hash256][]   | 5         | 256        | No                                  | A 256-bit arbitrary binary value. This usually represents the "SHA-512Half" hash of a transaction, ledger version, or ledger data object. |
| [PathSet][]   | 18        | Variable   | No                                  | A set of possible [payment paths](paths.html) for a [cross-currency payment](cross-currency-payments.html). |
| [STArray][]   | 15        | Variable   | No                                  | An array containing a variable number of members, which can be different types depending on the field. Two cases of this include [memos](transaction-common-fields.html#memos-field) and lists of signers used in [multi-signing](multi-signing.html). |
| [STObject][]  | 14        | Variable   | No                                  | An object containing one or more nested fields. |
| [UInt8][]     | 16        | 8          | No                                  | An 8-bit unsigned integer. |
| [UInt16][]    | 1         | 16         | No                                  | A 16-bit unsigned integer. The `TransactionType` is a special case of this type, with specific strings mapping to integer values. |
| [UInt32][]    | 2         | 32         | No                                  | A 32-bit unsigned integer. The `Flags` and `Sequence` fields on all transactions are examples of this type. |

[Length-prefixed]: #length-prefixing

In addition to all of the above field types, the following types may appear in other contexts, such as [ledger objects](ledger-object-types.html) and [transaction metadata](transaction-metadata.html):

| Type Name   | Type Code | [Length-prefixed]? | Description                   |
|:------------|:----------|:-------------------|:------------------------------|
| Transaction | 10001     | No                 | A "high-level" type containing an entire [transaction](transaction-formats.html). |
| LedgerEntry | 10002     | No                 | A "high-level" type containing an entire [ledger object](ledger-object-types.html). |
| Validation  | 10003     | No                 | A "high-level" type used in peer-to-peer communications to represent a validation vote in the [consensus process](consensus.html). |
| Metadata    | 10004     | No                 | A "high-level" type containing [metadata for one transaction](transaction-metadata.html). |
| [UInt64][]  | 3         | No                 | A 64-bit unsigned integer. This type does not appear in transaction instructions, but several ledger objects use fields of this type. |
| Vector256   | 19        | Yes                | This type does not appear in transaction instructions, but the [Amendments ledger object](amendments-object.html)'s `Amendments` field uses this to represent which [amendments](amendments.html) are currently enabled. |


### AccountID Fields
[AccountID]: #accountid-fields

Fields of this type contain the 160-bit identifier for an XRP Ledger [account](accounts.html). In JSON, these fields are represented as [base58][] XRP Ledger "addresses", with additional checksum data so that typos are unlikely to result in valid addresses. (This encoding, sometimes called "Base58Check", prevents accidentally sending money to the wrong address.) The binary format for these fields does not contain any checksum data nor does it include the `0x00` "type prefix" used in [address base58 encoding](accounts.html#address-encoding). (However, since the binary format is used mostly for signed transactions, a typo or other error in transcribing a signed transaction would invalidate the signature, preventing it from sending money.)

AccountIDs that appear as stand-alone fields (such as `Account` and `Destination`) are [length-prefixed](#length-prefixing) despite being a fixed 160 bits in length. As a result, the length indicator for these fields is always the byte `0x14`. AccountIDs that appear as children of special fields ([Amount `issuer`][Amount] and [PathSet `account`][PathSet]) are _not_ length-prefixed.


### Amount Fields
[Amount]: #amount-fields

The "Amount" type is a special field type that represents an amount of currency, either XRP or a token. This type consists of two sub-types:

- **XRP**

    XRP is serialized as a 64-bit unsigned integer (big-endian order), except that the most significant bit is always 0 to indicate that it's XRP, and the second-most-significant bit is `1` to indicate that it is positive. Since the maximum amount of XRP (10<sup>17</sup> drops) only requires 57 bits, you can calculate XRP serialized format by taking standard 64-bit unsigned integer and performing a bitwise-OR with `0x4000000000000000`.

- **Tokens**

    Tokens consist of three segments in order:

    1. 64 bits indicating the amount in the [token amount format](#token-amount-format). The first bit is `1` to indicate that this is not XRP.
    2. 160 bits indicating the [currency code](currency-formats.html#currency-codes). The standard API converts 3-character codes such as "USD" into 160-bit codes using the [standard currency code format](currency-formats.html#standard-currency-codes), but custom 160-bit codes are also possible.
    3. 160 bits indicating the issuer's Account ID. (See also: [Account Address Encoding](accounts.html#address-encoding))

You can tell which of the two sub-types it is based on the first bit: `0` for XRP; `1` for tokens.

The following diagram shows the serialization formats for both XRP amounts and token amounts:

<figure><a href="img/serialization-amount.svg" title='XRP amounts have a "not XRP" bit, a sign bit, and 62 bits of precision. Token amounts consist of a "not XRP" bit, a sign bit, an exponent (8 bits), significant digits (54 bits), currency code (160 bits), and issuer (160 bits).'><svg color-interpolation="auto" color-rendering="auto" fill="black" fill-opacity="1" font-family="'Dialog'" font-size="12px" font-style="normal" font-weight="normal" height="100%" image-rendering="auto" shape-rendering="auto" stroke="black" stroke-dasharray="none" stroke-dashoffset="0" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10" stroke-opacity="1" stroke-width="1" text-rendering="auto" viewBox="0 0 900 620" width="900" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!--Generated by the Batik Graphics2D SVG Generator--><defs id="img/serialization-amount.svg__genericDefs"/><g><defs id="img/serialization-amount.svg__defs1"><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath1"><path d="M0 0 L2147483647 0 L2147483647 2147483647 L0 2147483647 L0 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath2"><path d="M0 0 L0 50 L620 50 L620 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath3"><path d="M0 0 L0 30 L240 30 L240 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath4"><path d="M0 0 L0 50 L850 50 L850 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath5"><path d="M0 0 L0 30 L160 30 L160 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath6"><path d="M0 0 L0 30 L540 30 L540 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath7"><path d="M0 0 L0 60 L160 60 L160 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath8"><path d="M0 0 L0 30 L260 30 L260 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath9"><path d="M0 0 L0 30 L20 30 L20 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath10"><path d="M0 0 L0 30 L130 30 L130 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath11"><path d="M0 0 L0 30 L150 30 L150 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath12"><path d="M0 0 L0 30 L180 30 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath13"><path d="M0 0 L0 30 L220 30 L220 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath14"><path d="M0 0 L0 40 L300 40 L300 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath15"><path d="M0 0 L0 30 L200 30 L200 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath16"><path d="M0 0 L0 30 L190 30 L190 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath17"><path d="M0 0 L0 90 L50 90 L50 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath18"><path d="M0 0 L0 60 L50 60 L50 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath19"><path d="M0 0 L0 230 L40 230 L40 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath20"><path d="M0 0 L0 230 L460 230 L460 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath21"><path d="M0 0 L0 50 L40 50 L40 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-amount.svg__clipPath22"><path d="M0 0 L0 70 L60 70 L60 0 Z"/></clipPath></defs><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(30,500)"><rect clip-path="url(#img/serialization-amount.svg__clipPath2)" height="48.5" stroke="none" width="618.5" x="0.5" y="0.5"/></g><g transform="translate(30,500)"><rect clip-path="url(#img/serialization-amount.svg__clipPath2)" fill="none" height="48.5" width="618.5" x="0.5" y="0.5"/></g><g font-family="sans-serif" font-size="14px" transform="translate(90,470)"><text clip-path="url(#img/serialization-amount.svg__clipPath3)" stroke="none" x="5" xml:space="preserve" y="18.1094">Standard Currency Code Format</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(30,260)"><rect clip-path="url(#img/serialization-amount.svg__clipPath4)" height="48.5" stroke="none" width="848.5" x="0.5" y="0.5"/></g><g transform="translate(30,260)"><rect clip-path="url(#img/serialization-amount.svg__clipPath4)" fill="none" height="48.5" width="848.5" x="0.5" y="0.5"/></g><g font-family="sans-serif" font-size="14px" transform="translate(30,230)"><text clip-path="url(#img/serialization-amount.svg__clipPath3)" stroke="none" x="5" xml:space="preserve" y="18.1094">Token Amount Format</text></g><g font-family="sans-serif" font-size="14px" transform="translate(30,20)"><text clip-path="url(#img/serialization-amount.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="18.1094">XRP Amount Format</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(30,50)"><rect clip-path="url(#img/serialization-amount.svg__clipPath2)" height="48.5" stroke="none" width="618.5" x="0.5" y="0.5"/></g><g transform="translate(30,50)"><rect clip-path="url(#img/serialization-amount.svg__clipPath2)" fill="none" height="48.5" width="618.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,60)"><rect clip-path="url(#img/serialization-amount.svg__clipPath6)" height="28.5" stroke="none" width="538.5" x="0.5" y="0.5"/></g><g transform="translate(100,60)"><rect clip-path="url(#img/serialization-amount.svg__clipPath6)" fill="none" height="28.5" width="538.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath6)" font-family="sans-serif" font-size="14px" stroke="none" x="191" xml:space="preserve" y="18.1094">integer drops (62 bits)</text></g><g font-family="sans-serif" font-size="14px" transform="translate(80,140)"><text clip-path="url(#img/serialization-amount.svg__clipPath7)" stroke="none" x="5" xml:space="preserve" y="18.1094">"Not XRP" bit</text><text clip-path="url(#img/serialization-amount.svg__clipPath7)" stroke="none" x="5" xml:space="preserve" y="34.2188">(0=XRP, 1=not XRP)</text></g><g font-family="sans-serif" font-size="14px" transform="translate(100,110)"><text clip-path="url(#img/serialization-amount.svg__clipPath8)" stroke="none" x="5" xml:space="preserve" y="18.1094">Sign bit (always 1 for positive)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(70,60)"><rect clip-path="url(#img/serialization-amount.svg__clipPath9)" height="28.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(70,60)"><rect clip-path="url(#img/serialization-amount.svg__clipPath9)" fill="none" height="28.5" width="18.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="5" xml:space="preserve" y="18.1094">1</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(40,60)"><rect clip-path="url(#img/serialization-amount.svg__clipPath9)" height="28.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(40,60)"><rect clip-path="url(#img/serialization-amount.svg__clipPath9)" fill="none" height="28.5" width="18.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="5" xml:space="preserve" y="18.1094">0</text></g><g font-family="sans-serif" font-size="14px" transform="translate(330,550)"><text clip-path="url(#img/serialization-amount.svg__clipPath10)" stroke="none" x="5" xml:space="preserve" y="18.1094">3 chars of ASCII</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(300,510)"><rect clip-path="url(#img/serialization-amount.svg__clipPath11)" height="28.5" stroke="none" width="148.5" x="0.5" y="0.5"/></g><g transform="translate(300,510)"><rect clip-path="url(#img/serialization-amount.svg__clipPath11)" fill="none" height="28.5" width="148.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath11)" font-family="sans-serif" font-size="14px" stroke="none" x="12" xml:space="preserve" y="18.1094">ISO code (24 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(460,510)"><rect clip-path="url(#img/serialization-amount.svg__clipPath12)" height="28.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(460,510)"><rect clip-path="url(#img/serialization-amount.svg__clipPath12)" fill="none" height="28.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath12)" font-family="sans-serif" font-size="14px" stroke="none" x="25" xml:space="preserve" y="18.1094">Reserved (40 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(70,510)"><rect clip-path="url(#img/serialization-amount.svg__clipPath13)" height="28.5" stroke="none" width="218.5" x="0.5" y="0.5"/></g><g transform="translate(70,510)"><rect clip-path="url(#img/serialization-amount.svg__clipPath13)" fill="none" height="28.5" width="218.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath13)" font-family="sans-serif" font-size="14px" stroke="none" x="45" xml:space="preserve" y="18.1094">Reserved (88 bits)</text></g><g font-family="sans-serif" font-size="14px" transform="translate(80,560)"><text clip-path="url(#img/serialization-amount.svg__clipPath14)" stroke="none" x="5" xml:space="preserve" y="18.1094">Type code (8 bits)</text><text clip-path="url(#img/serialization-amount.svg__clipPath14)" stroke="none" x="5" xml:space="preserve" y="34.2188">0x00 for ISO 4217/pseudo-ISO currency</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(40,510)"><rect clip-path="url(#img/serialization-amount.svg__clipPath9)" height="28.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(40,510)"><rect clip-path="url(#img/serialization-amount.svg__clipPath9)" fill="none" height="28.5" width="18.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="1" xml:space="preserve" y="18.1094">00</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(670,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath15)" height="28.5" stroke="none" width="198.5" x="0.5" y="0.5"/></g><g transform="translate(670,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath15)" fill="none" height="28.5" width="198.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath15)" font-family="sans-serif" font-size="14px" stroke="none" x="5" xml:space="preserve" y="18.1094">issuer AccountID (160 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(460,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath15)" height="28.5" stroke="none" width="198.5" x="0.5" y="0.5"/></g><g transform="translate(460,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath15)" fill="none" height="28.5" width="198.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath15)" font-family="sans-serif" font-size="14px" stroke="none" x="14" xml:space="preserve" y="18.1094">currency code (160 bits)</text></g><g font-family="sans-serif" font-size="14px" transform="translate(80,350)"><text clip-path="url(#img/serialization-amount.svg__clipPath7)" stroke="none" x="5" xml:space="preserve" y="18.1094">"Not XRP" bit</text><text clip-path="url(#img/serialization-amount.svg__clipPath7)" stroke="none" x="5" xml:space="preserve" y="34.2188">(0=XRP, 1=not XRP)</text></g><g font-family="sans-serif" font-size="14px" transform="translate(100,320)"><text clip-path="url(#img/serialization-amount.svg__clipPath8)" stroke="none" x="5" xml:space="preserve" y="18.1094">Sign bit (0=negative, 1=positive)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(260,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath16)" height="28.5" stroke="none" width="188.5" x="0.5" y="0.5"/></g><g transform="translate(260,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath16)" fill="none" height="28.5" width="188.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath16)" font-family="sans-serif" font-size="14px" stroke="none" x="5" xml:space="preserve" y="18.1094">significant digits (54 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath11)" height="28.5" stroke="none" width="148.5" x="0.5" y="0.5"/></g><g transform="translate(100,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath11)" fill="none" height="28.5" width="148.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath11)" font-family="sans-serif" font-size="14px" stroke="none" x="14" xml:space="preserve" y="18.1094">exponent (8 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(70,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath9)" height="28.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(70,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath9)" fill="none" height="28.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(40,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath9)" height="28.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(40,270)"><rect clip-path="url(#img/serialization-amount.svg__clipPath9)" fill="none" height="28.5" width="18.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-amount.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="5" xml:space="preserve" y="18.1094">1</text></g><g transform="translate(40,80)"><path clip-path="url(#img/serialization-amount.svg__clipPath17)" d="M10.5 11.5 L10.5 70.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath17)" d="M10.5 70.5 L30.5 70.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath17)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath17)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(70,80)"><path clip-path="url(#img/serialization-amount.svg__clipPath18)" d="M10.5 11.5 L10.5 40.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath18)" d="M10.5 40.5 L30.5 40.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath18)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath18)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(640,290)"><path clip-path="url(#img/serialization-amount.svg__clipPath19)" d="M10.5 210.5 L20.5 10.5" fill="none"/></g><g stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(20,290)"><path clip-path="url(#img/serialization-amount.svg__clipPath20)" d="M10.5 210.5 L440.5 10.5" fill="none"/></g><g transform="translate(310,530)"><path clip-path="url(#img/serialization-amount.svg__clipPath21)" d="M10.5 11.5 L10.5 30.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath21)" d="M10.5 30.5 L20.5 30.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath21)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath21)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(40,520)"><path clip-path="url(#img/serialization-amount.svg__clipPath22)" d="M10.5 11.5 L10.5 50.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath22)" d="M10.5 50.5 L40.5 50.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath22)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath22)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(40,290)"><path clip-path="url(#img/serialization-amount.svg__clipPath17)" d="M10.5 11.5 L10.5 70.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath17)" d="M10.5 70.5 L30.5 70.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath17)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath17)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(70,290)"><path clip-path="url(#img/serialization-amount.svg__clipPath18)" d="M10.5 11.5 L10.5 40.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath18)" d="M10.5 40.5 L30.5 40.5" fill="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath18)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-amount.svg__clipPath18)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g></g></svg></a></figure>

#### Token Amount Format
[[Source]](https://github.com/ripple/rippled/blob/35fa20a110e3d43ffc1e9e664fc9017b6f2747ae/src/ripple/protocol/impl/STAmount.cpp "Source")

<figure><a href="img/currency-number-format.svg" title="Token Amount Format diagram"><svg color-interpolation="auto" color-rendering="auto" fill="black" fill-opacity="1" font-family="'Dialog'" font-size="12px" font-style="normal" font-weight="normal" height="100%" image-rendering="auto" shape-rendering="auto" stroke="black" stroke-dasharray="none" stroke-dashoffset="0" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10" stroke-opacity="1" stroke-width="1" text-rendering="auto" viewBox="0 0 700 380" width="700" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!--Generated by the Batik Graphics2D SVG Generator--><defs id="img/currency-number-format.svg__genericDefs"/><g><defs id="img/currency-number-format.svg__defs1"><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath1"><path d="M0 0 L2147483647 0 L2147483647 2147483647 L0 2147483647 L0 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath2"><path d="M0 0 L0 30 L280 30 L280 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath3"><path d="M0 0 L0 30 L630 30 L630 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath4"><path d="M0 0 L0 70 L650 70 L650 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath5"><path d="M0 0 L0 90 L150 90 L150 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath6"><path d="M0 0 L0 30 L270 30 L270 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath7"><path d="M0 0 L0 30 L260 30 L260 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath8"><path d="M0 0 L0 30 L410 30 L410 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath9"><path d="M0 0 L0 30 L150 30 L150 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath10"><path d="M0 0 L0 30 L20 30 L20 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath11"><path d="M0 0 L0 60 L90 60 L90 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath12"><path d="M0 0 L0 100 L50 100 L50 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath13"><path d="M0 0 L0 130 L50 130 L50 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-number-format.svg__clipPath14"><path d="M0 0 L0 90 L40 90 L40 0 Z"/></clipPath></defs><g font-family="sans-serif" font-size="14px" transform="translate(130,330)"><text clip-path="url(#img/currency-number-format.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="18.1094">Most significant bit is 1, the rest is 0's</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(40,280)"><rect clip-path="url(#img/currency-number-format.svg__clipPath3)" height="28.5" stroke="none" width="628.5" x="0.5" y="0.5"/></g><g transform="translate(40,280)"><rect clip-path="url(#img/currency-number-format.svg__clipPath3)" fill="none" height="28.5" width="628.5" x="0.5" y="0.5"/><text clip-path="url(#img/currency-number-format.svg__clipPath3)" font-family="sans-serif" font-size="14px" stroke="none" x="128" xml:space="preserve" y="18.1094">0x8000000000000000000000000000000000000000</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(20,20)"><path clip-path="url(#img/currency-number-format.svg__clipPath4)" d="M0.5 0.5 L260.5 0.5 L260.5 21.6094 L649 21.6094 L649 69 L0.5 69 Z" stroke="none"/></g><g transform="translate(20,20)"><path clip-path="url(#img/currency-number-format.svg__clipPath4)" d="M0.5 0.5 L260.5 0.5 L260.5 21.6094 L649 21.6094 L649 69 L0.5 69 Z" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath4)" d="M0.5 21.6094 L260.5 21.6094" fill="none"/><text clip-path="url(#img/currency-number-format.svg__clipPath4)" font-family="sans-serif" font-size="14px" stroke="none" x="5" xml:space="preserve" y="16.1094">Token Number Format</text></g><g font-family="sans-serif" font-size="14px" transform="translate(530,110)"><text clip-path="url(#img/currency-number-format.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="18.1094">Normalized to the</text><text clip-path="url(#img/currency-number-format.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="34.2188">range</text><text clip-path="url(#img/currency-number-format.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="50.3281">(10¹⁵, 10¹⁶-1)</text><text clip-path="url(#img/currency-number-format.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="66.4375">inclusive</text></g><g font-family="sans-serif" font-size="14px" transform="translate(210,100)"><text clip-path="url(#img/currency-number-format.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="18.1094">Unsigned integer; original value +97</text></g><g font-family="sans-serif" font-size="14px" transform="translate(60,170)"><text clip-path="url(#img/currency-number-format.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="18.1094">"Not XRP" bit (0=XRP, 1=not XRP)</text></g><g font-family="sans-serif" font-size="14px" transform="translate(80,130)"><text clip-path="url(#img/currency-number-format.svg__clipPath7)" stroke="none" x="5" xml:space="preserve" y="18.1094">Sign bit (0=negative, 1=positive)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(250,50)"><rect clip-path="url(#img/currency-number-format.svg__clipPath8)" height="28.5" stroke="none" width="408.5" x="0.5" y="0.5"/></g><g transform="translate(250,50)"><rect clip-path="url(#img/currency-number-format.svg__clipPath8)" fill="none" height="28.5" width="408.5" x="0.5" y="0.5"/><text clip-path="url(#img/currency-number-format.svg__clipPath8)" font-family="sans-serif" font-size="14px" stroke="none" x="115" xml:space="preserve" y="18.1094">significant digits (54 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(90,50)"><rect clip-path="url(#img/currency-number-format.svg__clipPath9)" height="28.5" stroke="none" width="148.5" x="0.5" y="0.5"/></g><g transform="translate(90,50)"><rect clip-path="url(#img/currency-number-format.svg__clipPath9)" fill="none" height="28.5" width="148.5" x="0.5" y="0.5"/><text clip-path="url(#img/currency-number-format.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="14" xml:space="preserve" y="18.1094">exponent (8 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(60,50)"><rect clip-path="url(#img/currency-number-format.svg__clipPath10)" height="28.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(60,50)"><rect clip-path="url(#img/currency-number-format.svg__clipPath10)" fill="none" height="28.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(30,50)"><rect clip-path="url(#img/currency-number-format.svg__clipPath10)" height="28.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(30,50)"><rect clip-path="url(#img/currency-number-format.svg__clipPath10)" fill="none" height="28.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(30,250)"><path clip-path="url(#img/currency-number-format.svg__clipPath4)" d="M0.5 0.5 L312.0068 0.5 L312.0068 21.6094 L649 21.6094 L649 69 L0.5 69 Z" stroke="none"/></g><g transform="translate(30,250)"><path clip-path="url(#img/currency-number-format.svg__clipPath4)" d="M0.5 0.5 L312.0068 0.5 L312.0068 21.6094 L649 21.6094 L649 69 L0.5 69 Z" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath4)" d="M0.5 21.6094 L312.0068 21.6094" fill="none"/><text clip-path="url(#img/currency-number-format.svg__clipPath4)" font-family="sans-serif" font-size="14px" stroke="none" x="5" xml:space="preserve" y="16.1094">Special Case (Issued currency amount = 0)</text></g><g transform="translate(60,300)"><path clip-path="url(#img/currency-number-format.svg__clipPath11)" d="M10.5 11.5 L10.5 40.5" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath11)" d="M10.5 40.5 L70.5 40.5" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath11)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath11)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(500,70)"><path clip-path="url(#img/currency-number-format.svg__clipPath12)" d="M10.5 11.5 L10.5 80.5" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath12)" d="M10.5 80.5 L30.5 80.5" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath12)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath12)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(140,70)"><path clip-path="url(#img/currency-number-format.svg__clipPath11)" d="M10.5 11.5 L10.5 40.5" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath11)" d="M10.5 40.5 L70.5 40.5" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath11)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath11)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(30,70)"><path clip-path="url(#img/currency-number-format.svg__clipPath13)" d="M10.5 11.5 L10.5 110.5" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath13)" d="M10.5 110.5 L30.5 110.5" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath13)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath13)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(60,70)"><path clip-path="url(#img/currency-number-format.svg__clipPath14)" d="M10.5 11.5 L10.5 70.5" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath14)" d="M10.5 70.5 L20.5 70.5" fill="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath14)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/currency-number-format.svg__clipPath14)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g></g></svg></a></figure>

The XRP Ledger uses 64 bits to serialize the numeric amount of a (fungible) token. (In JSON format, the numeric amount is the `value` field of a currency amount object.) In binary format, the numeric amount consists of a "not XRP" bit, a sign bit, significant digits, and an exponent, in order:

1. The first (most significant) bit for an token amount is `1` to indicate that it is not an XRP amount. (XRP amounts always have the most significant bit set to `0` to distinguish them from this format.)
2. The sign bit indicates whether the amount is positive or negative. Unlike standard [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement) integers, `1` indicates **positive** in the XRP Ledger format, and `0` indicates negative.
3. The next 8 bits represent the exponent as an unsigned integer. The exponent indicates the scale (what power of 10 the significant digits should be multiplied by) in the range -96 to +80 (inclusive). However, when serializing, we add 97 to the exponent to make it possible to serialize as an unsigned integer. Thus, a serialized value of `1` indicates an exponent of `-96`, a serialized value of `177` indicates an exponent of 80, and so on.
4. The remaining 54 bits represent the significant digits (sometimes called a _mantissa_) as an unsigned integer. When serializing, this value is normalized to the range 10<sup>15</sup> (`1000000000000000`) to 10<sup>16</sup>-1 (`9999999999999999`) inclusive, except for the special case of the value 0. In the special case for 0, the sign bit, exponent, and significant digits are all zeroes, so the 64-bit value is serialized as `0x8000000000000000000000000000000000000000`.

The numeric amount is serialized alongside the [currency code][] and issuer to form a full [token amount](#amount-fields).

#### Currency Codes

At a protocol level, currency codes in the XRP Ledger are arbitrary 160-bit values, except the following values have special meaning:

- The currency code `0x0000000000000000000000005852500000000000` is **always disallowed**. (This is the code "XRP" in the "standard format".)
- The currency code `0x0000000000000000000000000000000000000000` (all zeroes) is **generally disallowed**. Usually, XRP amounts are not specified with currency codes. However, this code is used to indicate XRP in rare cases where a field must specify a currency code for XRP.

The [`rippled` APIs](rippled-api.html) support a **standard format** for translating three-character ASCII codes to 160-bit hex values as follows:

<figure><a href="img/currency-code-format.svg" title="Standard Currency Code Format"><svg color-interpolation="auto" color-rendering="auto" fill="black" fill-opacity="1" font-family="'Dialog'" font-size="12px" font-style="normal" font-weight="normal" height="100%" image-rendering="auto" shape-rendering="auto" stroke="black" stroke-dasharray="none" stroke-dashoffset="0" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10" stroke-opacity="1" stroke-width="1" text-rendering="auto" viewBox="10 20 660 290" width="660" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!--Generated by the Batik Graphics2D SVG Generator--><defs id="img/currency-code-format.svg__genericDefs"/><g><defs id="img/currency-code-format.svg__defs1"><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-code-format.svg__clipPath1"><path d="M0 0 L2147483647 0 L2147483647 2147483647 L0 2147483647 L0 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-code-format.svg__clipPath2"><path d="M0 0 L0 30 L600 30 L600 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-code-format.svg__clipPath3"><path d="M0 0 L0 70 L620 70 L620 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-code-format.svg__clipPath4"><path d="M0 0 L0 40 L130 40 L130 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-code-format.svg__clipPath5"><path d="M0 0 L0 30 L150 30 L150 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-code-format.svg__clipPath6"><path d="M0 0 L0 30 L180 30 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-code-format.svg__clipPath7"><path d="M0 0 L0 30 L220 30 L220 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-code-format.svg__clipPath8"><path d="M0 0 L0 60 L200 60 L200 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-code-format.svg__clipPath9"><path d="M0 0 L0 30 L20 30 L20 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-code-format.svg__clipPath10"><path d="M0 0 L0 60 L40 60 L40 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/currency-code-format.svg__clipPath11"><path d="M0 0 L0 60 L60 60 L60 0 Z"/></clipPath></defs><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(40,250)"><rect clip-path="url(#img/currency-code-format.svg__clipPath2)" height="28.5" stroke="none" width="598.5" x="0.5" y="0.5"/></g><g transform="translate(40,250)"><rect clip-path="url(#img/currency-code-format.svg__clipPath2)" fill="none" height="28.5" width="598.5" x="0.5" y="0.5"/><text clip-path="url(#img/currency-code-format.svg__clipPath2)" font-family="sans-serif" font-size="14px" stroke="none" x="51" xml:space="preserve" y="18.1094">0x00000000000000000000000000000000000000000 (160 bits of 0's)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(30,220)"><path clip-path="url(#img/currency-code-format.svg__clipPath3)" d="M0.5 0.5 L248.5 0.5 L248.5 21.6094 L619 21.6094 L619 69 L0.5 69 Z" stroke="none"/></g><g transform="translate(30,220)"><path clip-path="url(#img/currency-code-format.svg__clipPath3)" d="M0.5 0.5 L248.5 0.5 L248.5 21.6094 L619 21.6094 L619 69 L0.5 69 Z" fill="none"/><path clip-path="url(#img/currency-code-format.svg__clipPath3)" d="M0.5 21.6094 L248.5 21.6094" fill="none"/><text clip-path="url(#img/currency-code-format.svg__clipPath3)" font-family="sans-serif" font-size="14px" stroke="none" x="5" xml:space="preserve" y="16.1094">Special Case XRP Currency Code</text></g><g font-family="sans-serif" font-size="14px" transform="translate(330,110)"><text clip-path="url(#img/currency-code-format.svg__clipPath4)" stroke="none" x="5" xml:space="preserve" y="18.1094">3 chars of ASCII</text><text clip-path="url(#img/currency-code-format.svg__clipPath4)" stroke="none" x="5" xml:space="preserve" y="34.2188">(can't be "XRP")</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(30,40)"><path clip-path="url(#img/currency-code-format.svg__clipPath3)" d="M0.5 0.5 L248.5 0.5 L248.5 21.6094 L619 21.6094 L619 69 L0.5 69 Z" stroke="none"/></g><g transform="translate(30,40)"><path clip-path="url(#img/currency-code-format.svg__clipPath3)" d="M0.5 0.5 L248.5 0.5 L248.5 21.6094 L619 21.6094 L619 69 L0.5 69 Z" fill="none"/><path clip-path="url(#img/currency-code-format.svg__clipPath3)" d="M0.5 21.6094 L248.5 21.6094" fill="none"/><text clip-path="url(#img/currency-code-format.svg__clipPath3)" font-family="sans-serif" font-size="14px" stroke="none" x="5" xml:space="preserve" y="16.1094">Issued Currency Code Format</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(300,70)"><rect clip-path="url(#img/currency-code-format.svg__clipPath5)" height="28.5" stroke="none" width="148.5" x="0.5" y="0.5"/></g><g transform="translate(300,70)"><rect clip-path="url(#img/currency-code-format.svg__clipPath5)" fill="none" height="28.5" width="148.5" x="0.5" y="0.5"/><text clip-path="url(#img/currency-code-format.svg__clipPath5)" font-family="sans-serif" font-size="14px" stroke="none" x="12" xml:space="preserve" y="18.1094">ISO code (24 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(460,70)"><rect clip-path="url(#img/currency-code-format.svg__clipPath6)" height="28.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(460,70)"><rect clip-path="url(#img/currency-code-format.svg__clipPath6)" fill="none" height="28.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/currency-code-format.svg__clipPath6)" font-family="sans-serif" font-size="14px" stroke="none" x="25" xml:space="preserve" y="18.1094">Reserved (40 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(70,70)"><rect clip-path="url(#img/currency-code-format.svg__clipPath7)" height="28.5" stroke="none" width="218.5" x="0.5" y="0.5"/></g><g transform="translate(70,70)"><rect clip-path="url(#img/currency-code-format.svg__clipPath7)" fill="none" height="28.5" width="218.5" x="0.5" y="0.5"/><text clip-path="url(#img/currency-code-format.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="45" xml:space="preserve" y="18.1094">Reserved (88 bits)</text></g><g font-family="sans-serif" font-size="14px" transform="translate(80,120)"><text clip-path="url(#img/currency-code-format.svg__clipPath8)" stroke="none" x="5" xml:space="preserve" y="18.1094">Type code (8 bits)</text><text clip-path="url(#img/currency-code-format.svg__clipPath8)" stroke="none" x="5" xml:space="preserve" y="34.2188">0x00 for ISO 4217 or </text><text clip-path="url(#img/currency-code-format.svg__clipPath8)" stroke="none" x="5" xml:space="preserve" y="50.3281">pseudo-ISO currency</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(40,70)"><rect clip-path="url(#img/currency-code-format.svg__clipPath9)" height="28.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(40,70)"><rect clip-path="url(#img/currency-code-format.svg__clipPath9)" fill="none" height="28.5" width="18.5" x="0.5" y="0.5"/><text clip-path="url(#img/currency-code-format.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="1" xml:space="preserve" y="18.1094">00</text></g><g transform="translate(310,90)"><path clip-path="url(#img/currency-code-format.svg__clipPath10)" d="M10.5 11.5 L10.5 40.5" fill="none"/><path clip-path="url(#img/currency-code-format.svg__clipPath10)" d="M10.5 40.5 L20.5 40.5" fill="none"/><path clip-path="url(#img/currency-code-format.svg__clipPath10)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/currency-code-format.svg__clipPath10)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(40,90)"><path clip-path="url(#img/currency-code-format.svg__clipPath11)" d="M10.5 11.5 L10.5 40.5" fill="none"/><path clip-path="url(#img/currency-code-format.svg__clipPath11)" d="M10.5 40.5 L40.5 40.5" fill="none"/><path clip-path="url(#img/currency-code-format.svg__clipPath11)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/currency-code-format.svg__clipPath11)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g></g></svg></a></figure>

1. The first 8 bits must be `0x00`.
2. The next 88 bits are reserved, and should be all `0`'s.
3. The next 24 bits represent 3 characters of ASCII.
    Ripple recommends using [ISO 4217](https://www.xe.com/iso4217.php) codes, or popular pseudo-ISO 4217 codes such as "BTC". However, any combination of the following characters is permitted: all uppercase and lowercase letters, digits, as well as the symbols `?`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `<`, `>`, `(`, `)`, `{`, `}`, `[`, `]`, and <code>&#124;</code>. The currency code `XRP` (all-uppercase) is reserved for XRP and cannot be used by tokens.
4. The next 40 bits are reserved and should be all `0`'s.

The **nonstandard format** is any 160 bits of data as long as the first 8 bits are not `0x00`.


### Array Fields
[STArray]: #array-fields

Some transaction fields, such as `SignerEntries` (in [SignerListSet transactions][]) and [`Memos`](transaction-common-fields.html#memos-field), are arrays of objects (called the "STArray" type).

Arrays contain several [object fields](#object-fields) in their native binary format in a specific order. In JSON, each array member is a JSON "wrapper" object with a single field, which is the name of the member object field. The value of that field is the ("inner") object itself.

In the binary format, each member of the array has a Field ID prefix (based on the single key of the wrapper object) and contents (comprising the inner object, [serialized as an object](#object-fields)). To mark the end of an array, append an item with a "Field ID" of `0xf1` (the type code for array with field code of 1) and no contents.

The following example shows the serialization format for an array (the `SignerEntries` field):

<figure><a href="img/serialization-array.svg" title='Array field ID, followed by the Field ID and contents of each array element, followed by the "Array end" field ID'><svg color-interpolation="auto" color-rendering="auto" fill="black" fill-opacity="1" font-family="'Dialog'" font-size="12px" font-style="normal" font-weight="normal" height="100%" image-rendering="auto" shape-rendering="auto" stroke="black" stroke-dasharray="none" stroke-dashoffset="0" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10" stroke-opacity="1" stroke-width="1" text-rendering="auto" viewBox="10 20 700 220" width="700" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!--Generated by the Batik Graphics2D SVG Generator--><defs id="img/serialization-array.svg__genericDefs"/><g><defs id="img/serialization-array.svg__defs1"><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-array.svg__clipPath1"><path d="M0 0 L2147483647 0 L2147483647 2147483647 L0 2147483647 L0 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-array.svg__clipPath2"><path d="M0 0 L0 30 L210 30 L210 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-array.svg__clipPath3"><path d="M0 0 L0 50 L600 50 L600 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-array.svg__clipPath4"><path d="M0 0 L0 30 L180 30 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-array.svg__clipPath5"><path d="M0 0 L0 30 L50 30 L50 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-array.svg__clipPath6"><path d="M0 0 L0 50 L110 50 L110 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-array.svg__clipPath7"><path d="M0 0 L0 60 L100 60 L100 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-array.svg__clipPath8"><path d="M0 0 L0 30 L40 30 L40 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-array.svg__clipPath9"><path d="M0 0 L0 80 L100 80 L100 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-array.svg__clipPath10"><path d="M0 0 L0 80 L30 80 L30 0 Z"/></clipPath></defs><g font-family="sans-serif" font-size="14px" transform="translate(80,40)"><text clip-path="url(#img/serialization-array.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="18.1094">SignerEntries (array) field</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(80,70)"><rect clip-path="url(#img/serialization-array.svg__clipPath3)" height="48.5" stroke="none" width="598.5" x="0.5" y="0.5"/></g><g transform="translate(80,70)"><rect clip-path="url(#img/serialization-array.svg__clipPath3)" fill="none" height="48.5" width="598.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(430,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath4)" height="28.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(430,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath4)" fill="none" height="28.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-array.svg__clipPath4)" font-family="sans-serif" font-size="14px" stroke="none" x="9" xml:space="preserve" y="18.1094">(SignerEntry Contents)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(380,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath5)" height="28.5" stroke="none" width="48.5" x="0.5" y="0.5"/></g><g transform="translate(380,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath5)" fill="none" height="28.5" width="48.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-array.svg__clipPath5)" font-family="sans-serif" font-size="14px" stroke="none" x="7" xml:space="preserve" y="18.1094">0xeb</text></g><g font-family="sans-serif" font-size="14px" transform="translate(250,140)"><text clip-path="url(#img/serialization-array.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="18.1094">SignerEntry</text><text clip-path="url(#img/serialization-array.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="34.2188">Field ID</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(190,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath4)" height="28.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(190,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath4)" fill="none" height="28.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-array.svg__clipPath4)" font-family="sans-serif" font-size="14px" stroke="none" x="9" xml:space="preserve" y="18.1094">(SignerEntry Contents)</text></g><g font-family="sans-serif" font-size="14px" transform="translate(590,160)"><text clip-path="url(#img/serialization-array.svg__clipPath7)" stroke="none" x="5" xml:space="preserve" y="18.1094">Array end</text><text clip-path="url(#img/serialization-array.svg__clipPath7)" stroke="none" x="5" xml:space="preserve" y="34.2188">Field ID;</text><text clip-path="url(#img/serialization-array.svg__clipPath7)" stroke="none" x="5" xml:space="preserve" y="50.3281">no contents</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(620,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath5)" height="28.5" stroke="none" width="48.5" x="0.5" y="0.5"/></g><g transform="translate(620,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath5)" fill="none" height="28.5" width="48.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-array.svg__clipPath5)" font-family="sans-serif" font-size="14px" stroke="none" x="9" xml:space="preserve" y="18.1094">0xf1</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath5)" height="28.5" stroke="none" width="48.5" x="0.5" y="0.5"/></g><g transform="translate(140,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath5)" fill="none" height="28.5" width="48.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-array.svg__clipPath5)" font-family="sans-serif" font-size="14px" stroke="none" x="7" xml:space="preserve" y="18.1094">0xeb</text></g><g font-family="sans-serif" font-size="14px" transform="translate(30,160)"><text clip-path="url(#img/serialization-array.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="18.1094">SignerEntries</text><text clip-path="url(#img/serialization-array.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="34.2188">Field ID</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(90,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath8)" height="28.5" stroke="none" width="38.5" x="0.5" y="0.5"/></g><g transform="translate(90,80)"><rect clip-path="url(#img/serialization-array.svg__clipPath8)" fill="none" height="28.5" width="38.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-array.svg__clipPath8)" font-family="sans-serif" font-size="14px" stroke="none" x="4" xml:space="preserve" y="18.1094">0xf4</text></g><g transform="translate(160,100)"><path clip-path="url(#img/serialization-array.svg__clipPath9)" d="M10.5 11.5 L10.5 60.5" fill="none"/><path clip-path="url(#img/serialization-array.svg__clipPath9)" d="M10.5 60.5 L80.5 60.5" fill="none"/><path clip-path="url(#img/serialization-array.svg__clipPath9)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-array.svg__clipPath9)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(630,100)"><path clip-path="url(#img/serialization-array.svg__clipPath10)" d="M10.5 11.5 L10.5 60.5" fill="none"/><path clip-path="url(#img/serialization-array.svg__clipPath10)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-array.svg__clipPath10)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(100,100)"><path clip-path="url(#img/serialization-array.svg__clipPath10)" d="M10.5 11.5 L10.5 60.5" fill="none"/><path clip-path="url(#img/serialization-array.svg__clipPath10)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-array.svg__clipPath10)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g></g></svg></a></figure>


### Blob Fields
[Blob]: #blob-fields

The Blob type is a [length-prefixed](#length-prefixing) field with arbitrary data. Two common fields that use this type are `SigningPubKey` and `TxnSignature`, which contain (respectively) the public key and signature that authorize a transaction to be executed.

Blob fields have no further structure to their contents, so they consist of exactly the amount of bytes indicated in the variable-length encoding, after the Field ID and length prefixes.


### Hash Fields
[Hash128]: #hash-fields
[Hash160]: #hash-fields
[Hash256]: #hash-fields

The XRP Ledger has several "hash" types: Hash128, Hash160, and Hash256. These fields contain arbitrary binary data of the given number of bits, which may or may not represent the result of a hash operation.

All such fields are serialized as the specific number of bits, with no length indicator, in big-endian byte order.


### Object Fields
[STObject]: #object-fields

Some fields, such as `SignerEntry` (in [SignerListSet transactions][]), and `Memo` (in `Memos` arrays) are objects (called the "STObject" type). The serialization of objects is very similar to that of arrays, with one difference: **object members must be placed in canonical order** within the object field, where array fields have an explicit order already.

The [canonical field order](#canonical-field-order) of object fields is the same as the canonical field order for all top-level fields, but the members of the object must be sorted within the object. After the last member, there is an "Object end" Field ID of `0xe1` with no contents.

The following example shows the serialization format for an object (a single `Memo` object in the `Memos` array).

<figure><a href="img/serialization-object.svg" title='Object field ID, followed by the Object ID and contents of each object member in canonical order, followed by the "Object end" field ID'><svg color-interpolation="auto" color-rendering="auto" fill="black" fill-opacity="1" font-family="'Dialog'" font-size="12px" font-style="normal" font-weight="normal" height="100%" image-rendering="auto" shape-rendering="auto" stroke="black" stroke-dasharray="none" stroke-dashoffset="0" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10" stroke-opacity="1" stroke-width="1" text-rendering="auto" viewBox="10 10 710 250" width="710" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!--Generated by the Batik Graphics2D SVG Generator--><defs id="img/serialization-object.svg__genericDefs"/><g><defs id="img/serialization-object.svg__defs1"><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath1"><path d="M0 0 L2147483647 0 L2147483647 2147483647 L0 2147483647 L0 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath2"><path d="M0 0 L0 30 L160 30 L160 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath3"><path d="M0 0 L0 50 L600 50 L600 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath4"><path d="M0 0 L0 40 L140 40 L140 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath5"><path d="M0 0 L0 30 L150 30 L150 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath6"><path d="M0 0 L0 50 L170 50 L170 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath7"><path d="M0 0 L0 30 L30 30 L30 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath8"><path d="M0 0 L0 50 L110 50 L110 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath9"><path d="M0 0 L0 30 L50 30 L50 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath10"><path d="M0 0 L0 60 L100 60 L100 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath11"><path d="M0 0 L0 50 L80 50 L80 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath12"><path d="M0 0 L0 30 L40 30 L40 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath13"><path d="M0 0 L0 50 L290 50 L290 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath14"><path d="M0 0 L0 50 L50 50 L50 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath15"><path d="M0 0 L0 70 L40 70 L40 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath16"><path d="M0 0 L0 90 L500 90 L500 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath17"><path d="M0 0 L0 80 L50 80 L50 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath18"><path d="M0 0 L0 60 L80 60 L80 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-object.svg__clipPath19"><path d="M0 0 L0 60 L30 60 L30 0 Z"/></clipPath></defs><g font-family="sans-serif" font-size="14px" transform="translate(40,40)"><text clip-path="url(#img/serialization-object.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="18.1094">Memo (object) field</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(40,70)"><rect clip-path="url(#img/serialization-object.svg__clipPath3)" height="48.5" stroke="none" width="598.5" x="0.5" y="0.5"/></g><g transform="translate(40,70)"><rect clip-path="url(#img/serialization-object.svg__clipPath3)" fill="none" height="48.5" width="598.5" x="0.5" y="0.5"/></g><g font-family="sans-serif" font-size="14px" transform="translate(420,120)"><text clip-path="url(#img/serialization-object.svg__clipPath4)" stroke="none" x="5" xml:space="preserve" y="18.1094">Length prefixes</text></g><g font-family="sans-serif" font-size="14px" transform="translate(370,30)"><text clip-path="url(#img/serialization-object.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="18.1094">MemoData Field ID</text></g><g font-family="sans-serif" font-size="14px" transform="translate(260,190)"><text clip-path="url(#img/serialization-object.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="18.1094">Object contents in</text><text clip-path="url(#img/serialization-object.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="34.2188">canonical order</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(390,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath7)" height="28.5" stroke="none" width="28.5" x="0.5" y="0.5"/></g><g transform="translate(390,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath7)" fill="none" height="28.5" width="28.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(420,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath5)" height="28.5" stroke="none" width="148.5" x="0.5" y="0.5"/></g><g transform="translate(420,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath5)" fill="none" height="28.5" width="148.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-object.svg__clipPath5)" font-family="sans-serif" font-size="14px" stroke="none" x="4" xml:space="preserve" y="18.1094">MemoData contents</text></g><g font-family="sans-serif" font-size="14px" transform="translate(150,140)"><text clip-path="url(#img/serialization-object.svg__clipPath8)" stroke="none" x="5" xml:space="preserve" y="18.1094">MemoType</text><text clip-path="url(#img/serialization-object.svg__clipPath8)" stroke="none" x="5" xml:space="preserve" y="34.2188">Field ID</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(150,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath7)" height="28.5" stroke="none" width="28.5" x="0.5" y="0.5"/></g><g transform="translate(150,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath7)" fill="none" height="28.5" width="28.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(340,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath9)" height="28.5" stroke="none" width="48.5" x="0.5" y="0.5"/></g><g transform="translate(340,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath9)" fill="none" height="28.5" width="48.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-object.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="7" xml:space="preserve" y="18.1094">0x7d</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath5)" height="28.5" stroke="none" width="148.5" x="0.5" y="0.5"/></g><g transform="translate(180,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath5)" fill="none" height="28.5" width="148.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-object.svg__clipPath5)" font-family="sans-serif" font-size="14px" stroke="none" x="3" xml:space="preserve" y="18.1094">MemoType contents</text></g><g font-family="sans-serif" font-size="14px" transform="translate(600,140)"><text clip-path="url(#img/serialization-object.svg__clipPath10)" stroke="none" x="5" xml:space="preserve" y="18.1094">"Object end"</text><text clip-path="url(#img/serialization-object.svg__clipPath10)" stroke="none" x="5" xml:space="preserve" y="34.2188">Field ID;</text><text clip-path="url(#img/serialization-object.svg__clipPath10)" stroke="none" x="5" xml:space="preserve" y="50.3281">no contents</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(580,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath9)" height="28.5" stroke="none" width="48.5" x="0.5" y="0.5"/></g><g transform="translate(580,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath9)" fill="none" height="28.5" width="48.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-object.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="7" xml:space="preserve" y="18.1094">0xe1</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath9)" height="28.5" stroke="none" width="48.5" x="0.5" y="0.5"/></g><g transform="translate(100,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath9)" fill="none" height="28.5" width="48.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-object.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="8" xml:space="preserve" y="18.1094">0x7c</text></g><g font-family="sans-serif" font-size="14px" transform="translate(30,140)"><text clip-path="url(#img/serialization-object.svg__clipPath11)" stroke="none" x="5" xml:space="preserve" y="18.1094">Memo</text><text clip-path="url(#img/serialization-object.svg__clipPath11)" stroke="none" x="5" xml:space="preserve" y="34.2188">Field ID</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(50,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath12)" height="28.5" stroke="none" width="38.5" x="0.5" y="0.5"/></g><g transform="translate(50,80)"><rect clip-path="url(#img/serialization-object.svg__clipPath12)" fill="none" height="28.5" width="38.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-object.svg__clipPath12)" font-family="sans-serif" font-size="14px" stroke="none" x="2" xml:space="preserve" y="18.1094">0xea</text></g><g transform="translate(150,100)"><path clip-path="url(#img/serialization-object.svg__clipPath13)" d="M10.5 11.5 L10.5 30.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath13)" d="M10.5 30.5 L270.5 30.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath13)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-object.svg__clipPath13)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(390,100)"><path clip-path="url(#img/serialization-object.svg__clipPath14)" d="M10.5 11.5 L10.5 30.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath14)" d="M10.5 30.5 L30.5 30.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath14)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-object.svg__clipPath14)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(350,30)"><path clip-path="url(#img/serialization-object.svg__clipPath15)" d="M10.5 49.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath15)" d="M10.5 10.5 L20.5 10.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath15)" d="M17 38.7417 L10.5 50 L4 38.7417 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-object.svg__clipPath15)" d="M17 38.7417 L10.5 50 L4 38.7417 Z" fill="none"/></g><g stroke-dasharray="8,5" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(90,120)"><path clip-path="url(#img/serialization-object.svg__clipPath16)" d="M10.5 10.5 L10.5 70.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath16)" d="M10.5 70.5 L480.5 70.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath16)" d="M480.5 70.5 L480.5 10.5" fill="none"/></g><g transform="translate(120,100)"><path clip-path="url(#img/serialization-object.svg__clipPath17)" d="M10.5 11.5 L10.5 60.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath17)" d="M10.5 60.5 L30.5 60.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath17)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-object.svg__clipPath17)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(590,100)"><path clip-path="url(#img/serialization-object.svg__clipPath18)" d="M10.5 11.5 L10.5 30.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath18)" d="M10.5 30.5 L60.5 30.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath18)" d="M60.5 30.5 L60.5 40.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath18)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-object.svg__clipPath18)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g transform="translate(60,100)"><path clip-path="url(#img/serialization-object.svg__clipPath19)" d="M10.5 11.5 L10.5 40.5" fill="none"/><path clip-path="url(#img/serialization-object.svg__clipPath19)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-object.svg__clipPath19)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g></g></svg></a></figure>


### PathSet Fields
[PathSet]: #pathset-fields

The `Paths` field of a cross-currency [Payment transaction][] is a "PathSet", represented in JSON as an array of arrays. For more information on what paths are used for, see [Paths](paths.html).

A PathSet is serialized as **1 to 6** individual paths in sequence[[Source]](https://github.com/ripple/rippled/blob/4cff94f7a4a05302bdf1a248515379da99c5bcd4/src/ripple/app/tx/impl/Payment.h#L35-L36 "Source"). Each complete path is followed by a byte that indicates what comes next:

- `0xff` indicates another path follows
- `0x00` indicates the end of the PathSet

Each path consists of **1 to 8** path steps in order[[Source]](https://github.com/ripple/rippled/blob/4cff94f7a4a05302bdf1a248515379da99c5bcd4/src/ripple/app/tx/impl/Payment.h#L38-L39 "Source"). Each step starts with a **type** byte, followed by one or more fields describing the path step. The type indicates which fields are present in that path step through bitwise flags. (For example, the value `0x30` indicates changing both currency and issuer.) If more than one field is present, the fields are always placed in a specific order.

The following table describes the possible fields and the bitwise flags to set in the type byte to indicate them:

| Type Flag | Field Present | Field Type        | Bit Size | Order |
|:----------|:--------------|:------------------|:---------|:------|
| `0x01`    | `account`     | [AccountID][]     | 160 bits | 1st   |
| `0x10`    | `currency`    | [Currency Code][] | 160 bits | 2nd   |
| `0x20`    | `issuer`      | [AccountID][]     | 160 bits | 3rd   |

[Currency Code]: currency-formats.html#standard-currency-codes

Some combinations are invalid; see [Path Specifications](paths.html#path-specifications) for details.

The AccountIDs in the `account` and `issuer` fields are presented _without_ a length prefix. When the `currency` is XRP, the currency code is represented as 160 bits of zeroes.

Each step is followed directly by the next step of the path. As described above, last step of a path is followed by either `0xff` (if another path follows) or `0x00` (if this ends the last path).

The following example shows the serialization format for a PathSet:

<figure><a href="img/serialization-pathset.svg" title="PathSet is several paths each followed by a continue or end byte; each path is several path steps consisting of a type byte and one or more 160-bit fields based on the type byte"><svg color-interpolation="auto" color-rendering="auto" fill="black" fill-opacity="1" font-family="'Dialog'" font-size="12px" font-style="normal" font-weight="normal" height="100%" image-rendering="auto" shape-rendering="auto" stroke="black" stroke-dasharray="none" stroke-dashoffset="0" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10" stroke-opacity="1" stroke-width="1" text-rendering="auto" viewBox="10 0 750 350" width="750" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!--Generated by the Batik Graphics2D SVG Generator--><defs id="img/serialization-pathset.svg__genericDefs"/><g><defs id="img/serialization-pathset.svg__defs1"><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath1"><path d="M0 0 L2147483647 0 L2147483647 2147483647 L0 2147483647 L0 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath2"><path d="M0 0 L0 50 L650 50 L650 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath3"><path d="M0 0 L0 30 L100 30 L100 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath4"><path d="M0 0 L0 30 L180 30 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath5"><path d="M0 0 L0 30 L130 30 L130 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath6"><path d="M0 0 L0 30 L260 30 L260 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath7"><path d="M0 0 L0 30 L40 30 L40 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath8"><path d="M0 0 L0 30 L160 30 L160 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath9"><path d="M0 0 L0 30 L150 30 L150 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath10"><path d="M0 0 L0 60 L60 60 L60 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath11"><path d="M0 0 L0 70 L70 70 L70 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath12"><path d="M0 0 L0 100 L60 100 L60 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath13"><path d="M0 0 L0 50 L390 50 L390 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath14"><path d="M0 0 L0 130 L520 130 L520 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/serialization-pathset.svg__clipPath15"><path d="M0 0 L0 130 L40 130 L40 0 Z"/></clipPath></defs><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(40,200)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath2)" height="48.5" stroke="none" width="648.5" x="0.5" y="0.5"/></g><g transform="translate(40,200)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath2)" fill="none" height="48.5" width="648.5" x="0.5" y="0.5"/></g><g font-family="sans-serif" font-size="14px" transform="translate(50,170)"><text clip-path="url(#img/serialization-pathset.svg__clipPath3)" stroke="none" x="5" xml:space="preserve" y="18.1094">Path</text></g><g font-family="sans-serif" font-size="14px" transform="translate(40,30)"><text clip-path="url(#img/serialization-pathset.svg__clipPath3)" stroke="none" x="5" xml:space="preserve" y="18.1094">PathSet</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(40,60)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath2)" height="48.5" stroke="none" width="648.5" x="0.5" y="0.5"/></g><g transform="translate(40,60)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath2)" fill="none" height="48.5" width="648.5" x="0.5" y="0.5"/></g><g font-family="sans-serif" font-size="14px" transform="translate(640,20)"><text clip-path="url(#img/serialization-pathset.svg__clipPath3)" stroke="none" x="5" xml:space="preserve" y="18.1094">"End" byte</text></g><g font-family="sans-serif" font-size="14px" transform="translate(460,20)"><text clip-path="url(#img/serialization-pathset.svg__clipPath4)" stroke="none" x="5" xml:space="preserve" y="18.1094">"Continue" byte</text></g><g font-family="sans-serif" font-size="14px" transform="translate(490,300)"><text clip-path="url(#img/serialization-pathset.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="18.1094">More path steps</text></g><g font-family="sans-serif" font-size="14px" transform="translate(490,120)"><text clip-path="url(#img/serialization-pathset.svg__clipPath4)" stroke="none" x="5" xml:space="preserve" y="18.1094">More paths</text></g><g font-family="sans-serif" font-size="14px" transform="translate(80,290)"><text clip-path="url(#img/serialization-pathset.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="18.1094">Path step</text></g><g font-family="sans-serif" font-size="14px" transform="translate(640,210)"><text clip-path="url(#img/serialization-pathset.svg__clipPath7)" stroke="none" x="5" xml:space="preserve" y="18.1094">...</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(460,210)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath8)" height="28.5" stroke="none" width="158.5" x="0.5" y="0.5"/></g><g transform="translate(460,210)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath8)" fill="none" height="28.5" width="158.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-pathset.svg__clipPath8)" font-family="sans-serif" font-size="14px" stroke="none" x="15" xml:space="preserve" y="18.1094">Account (160 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(420,210)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath7)" height="28.5" stroke="none" width="38.5" x="0.5" y="0.5"/></g><g transform="translate(420,210)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath7)" fill="none" height="28.5" width="38.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-pathset.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="2" xml:space="preserve" y="18.1094">0x01</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(250,210)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath8)" height="28.5" stroke="none" width="158.5" x="0.5" y="0.5"/></g><g transform="translate(250,210)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath8)" fill="none" height="28.5" width="158.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-pathset.svg__clipPath8)" font-family="sans-serif" font-size="14px" stroke="none" x="22" xml:space="preserve" y="18.1094">Issuer (160 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(90,210)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath8)" height="28.5" stroke="none" width="158.5" x="0.5" y="0.5"/></g><g transform="translate(90,210)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath8)" fill="none" height="28.5" width="158.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-pathset.svg__clipPath8)" font-family="sans-serif" font-size="14px" stroke="none" x="12" xml:space="preserve" y="18.1094">Currency (160 bits)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(640,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath7)" height="28.5" stroke="none" width="38.5" x="0.5" y="0.5"/></g><g transform="translate(640,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath7)" fill="none" height="28.5" width="38.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-pathset.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="2" xml:space="preserve" y="18.1094">0x00</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(490,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath9)" height="28.5" stroke="none" width="148.5" x="0.5" y="0.5"/></g><g transform="translate(490,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath9)" fill="none" height="28.5" width="148.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-pathset.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="42" xml:space="preserve" y="18.1094">Last path</text></g><g font-family="sans-serif" font-size="14px" transform="translate(450,70)"><text clip-path="url(#img/serialization-pathset.svg__clipPath7)" stroke="none" x="5" xml:space="preserve" y="18.1094">...</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(400,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath7)" height="28.5" stroke="none" width="38.5" x="0.5" y="0.5"/></g><g transform="translate(400,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath7)" fill="none" height="28.5" width="38.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-pathset.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="6" xml:space="preserve" y="18.1094">0xff</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(250,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath9)" height="28.5" stroke="none" width="148.5" x="0.5" y="0.5"/></g><g transform="translate(250,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath9)" fill="none" height="28.5" width="148.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-pathset.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="31" xml:space="preserve" y="18.1094">Second path</text></g><g font-family="sans-serif" font-size="14px" transform="translate(470,260)"><text clip-path="url(#img/serialization-pathset.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="18.1094">Path step's type byte</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(50,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath9)" height="28.5" stroke="none" width="148.5" x="0.5" y="0.5"/></g><g transform="translate(50,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath9)" fill="none" height="28.5" width="148.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-pathset.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="41" xml:space="preserve" y="18.1094">First path</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath7)" height="28.5" stroke="none" width="38.5" x="0.5" y="0.5"/></g><g transform="translate(200,70)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath7)" fill="none" height="28.5" width="38.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-pathset.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="6" xml:space="preserve" y="18.1094">0xff</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(50,210)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath7)" height="28.5" stroke="none" width="38.5" x="0.5" y="0.5"/></g><g transform="translate(50,210)"><rect clip-path="url(#img/serialization-pathset.svg__clipPath7)" fill="none" height="28.5" width="38.5" x="0.5" y="0.5"/><text clip-path="url(#img/serialization-pathset.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="2" xml:space="preserve" y="18.1094">0x30</text></g><g transform="translate(670,40)"><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M11.5 40.5 L40.5 40.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M40.5 40.5 L40.5 10.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M22.2583 47 L11 40.5 L22.2583 34 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M22.2583 47 L11 40.5 L22.2583 34 Z" fill="none"/></g><g transform="translate(410,20)"><path clip-path="url(#img/serialization-pathset.svg__clipPath11)" d="M10.5 49.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath11)" d="M10.5 10.5 L50.5 10.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath11)" d="M17 38.7417 L10.5 50 L4 38.7417 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath11)" d="M17 38.7417 L10.5 50 L4 38.7417 Z" fill="none"/></g><g transform="translate(610,230)"><path clip-path="url(#img/serialization-pathset.svg__clipPath12)" d="M40.5 11.5 L40.5 80.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath12)" d="M40.5 80.5 L10.5 80.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath12)" d="M34 22.2583 L40.5 11 L47 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath12)" d="M34 22.2583 L40.5 11 L47 22.2583 Z" fill="none"/></g><g transform="translate(450,90)"><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M10.5 11.5 L10.5 40.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M10.5 40.5 L40.5 40.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g><g stroke-dasharray="8,5" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(40,250)"><path clip-path="url(#img/serialization-pathset.svg__clipPath13)" d="M10.5 10.5 L10.5 30.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath13)" d="M10.5 30.5 L370.5 30.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath13)" d="M370.5 30.5 L370.5 10.5" fill="none"/></g><g stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(190,90)"><path clip-path="url(#img/serialization-pathset.svg__clipPath14)" d="M500.5 110.5 L10.5 10.5" fill="none"/></g><g stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(30,90)"><path clip-path="url(#img/serialization-pathset.svg__clipPath15)" d="M10.5 110.5 L20.5 10.5" fill="none"/></g><g transform="translate(430,230)"><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M10.5 11.5 L10.5 40.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M10.5 40.5 L40.5 40.5" fill="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="white" stroke="none"/><path clip-path="url(#img/serialization-pathset.svg__clipPath10)" d="M4 22.2583 L10.5 11 L17 22.2583 Z" fill="none"/></g></g></svg></a></figure>


### UInt Fields
[UInt8]: #uint-fields
[UInt16]: #uint-fields
[UInt32]: #uint-fields
[UInt64]: #uint-fields

The XRP Ledger has several unsigned integer types: UInt8, UInt16, UInt32, and UInt64. All of these are standard big-endian binary unsigned integers with the specified number of bits.

When representing these fields in JSON objects, most are represented as JSON numbers by default. One exception is UInt64, which is represented as a string because some JSON decoders may try to represent these integers as 64-bit "double precision" floating point numbers, which cannot represent all distinct UInt64 values with full precision.

Another special case is the `TransactionType` field. In JSON, this field is conventionally represented as a string with the name of the transaction type, but in binary, this field is a UInt16. The `TRANSACTION_TYPES` object in the [definitions file](#definitions-file) maps these strings to specific numeric values.

<!-- SPELLING_IGNORE: pathset, stobject, starray, ledgerentry, vector256, accountids, uint -->
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
