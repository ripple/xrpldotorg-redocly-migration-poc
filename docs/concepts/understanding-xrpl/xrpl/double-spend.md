# The Double-spend Problem

Consensus protocols are a solution to the _double-spend problem_: the challenge of preventing someone from successfully spending the same digital money twice. The hardest part about this problem is putting transactions in order: without a central authority, it can be difficult to resolve disputes about which transaction comes first when you have two or more mutually exclusive transactions sent around the same time.

The double-spend problem is a fundamental challenge to operating any sort of payment system. The problem comes from the requirement that when money is spent in one place, it can't also be spent in another place. More generally, the problem occurs when you have any two transactions such that either one is valid but not both together.

Suppose Alice, Bob, and Charlie are using a payment system, and Alice has a balance of $10. For the payment system to be useful, Alice must be able to send her $10 to Bob, or to Charlie. However, if Alice tries to send $10 to Bob and also send $10 to Charlie at the same time, that's where the double spend problem comes in.

If Alice can send the "same" $10 to both Charlie and Bob, the payment system ceases to be useful. The payment system needs a way to choose which transaction should succeed and which should fail, in such a way that all participants agree on which transaction has happened. Either of those two transactions is equally valid on its own. However, different participants in the payment system may have a different view of which transaction came first.

Conventionally, payment systems solve the double spend problem by having a central authority track and approve transactions. For example, a bank decides to clear a check based on the issuer's available balance, of which the bank is the sole custodian. In such a system, all participants follow the central authority's decisions.

Distributed ledger technologies, like the XRP Ledger, have no central authority. They must solve the double spend problem using a consensus protocol.
