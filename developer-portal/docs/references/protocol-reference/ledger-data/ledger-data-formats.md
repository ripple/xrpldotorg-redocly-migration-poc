# Ledger Data Formats

Each [ledger version](ledgers.html) in the XRP Ledger is made up of three parts:

- **[Ledger Header](ledger-header.html)**: Metadata about this ledger version itself.
- **[Transaction Set](transaction-formats.html)**: All the transactions that were executed to create this ledger version.
- **[State Data](ledger-object-types.html)**: The complete record of objects representing accounts, settings, and balances as of this ledger version. (This is also called the "account state".)

## State Data

Each [ledger version](ledgers.html)'s state data is a set of **ledger objects**, sometimes called _ledger entries_, which collectively represent all settings, balances, and relationships at a given point in time. To store or retrieve an object in the state data, the protocol uses that object's unique **[Ledger Object ID](ledger-object-ids.html)**.

In the [peer protocol](peer-protocol.html), ledger objects have a [canonical binary format](serialization.html). In `rippled` APIs, ledger objects are represented as JSON objects.

A ledger object's data fields depend on the type of object; the XRP Ledger supports the following types:




<ul class="children-display">
  
<li class="level-1"><a href="accountroot.html">AccountRoot</a>
  
  <p class="blurb child-blurb">The settings, XRP balance, and other metadata for one account.</p>
</li>
  
  
<li class="level-1"><a href="amendments-object.html">Amendments</a>
  
  <p class="blurb child-blurb">Singleton object with status of enabled and pending amendments.</p>
</li>
  
  
<li class="level-1"><a href="check.html">Check</a>
  
  <p class="blurb child-blurb">A check that can be redeemed for money by its destination.</p>
</li>
  
  
<li class="level-1"><a href="depositpreauth-object.html">DepositPreauth</a>
  
  <p class="blurb child-blurb">A record of preauthorization for sending payments to an account that requires authorization.</p>
</li>
  
  
<li class="level-1"><a href="directorynode.html">DirectoryNode</a>
  
  <p class="blurb child-blurb">Contains links to other objects.</p>
</li>
  
  
<li class="level-1"><a href="escrow-object.html">Escrow</a>
  
  <p class="blurb child-blurb">Contains XRP held for a conditional payment.</p>
</li>
  
  
<li class="level-1"><a href="feesettings.html">FeeSettings</a>
  
  <p class="blurb child-blurb">Singleton object with consensus-approved base transaction cost and reserve requirements.</p>
</li>
  
  
<li class="level-1"><a href="ledgerhashes.html">LedgerHashes</a>
  
  <p class="blurb child-blurb">Lists of prior ledger versions' hashes for history lookup.</p>
</li>
  
  
<li class="level-1"><a href="negativeunl.html">NegativeUNL</a>
  
  <p class="blurb child-blurb">List of validators currently believed to be offline.</p>
</li>
  
  
<li class="level-1"><a href="nftokenoffer.html">NFTokenOffer</a>
  <span class="status not_enabled" title="This feature is not currently enabled on the production XRP Ledger."><i class="fa fa-flask"></i></span>
  <p class="blurb child-blurb">Create offers to buy or sell NFTs.</p>
</li>
  
  
<li class="level-1"><a href="nftokenpage.html">NFTokenPage</a>
  <span class="status not_enabled" title="This feature is not currently enabled on the production XRP Ledger."><i class="fa fa-flask"></i></span>
  <p class="blurb child-blurb">Ledger structure for recording NFTokens.</p>
</li>
  
  
<li class="level-1"><a href="offer.html">Offer</a>
  
  <p class="blurb child-blurb">An order to make a currency trade.</p>
</li>
  
  
<li class="level-1"><a href="paychannel.html">PayChannel</a>
  
  <p class="blurb child-blurb">A channel for asynchronous XRP payments.</p>
</li>
  
  
<li class="level-1"><a href="ripplestate.html">RippleState</a>
  
  <p class="blurb child-blurb">Links two accounts, tracking the balance of one currency between them. The concept of a trust line is an abstraction of this object type.</p>
</li>
  
  
<li class="level-1"><a href="signerlist.html">SignerList</a>
  
  <p class="blurb child-blurb">A list of addresses for multi-signing transactions.</p>
</li>
  
  
<li class="level-1"><a href="ticket.html">Ticket</a>
  
  <p class="blurb child-blurb">A Ticket tracks an account sequence number that has been set aside for future use.</p>
</li>
  
  

</ul><!--/.children-display-->

