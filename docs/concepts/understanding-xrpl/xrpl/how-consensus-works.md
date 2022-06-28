# How Consensus Works

This topic describes how the XRP Ledger is able to solve the double-spend problem without relying on a central authority.

## Consensus Rules

The primary role of consensus is for participants in the process to agree on which transactions are to be processed as a group to resolve the double spend problem. There are four reasons this agreement is easier to achieve than might be expected:

If there is no reason a transaction should not be included in such a group of transactions, all honest participants agree to include it. If all participants already agree, consensus has no work to do.
If there is any reason at all a transaction should not be included in such a group of transactions, all honest participants are willing to exclude it. If the transaction is still valid, there is no reason not to include it in the next round, and they should all agree to include it then.
It is extremely rare for a participant to particularly care how the transactions were grouped. Agreement is easiest when everyone’s priority is reaching agreement and only challenging when there are diverging interests.
Deterministic rules can be used even to form the groupings, leading to disagreement only in edge cases. For example, if there are two conflicting transactions in a round, deterministic rules can be used to determine which is included in the next round.
Every participant’s top priority is correctness. They must first enforce the rules to be sure nothing violates the integrity of the shared ledger. For example, a transaction that is not properly signed must never be processed (even if other participants want it to be processed). However, every honest participant’s second priority is agreement. A network with possible double spends has no utility at all, so every honest participant values agreement above everything but correctness.

## Consensus Rounds

A consensus round is an attempt to agree on a group of transactions so they can be processed. A consensus round starts with each participant who wishes to do so taking an initial position. This is the set of valid transactions they have seen.

Participants then “avalanche” to consensus: If a particular transaction does not have majority support, participants agree to defer that transaction. If a particular transaction does have majority support, participants agree to include the transaction. Thus slight majorities rapidly become full support and slight minorities rapidly become universal rejection from the current round.

To prevent consensus from stalling near 50% and to reduce the overlap required for reliable convergence, the required threshold to include a transaction increases over time. Initially, participants continue to agree to include a transaction if 50% or more of other participants agree. If participants disagree, they increase this threshold, first to 60% and then even higher, until all disputed transactions are removed from the current set. Any transactions removed this way are deferred to the next ledger version.

When a participant sees a supermajority that agrees on the set of transactions to next be processed, it declares a consensus to have been reached.

## Consensus Can Fail

It is not practical to develop a consensus algorithm that never fails to achieve perfect consensus. To understand why, consider how the consensus process finishes. At some point, each participant must declare that a consensus has been reached and that some set of transactions is known to be the result of the process. This declaration commits that participant irrevocably to some particular set of transactions as the result of the consensus process.

Some participant must do this first or no participant will ever do it, and they will never reach a consensus. Now, consider the participant that does this first. When this participant decides that consensus is finished, other participants have not yet made that decision. If they were incapable of changing the agreed set from their point of view, they would have already decided consensus was finished. So they must be still capable of changing their agreed set.
In other words, for the consensus process to ever finish, some participant must declare that consensus has been reached on a set of transactions even though every other participant is theoretically still capable of changing the agreed upon set of transactions.

Imagine a group of people in a room trying to agree which door they should use to exit. No matter how much the participants discuss, at some point, someone has to be the first one to walk out of a door, even though the people behind that person could still change their minds and leave through the other door.

The probability of this kind of failure can be made very low, but it cannot be reduced to zero. The engineering tradeoffs are such that driving this probability down below about one in a thousand makes consensus significantly slower, and less able to tolerate network and endpoint failures.

How the XRP Ledger Handles Consensus Failure
After a consensus round completes, each participant applies the set of transactions that they believe were agreed to. This results in constructing what they believe the next state of the ledger should be.

Participants that are also validators then publish a cryptographic fingerprint of this next ledger. We call this fingerprint a “validation vote”. If the consensus round succeeded, the vast majority of honest validators should be publishing the same fingerprint.

Participants then collect these validation votes. From the validation votes, they can determine whether the previous consensus round resulted in a supermajority of participants agreeing on a set of transactions or not.

Participants then find themselves in one of three cases, in order of probability:

They built the same ledger a supermajority agreed to. In this case, they can consider that ledger fully validated and rely on its contents.
They built a different ledger than a supermajority agreed on. In this case, they must build and accept the supermajority ledger. This typically indicates that they declared a consensus early and many other participants changed after that. They must “jump” to the super-majority ledger to resume operation.
No supermajority is clear from the received validations. In this case, the previous consensus round was wasted and a new round must occur before any ledger can be validated.
Of course, case 1 is the most common. Case 2 does no harm to the network whatsoever. A small percentage of the participants could even fall into case 2 every round, and the network would work with no issues. Even those participants can recognize that they did not build the same ledger as the supermajority, so they know not to report their results as final until they are in agreement with the supermajority.

Case 3 results in the network losing a few seconds in which it could have made forward progress, but is extremely rare. In this case, the next consensus round is much less likely to fail because disagreements are resolved in the consensus process and only remaining disagreements can cause a failure.

On rare occasions, the network as a whole fails to make forward progress for a few seconds. In exchange, average transaction confirmation times are low.
