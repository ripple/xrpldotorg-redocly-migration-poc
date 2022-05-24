---
seo:
  title: Become an XRP Ledger Gateway
redirectFrom:
  - /docs/tutorials/xrp-ledger-businesses/
---
# Become an XRP Ledger Gateway

**Gateways** are the businesses that link the XRP Ledger to the rest of the world. An existing online financial institution can expand to act as a gateway in the the XRP Ledger. By becoming an XRP Ledger gateway, a financial services business can gain several advantages:

* By enabling its customers to send and receive value in the XRP Ledger, the business increases its value proposition to customers.
* By accepting payments from the XRP Ledger, the business increases the number of ways that customers can fund accounts at its business, even internationally.
* The business can use XRP Ledger-related services as a new source of revenue.

This document explains the concepts and steps necessary to become an XRP Ledger gateway. In this document, we use a fictional online currency exchange named "ACME" and its customers as examples, to show how ACME can expand its business to include being an XRP Ledger gateway.


## Gateways Explained

Gateways are businesses that provide a way for money and other forms of value to move in and out of the XRP Ledger. There are three major models that gateways can follow, with different purposes and modes of operation.

* An **Issuing Gateway** receives money (or other assets of value) outside of the XRP Ledger, and issues currency in the XRP Ledger. This provides a direct way for customers to get money in and out of the XRP Ledger. All currencies in the XRP Ledger, except for XRP, are tied to a specific issuing gateway.
* A **Private Exchange** holds XRP and lets its customers buy and sell that XRP in its own system. Most cryptocurrencies rely on private exchanges to provide a market for the cryptocurrency, but the XRP Ledger has a currency exchange built into the protocol itself.
* **Merchants** accept payment within the XRP Ledger in exchange for goods and services in the outside world. Currently, Ripple (the company) does not provide support for merchant operations using the XRP Ledger.
<!--_ -->

This guide focuses on running an **issuing gateway**.

### Trust Lines and Issued Currencies

All assets in the XRP Ledger, except for the native cryptocurrency XRP, are represented as _issued currencies_, which are digital balances that represent currency or assets of value held by an issuer. The XRP Ledger has a system of directional accounting relationships, called _trust lines_, to make sure that users only hold issued currencies from counterparties they trust.

Main article: [Trust Lines and Issuing](trust-lines-and-issuing.html).


### XRP

[**XRP**](xrp.html) is the native cryptocurrency of the XRP Ledger. XRP can be sent directly from any XRP Ledger address to any other, without going through a gateway or liquidity provider. This helps make XRP a convenient bridge currency. For more information on XRP, see the [XRP Overview](xrp-overview.html).

Issuing gateways do not need to accumulate or exchange XRP. They must only hold a small balance of XRP to meet the [reserve requirements](reserves.html) and pay the [cost of sending transactions](transaction-cost.html) through the network. The XRP equivalent of $10 USD should be enough for at least one year of transaction costs for a busy gateway.

Main article: [XRP](xrp.html).


### Liquidity and Currency Exchange

The XRP Ledger contains a [decentralized asset exchange](decentralized-exchange.html), where any user can place and fulfill bids to exchange XRP and issued currencies in any combination. [Cross-currency payments](cross-currency-payments.html) use the decentralized exchange to convert currency atomically when the transaction is executed. In this way, users who choose make offers in the decentralized exchange provide the liquidity that makes it possible to trade issued currencies.

Currency traders who hold a gateway's issued currencies can provide liquidity to other popular currencies, without the gateway needing to float a large reserve in various destination currencies. The gateway also does not need to take on the risk of holding a variety of currencies. However, a gateway _may_ still want to provide liquidity to XRP or other popular currencies at a baseline rate, especially when the gateway is new to the exchange. If you do provide liquidity, **use a different address for trading than your issuing address.**

Liquidity providers can use the [HTTP / WebSocket APIs](rippled-api.html), [client libraries](client-libraries.html), or another application to access the distributed exchange. It may also help client applications to surface information about your gateway to clients if you provide an [`xrp-ledger.toml` file](xrp-ledger-toml.html).



## Suggested Business Practices

The value of a gateway's issued currency in the XRP Ledger comes directly from the trust that customers can redeem the issued balance from the gateway when needed. We recommend the following precautions to reduce the risk of business interruptions:

* Use separate [Issuing and Operational Addresses](issuing-and-operational-addresses.html) to limit your risk profile on the network.
* Follow anti-money-laundering regulations for your jurisdiction, such as the [Bank Secrecy Act](http://en.wikipedia.org/wiki/Bank_Secrecy_Act). This usually includes requirements to collect ["Know-Your-Customer" (KYC) information](http://en.wikipedia.org/wiki/Know_your_customer).
* Read and stay up-to-date with [Gateway Bulletins](#gateway-bulletins), which provide news and suggestions for XRP Ledger gateways.
* Publicize all your policies and fees.


### Hot and Cold Wallets

In the XRP Ledger, financial institutions typically use multiple XRP Ledger addresses to minimize the risk associated with a compromised secret key. The industry standard is to separate roles as follows:

* One **issuing address**, also known as a "cold wallet." This address is the hub of the financial institution's accounting relationships in the ledger, but sends as few transactions as possible. <!-- STYLE_OVERRIDE: cold wallet, wallet -->
* One or more **operational addresses**, also known as "hot wallets." Automated, internet-connected systems use the secret keys to these addresses to conduct day-to-day business like transfers to customers and partners. <!-- STYLE_OVERRIDE: hot wallet, wallet -->
* Optional **standby addresses**, also known as "warm wallets." Trusted human operators use these addresses to transfer money to the operational addresses. <!-- STYLE_OVERRIDE: warm wallet, wallet -->
<!---->

Main article: [Issuing and Operational Addresses](issuing-and-operational-addresses.html)


## Fees and Revenue Sources

There are several ways in which a gateway can seek to profit from XRP Ledger integration. These can include:

* Withdrawal and Deposit fees. Gateways typically charge a small fee (such as 1%) for the service of adding or removing money from the XRP Ledger. You have the power to determine the rate you credit people when they move money onto and off of the XRP Ledger through your gateway.
* Transfer fees. You can set a percentage fee to charge automatically when customers send each other issued currencies created by your issuing address. This amount is debited from the XRP Ledger, decreasing your obligation each time your issued currencies change hands. See [Transfer Fees](#transfer-fees) for details.
* Indirect revenue from value added. XRP Ledger integration can provide valuable functionality for your customers that distinguishes your business from your competitors.
* Interest on XRP Ledger-backed funds. You can keep the collateral for the funds you issue in XRP Ledger in a bank account that earns interest. Make sure you can always access enough funds to service customer withdrawals.
* [Financial Exchange](#liquidity-and-currency-exchange). A gateway can also make offers to buy and sell its issued currencies for other issued currencies in the XRP Ledger, providing liquidity to cross-currency payments and possibly making a profit. (As with all financial exchange, profits are not guaranteed.)


### Choosing Fee Rates

Fees imposed by gateways are optional. Higher fees earn more revenue when a gateway's services are used. On the other hand, high fees discourage customers from using your services. Consider the fees that are charged by other gateways, especially ones issuing similar currencies, as well as traditional payment systems outside of the XRP Ledger, such as wire fees. Choosing the right fee structure is a matter of balancing your pricing with what the market is willing to pay.


## Gateway Compliance

Gateways are responsible for complying with local regulations and reporting to the appropriate agencies. Regulations vary by country and state, but may include the reporting and compliance requirements described in the following sections.

### Know Your Customer (KYC)

Know Your Customer (KYC) refers to due diligence activities conducted by a financial institution to determine and verify the identity of its customers to prevent use of the institution for criminal activity. Criminal activity in financial terms may include money laundering, terrorist financing, financial fraud, and identity theft. Customers may be individuals, intermediaries, or businesses.

The KYC process generally aims to:

- Identify the customer (and, in the case of organizations and businesses, any beneficial owners)

- Understand the purpose and intended nature of the business relationship

- Understand the expected transaction activity.

KYC is critical for financial institutions and related businesses to mitigate risk, especially legal and reputational risk. Having an inadequate or nonexistent KYC program may result in civil and criminal penalties for the institution or individual employees.

See also:

- [Customer Identification Program (USA FFIEC)](https://bsaaml.ffiec.gov/manual/RegulatoryRequirements/01)

- [The Non-US Standard on KYC set by the Financial Action Task Force (FATF)](http://www.fatf-gafi.org/publications/fatfrecommendations/documents/fatf-recommendations.html)

<!-- SPELLING_IGNORE: ffiec -->

### Anti-Money Laundering (AML) and Combating the Financing of Terrorism (CFT)

Money laundering is the process of moving illegal funds by disguising the source, nature or ownership so that funds can be legally accessed or distributed via legitimate financial channels and credible institutions. In short, it is converting “dirty money” into “clean money.” Anti-Money Laundering (AML) refers to the laws and procedures designed to stop money laundering from occurring.

Terrorist financing is the solicitation, collection, or provision of funds to organizations engaged in terrorist activity or organizations that support terrorism and its proliferation. Combating the Financing of Terrorism (CFT) refers to the process of identifying, reporting, and blocking flows of funds used to finance terrorism.

See also:

- [“International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation.” FATF, 2012](http://www.fatf-gafi.org/publications/fatfrecommendations/documents/fatf-recommendations.html)

- [“Virtual Currencies: Key Definitions and Potential AML/CFT Risks.” FATF, 2014](http://www.fatf-gafi.org/publications/methodsandtrends/documents/virtual-currency-definitions-aml-cft-risk.html)

<!-- SPELLING_IGNORE: fatf, cft -->

### Source of Funds

To prevent illicit funds from passing through their systems, financial institutions must be able to determine within reason if the source of a customer’s funds is linked to criminal activity.

Determining the exact source of funds for every customer may not be administratively feasible. As a result, some regulatory authorities may not provide specific regulation or guidance for all accounts. In specific cases, however, authorities may require financial institutions to identify and report the source of funds. Guidance by the FATF recommends that where the risks of money laundering or terrorist financing are higher (commonly referred to as a “risk-based approach”), financial institutions conduct enhanced due diligence, including but not limited to determining the customer’s source of funds.

<!-- STYLE_OVERRIDE: feasible -->

### Suspicious Activity Reporting

If a financial institution suspects that funds may be related to criminal activity, the institution must file a Suspicious Activity Report (SAR) with the appropriate regulatory authority. Failure to report suspicious activity may result in in penalties for the institution.

See also:

- [Suspicious Activity Reporting Overview (USA FFIEC)](https://bsaaml.ffiec.gov/manual/RegulatoryRequirements/04_ep)

- [FATF Recommendation 16: Reporting of suspicious transactions and compliance](http://www.fatf-gafi.org/publications/fatfrecommendations/documents/fatf-recommendations.html)

### Travel Rule

The Travel Rule is a Bank Secrecy Act (BSA) rule requiring funds-transmitting financial institutions to forward certain information to the next financial institution if the funds transmittal equals or exceeds the USD equivalent of $3,000. The following information must be included in the transmittal order:

- The name of the transmittor,
- The account number of the transmittor, if used,
- The address of the transmittor,
- The identity of the transmittor's financial institution,
- The amount of the transmittal order,
- The execution date of the transmittal order, and
- The identity of the recipient's financial institution.

<!-- SPELLING_IGNORE: transmittor -->

See also:

- [Funds “Travel” Regulations: Questions & Answers ](https://www.fincen.gov/resources/statutes-regulations/guidance/funds-travel-regulations-questions-answers)

### Fee Disclosure and Tracing Funds

- In the United States, Dodd Frank 1073 Electronic Fund Transfer Act (Regulation E) requires banks to provide information on cost and delivery terms for international payments originating in the US including exchange rate, fees, and the amount to be received by the designated recipient in the foreign country. "Pre-payment disclosure" is provided to a consumer when requesting an international electronic payment and “receipt disclosure” is provided to a consumer at the time consumer authorizes the transfer.

    See also:

    - [The Consumer Financial Protection Bureau description of the regulation and extensions for banks](https://www.consumerfinance.gov/rules-policy/final-rules/electronic-fund-transfers-regulation-e/#rule)

- In the European Union, EU Funds Transfer Regulation requires that the originator’s bank, the beneficiary’s bank, and any intermediary banks include certain details of the payer and payee in transaction details to detect, investigate, and prevent money laundering and terrorist financing.

    See also:

    - [EU Regulation (EC) No 1781/2006 description](http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2006:345:0001:0009:EN:PDF)

    - [Effective June 26, 2017: Regulation 2015/847 on information accompanying transfers of funds](http://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32015R0847)

### Office of Foreign Assets Control (OFAC)

The Office of Foreign Assets Control (OFAC) is an agency of the US Department of Treasury that administers and enforces economic and trade sanctions in support of U.S. foreign policy and national security objectives. All U.S. persons and U.S. incorporated entities and their foreign branches must follow OFAC regulations. Under OFAC regulations, U.S. financial institutions are prohibited—unless authorized by OFAC or expressly exempted by statute—from conducting transactions and other dealings with individuals, entities, or countries under sanctions or embargo programs administered and enforced by OFAC.

See also:

- [A list of OFAC resources](https://www.treasury.gov/resource-center/faqs/Sanctions/Pages/ques_index.aspx)

<!-- SPELLING_IGNORE: ofac -->

### Guidance on Virtual Currency and Money Service Business

- United States:

    - [FinCEN Guidance and Definitions around Virtual Currency, March 18, 2013](https://www.fincen.gov/resources/statutes-regulations/guidance/application-fincens-regulations-persons-administering)

    - [FinCEN Publishes Two Rulings on Virtual Currency Miners and Investors, January 30, 2014](https://www.fincen.gov/news/news-releases/fincen-publishes-two-rulings-virtual-currency-miners-and-investors)

- Europe:

    - [European Banking Authority Opinion on Virtual Currencies, July 4, 2014](http://www.eba.europa.eu/documents/10180/657547/EBA-Op-2014-08+Opinion+on+Virtual+Currencies.pdf)

- FATF Guidance for Money Service Businesses:

    - [Financial Action Task Force, July 2009](http://www.fatf-gafi.org/media/fatf/documents/reports/Guidance-RBA-money-value-transfer-services.pdf)




# XRP Ledger Integration

## Before Integration

Our example exchange, ACME, already accepts withdrawals and deposits from customers using some existing system, and uses its own system of record to track how much balance each user has with the exchange. Such a system can be modeled with a balance sheet and tracking how much currency each user has with ACME.

In the following diagram, ACME Exchange starts with €5 on hand, including €1 that belongs to Bob, €2 that belongs to Charlie, and an additional €2 of equity that belongs to ACME itself. Alice deposits €5, so ACME adds her to its balance sheet and ends up with €10.

![Diagram: Alice sends €5 to ACME. ACME adds her balance to its balance sheet.](img/e2g-01.png)

**Assumptions:** To integrate with the XRP Ledger, we assume that an exchange such as ACME meets the following assumptions:

* ACME already has a system to accept deposits and withdrawals from some outside payment source.
* ACME waits for deposits to clear before crediting them in ACME's system of record.
* ACME always keeps enough funds on-hand to pay withdrawals on demand, subject to their terms and conditions.
    * ACME can set fees, minimum withdrawals, and delay times for deposits and withdrawals as their business model demands.

## Sending from Gateway to the XRP Ledger

XRP Ledger payments can automatically bridge between currencies, but an issuing gateway normally only sends single-currency payments that go directly to customers. This means debiting a customer's current balance in your system, and then sending the equivalent amount of issued currencies in the XRP Ledger to the customer's XRP Ledger address.

An example flow for a payment into the XRP Ledger:

1. Alice asks to send €3 of her ACME balance into the XRP Ledger.
2. In its system of record, ACME debits Alice's balance €3.
3. ACME submits an XRP Ledger transaction, sending €3 to Alice's XRP Ledger address. The €3 is marked in the XRP Ledger as being "issued" by ACME (3 EUR.ACME).

**Assumptions:**

* Alice already has an address in the XRP Ledger separate from her ACME account. Alice manages her XRP Ledger address using a third-party client application.

![Diagram: ACME issues 3 EUR.ACME to Alice on the XRP Ledger](img/e2g-02.png)

<!---->



### Requirements for Sending to XRP Ledger

There are several prerequisites that ACME must meet for this to happen:

- ACME sets aside money that is issued in the XRP Ledger. ACME can query the XRP Ledger to see who holds its issued currencies at any time. There are several ways ACME may do this:
    - ACME may create a XRP Ledger collateral account in ACME's system of record.
    - ACME can store the funds allocated to the XRP Ledger in a separate bank account.
    - If ACME is a cryptocurrency exchange, ACME can create a separate wallet to hold the funds allocated to the XRP Ledger, as publicly-verifiable proof to customers that the gateway is solvent.
- ACME must control an address in the XRP Ledger. Ripple's best practices recommend using a separate issuing address and operational address. See [Issuing and Operational Addresses](issuing-and-operational-addresses.html) for details.
    - ACME must enable the [Default Ripple Flag](#default-ripple) on its issuing address for customers to send and receive its issued currencies.
- Alice must create an accounting relationship (trust line) from her XRP Ledger address to ACME's issuing address. She can do this from any XRP Ledger client application as long as she knows ACME's issuing address.
    - ACME should publicize its issuing address on its website where customers can find it. It can also use an [`xrp-ledger.toml` file](xrp-ledger-toml.html) to publish the issuing address to automated systems.
- ACME must create a user interface for Alice to send funds from ACME into the XRP Ledger.
    - ACME needs to know Alice's XRP Ledger address. ACME can have Alice input her XRP Ledger address as part of the interface, or ACME can require Alice to input and verify her XRP Ledger address in advance.

See [Sending Payments to Customers](#sending-payments-to-customers) for an example of how to send payments into the XRP Ledger.


## Sending from XRP Ledger to Gateway

A payment out of the XRP Ledger means the Gateway receives a payment in the XRP Ledger, and credits a user in the gateway's system of record.

An example flow of a payment out of the XRP Ledger:

1. Bob sends an XRP Ledger transaction of €1 to ACME's issuing address.
2. In ACME's system of record, ACME credits Bob's balance €1.

Payments going from the XRP Ledger to a gateway can be single-currency or cross-currency payments. The gateway's issuing address can only receive issued currencies it created (or XRP).

### Requirements for Receiving from XRP Ledger

In addition to the [requirements for sending into the XRP Ledger](#requirements-for-sending-to-xrp-ledger), there are several prerequisites that ACME must meet to process payments coming from the XRP Ledger:

- ACME must monitor its XRP Ledger addresses for incoming payments.
- ACME must know which user to credit in its system of record for the incoming payments.
    - We recommend that ACME should [bounce any unrecognized incoming payments](#bouncing-payments) back to their sender.
    - Typically, the preferred method of recognizing incoming payments is through [destination tags](#source-and-destination-tags).


## Precautions

Processing payments to and from the XRP Ledger naturally comes with some risks, so a gateway should be sure to take care in implementing these processes. We recommend the following precautions:

- Protect yourself against reversible deposits. XRP Ledger payments are irreversible, but many electronic money systems like credit cards or PayPal are not. Scammers can abuse this to take their fiat money back by canceling a deposit after receiving issued currencies in the XRP Ledger.
- When sending into the XRP Ledger, specify the issuing address as the issuer of the currency. Otherwise, you might accidentally use paths that deliver the same currency issued by other addresses.
- Before sending a payment into the XRP Ledger, double check the cost of the payment. A payment from your operational address to a customer should not cost more than the destination amount plus any [transfer fee](#transfer-fees) you have set.
- Before processing a payment out of Ripple, make sure you know the customer's identity. This makes it harder for anonymous attackers to scam you. Most anti-money-laundering regulations require this anyway. This is especially important because the users sending money from the XRP Ledger could be different than the ones that initially received the money in the XRP Ledger.
- Follow the guidelines for [reliable transaction submission](#reliable-transaction-submission) when sending XRP Ledger transactions.
- [Robustly monitor for incoming payments](#robustly-monitoring-for-payments), and read the correct amount. Don't mistakenly credit someone the full amount if they only sent a [partial payment](partial-payments.html).
- Track your obligations and balances within the XRP Ledger, and compare with the assets in your collateral account. If they do not match up, stop processing withdrawals and deposits until you resolve the discrepancy.
- Avoid ambiguous situations. We recommend the following:
    - Enable the [Disallow XRP flag](#disallow-xrp) for the issuing address and all operational addresses, so customers do not accidentally send you XRP. (Private exchanges should *not* set this flag, since they trade XRP normally.)
    - Enable the [`RequireDest` flag](require-destination-tags.html) for the issuing address and all operational addresses, so customers do not accidentally send a payment without the destination tag to indicate who should be credited.
    - Enable the [`RequireAuth` flag](#require-auth) on all operational addresses so they cannot issue currency by accident.
- Monitor for suspicious or abusive behavior. For example, a user could repeatedly send funds into and out of the XRP Ledger, as a denial of service attack that effectively empties an operational address's balance. Suspend customers whose addresses are involved in suspicious behavior by not processing their XRP Ledger payments.

## Trading on Ripple

After the issued currencies have been created in the XRP Ledger, they can be freely transferred and traded by XRP Ledger users. There are several consequences of this situation:

- Anyone can buy/sell EUR.ACME on Ripple. If ACME issues multiple currencies on Ripple, a separate trust line is necessary for each.
    - This includes XRP Ledger users who do not have an account in ACME Exchange's systems. To withdraw the funds successfully from ACME, users still have to register with ACME.
    - Optionally, ACME uses the [Authorized Trust Lines](#authorized-trust-lines) feature to limit who can hold EUR.ACME in the XRP Ledger.
    - If ACME determines that a customer has acted in bad faith, ACME can [Freeze](#freeze) that user's accounting relationships to ACME in the XRP Ledger, so that the user can no longer trade in the gateway's issued currencies.
- XRP Ledger users trading and sending EUR.ACME to one another requires no intervention by ACME.
- All exchanges and balances in the XRP Ledger are publicly viewable.

The following diagram depicts an XRP Ledger payment sending 2 EUR.ACME from Alice to Charlie. ACME can query the XRP Ledger to see updates to its balances any time after the transaction has occurred:

![Diagram: Alice's sends 2 EUR.ACME from her trust line to Charlie's](img/e2g-03.png)



## Freeze

A gateway can freeze accounting relationships in the XRP Ledger to meet regulatory requirements:

* Gateways can freeze individual accounting relationships, in case a customer address shows suspicious activity or violates a gateway's terms of use.
* Gateways can freeze all accounting relationships to their issuing address, in case of a major security compromise or for migrating to a new issuing address.
* Furthermore, gateways can permanently opt out of their ability to freeze accounting relationships. This allows a gateway to assure its customers that it will continue to provide "physical-money-like" services. <!-- STYLE_OVERRIDE: will -->

For more information, see the [Freeze article](freezes.html).


## Authorized Trust Lines

The XRP Ledger's Authorized Trust Lines feature (formerly called "Authorized Accounts") enables a gateway to limit who can hold that gateway's issued currencies, so that unknown XRP Ledger addresses cannot hold the currency the gateway issues. Ripple feels this is *not necessary* in most cases, since gateways have full control over the process of redeeming XRP Ledger balances for value in the outside world. (You can collect customer information and impose limits on withdrawals at that stage without worrying about what happens within the XRP Ledger.)

For more information, see [Authorized Trust Lines](authorized-trust-lines.html).


## Source and Destination Tags

*Destination Tags* are a feature of XRP Ledger payments can be used to indicate the beneficiary or destination for a payment. For example, an XRP Ledger payment to a gateway may include a destination tag to indicate which customer should be credited for the payment. A gateway should keep a mapping of destination tags to accounts in the gateway's system of record.

Similarly, *Source Tags* indicate the originator or source of a payment. Most commonly, a Source Tag is included so that the recipient of the payment knows where to bounce the payment. When you bounce an incoming payment, use the Source Tag from the incoming payment as the Destination Tag of the outgoing (bounce) payment.

Ripple recommends making a user interface to generate a destination tag on-demand when a customer intends to send money to the gateway. You should consider that destination tag valid only for a payment with the expected amount. Later, bounce any other transactions that reuse the same destination tag.

[Enable the `RequireDest` flag](require-destination-tags.html) on your issuing and operational addresses so that customers must use a destination tag to indicate where funds should go when they send XRP Ledger payments to your gateway.

For more information, see [Source and Destination Tags](source-and-destination-tags.html).


## Gateway Bulletins

Historically, Ripple (the company) issued gateway bulletins to introduce new features or discuss topics related to compliance and risk. Gateway Bulletins are listed here in reverse chronological order.

- May 13, 2015 - [GB-2015-06 Gateway Bulletin: Corrections to Autobridging (PDF)](assets/pdf/GB-2015-06.pdf) <!-- SPELLING_IGNORE: autobridging -->
- April 17, 2015 - [GB-2015-05 Historical Ledger Query Migration](assets/pdf/GB-2015-05.pdf)
- March 13, 2015 - [GB-2015-04 Action Required: Default Ripple Flag (PDF)](https://ripple.com/files/GB-2015-04.pdf)
- March 3, 2015 - [GB-2015-03 Gateway Advisory: FinCEN Ruling on MoneyGram Compliance Program (PDF)](https://ripple.com/files/GB-2015-03.pdf) <!-- SPELLING_IGNORE: moneygram -->
- March 2, 2015 (Updated) - [GB-2015-02 New Standards: How to be Featured on Ripple Trade and Ripple Charts (PDF)](https://ripple.com/files/GB-2015-02.pdf)
- January 5, 2015 - [GB-2015-01 Gateway Advisory: Reliable Transaction Submission (PDF)](https://ripple.com/files/GB-2015-01.pdf)
- December 18, 2014 - [GB-2014-08 Gateway Advisory: Recent FinCEN Rulings (PDF)](https://ripple.com/files/GB-2014-08.pdf)
- November 4, 2014 -[GB-2014-07 Gateway Advisory: FATF Standards (PDF)](https://ripple.com/files/GB-2014-07.pdf)
- October 17, 2014 -[GB-2014-06 Gateway Advisory: Partial Payment Flag (PDF)](https://ripple.com/files/GB-2014-06.pdf)
- September 24, 2014 - [GB-2014-05 Gateway Advisory: EBA Opinion On Virtual Currency (PDF)](https://ripple.com/files/GB-2014-05.pdf) <!-- SPELLING_IGNORE: eba -->
- September 11, 2014 - [GB-2014-04 Gateway Advisory: CFPB Opinion on Virtual Currency (PDF)](https://ripple.com/files/GB-2014-04.pdf) <!-- SPELLING_IGNORE: cfpb -->
- August 19, 2014 - [GB-2014-03 Updated Feature: Trust Lines UI (PDF)](https://ripple.com/files/GB-2014-03.pdf)
- August 1, 2014 - [GB-2014-02 New Feature: Balance Freeze (PDF)](https://ripple.com/files/GB-2014-02.pdf)
- April 23, 2014, Updated August 14, 2014 -[GB-2014-01 New Feature: Ripple Names (PDF)](https://ripple.com/files/GB-2014-01.pdf)


# Technical Details

## Infrastructure

For the gateway's own security as well as the stability of the network, each gateway should run its own `rippled` servers including one [validator](rippled-server-modes.html#validators).


### APIs and Middleware

There are several interfaces you can use to connect to the XRP Ledger, depending on your needs and your existing software:

* [`rippled`](rippled-api.html) provides JSON-RPC and WebSocket APIs that can be used as a low-level interface to all core XRP Ledger functionality.
* [Client Libraries](client-libraries.html) are available in several programming languages to provide convenient utilities for accessing the XRP Ledger.
* Other tools such as [xApps](https://xumm.readme.io/docs/xapps) are also available.


## Tool Security

Any time you submit an XRP Ledger transaction, it must be signed using your secret key. The secret key gives full control over your XRP Ledger address. **Never** send your secret key to a server run by someone else. Either use your own `rippled` server, or sign the transactions locally before sending them to a `rippled` server.

The examples in this document show API methods that include a secret key. This is only safe if you control `rippled` server yourself, *and* you connect to it over a connection that is secure from outside listeners. For instructions and examples of other secure configurations, see [Set Up Secure Signing](set-up-secure-signing.html).


## Default Ripple

The Default Ripple flag controls whether the balances in an accounting relationship [allowed to ripple](rippling.html) by default. Rippling is what allows customers to trade issued currencies, so a gateway must allow rippling on all the accounting relationships to its issuing address.

Before asking customers to create accounting relationships to its issuing address, a gateway should enable the Default Ripple flag on that address. Otherwise, the gateway must individually disable the No Ripple flag for each accounting relationship that other addresses have created.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send an AccountSet transaction to enable the Default Ripple flag:

Request:

```json
POST http://localhost:8088/

{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Fee": "15000",
                "Flags": 0,
                "SetFlag": 8,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

**Caution:** Never submit a secret key to a server you do not control. Do not send a secret key unencrypted over the network.
<!---->

Response:

```json
{
    "result": {
        "engine_result": "tesSUCCESS",
        "engine_result_code": 0,
        "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
        "status": "success",
        "tx_blob": "1200032200000000240000003E202100000008684000000000003A98732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D8F2DEF27DE313E3F0D1E189BF5AC8879F591045950E2A33787C3051169038C80220728A548F188F882EA40A416CCAF2AC52F3ED679563BBE1BAC014BB9E773A333581144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
        "tx_json": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "Fee": "15000",
            "Flags": 0,
            "Sequence": 62,
            "SetFlag": 8,
            "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
            "TransactionType": "AccountSet",
            "TxnSignature": "3045022100D8F2DEF27DE313E3F0D1E189BF5AC8879F591045950E2A33787C3051169038C80220728A548F188F882EA40A416CCAF2AC52F3ED679563BBE1BAC014BB9E773A3335",
            "hash": "665B27B64CE658704FFD326A4FE2F5F5B5E67EACA61DE08258A59D35B883E1D5"
        }
    }
}
```

To confirm that an address has Default Ripple enabled, look up the address using the [account_info method][], specifying a validated ledger version. Use [a bitwise-AND operator](https://en.wikipedia.org/wiki/Bitwise_operation#AND) to compare the `Flags` field with `0x00800000` (the [ledger flag `lsfDefaultRipple`](accountroot.html#accountroot-flags)). If the result of the bitwise-AND operation is nonzero, then the address has Default Ripple enabled.



## Disallow XRP

The Disallow XRP setting is designed to discourage XRP Ledger users from sending XRP to an address by accident. This reduces the costs and effort of bouncing undesired payments, if your gateway does not trade XRP. The Disallow XRP flag is not strictly enforced, because doing so could allow addresses to become permanently unusable if they run out of XRP. Client applications should honor the Disallow XRP flag by default.

An issuing gateway that does not trade XRP should enable the Disallow XRP flag on the gateway's issuing and operational addresses. A private exchange that trades in XRP should only enable the Disallow XRP flag on addresses that are not expected to receive XRP.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send an AccountSet transaction to enable the Disallow XRP flag:

Request:

```json
POST http://localhost:8088/

{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Fee": "10000",
                "Flags": 0,
                "SetFlag": 3,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

**Caution:** Never submit a secret key to a server you do not control. Do not send a secret key unencrypted over the network.
<!---->

Response:

```json
{
	"result": {
		"engine_result": "tesSUCCESS",
		"engine_result_code": 0,
		"engine_result_message": "The transaction was applied. Only final in a validated ledger.",
		"status": "success",
		"tx_blob": "12000322000000002400000164202100000003684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100C2E38177E92C3998EB2C22978595784BC4CABCF7D57DE71FCF6CF162FB683A1D02205942D42C440D860B4CF7BB0DF77E4F2C529695854835B2F76DC2D09644FCBB2D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
		"tx_json": {
			"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
			"Fee": "10000",
			"Flags": 0,
			"Sequence": 356,
			"SetFlag": 3,
			"SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
			"TransactionType": "AccountSet",
			"TxnSignature": "3045022100C2E38177E92C3998EB2C22978595784BC4CABCF7D57DE71FCF6CF162FB683A1D02205942D42C440D860B4CF7BB0DF77E4F2C529695854835B2F76DC2D09644FCBB2D",
			"hash": "096A89DA55A6A1C8C9EE1BCD15A8CADCC52E6D2591393F680243ECEB93161B33"
		}
	}
}
```


## Require Auth

The Require Auth setting prevents all counterparties from holding balances issued by an address unless the address has specifically approved an accounting relationship with that counterparty. For more information, see [Authorized Trust Lines](authorized-trust-lines.html).

### Enabling Require Auth

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send an AccountSet transaction to enable the Require Auth flag: (This method works the same way regardless of whether the address is an issuing address, operational address, or standby address.)

Request:

```json
POST http://localhost:5005/

{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                "Fee": "15000",
                "Flags": 0,
                "SetFlag": 2,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

**Caution:** Never submit a secret key to a server you do not control. Do not send a secret key unencrypted over the network.
<!---->

### Authorizing Trust Lines

If you are using the [Authorized Trust Lines](authorized-trust-lines.html) feature, customers cannot hold balances you issue unless you first authorize their accounting relationships to you in the XRP Ledger.

To authorize an accounting relationship, submit a TrustSet transaction from your issuing address, with the user to trust as the `issuer` of the `LimitAmount`. Leave the `value` (the amount to trust them for) as **0**, and enable the [`tfSetfAuth` flag](trustset.html#trustset-flags) for the transaction.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send a TrustSet transaction authorizing the customer address `rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn` to hold USD issued by the address `rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW`:

Request:

```json
POST http://localhost:8088/

{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "Fee": "15000",
                "TransactionType": "TrustSet",
                "LimitAmount": {
                    "currency": "USD",
                    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "value": 0
                },
                "Flags": 65536
            }
        }
    ]
}
```

**Caution:** Never submit a secret key to a server you do not control. Do not send a secret key unencrypted over the network.
<!---->


## Robustly Monitoring for Payments

To robustly check for incoming payments, gateways should do the following:

* Keep a record of the most-recently-processed transaction and ledger. That way, if you temporarily lose connectivity, you know how far to go back.
* Check the result code of every incoming payment. Some payments go into the ledger to charge an anti-spam fee, even though they failed. Only transactions with the result code `tesSUCCESS` can change non-XRP balances. Only transactions from a validated ledger are final.
* [Look out for Partial Payments](https://ripple.com/files/GB-2014-06.pdf "Partial Payment Flag Gateway Bulletin"). Payments with the partial-payment flag enabled can be considered "successful" if any non-zero amount is delivered, even miniscule amounts.
    * In `rippled`, check the transaction for a `meta.delivered_amount` field. If present, that field indicates how much money *actually* got delivered to the `Destination` address.
    * In xrpl.js, you can use the [`xrpl.getBalanceChanges()` method](https://js.xrpl.org/modules.html#getBalanceChanges) to see how much each address received. In some cases, this can be divided into multiple parts on different trust lines.
* Some transactions change your balances without being payments directly to or from one of your addresses. For example, if ACME sets a nonzero [transfer fee](#transfer-fees), then ACME's issuing address's outstanding obligations decrease each time Bob and Charlie exchange ACME's issued currencies. See [Transfer Fees](#transfer-fees) for more information.

To make things simpler for your customers, we recommend accepting payments to either operational addresses and issuing addresses.

As an added precaution, we recommend comparing the balances of your issuing address with the collateral funds in your internal accounting system as of each new XRP Ledger ledger version. The issuing address's negative balances should match the assets you have allocated to XRP Ledger outside the network. If the two do not match up, then you should suspend processing payments into and out of the XRP Ledger until you have resolved the discrepancy.

* Use the [gateway_balances method][] to check your balances.
* If you have a [Transfer Fee](#transfer-fees) set, then your obligations within the XRP Ledger decrease slightly whenever other XRP Ledger addresses transfer your issued currencies among themselves.


## Transfer Fees

The `TransferRate` setting defines a fee to charge for transferring issued currencies from one XRP Ledger address to another. See [Transfer Fees](transfer-fees.html) for more information.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send an AccountSet transaction for the issuing address `rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW`, setting the `TransferRate` to charge a fee of 0.5%.

Request:

```json
{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "Fee": "10000",
                "Flags": 0,
                "TransferRate": 1005000000,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

Response:

```
{
	"result": {
		"engine_result": "tesSUCCESS",
		"engine_result_code": 0,
		"engine_result_message": "The transaction was applied. Only final in a validated ledger.",
		"status": "success",
		"tx_blob": "1200032200000000240000000F2B3BE71540684000000000002710732102B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF74473045022100AAFC3360BE151299523A93F445D5F6EB58AF5A4F8586C8B7818D6C6069660B40022022F46BCDA8FEE256AEB0BA2E92947EF4571F92354AB703E3E6D77FEF7ECBF64E8114204288D2E47F8EF6C99BCC457966320D12409711",
		"tx_json": {
			"Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
			"Fee": "10000",
			"Flags": 0,
			"Sequence": 15,
			"SigningPubKey": "02B3EC4E5DD96029A647CFA20DA07FE1F85296505552CCAC114087E66B46BD77DF",
			"TransactionType": "AccountSet",
			"TransferRate": 1005000000,
			"TxnSignature": "3045022100AAFC3360BE151299523A93F445D5F6EB58AF5A4F8586C8B7818D6C6069660B40022022F46BCDA8FEE256AEB0BA2E92947EF4571F92354AB703E3E6D77FEF7ECBF64E",
			"hash": "24360352FBF5597F313E5985C1766BB4A0D277CE63219AC0C0D81014C1E663BB"
		}
	}
}
```

### Transfer Fees with Operational and Standby Addresses

All XRP Ledger addresses, including operational and standby addresses, are subject to the issuer's transfer fees when sending issued currency. If you set a nonzero transfer fee, then you must send extra (to pay the transfer fee) when making payments from your operational address or standby address. In other words, your addresses must pay back a little of the balance your issuing address created, each time you make a payment.

Set the [`SendMax` transaction parameter][Payment] higher than the destination `Amount` parameter by a percentage based on the `TransferRate` setting.

**Note:** Transfer fees do not apply when sending issued currencies directly to the issuing address. The issuing address must always accept its issued currencies at face value in the XRP Ledger. This means that customers don't have to pay the transfer fee if they send payments to the issuing address directly, but they do when sending to an operational address. If you accept payments at both addresses, you may want to adjust the amount you credit customers in your system of record when customers send payments to the operational address, to compensate for the transfer fee the customer pays.

For example: If ACME sets a transfer fee of 1%, an XRP Ledger payment to deliver 5 EUR.ACME from a customer address to ACME's issuing address would cost exactly 5 EUR.ACME. However, the customer would need to send 5.05 EUR.ACME to deliver 5 EUR.ACME to ACME's operational address. (The issuing address's total obligations in the XRP Ledger decrease by 0.05 EUR.ACME.) When ACME credits customers for payments to ACME's operational address, ACME credits the customer for the amount delivered to the operational address _and_ the transfer fee, giving the customer €5,05 in ACME's systems.


## Sending Payments to Customers

When you build an automated system to send payments into the XRP Ledger for your customers, you must make sure that it constructs payments carefully. Malicious actors are constantly trying to find ways to trick a system into paying them more money than it should.

One common pitfall is performing pathfinding before sending sending a payment to customers in the XRP Ledger. If you specify the issuers correctly, the [default paths](paths.html#default-paths) can deliver the currency as intended.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send a payment from the operational address `rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn` to the customer address `raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n`, sending and delivering funds issued by the issuing address `rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW`.

Request:

```
{
	"method": "submit",
	"params": [{
		"secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
		"tx_json": {
			"TransactionType": "Payment",
			"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
			"Destination": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
			"Amount": {
				"currency": "USD",
				"value": "0.13",
				"issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
			},
			"SendMax": {
				"currency": "USD",
				"value": "0.13065",
				"issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
			},
			"Fee": "10000"
		}
	}]
}
```

*Reminder: Don't send your secret to a server you do not control.*

Response:

```
{
	"result": {
		"engine_result": "tesSUCCESS",
		"engine_result_code": 0,
		"engine_result_message": "The transaction was applied. Only final in a validated ledger.",
		"status": "success",
		"tx_blob": "1200002280000000240000016561D4449E57D63540000000000000000000000000005553440000000000204288D2E47F8EF6C99BCC457966320D1240971168400000000000271069D444A4413C6628000000000000000000000000005553440000000000204288D2E47F8EF6C99BCC457966320D12409711732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402207B75D91DC0EEE613A94E05FD5D031568D8A763E99697FF6328745BD226DA7D4E022005C75D7215FD62CB8E46C55B29FCA8E3FC62FDC55DF300597089DD29863BD3CD81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143A4C02EA95AD6AC3BED92FA036E0BBFB712C030C",
		"tx_json": {
			"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
			"Amount": {
				"currency": "USD",
				"issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
				"value": "0.13"
			},
			"Destination": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
			"Fee": "10000",
			"Flags": 2147483648,
			"SendMax": {
				"currency": "USD",
				"issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
				"value": "0.13065"
			},
			"Sequence": 357,
			"SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
			"TransactionType": "Payment",
			"TxnSignature": "304402207B75D91DC0EEE613A94E05FD5D031568D8A763E99697FF6328745BD226DA7D4E022005C75D7215FD62CB8E46C55B29FCA8E3FC62FDC55DF300597089DD29863BD3CD",
			"hash": "37B4AA5C77A8EB889164CA012E6F064A46B6B7B51677003FC3617F614608C60B"
		}
	}
}
```

In particular, note the following features of the [Payment transaction][]:

- No `Paths` field. The payment only succeeds if it can use a [default path](paths.html#default-paths), which is preferable. Using less direct paths can become much more expensive.
- The `issuer` of both the `SendMax` and the `Amount` is the issuing address. This ensures that the transaction sends and delivers issued currencies from the issuing address, and not from some other gateway.
- The `value` of the `SendMax` amount is slightly higher than the destination `Amount`, to compensate for the [transfer fee](#transfer-fees). In this case, the transfer fee is 0.5%, so the `SendMax` amount is exactly 1.005 times the destination `Amount`.


## Bouncing Payments

When one of your addresses receives a payment whose purpose is unclear, we recommend that you try to return the money to its sender. While this is more work than pocketing the money, it demonstrates good faith towards customers. You can have an operator bounce payments manually, or create a system to do so automatically.

The first requirement to bouncing payments is [robustly monitoring for incoming payments](#robustly-monitoring-for-payments). You do not want to accidentally refund a customer for more than they sent you! (This is particularly important if your bounce process is automated.) The [Partial Payment Flag Gateway Bulletin (PDF)](https://ripple.com/files/GB-2014-06.pdf) explains how to avoid a common problem.

Second, you should send bounced payments as Partial Payments. Since third parties can manipulate the cost of pathways between addresses, Partial Payments allow you to divest yourself of the full amount without being concerned about exchange rates within the XRP Ledger. You should publicize your bounced payments policy as part of your terms of use. Send the bounced payment from either an operational address or a standby address.

To send a Partial Payment, enable the [`tfPartialPayment` flag](payment.html#payment-flags) on the transaction. Set the `Amount` field to the amount you received and omit the `SendMax` field. You should use the `SourceTag` value from the incoming payment as the `DestinationTag` value for the return payment.

To prevent two systems from bouncing payments back and forth indefinitely, you can set a new Source Tag for the outgoing return payment. If you receive an unexpected payment whose Destination Tag matches the Source Tag of a return you sent, then do not bounce it back again.


## Reliable Transaction Submission

The goal of reliably submitting transactions is to achieve the following two properties in a finite amount of time:

* Idempotency - Transactions should be processed once and only once, or not at all.
* Verifiability - Applications can determine the final result of a transaction.

To submit transactions reliably, follow these guidelines:

* Persist details of the transaction before submitting it.
* Use the `LastLedgerSequence` parameter. (Many [client libraries](client-libraries.html) do this by default.)
* Resubmit a transaction if it has not appeared in a validated ledger whose [ledger index][] is less than or equal to the transaction's `LastLedgerSequence` parameter.

For more information, see [Reliable Transaction Submission](reliable-transaction-submission.html).


## xrp-ledger.toml File

You can publish information about what currencies your gateway issues, and which XRP Ledger addresses you control, to protect against impostors or confusion, using an [`xrp-ledger.toml` file](xrp-ledger-toml.html). This machine-readable format is convenient for client applications to process. If you run an XRP Ledger validator, you can also publish the key in the same file.


<!-- STYLE_OVERRIDE: gateway, gateways -->

## See Also

- **Concepts:**
    - [Issued Currencies](issued-currencies.html)
    - [Decentralized Exchange](decentralized-exchange.html)
    - [Source and Destination Tags](source-and-destination-tags.html)
- **Tutorials:**
    - [Install `rippled`](install-rippled.html)
    - [Set Up Secure Signing](set-up-secure-signing.html)
- **References:**
    - [Payment transaction][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - [RippleState object](ripplestate.html)
    - [account_lines method][]
    - [gateway_balances method][]

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
