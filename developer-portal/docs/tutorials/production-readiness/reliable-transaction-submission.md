# Reliable Transaction Submission

Financial institutions and other services using the XRP Ledger should use the best practices described here to make sure that transactions are validated or rejected in a verifiable and prompt way.  You should submit transactions to trusted `rippled` servers.

The best practices detailed in this document allow applications to submit transactions to the XRP Ledger while achieving:

1. [Idempotency](https://en.wikipedia.org/wiki/Idempotence) - Transactions should be processed once and only once, or not at all.
2. Verifiability - Applications can determine the final result of a transaction.

Applications which fail to implement best practices are at risk of the following errors:

1. Submitting transactions which are inadvertently never executed.
2. Mistaking provisional transaction results for their final, immutable results.
3. Failing to find authoritative results of transactions previously applied to the ledger.

These types of errors can potentially lead to serious problems.  For example, an application that fails to find a prior successful payment transaction might erroneously submit another transaction, duplicating the original payment.  This underscores the importance that applications base their actions on authoritative transaction results, using the techniques described in this document.

## Background

The XRP Ledger protocol provides a ledger shared across all servers in the network.  Through a [process of consensus and validation](consensus.html), the network agrees on the order in which transactions are applied to (or omitted from) the ledger.

Well-formed transactions submitted to trusted XRP Ledger servers are usually validated or rejected in a matter of seconds.  There are cases, however, in which a well-formed transaction is neither validated nor rejected this quickly. One specific case can occur if the global [transaction cost](transaction-cost.html) increases after an application sends a transaction.  If the transaction cost increases above what has been specified in the transaction, the transaction is not included in the next validated ledger. If at some later date the global transaction cost decreases, the transaction could be included in a later ledger. If the transaction does not specify an expiration, there is no limit to how much later this can occur.

If a power or network outage occurs, applications face more challenges finding the status of submitted transactions. Applications must take care both to properly submit a transaction and later to properly get authoritative results.




### Transaction Timeline

When you submit a transaction to the XRP Ledger, regardless of whether you used [HTTP API](rippled-api.html), a [client library](client-libraries.html), or some other app, process of applying the transaction to the ledger is the same. That process goes like this:

1. An account owner creates and signs a transaction.
2. The owner submits the transaction to the network as a candidate transaction.
    - Malformed or nonsensical transactions are rejected immediately.
    - Well-formed transactions may provisionally succeed, then later fail.
    - Well-formed transactions may provisionally fail, then later succeed.
    - Well-formed transactions may provisionally succeed, and then later succeed in a slightly different way. (For example, the exchange rate when [trading currencies](decentralized-exchange.html) may vary.)
3. Through consensus and validation, the transaction is applied to the ledger. Even some failed transactions are applied, to enforce a cost for being propagated through the network.
4. The validated ledger includes the transaction, and its effects are reflected in the ledger state.
    - Transaction results are no longer provisional, success or failure is now final and immutable.

**Note:** A successful status code returned from a [submit method][] indicates the server has received the candidate transaction. The transaction may or may not be applied to a validated ledger.

APIs may return provisional results based on the result of applying candidate transactions to the current, in-progress ledger. Applications must not confuse these with the final, *immutable*, results of a transaction.  Immutable results are found only in validated ledgers.  Applications may need to query the status of a transaction repeatedly, until the ledger containing the transaction results is validated.

While applying transactions, `rippled` servers use the *last validated ledger*, a snapshot of the ledger state based on transactions the entire network has validated.  The process of consensus and validation apply a set of new transactions to the last validated ledger in canonical order, resulting in a new validated ledger.  This new validated ledger version and the ones that preceded it form the ledger history.

Each validated ledger version has a ledger index, which is 1 greater than the ledger index of the previous ledger version. Each ledger also has an identifying hash value, which is uniquely determined from its contents. There may be many different versions of in-progress ledgers, which have the same ledger index but different hash values. Only one version can ever be validated.

Each validated ledger has a canonical order in which transactions apply. This order is deterministic based on the final transaction set of the ledger. In contrast, each `rippled` server's in-progress ledger is calculated incrementally, as transactions are received. The order in which transactions execute provisionally is usually not the same as the order in which transactions execute to build a new validated ledger. This is one reason why the provisional outcome of a transaction may be different than the final result. For example, a payment may achieve a different final exchange rate depending on whether it executes before or after another payment that would consume the same offer.



### LastLedgerSequence

<!-- SPELLING_IGNORE: lastledgersequence -->

`LastLedgerSequence` is an optional [parameter of all transactions](transaction-common-fields.html).  This instructs the XRP Ledger that a transaction must be validated on or before a specific ledger version.  The XRP Ledger never includes a transaction in a ledger version whose ledger index is higher than the transaction's `LastLedgerSequence` parameter.

Use the `LastLedgerSequence` parameter to prevent undesirable cases where a transaction is not confirmed promptly but could be included in a future ledger.  You should specify the `LastLedgerSequence` parameter on every transaction.  Automated processes should use a value of 4 greater than the last validated ledger index to make sure that a transaction is validated or rejected in a predictable and prompt way.

Applications using the [HTTP / WebSocket APIs](rippled-api.html) should explicitly specify a `LastLedgerSequence` when submitting transactions. Some [client libraries](client-libraries.html) can also [auto-fill](transaction-common-fields.html#auto-fillable-fields) a reasonable value for `LastLedgerSequence`; the details vary by library.



## Best Practices

The following diagram summarizes the recommended flow for submitting a transaction and determining its outcome:

<figure><a href="img/reliable-tx-submission.svg" title="Reliable transaction submission flowchart"><svg color-interpolation="auto" color-rendering="auto" fill="black" fill-opacity="1" font-family="'Dialog'" font-size="12px" font-style="normal" font-weight="normal" height="100%" image-rendering="auto" shape-rendering="auto" stroke="black" stroke-dasharray="none" stroke-dashoffset="0" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10" stroke-opacity="1" stroke-width="1" text-rendering="auto" viewBox="-10 -10 1360 970" width="1360" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!--Generated by the Batik Graphics2D SVG Generator--><defs id="img/reliable-tx-submission.svg__genericDefs"/><g><defs id="img/reliable-tx-submission.svg__defs1"><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath1"><path d="M0 0 L2147483647 0 L2147483647 2147483647 L0 2147483647 L0 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath2"><path d="M0 0 L0 230 L230 230 L230 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath3"><path d="M0 0 L0 100 L180 100 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath4"><path d="M0 0 L0 20 L20 20 L20 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath5"><path d="M0 0 L0 30 L60 30 L60 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath6"><path d="M0 0 L0 40 L40 40 L40 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath7"><path d="M0 0 L0 80 L180 80 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath8"><path d="M0 0 L0 30 L190 30 L190 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath9"><path d="M0 0 L0 50 L180 50 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath10"><path d="M0 0 L0 70 L180 70 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath11"><path d="M0 0 L0 60 L180 60 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath12"><path d="M0 0 L0 90 L140 90 L140 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath13"><path d="M0 0 L0 30 L160 30 L160 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath14"><path d="M0 0 L0 130 L180 130 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath15"><path d="M0 0 L0 110 L180 110 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath16"><path d="M0 0 L0 90 L180 90 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath17"><path d="M0 0 L0 310 L830 310 L830 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath18"><path d="M0 0 L0 160 L320 160 L320 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath19"><path d="M0 0 L0 130 L30 130 L30 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath20"><path d="M0 0 L0 60 L230 60 L230 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath21"><path d="M0 0 L0 130 L150 130 L150 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath22"><path d="M0 0 L0 30 L100 30 L100 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath23"><path d="M0 0 L0 60 L130 60 L130 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath24"><path d="M0 0 L0 60 L240 60 L240 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath25"><path d="M0 0 L0 30 L90 30 L90 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath26"><path d="M0 0 L0 140 L430 140 L430 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath27"><path d="M0 0 L0 330 L90 330 L90 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath28"><path d="M0 0 L0 130 L230 130 L230 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath29"><path d="M0 0 L0 30 L130 30 L130 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath30"><path d="M0 0 L0 160 L490 160 L490 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath31"><path d="M0 0 L0 50 L240 50 L240 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath32"><path d="M0 0 L0 310 L640 310 L640 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath33"><path d="M0 0 L0 60 L30 60 L30 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath34"><path d="M0 0 L0 120 L250 120 L250 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath35"><path d="M0 0 L0 30 L80 30 L80 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath36"><path d="M0 0 L0 30 L70 30 L70 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/reliable-tx-submission.svg__clipPath37"><path d="M0 0 L0 70 L130 70 L130 0 Z"/></clipPath></defs><g fill="yellow" stroke="yellow" transform="translate(1080,700)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" d="M0.5 0.5 L218.5 0.5 L229 12.5 L229 229 L0.5 229 Z" stroke="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" d="M0.5 0.5 L218.5 0.5 L229 12.5 L229 229 L0.5 229 Z" fill="none" stroke="black"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" d="M218.5 0.5 L218.5 12.5 L229 12.5" fill="none" stroke="black"/></g><g font-family="sans-serif" font-size="14px" transform="translate(1080,700)"><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="18.1094">Some reasons an unknown</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="34.2188">transaction may have been</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="50.3281">validated:</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="66.4375">- The transaction was</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="82.5469">malleable and succeeded with</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="98.6562">a different hash.</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="114.7656">- A different program or</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="130.875">person with your secret key is</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="146.9844">also sending transactions</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="163.0938">from the same account.</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="179.2031">- You previously sent a</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="195.3125">transaction, but lost your</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="211.4219">record of it.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(650,220)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath3)" height="98.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(650,220)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath3)" fill="none" height="98.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath3)" font-family="sans-serif" font-size="14px" stroke="none" x="17" xml:space="preserve" y="18.1094">Repeat the following</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath3)" font-family="sans-serif" font-size="14px" stroke="none" x="40" xml:space="preserve" y="34.2188">steps for each</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath3)" font-family="sans-serif" font-size="14px" stroke="none" x="15" xml:space="preserve" y="50.3281">transaction without a</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath3)" font-family="sans-serif" font-size="14px" stroke="none" x="41" xml:space="preserve" y="66.4375">final outcome</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath3)" font-family="sans-serif" font-size="14px" stroke="none" x="56" xml:space="preserve" y="82.5469">recorded.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(420,390)"><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="9.75" cy="9.75" r="9.25" stroke="none"/></g><g transform="translate(420,390)"><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="9.75" cy="9.75" fill="none" r="9.25"/><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="10" cy="10" r="6.2273" stroke="none"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(420,390)"><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="10" cy="10" fill="none" r="6.2273"/></g><g font-family="sans-serif" font-size="14px" transform="translate(410,410)"><text clip-path="url(#img/reliable-tx-submission.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="18.1094">Done</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(410,250)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath6)" d="M20.5 1.5 L39 20.5 L20.5 39 L1.5 20.5 Z" stroke="none"/></g><g transform="translate(410,250)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath6)" d="M20.5 1.5 L39 20.5 L20.5 39 L1.5 20.5 Z" fill="none"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,240)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" height="78.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(160,240)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" fill="none" height="78.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="31" xml:space="preserve" y="18.1094">Check persistent</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="51" xml:space="preserve" y="34.2188">storage for</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="11" xml:space="preserve" y="50.3281">transactions without a</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="16" xml:space="preserve" y="66.4375">final outcome saved.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(880,700)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" height="78.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(880,700)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" fill="none" height="78.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="15" xml:space="preserve" y="18.1094">Unknown transaction</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="20" xml:space="preserve" y="34.2188">has been validated.</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="19" xml:space="preserve" y="50.3281">Manual intervention</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="36" xml:space="preserve" y="66.4375">recommended.</text></g><g font-family="sans-serif" font-size="14px" transform="translate(10,190)"><text clip-path="url(#img/reliable-tx-submission.svg__clipPath8)" stroke="none" x="5" xml:space="preserve" y="18.1094">Recover from outage</text></g><g transform="translate(50,220)"><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="10.25" cy="10.25" r="8.75" stroke="none"/><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="10.25" cy="10.25" fill="none" r="8.75"/></g><g font-family="sans-serif" font-size="14px" transform="translate(680,900)"><text clip-path="url(#img/reliable-tx-submission.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="18.1094">Done</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(450,870)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" height="48.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(450,870)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" fill="none" height="48.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="13" xml:space="preserve" y="18.1094">Save final outcome to</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="23" xml:space="preserve" y="34.2188">persistent storage.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,860)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" height="78.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(200,860)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" fill="none" height="78.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="20" xml:space="preserve" y="18.1094">Transaction has not</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="16" xml:space="preserve" y="34.2188">been included in any</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="17" xml:space="preserve" y="50.3281">validated ledger and</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="42" xml:space="preserve" y="66.4375">never will be.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(690,880)"><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="9.75" cy="9.75" r="9.25" stroke="none"/></g><g transform="translate(690,880)"><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="9.75" cy="9.75" fill="none" r="9.25"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" d="M2.9191 3.6667 L17.0809 16.3333" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" d="M2.9191 16.3333 L17.0809 3.6667" fill="none"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(350,700)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath10)" height="68.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(350,700)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath10)" fill="none" height="68.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath10)" font-family="sans-serif" font-size="14px" stroke="none" x="32" xml:space="preserve" y="18.1094">Look up account</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath10)" font-family="sans-serif" font-size="14px" stroke="none" x="17" xml:space="preserve" y="34.2188">Sequence number in</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath10)" font-family="sans-serif" font-size="14px" stroke="none" x="8" xml:space="preserve" y="50.3281">latest validated ledger.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(1110,530)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath11)" height="58.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(1110,530)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath11)" fill="none" height="58.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath11)" font-family="sans-serif" font-size="14px" stroke="none" x="14" xml:space="preserve" y="18.1094">Wait for gaps to fill in</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath11)" font-family="sans-serif" font-size="14px" stroke="none" x="29" xml:space="preserve" y="34.2188">or ask a different</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath11)" font-family="sans-serif" font-size="14px" stroke="none" x="65" xml:space="preserve" y="50.3281">server.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(630,710)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath6)" d="M20.5 1.5 L39 20.5 L20.5 39 L1.5 20.5 Z" stroke="none"/></g><g transform="translate(630,710)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath6)" d="M20.5 1.5 L39 20.5 L20.5 39 L1.5 20.5 Z" fill="none"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(870,530)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath6)" d="M20.5 1.5 L39 20.5 L20.5 39 L1.5 20.5 Z" stroke="none"/></g><g transform="translate(870,530)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath6)" d="M20.5 1.5 L39 20.5 L20.5 39 L1.5 20.5 Z" fill="none"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(620,530)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath6)" d="M20.5 1.5 L39 20.5 L20.5 39 L1.5 20.5 Z" stroke="none"/></g><g transform="translate(620,530)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath6)" d="M20.5 1.5 L39 20.5 L20.5 39 L1.5 20.5 Z" fill="none"/></g><g font-family="sans-serif" font-size="14px" transform="translate(150,760)"><text clip-path="url(#img/reliable-tx-submission.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="18.1094">Done</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,740)"><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="9.75" cy="9.75" r="9.25" stroke="none"/></g><g transform="translate(160,740)"><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="9.75" cy="9.75" fill="none" r="9.25"/><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="10" cy="10" r="6.2273" stroke="none"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,740)"><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="10" cy="10" fill="none" r="6.2273"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(90,660)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" height="48.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(90,660)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" fill="none" height="48.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="13" xml:space="preserve" y="18.1094">Save final outcome to</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="23" xml:space="preserve" y="34.2188">persistent storage.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(370,530)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath6)" d="M20.5 1.5 L39 20.5 L20.5 39 L1.5 20.5 Z" stroke="none"/></g><g transform="translate(370,530)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath6)" d="M20.5 1.5 L39 20.5 L20.5 39 L1.5 20.5 Z" fill="none"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(90,530)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" height="48.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(90,530)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" fill="none" height="48.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="35" xml:space="preserve" y="18.1094">Check status of</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="18" xml:space="preserve" y="34.2188">transaction by hash.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(1080,230)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath12)" d="M50.5 0.5 L90.5 40.5 L50.5 40.5 L90.5 0.5 Z" stroke="none"/></g><g transform="translate(1080,230)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath12)" d="M50.5 0.5 L90.5 40.5 L50.5 40.5 L90.5 0.5 Z" fill="none"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath12)" font-family="sans-serif" font-size="14px" stroke="none" x="8" xml:space="preserve" y="63.1094">Wait ~4s for next</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath12)" font-family="sans-serif" font-size="14px" stroke="none" x="12" xml:space="preserve" y="79.2188">validated ledger</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(1070,80)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" height="48.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(1070,80)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" fill="none" height="48.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="21" xml:space="preserve" y="18.1094">Submit transaction.</text></g><g font-family="sans-serif" font-size="14px" transform="translate(10,10)"><text clip-path="url(#img/reliable-tx-submission.svg__clipPath13)" stroke="none" x="5" xml:space="preserve" y="18.1094">New transaction</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(840,50)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath14)" height="128.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(840,50)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath14)" fill="none" height="128.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath14)" font-family="sans-serif" font-size="14px" stroke="none" x="21" xml:space="preserve" y="18.1094">Save transaction to</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath14)" font-family="sans-serif" font-size="14px" stroke="none" x="12" xml:space="preserve" y="34.2188">persistent storage. Be</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath14)" font-family="sans-serif" font-size="14px" stroke="none" x="24" xml:space="preserve" y="50.3281">sure to include the</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath14)" font-family="sans-serif" font-size="14px" stroke="none" x="31" xml:space="preserve" y="66.4375">hash, Sequence,</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath14)" font-family="sans-serif" font-size="14px" stroke="none" x="14" xml:space="preserve" y="82.5469">LastLedgerSequence,</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath14)" font-family="sans-serif" font-size="14px" stroke="none" x="28" xml:space="preserve" y="98.6562">and the validated</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath14)" font-family="sans-serif" font-size="14px" stroke="none" x="43" xml:space="preserve" y="114.7656">ledger index.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(610,80)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" height="48.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(610,80)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" fill="none" height="48.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath9)" font-family="sans-serif" font-size="14px" stroke="none" x="30" xml:space="preserve" y="18.1094">Sign transaction.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(390,50)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath15)" height="108.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(390,50)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath15)" fill="none" height="108.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath15)" font-family="sans-serif" font-size="14px" stroke="none" x="14" xml:space="preserve" y="18.1094">Construct transaction</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath15)" font-family="sans-serif" font-size="14px" stroke="none" x="38" xml:space="preserve" y="34.2188">JSON including</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath15)" font-family="sans-serif" font-size="14px" stroke="none" x="40" xml:space="preserve" y="50.3281">Sequence and</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath15)" font-family="sans-serif" font-size="14px" stroke="none" x="14" xml:space="preserve" y="66.4375">LastLedgerSequence.</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath15)" font-family="sans-serif" font-size="14px" stroke="none" x="13" xml:space="preserve" y="82.5469">(LastLedgerSequence</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath15)" font-family="sans-serif" font-size="14px" stroke="none" x="66" xml:space="preserve" y="98.6562">is &gt; A)</text></g><g transform="translate(50,40)"><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="10.25" cy="10.25" r="8.75" stroke="none"/><circle clip-path="url(#img/reliable-tx-submission.svg__clipPath4)" cx="10.25" cy="10.25" fill="none" r="8.75"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,60)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath16)" height="88.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(160,60)"><rect clip-path="url(#img/reliable-tx-submission.svg__clipPath16)" fill="none" height="88.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath16)" font-family="sans-serif" font-size="14px" stroke="none" x="39" xml:space="preserve" y="18.1094">Find the latest</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath16)" font-family="sans-serif" font-size="14px" stroke="none" x="9" xml:space="preserve" y="34.2188">validated ledger index.</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath16)" font-family="sans-serif" font-size="14px" stroke="none" x="31" xml:space="preserve" y="50.3281">Call this value A.</text></g><g transform="translate(50,260)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath17)" d="M39.5 290.5 L10.5 290.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath17)" d="M10.5 290.5 L10.5 190.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath17)" d="M10.5 190.5 L810.5 190.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath17)" d="M810.5 190.5 L810.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath17)" d="M810.5 10.5 L780.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath17)" d="M28.7417 284 L40 290.5 L28.7417 297" fill="none"/></g><g transform="translate(850,310)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath18)" d="M11.5 140.5 L300.5 140.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath18)" d="M300.5 140.5 L300.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath18)" d="M22.2583 147 L11 140.5 L22.2583 134" fill="none"/></g><g transform="translate(1140,120)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath19)" d="M10.5 109.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath19)" d="M17 98.7417 L10.5 110 L4 98.7417" fill="none"/></g><g transform="translate(440,250)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath20)" d="M209.5 20.5 L10.5 20.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath20)" d="M198.7417 14 L210 20.5 L198.7417 27" fill="none"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath20)" font-family="sans-serif" font-size="14px" stroke="none" x="47.0884" xml:space="preserve" y="16">[final outcomes of</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath20)" font-family="sans-serif" font-size="14px" stroke="none" x="46.2554" xml:space="preserve" y="32.1094">some transactions</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath20)" font-family="sans-serif" font-size="14px" stroke="none" x="49.5137" xml:space="preserve" y="48.2188">are not recorded]</text></g><g transform="translate(420,280)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath21)" d="M10.5 109.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath21)" d="M17 98.7417 L10.5 110 L4 98.7417" fill="none"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath21)" font-family="sans-serif" font-size="14px" stroke="none" x="14" xml:space="preserve" y="51.9453">[final outcomes of</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath21)" font-family="sans-serif" font-size="14px" stroke="none" x="14" xml:space="preserve" y="68.0547">all transactions</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath21)" font-family="sans-serif" font-size="14px" stroke="none" x="14" xml:space="preserve" y="84.1641">are recorded]</text></g><g transform="translate(330,260)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath22)" d="M79.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath22)" d="M68.7417 4 L80 10.5 L68.7417 17" fill="none"/></g><g transform="translate(50,230)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath23)" d="M109.5 40.5 L10.5 40.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath23)" d="M10.5 40.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath23)" d="M98.7417 34 L110 40.5 L98.7417 47" fill="none"/></g><g transform="translate(660,710)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath24)" d="M219.5 20.5 L10.5 20.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath24)" d="M208.7417 14 L220 20.5 L208.7417 27" fill="none"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath24)" font-family="sans-serif" font-size="14px" stroke="none" x="40.2563" xml:space="preserve" y="16">[Account Sequence is</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath24)" font-family="sans-serif" font-size="14px" stroke="none" x="30.229" xml:space="preserve" y="32.1094">greater than transaction </text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath24)" font-family="sans-serif" font-size="14px" stroke="none" x="78.7998" xml:space="preserve" y="48.2188">Sequence]</text></g><g transform="translate(620,880)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath25)" d="M69.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath25)" d="M58.7417 4 L70 10.5 L58.7417 17" fill="none"/></g><g transform="translate(370,880)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath22)" d="M79.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath22)" d="M68.7417 4 L80 10.5 L68.7417 17" fill="none"/></g><g transform="translate(240,740)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath26)" d="M10.5 119.5 L10.5 70.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath26)" d="M10.5 70.5 L410.5 70.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath26)" d="M410.5 70.5 L410.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath26)" d="M17 108.7417 L10.5 120 L4 108.7417" fill="none"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath26)" font-family="sans-serif" font-size="14px" stroke="none" x="135.2563" xml:space="preserve" y="66">[Account Sequence is </text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath26)" font-family="sans-serif" font-size="14px" stroke="none" x="139.0786" xml:space="preserve" y="82.1094">less than or equal to</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath26)" font-family="sans-serif" font-size="14px" stroke="none" x="131.7588" xml:space="preserve" y="98.2188">transaction Sequence]</text></g><g transform="translate(1240,240)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath27)" d="M11.5 10.5 L70.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath27)" d="M70.5 10.5 L70.5 310.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath27)" d="M70.5 310.5 L50.5 310.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath27)" d="M22.2583 17 L11 10.5 L22.2583 4" fill="none"/></g><g transform="translate(900,530)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath28)" d="M209.5 20.5 L10.5 20.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath28)" d="M198.7417 14 L210 20.5 L198.7417 27" fill="none"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath28)" font-family="sans-serif" font-size="14px" stroke="none" x="53.2847" xml:space="preserve" y="16">[server does not </text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath28)" font-family="sans-serif" font-size="14px" stroke="none" x="53.0781" xml:space="preserve" y="32.1094">have continuous </text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath28)" font-family="sans-serif" font-size="14px" stroke="none" x="62.2373" xml:space="preserve" y="48.2188">ledger history </text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath28)" font-family="sans-serif" font-size="14px" stroke="none" x="77.8384" xml:space="preserve" y="64.3281">from A to </text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath28)" font-family="sans-serif" font-size="14px" stroke="none" x="37.6694" xml:space="preserve" y="80.4375">LastLedgerSequence </text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath28)" font-family="sans-serif" font-size="14px" stroke="none" x="72.3545" xml:space="preserve" y="96.5469">(inclusive)]</text></g><g transform="translate(520,720)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath29)" d="M109.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath29)" d="M98.7417 4 L110 10.5 L98.7417 17" fill="none"/></g><g transform="translate(420,560)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath30)" d="M10.5 139.5 L10.5 90.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath30)" d="M10.5 90.5 L470.5 90.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath30)" d="M470.5 90.5 L470.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath30)" d="M17 128.7417 L10.5 140 L4 128.7417" fill="none"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath30)" font-family="sans-serif" font-size="14px" stroke="none" x="109.748" xml:space="preserve" y="86">[server has continuous ledger history </text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath30)" font-family="sans-serif" font-size="14px" stroke="none" x="94.6064" xml:space="preserve" y="102.1094">from A to LastLedgerSequence, inclusive]</text></g><g transform="translate(650,540)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath31)" d="M219.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath31)" d="M208.7417 4 L220 10.5 L208.7417 17" fill="none"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath31)" font-family="sans-serif" font-size="14px" stroke="none" x="27.748" xml:space="preserve" y="22.8906">[latest validated ledger </text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath31)" font-family="sans-serif" font-size="14px" stroke="none" x="8.458" xml:space="preserve" y="36">is ≥ LastLedgerSequence]</text></g><g transform="translate(630,240)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath32)" d="M551.5 10.5 L620.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath32)" d="M620.5 10.5 L620.5 270.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath32)" d="M620.5 270.5 L10.5 270.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath32)" d="M10.5 270.5 L10.5 290.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath32)" d="M562.2583 17 L551 10.5 L562.2583 4" fill="none"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath32)" font-family="sans-serif" font-size="14px" stroke="none" x="34" xml:space="preserve" y="249.7812">[latest validated ledger </text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath32)" font-family="sans-serif" font-size="14px" stroke="none" x="34" xml:space="preserve" y="262.8906">is &lt; LastLedgerSequence]</text></g><g transform="translate(160,700)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath33)" d="M10.5 39.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath33)" d="M17 28.7417 L10.5 40 L4 28.7417" fill="none"/></g><g transform="translate(160,560)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath34)" d="M10.5 99.5 L10.5 60.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath34)" d="M10.5 60.5 L230.5 60.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath34)" d="M230.5 60.5 L230.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath34)" d="M17 88.7417 L10.5 100 L4 88.7417" fill="none"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath34)" font-family="sans-serif" font-size="14px" stroke="none" x="70.8535" xml:space="preserve" y="56">[transaction is </text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath34)" font-family="sans-serif" font-size="14px" stroke="none" x="46.3052" xml:space="preserve" y="72.1094">in a validated ledger]</text></g><g transform="translate(400,530)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath24)" d="M219.5 20.5 L10.5 20.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath24)" d="M208.7417 14 L220 20.5 L208.7417 27" fill="none"/><text clip-path="url(#img/reliable-tx-submission.svg__clipPath24)" font-family="sans-serif" font-size="14px" stroke="none" x="35.8115" xml:space="preserve" y="16">[transaction not found,</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath24)" font-family="sans-serif" font-size="14px" stroke="none" x="63.6289" xml:space="preserve" y="32.1094">or is found in a</text><text clip-path="url(#img/reliable-tx-submission.svg__clipPath24)" font-family="sans-serif" font-size="14px" stroke="none" x="40.7212" xml:space="preserve" y="48.2188">non-validated ledger]</text></g><g transform="translate(260,540)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath29)" d="M109.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath29)" d="M98.7417 4 L110 10.5 L98.7417 17" fill="none"/></g><g transform="translate(1010,90)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath35)" d="M59.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath35)" d="M48.7417 4 L60 10.5 L48.7417 17" fill="none"/></g><g transform="translate(780,90)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath35)" d="M59.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath35)" d="M48.7417 4 L60 10.5 L48.7417 17" fill="none"/></g><g transform="translate(560,90)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath36)" d="M49.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath36)" d="M38.7417 4 L50 10.5 L38.7417 17" fill="none"/></g><g transform="translate(330,90)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath35)" d="M59.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath35)" d="M48.7417 4 L60 10.5 L48.7417 17" fill="none"/></g><g transform="translate(50,50)"><path clip-path="url(#img/reliable-tx-submission.svg__clipPath37)" d="M109.5 50.5 L10.5 50.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath37)" d="M10.5 50.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/reliable-tx-submission.svg__clipPath37)" d="M98.7417 44 L110 50.5 L98.7417 57" fill="none"/></g></g></svg></a></figure>


### Reliable Transactions Submission

Applications submitting transactions should use the following practices to submit reliably even in the event that a process dies or other failure occurs.  Application transaction results must be verified so that applications can act on the final, validated results.

Submission and verification are two separate procedures which may be implemented using the logic described in this document.

1. Submission - The transaction is submitted to the network and a provisional result is returned.
2. Verification - The authoritative result is determined by examining validated ledgers.


### Submission

[Persist](https://en.wikipedia.org/wiki/Persistence_%28computer_science%29) details of the transaction before submission, in case of power failure or network failure before submission completes.  On restart, the persisted values make it possible to verify the status of the transaction.

The submission process:

1. Construct and sign the transaction
    - Include `LastLedgerSequence` parameter
2. Persist the transaction details, saving:
    - Transaction hash
    - `LastLedgerSequence`
    - Sender address and sequence number
    - Latest validated ledger index at the time of submission
    - Application-specific data, as needed
3. Submit the transaction



### Verification

During normal operation, applications may check the status of submitted transactions by their hashes; or, depending on the API used, receive notifications when transactions have been validated (or failed).  This normal operation may be interrupted, for example by network failures or power failures.  In case of such interruption applications need to reliably verify the status of transactions which may or may not have been submitted to the network before the interruption.

On restart, or the determination of a new last validated ledger (pseudocode):

```
For each persisted transaction without validated result:
    Query transaction by hash
    If (result appears in any validated ledger)
        # Outcome is final
        Persist the final result
        If (result code is tesSUCCESS)
            Application may act based on successful transaction
        Else
            The transaction failed (1)
            If appropriate for the application and failure type, submit with
                new LastLedgerSequence and Fee

    Else if (LastLedgerSequence > newest validated ledger)
        # Outcome is not yet final
        Wait for more ledgers to be validated

    Else
        If (server has continuous ledger history from the ledger when the
              transaction was submitted up to and including the ledger
              identified by LastLedgerSequence)

            # Sanity check
            If (sender account sequence > transaction sequence)
                A different transaction with this sequence has a final outcome.
                Manual intervention suggested (3)
            Else
                The transaction failed (2)

        Else
            # Outcome is final, but not known due to a ledger gap
            Wait to acquire continuous ledger history
```

#### Failure Cases

The difference between the two transaction failure cases (labeled (1) and (2) in the pseudo-code) is whether the transaction was included in a validated ledger. In both cases, you should decide carefully how to process the failure.

- In failure case (1), the transaction was included in a ledger and destroyed the [XRP transaction cost](transaction-cost.html), but did nothing else. This could be caused by a lack of liquidity, improperly specified [paths](paths.html), or other circumstances. For many such failures, immediately retrying with a similar transaction is likely to have the same result. You may get different results if you wait for circumstances to change.

- In failure case (2), the transaction was not included in a validated ledger, so it did nothing at all, not even destroy the transaction cost. This could be the result of the transaction cost being too low for the current load on the XRP Ledger, the `LastLedgerSequence` being too soon, or it could be due to other conditions such as an unstable network connection.

    - In contrast to failure case (1), it is more likely that a new transaction is likely to succeed if you change only the `LastLedgerSequence` and possibly the `Fee` and submit again. Use the same `Sequence` number as the original transaction.

    - It is also possible that the transaction could not succeed due to the state of the ledger, for example because the sending address disabled the key pair used to sign the transaction. If the transaction's provisional result was a [`tef`-class code](tef-codes.html), the transaction is less likely to succeed without further modification.

- Failure case (3) represents an unexpected state. When a transaction is not processed, you should check the  `Sequence` number of the sending account in the most recent validated ledger. (You can use the [account_info method][] to do so.) If the account's `Sequence` value in the latest validated ledger is higher than the transaction's `Sequence` value, then a different transaction with the same `Sequence` value has been included in a validated ledger. If your system is not aware of the other transaction, you are in an unexpected state and should stop processing until you have determined why that has happened; otherwise, your system might send multiple transactions to accomplish the same goal. The steps you should take depend on specifically what caused it. Some possibilities include:

    - The previously-sent transaction was [malleable](transaction-malleability.html) and it actually was included in a validated ledger, but with a different hash than you expected. This can happen if you specify a set of flags that do not include the `tfFullyCanonicalSig` flag or if the transaction is multi-signed by more signers than necessary. If this is the case, save the different hash and the final outcome of the transaction, then resume normal activities.

    - You [canceled](cancel-or-skip-a-transaction.html) and replaced the transaction, and the replacement transaction was processed instead. If you are recovering from an outage, it's possible you may have lost record of the replacement transaction. If this is the case, the transaction you were originally looking up has failed permanently, and the final outcome of the replacement transaction is recorded in a validated ledger version. Save both final outcomes, check for any other missing or replaced transactions, then resume normal activities.

    - If you have two or more transaction-sending systems in an active/passive failover configuration, it's possible that the passive system mistakenly believes the active system has failed, and has become active while the original active system is still also sending transactions. Check the connectivity between the systems and ensure that at most one of them is active. Check your account's transaction history (for example, with the [account_tx method][]) and record the final outcome of all transactions that were included in validated ledgers. Any different transactions with the same `Sequence` numbers have failed permanently; save those final outcomes as well. When you have finished reconciling the differences from all the systems and have resolved the issues that made the systems activate simultaneously, resume normal activities.

        **Tip:** The [`AccountTxnID` field](transaction-common-fields.html#accounttxnid) can help prevent redundant transactions from succeeding in this situation.

    - A malicious actor may have used your secret key to send a transaction. If this is the case, [rotate your key pair](change-or-remove-a-regular-key-pair.html) if you can, and check for other transactions sent. You should also audit your network to determine if the secret key was part of a larger intrusion or security leak. When you successfully rotate your key pair and are certain that the malicious actor no longer has access to your accounts and systems, you can resume normal activities.


#### Ledger Gaps

If your server does not have continuous ledger history from when the transaction was originally submitted up to and including the ledger identified by `LastLedgerSequence`, you may not know the final outcome of the transaction. (If it was included in one of the ledger versions your server is missing, you do not know whether it succeeded or failed.)

Your `rippled` server should automatically acquire the missing ledger versions when it has spare resources (CPU/RAM/disk IO) to do so, unless the ledgers are older than its [configured amount of history to store](ledger-history.html). Depending on the size of the gap and the resource usage of your server, acquiring missing ledgers should take a few minutes. You can request your server to acquire historical ledger versions using the [ledger_request method][], but even so you may not be able to look up transaction outcomes from ledger versions that are outside of your server's configured history range.

Alternatively, you can look up the status of the transaction using a different `rippled` server that already has the needed ledger history, such as Ripple's full-history servers at `s2.ripple.com`. Only use a server you trust for this purpose. A malicious server could be programmed to provide false information about the status and outcome of a transaction.


## Technical Application

To implement the transaction submission and verification best practices, applications need to do the following:

1. Determine the signing account's next sequence number
    * Each transaction has an account-specific [sequence number](basic-data-types.html#account-sequence).  This guarantees the order in which transactions signed by an account are executed and makes it safe to resubmit a transaction without danger of the transaction being applied to the ledger more than once.
3. Decide on a `LastLedgerSequence`
     * A transaction's `LastLedgerSequence` is calculated from the last validated ledger index.
3. Construct and sign the transaction
    * Persist the details of a signed transaction before submission.
4. Submit the transaction
    * Initial results are provisional and subject to change.
5. Determine the final result of a transaction
    * Final results are an immutable part of the ledger history.

How the application does these actions depends on the API the application uses.  An application may use any of the following interfaces:

- The [HTTP / WebSocket APIs](rippled-api.html) provided directly by XRP Ledger servers
- A [client library](client-libraries.html)
- Other middleware or APIs layered on top of the above APIs


### rippled - Submitting and Verifying Transactions

#### Determine the Account Sequence

`rippled` provides the [account_info method][] to learn an account's sequence number in the last validated ledger.

JSON-RPC Request:

```json
{
  "method": "account_info",
  "params": [
    {
      "account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
      "ledger": "validated"
    }
  ]
}
```

Response body:

```json
{
    "result": {
        "validated": true,
        "status": "success",
        "ledger_index": 10266396,
        "account_data": {
            "index": "96AB97A1BBC37F4F8A22CE28109E0D39D709689BDF412FE8EDAFB57A55E37F38",
            "Sequence": 4,
            "PreviousTxnLgrSeq": 9905632,
            "PreviousTxnID": "CAEE0E34B3DB50A7A0CA486E3A236513531DE9E52EAC47CE4C26332CC847DE26",
            "OwnerCount": 2,
            "LedgerEntryType": "AccountRoot",
            "Flags": 0,
            "Balance": "49975988",
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        }
    }
}
```

In this example, the account's sequence is **4** (note `"Sequence": 4`, in `"account_data"`) as of the last validated ledger (note `"ledger": "validated"` in the request, and `"validated": "true"` in the response).

If an application were to submit three transactions signed by this account, they would use sequence numbers 4, 5, and 6.  To submit multiple transactions without waiting for validation of each, an application should keep a running account sequence number.


#### Determine the Last Validated Ledger

The [server_state method][] returns the ledger index of the last validated ledger.

Request:

```json
{
  "id": "client id 1",
  "method": "server_state"
}
```

Response:

```json
{
    "result": {
        "status": "success",
        "state": {
            "validation_quorum": 3,
            "validated_ledger": {
                "seq": 10268596,
                "reserve_inc": 5000000,
                "reserve_base": 20000000,
                "hash": "0E0901DA980251B8A4CCA17AB4CA6C3168FE83FA1D3F781AFC5B9B097FD209EF",
                "close_time": 470798600,
                "base_fee": 10
            },
            "server_state": "full",
            "published_ledger": 10268596,
            "pubkey_node": "n9LGg37Ya2SS9TdJ4XEuictrJmHaicdgTKiPJYi8QRSdvQd3xMnK",
            "peers": 58,
            "load_factor": 256000,
            "load_base": 256,
            "last_close": {
                "proposers": 5,
                "converge_time": 3004
            },
            "io_latency_ms": 2,
            "fetch_pack": 10121,
            "complete_ledgers": "10256331-10256382,10256412-10268596",
            "build_version": "0.26.4-sp3-private"
        }
    }
}
```

In this example the last validated ledger index is 10268596 (found under `result.state.validated_ledger` in the response).  Note also this example indicates a gap in ledger history.  The server used here would not be able to provide information about the transactions applied during that gap (ledgers 10256383 through 10256411).  If configured to do so, the server eventually retrieves that part of the ledger history.


#### Construct the Transaction

`rippled` provides the [sign method][] to prepare a transaction for submission.  This method requires an account secret, which should only be passed to trusted `rippled` instances.  This example issues 10 FOO (a made-up currency) to another XRP Ledger address.

Request:

```json
{
    "method": "sign",
    "params": [
        {
            "offline": true,
            "secret": "s████████████████████████████",
            "tx_json": {
               "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "Sequence": 4,
                "LastLedgerSequence": 10268600,
                "Fee": 10000,
                "Amount": {
                    "currency": "FOO",
                    "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                    "value": "10"
                },
                "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
                "TransactionType": "Payment"
            }
        }
    ]
}
```

Notice the application specifies the account sequence `"Sequence": 4`, learned from an earlier call to `account_info`, to avoid `tefPAST_SEQ` errors.

Notice also the `LastLedgerSequence` based on the last validated ledger our application learned from `server_state`.  The recommendation for backend applications is to use *(last validated ledger index + 4)*. Alternately, use a value of *(current ledger + 3)*.  If `LastLedgerSequence` is miscalculated and less than the last validated ledger, the transaction fails with `tefMAX_LEDGER` error.

Response:

```json
{
    "result": {
        "tx_json": {
            "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
            "TransactionType": "Payment",
            "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
            "Sequence": 4,
            "LastLedgerSequence": 10268600,
            "Flags": 2147483648,
            "Fee": "10000",
            "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
            "Amount": {
                "value": "10",
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO"
            },
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        },
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C",
        "status": "success"
    }
}
```

Applications should persist the transaction's hash before submitting.  The result of the `sign` method includes the hash under `tx_json`.



#### Submit the transaction

`rippled` provides the [submit method][], allowing us to submit the signed transaction.  This uses the `tx_blob` parameter that was returned by the `sign` method.

Request:

```json
{
    "method": "submit",
    "params": [
        {
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C"
        }
    ]
}
```

Response:

```json
{
    "result": {
        "tx_json": {
            "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
            "TransactionType": "Payment",
            "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
            "Sequence": 4,
            "LastLedgerSequence": 10268600,
            "Flags": 2147483648,
            "Fee": "10000",
            "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
            "Amount": {
                "value": "10",
                "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
                "currency": "FOO"
            },
            "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
        },
        "tx_blob": "12000022800000002400000004201B009CAFB861D4C38D7EA4C68000000000000000000000000000464F4F0000000000AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A68400000000000271073210267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC57446304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C7538114AC5FA3BB28A09BD2EC1AE0EED2315060E83D796A831438BC6F9F5A6F6C4E474DB0D59892E90C2C7CED5C",
        "status": "success",
        "engine_result_message": "The transaction was applied.",
        "engine_result_code": 0,
        "engine_result": "tesSUCCESS"
    }
}
```

This a **preliminary** result.  Final results are only available from validated ledgers.  The lack of a `"validated": true` field indicates that this is **not an immutable result**.


#### Verify the Transaction

The transaction hash, generated when the transaction was signed, is passed to the [tx method][] to retrieve the result of a transaction.

Request:

```json
{
    "method": "tx",
    "params": [
        {
            "transaction": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
            "binary": false
        }
    ]
}
```

Response:

```json
{
    "result": {
        "validated": true,
        "status": "success",
        "meta": {
            "TransactionResult": "tesSUCCESS",
            "TransactionIndex": 2,
            "AffectedNodes": [...]
        },
        "ledger_index": 10268599[d],
        "inLedger": 10268599,
        "hash": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE57",
        "date": 470798270,
        "TxnSignature": "304402202646962A21EC0516FCE62DC9280F79E7265778C571E9410D795E67BB72A2D8E402202FF4AF7B2E2160F5BCA93011CB548014626CAC7FCBEBDB81FE8193CEFF69C753",
        "TransactionType": "Payment",
        "SigningPubKey": "0267268EE0DDDEE6A862C9FF9DDAF898CF17060A673AF771B565AA2F4AE24E3FC5",
        "Sequence": 4,
        "LastLedgerSequence": 10268600,
        "Flags": 2147483648,
        "Fee": "10000",
        "Destination": "rawz2WQ8i9FdTHp4KSNpBdyxgFqNpKe8fM",
        "Amount": {
            "value": "10",
            "issuer": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W",
            "currency": "FOO"
        },
        "Account": "rG5Ro9e3uGEZVCh3zu5gB9ydKUskCs221W"
    }
}
```

This example response shows `"validated": true`, indicating the transaction has been included in a validated ledger, so the result of the transaction is immutable.  Further, the metadata includes `"TransactionResult": "tesSUCCESS"`, indicating the transaction was applied to the ledger.

If the response does not include `"validated": true`, the result is provisional and subject to change.  To retrieve a final result, applications must invoke the `tx` method again, allowing enough time for the network to validate more ledger versions.  It may be necessary to wait for the ledger specified in `LastLedgerSequence` to be validated, although if the transaction is included in an earlier validated ledger the result becomes immutable at that time.


#### Verify Missing Transaction

Applications must handle cases where a call to the [tx method][] returns a `txnNotFound` error.

```json
{
    "result": {
        "status": "error",
        "request": {
            "transaction": "395C313F6F11F70FEBAF3785529A6D6DE3F44C7AF679515A7EAE22B30146DE56",
            "command": "tx",
            "binary": false
        },
        "error_message": "Transaction not found.",
        "error_code": 24,
        "error": "txnNotFound"
    }
}
```

The `txnNotFound` result code occurs in cases where the transaction is not included in any ledger.  However, it could also occur when a `rippled` instance does not have a complete ledger history, or if the transaction has not yet propagated to the `rippled` instance.  Applications should make further queries to determine how to react.

The [server_state method][] (used earlier to determine the last validated ledger) indicates how complete the ledger history is, under `result.state.complete_ledgers`.

```json
{
    "result": {
        "status": "success",
        "state": {
            "validation_quorum": 3,
            "validated_ledger": {
                "seq": 10269447,
                "reserve_inc": 5000000,
                "reserve_base": 20000000,
                "hash": "D05C7ECC66DD6F4FEA3A6394F209EB5D6824A76C16438F562A1749CCCE7EAFC2",
                "close_time": 470802340,
                "base_fee": 10
            },
            "server_state": "full",
            "pubkey_node": "n9LJ5eCNjeUXQpNXHCcLv9PQ8LMFYy4W8R1BdVNcpjc1oDwe6XZF",
            "peers": 84,
            "load_factor": 256000,
            "load_base": 256,
            "last_close": {
                "proposers": 5,
                "converge_time": 2002
            },
            "io_latency_ms": 1,
            "complete_ledgers": "10256331-10256382,10256412-10269447",
            "build_version": "0.26.4-sp3-private"
        }
    }
}
```

Our example transaction specified `LastLedgerSequence` 10268600, based on the last validated ledger at the time, plus four.  To determine whether our missing transaction has permanently failed, our `rippled` server must have ledgers 10268597 through 10268600.  If the server has those validated ledgers in its history, **and** `tx` returns `txnNotFound`, then the transaction has failed and cannot be included in any future ledger.  In this case, application logic may dictate building and submitting a replacement transaction with the same account sequence and updated `LastLedgerSequence`.

The server may report a last validated ledger index less than the specified `LastLedgerSequence`.  If so, the `txnNotFound` indicates either (a) the submitted transaction has not been distributed to the network, or (b) the transaction has been distributed to the network but has not yet been processed.  To handle the former case, applications may submit again the same signed transaction.  Because the transaction has a unique account sequence number, it can be processed at most once.

Finally the server may show one or more gaps in the transaction history. The `completed_ledgers` field shown in the response above indicates that ledgers 10256383 through 10256411 are missing from this rippled instance.  Our example transaction can only appear in ledgers 10268597 - 10268600 (based on when it was submitted and `LastLedgerSequence`), so the gap shown here is not relevant.  However, if the gap indicated a ledger in that range was missing, then an application would need to query another rippled server (or wait for this one to retrieve the missing ledgers) to determine that a `txnNotFound` result is immutable.


## Additional Resources

- [Transaction Formats](transaction-formats.html)
- [Transaction Cost](transaction-cost.html)
- [Transaction Malleability](transaction-malleability.html)
- [Overview of XRP Ledger Consensus Process](consensus.html)
- [Consensus Principles and Rules](consensus-principles-and-rules.html)

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
