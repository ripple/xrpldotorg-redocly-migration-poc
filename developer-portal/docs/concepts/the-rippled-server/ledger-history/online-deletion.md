# Online Deletion
[[Source]<br/>](https://github.com/ripple/rippled/blob/master/src/ripple/app/misc/SHAMapStoreImp.cpp "Source")

The online deletion feature lets the `rippled` server delete the server's local copy of old ledger versions to keep disk usage from rapidly growing over time. The default config file sets online deletion to run automatically, but online deletion can also be configured to run only when prompted. [New in: rippled 0.27.0][]

The server always keeps the complete _current_ state of the ledger, with all the balances and settings it contains. The deleted data includes older transactions and versions of the ledger state that are older than the stored history.

The default config file sets the `rippled` server to keep the most recent 2000 ledger versions and automatically delete older data.

**Tip:** Even with online deletion, the amount of disk space required to store the same time span's worth of ledger data increases over time, because the size of individual ledger versions tends to grow over time. This growth is very slow in comparison to the accumulation of data that occurs without deleting old ledgers. For more information on disk space needs, see [Capacity Planning](capacity-planning.html).


## Background

The `rippled` server stores [ledger history](ledger-history.html) in its _ledger store_. This data accumulates over time.

Inside the ledger store, ledger data is "de-duplicated". In other words, data that doesn't change from version to version is only stored once. The records themselves in the ledger store do not indicate which ledger version(s) contain them; part of the work of online deletion is identifying which records are only used by outdated ledger versions. This process is time consuming and affects the disk I/O and application cache, so it is not feasible to delete old data on every ledger close.


## Online Deletion Behavior

The online deletion settings configure how many ledger versions the `rippled` server should keep available in the ledger store at a time. However, the specified number is a guideline, not a hard rule:

- The server never deletes data more recent than the configured number of ledger versions, but it may have less than that amount available if it has not been running for long enough or if it lost sync with the network at any time. (The server attempts to backfill at least some history; see [fetching history](ledger-history.html#fetching-history) for details.)
- The server may store up to slightly over twice the configured number of ledger versions if online deletion is set to run automatically. (Each time it runs, it reduces the number of stored ledger versions to approximately the configured number.)

    If online deletion is delayed because the server is busy, ledger versions can continue to accumulate. When functioning normally, online deletion begins when the server has twice the configured number of ledger versions, but it may not complete until after several more ledger versions have accumulated.

- If advisory deletion is enabled, the server stores all the ledger versions that it has acquired and built until its administrator calls the [can_delete method][].

    The amount of data the server stores depends on how often you call [can_delete][can_delete method] and how big an interval of time your `online_delete` setting represents:

    - If you call `can_delete` _more often_ than your `online_delete` interval, the server stores at most a number of ledger versions approximately equal to **twice the `online_delete` value**. (After deletion, this is reduced to approximately the `online_delete` value.) <!-- STYLE_OVERRIDE: a number of -->

        For example, if you call `can_delete` with a value of `now` once per day and an `online_delete` value of 50,000, the server typically stores up to 100,000 ledger versions before running deletion. After running deletion, the server keeps at least 50,000 ledger versions (about two days' worth). With this configuration, approximately every other `can_delete` call results in no change because the server does not have enough ledger versions to delete.

    - If you call `can_delete` _less often_ than your `online_delete` interval, the server stores at most ledger versions spanning an amount of time that is approximately **twice the interval between `can_delete` calls**. (After deletion, this is reduced to approximately one interval's worth of data.)

        For example, if you call `can_delete` with a value of `now` once per day and an `online_delete` value of 2000, the server typically stores up to two full days' worth of ledger versions before running deletion. After running deletion, the server keeps approximately one day's worth (about 25,000 ledger versions), but never fewer than 2000 ledger versions.


With online deletion enabled and running automatically (that is, with advisory delete disabled), the total amount of ledger data stored should remain at minimum equal to the number of ledger versions the server is configured to keep, with the maximum being roughly twice that many.

When online deletion runs, it does not reduce the size of SQLite database files on disk; it only makes space within those files available to be reused for new data. Online deletion _does_ reduce the size of RocksDB or NuDB database files containing the ledger store.

The server only counts validated ledger versions when deciding how far back it can delete. In exceptional circumstances where the server is unable to validate new ledger versions (either because of an outage in its local network connection or because the global XRP Ledger network is unable to reach a consensus) `rippled` continues to close ledgers so that it can recover quickly when the network is restored. In this case, the server may accumulate many closed but not validated ledger versions. These unvalidated ledgers do not affect how many _validated_ ledger versions the server keeps before running online deletion.

### Interrupting Online Deletion

Online deletion automatically stops if the [server state](rippled-server-states.html) becomes less than `full`. If this happens, the server writes a log message with the prefix `SHAMapStore::WRN`. The server attempts to start online deletion again after the next validated ledger version after becoming fully synced.

If you stop the server or it crashes while online deletion is running, online deletion resumes after the server is restarted and the server becomes fully synced.

To temporarily disable online deletion, you can use the [can_delete method][] with an argument of `never`. This change persists until you re-enable online deletion by calling [can_delete][can_delete method] again. For more information on controlling when online deletion happens, see [Advisory Deletion](#advisory-deletion).


## Configuration

The following settings relate to online deletion:

- **`online_delete`** - Specify a number of validated ledger versions to keep. The server periodically deletes any ledger versions that are older than this number. If not specified, no ledgers are deleted.

    The default config file specifies 2000 for this value. This cannot be less than 256, because some events like [Fee Voting](fee-voting.html) and the [Amendment Process](amendments.html#amendment-process) update only every 256 ledgers.

    **Caution:** If you run `rippled` with `online_delete` disabled, then later enable `online_delete` and restart the server, the server disregards but does not delete existing ledger history that your server already downloaded while `online_delete` was disabled. To save disk space, delete your existing history before re-starting the server after changing the `online_delete` setting.

- **`[ledger_history]`** - Specify a number of validated ledgers, equal to or less than `online_delete`. If the server does not have at least this many validated ledger versions, it attempts to backfill them by fetching the data from peers.

    The default for this setting is 256 ledgers.

    The following diagram shows the relationship between `online_delete` and `ledger_history` settings:

    <figure><a href="img/online_delete-vs-ledger_history.svg" title="Ledgers older than `online_delete` are automatically deleted. Ledgers newer than `ledger_history` are backfilled. Ledgers in between are kept if available but not backfilled"><svg color-interpolation="auto" color-rendering="auto" fill="black" fill-opacity="1" font-family="'Dialog'" font-size="12px" font-style="normal" font-weight="normal" height="100%" image-rendering="auto" shape-rendering="auto" stroke="black" stroke-dasharray="none" stroke-dashoffset="0" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10" stroke-opacity="1" stroke-width="1" text-rendering="auto" viewBox="20 40 800 460" width="800" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!--Generated by the Batik Graphics2D SVG Generator--><defs id="img/online_delete-vs-ledger_history.svg__genericDefs"/><g><defs id="img/online_delete-vs-ledger_history.svg__defs1"><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath1"><path d="M0 0 L2147483647 0 L2147483647 2147483647 L0 2147483647 L0 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath2"><path d="M0 0 L0 30 L220 30 L220 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath3"><path d="M0 0 L0 40 L380 40 L380 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath4"><path d="M0 0 L0 40 L330 40 L330 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath5"><path d="M0 0 L0 60 L230 60 L230 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath6"><path d="M0 0 L0 30 L170 30 L170 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath7"><path d="M0 0 L0 30 L210 30 L210 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath8"><path d="M0 0 L0 40 L210 40 L210 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath9"><path d="M0 0 L0 40 L170 40 L170 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath10"><path d="M0 0 L0 70 L90 70 L90 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath11"><path d="M0 0 L0 50 L740 50 L740 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath12"><path d="M0 0 L0 60 L80 60 L80 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online_delete-vs-ledger_history.svg__clipPath13"><path d="M0 0 L0 60 L70 60 L70 0 Z"/></clipPath></defs><g font-family="sans-serif" font-size="14px" font-weight="bold" transform="translate(40,280)"><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="18.1094">With advisory deletion</text></g><g font-family="sans-serif" font-size="14px" font-weight="bold" transform="translate(50,60)"><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="18.1094">Without advisory deletion</text></g><g fill="lime" stroke="lime" transform="translate(380,390)"><rect clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath3)" height="38.5" stroke="none" width="378.5" x="0.5" y="0.5"/><rect clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath3)" fill="none" height="38.5" stroke="black" width="378.5" x="0.5" y="0.5"/></g><g font-family="sans-serif" font-size="14px" transform="translate(380,390)"><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath3)" stroke="none" x="127" xml:space="preserve" y="18.1094">Backfill if possible</text></g><g fill="rgb(200,200,200)" stroke="rgb(200,200,200)" transform="translate(50,390)"><rect clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath4)" height="38.5" stroke="none" width="328.5" x="0.5" y="0.5"/></g><g stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(50,390)"><rect clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath4)" fill="none" height="38.5" width="328.5" x="0.5" y="0.5"/><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath4)" font-family="sans-serif" font-size="14px" stroke="none" x="92" xml:space="preserve" y="18.1094">Delete automatically</text></g><g font-family="sans-serif" font-size="14px" transform="translate(110,320)"><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="18.1094">online_delete setting, or most</text><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="34.2188">recent can_delete point,</text><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="50.3281">whichever is older</text></g><g font-family="sans-serif" font-size="14px" transform="translate(170,100)"><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="18.1094">online_delete setting</text></g><g font-family="sans-serif" font-size="14px" transform="translate(590,100)"><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath7)" stroke="none" x="5" xml:space="preserve" y="18.1094">ledger_history setting</text></g><g fill="lime" stroke="lime" transform="translate(550,140)"><rect clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath8)" height="38.5" stroke="none" width="208.5" x="0.5" y="0.5"/><rect clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath8)" fill="none" height="38.5" stroke="black" width="208.5" x="0.5" y="0.5"/></g><g font-family="sans-serif" font-size="14px" transform="translate(550,140)"><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath8)" stroke="none" x="42" xml:space="preserve" y="18.1094">Backfill if possible</text></g><g fill="rgb(70,70,70)" stroke="rgb(70,70,70)" transform="translate(380,140)"><rect clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath9)" height="38.5" stroke="none" width="168.5" x="0.5" y="0.5"/><rect clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath9)" fill="none" height="38.5" stroke="white" width="168.5" x="0.5" y="0.5"/></g><g fill="white" font-family="sans-serif" font-size="14px" stroke="white" transform="translate(380,140)"><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath9)" stroke="none" x="26" xml:space="preserve" y="18.1094">Keep if available</text></g><g fill="rgb(200,200,200)" stroke="rgb(200,200,200)" transform="translate(50,140)"><rect clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath4)" height="38.5" stroke="none" width="328.5" x="0.5" y="0.5"/></g><g stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(50,140)"><rect clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath4)" fill="none" height="38.5" width="328.5" x="0.5" y="0.5"/><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath4)" font-family="sans-serif" font-size="14px" stroke="none" x="92" xml:space="preserve" y="18.1094">Delete automatically</text></g><g transform="translate(310,340)"><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath10)" d="M70.5 49.5 L70.5 10.5" fill="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath10)" d="M70.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath10)" d="M77 38.7417 L70.5 50 L64 38.7417 Z" stroke="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath10)" d="M77 38.7417 L70.5 50 L64 38.7417 Z" fill="none"/></g><g transform="translate(40,430)"><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" d="M10.5 20.5 L719.5 20.5" fill="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" d="M708.7417 27 L720 20.5 L708.7417 14 Z" fill="white" stroke="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" d="M708.7417 27 L720 20.5 L708.7417 14 Z" fill="none"/><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" font-family="sans-serif" font-size="14px" stroke="none" x="310.2417" xml:space="preserve" y="32.1094">Ledger versions</text><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" font-family="sans-serif" font-size="14px" stroke="none" x="29" xml:space="preserve" y="34.1094">oldest</text><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" font-family="sans-serif" font-size="14px" stroke="none" x="651.2656" xml:space="preserve" y="34.1094">newest</text></g><g transform="translate(320,100)"><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath12)" d="M60.5 39.5 L60.5 10.5" fill="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath12)" d="M60.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath12)" d="M67 28.7417 L60.5 40 L54 28.7417 Z" stroke="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath12)" d="M67 28.7417 L60.5 40 L54 28.7417 Z" fill="none"/></g><g transform="translate(540,100)"><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath13)" d="M10.5 39.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath13)" d="M10.5 10.5 L50.5 10.5" fill="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath13)" d="M17 28.7417 L10.5 40 L4 28.7417 Z" stroke="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath13)" d="M17 28.7417 L10.5 40 L4 28.7417 Z" fill="none"/></g><g transform="translate(40,180)"><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" d="M10.5 20.5 L719.5 20.5" fill="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" d="M708.7417 27 L720 20.5 L708.7417 14 Z" fill="white" stroke="none"/><path clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" d="M708.7417 27 L720 20.5 L708.7417 14 Z" fill="none"/><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" font-family="sans-serif" font-size="14px" stroke="none" x="310.2417" xml:space="preserve" y="32.1094">Ledger versions</text><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" font-family="sans-serif" font-size="14px" stroke="none" x="29" xml:space="preserve" y="34.1094">oldest</text><text clip-path="url(#img/online_delete-vs-ledger_history.svg__clipPath11)" font-family="sans-serif" font-size="14px" stroke="none" x="651.2656" xml:space="preserve" y="34.1094">newest</text></g></g></svg></a></figure>

- **`advisory_delete`** - If enabled, online deletion is not scheduled automatically. Instead, an administrator must manually trigger online deletion. Use the value `0` for disabled or `1` for enabled.

    This setting is disabled by default.

- **`[fetch_depth]`** - Specify a number of ledger versions. The server does not accept fetch requests from peers for historical data that is older than the specified number of ledger versions. Specify the value `full` to serve any available data to peers.

    The default for `fetch_depth` is `full` (serve all available data).

    The `fetch_depth` setting cannot be higher than `online_delete` if both are specified. If `fetch_depth` is set higher, the server treats it as equal to `online_delete` instead.

    The following diagram shows how `fetch_depth` works:

    <figure><a href="img/fetch_depth.svg" title="Ledger versions older than fetch_depth are not served to peers"><svg color-interpolation="auto" color-rendering="auto" fill="black" fill-opacity="1" font-family="'Dialog'" font-size="12px" font-style="normal" font-weight="normal" height="100%" image-rendering="auto" shape-rendering="auto" stroke="black" stroke-dasharray="none" stroke-dashoffset="0" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10" stroke-opacity="1" stroke-width="1" text-rendering="auto" viewBox="0 10 780 170" width="780" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!--Generated by the Batik Graphics2D SVG Generator--><defs id="img/fetch_depth.svg__genericDefs"/><g><defs id="img/fetch_depth.svg__defs1"><clipPath clipPathUnits="userSpaceOnUse" id="img/fetch_depth.svg__clipPath1"><path d="M0 0 L2147483647 0 L2147483647 2147483647 L0 2147483647 L0 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/fetch_depth.svg__clipPath2"><path d="M0 0 L0 30 L170 30 L170 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/fetch_depth.svg__clipPath3"><path d="M0 0 L0 40 L260 40 L260 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/fetch_depth.svg__clipPath4"><path d="M0 0 L0 40 L240 40 L240 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/fetch_depth.svg__clipPath5"><path d="M0 0 L0 40 L210 40 L210 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/fetch_depth.svg__clipPath6"><path d="M0 0 L0 60 L90 60 L90 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/fetch_depth.svg__clipPath7"><path d="M0 0 L0 50 L740 50 L740 0 Z"/></clipPath></defs><g font-family="sans-serif" font-size="14px" transform="translate(270,30)"><text clip-path="url(#img/fetch_depth.svg__clipPath2)" stroke="none" x="5" xml:space="preserve" y="18.1094">fetch_depth setting</text></g><g fill="lime" stroke="lime" transform="translate(480,70)"><rect clip-path="url(#img/fetch_depth.svg__clipPath3)" height="38.5" stroke="none" width="258.5" x="0.5" y="0.5"/><rect clip-path="url(#img/fetch_depth.svg__clipPath3)" fill="none" height="38.5" stroke="black" width="258.5" x="0.5" y="0.5"/></g><g font-family="sans-serif" font-size="14px" transform="translate(480,70)"><text clip-path="url(#img/fetch_depth.svg__clipPath3)" stroke="none" x="45" xml:space="preserve" y="18.1094">Ledgers served to peers</text><text clip-path="url(#img/fetch_depth.svg__clipPath3)" stroke="none" x="73" xml:space="preserve" y="34.2188">when requested</text></g><g fill="rgb(70,70,70)" stroke="rgb(70,70,70)" transform="translate(240,70)"><rect clip-path="url(#img/fetch_depth.svg__clipPath4)" height="38.5" stroke="none" width="238.5" x="0.5" y="0.5"/><rect clip-path="url(#img/fetch_depth.svg__clipPath4)" fill="none" height="38.5" stroke="white" width="238.5" x="0.5" y="0.5"/></g><g fill="white" font-family="sans-serif" font-size="14px" stroke="white" transform="translate(240,70)"><text clip-path="url(#img/fetch_depth.svg__clipPath4)" stroke="none" x="19" xml:space="preserve" y="18.1094">Ledgers available locally but</text><text clip-path="url(#img/fetch_depth.svg__clipPath4)" stroke="none" x="51" xml:space="preserve" y="34.2188">not served to peers</text></g><g fill="rgb(200,200,200)" stroke="rgb(200,200,200)" transform="translate(30,70)"><rect clip-path="url(#img/fetch_depth.svg__clipPath5)" height="38.5" stroke="none" width="208.5" x="0.5" y="0.5"/></g><g stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(30,70)"><rect clip-path="url(#img/fetch_depth.svg__clipPath5)" fill="none" height="38.5" width="208.5" x="0.5" y="0.5"/><text clip-path="url(#img/fetch_depth.svg__clipPath5)" font-family="sans-serif" font-size="14px" stroke="none" x="38" xml:space="preserve" y="18.1094">Ledgers not stored</text></g><g transform="translate(410,30)"><path clip-path="url(#img/fetch_depth.svg__clipPath6)" d="M70.5 39.5 L70.5 10.5" fill="none"/><path clip-path="url(#img/fetch_depth.svg__clipPath6)" d="M70.5 10.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/fetch_depth.svg__clipPath6)" d="M77 28.7417 L70.5 40 L64 28.7417 Z" stroke="none"/><path clip-path="url(#img/fetch_depth.svg__clipPath6)" d="M77 28.7417 L70.5 40 L64 28.7417 Z" fill="none"/></g><g transform="translate(20,110)"><path clip-path="url(#img/fetch_depth.svg__clipPath7)" d="M10.5 20.5 L719.5 20.5" fill="none"/><path clip-path="url(#img/fetch_depth.svg__clipPath7)" d="M708.7417 27 L720 20.5 L708.7417 14 Z" fill="white" stroke="none"/><path clip-path="url(#img/fetch_depth.svg__clipPath7)" d="M708.7417 27 L720 20.5 L708.7417 14 Z" fill="none"/><text clip-path="url(#img/fetch_depth.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="310.2417" xml:space="preserve" y="32.1094">Ledger versions</text><text clip-path="url(#img/fetch_depth.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="29" xml:space="preserve" y="34.1094">oldest</text><text clip-path="url(#img/fetch_depth.svg__clipPath7)" font-family="sans-serif" font-size="14px" stroke="none" x="651.2656" xml:space="preserve" y="34.1094">newest</text></g></g></svg></a></figure>

For estimates of how much disk space is required to store different amounts of history, see [Capacity Planning](capacity-planning.html#disk-space).

### Advisory Deletion

The default config file schedules online deletion to happen automatically and periodically. If the config file does not specify an `online_delete` interval, online deletion does not occur. If config file enables the `advisory_delete` setting, online deletion only happens when an administrator triggers it using the [can_delete method][].

You can use advisory deletion with a scheduled job to trigger automatic deletion based on clock time instead of the number of ledger versions closed. If your server is heavily used, the extra load from online deletion can cause your server to fall behind and temporarily de-sync from the consensus network. If this is the case, you can use advisory deletion and schedule online deletion to happen only during off-peak times.

You can use advisory deletion for other reasons. For example, you may want to manually confirm that transaction data is backed up to a separate server before deleting it. Alternatively, you may want to manually confirm that a separate task has finished processing transaction data before you delete that data.

The `can_delete` API method can enable or disable automatic deletion, in general or up to a specific ledger version, as long as `advisory_delete` is enabled in the config file. These settings changes persist even if you restart the `rippled` server, unless you disable `advisory_delete` in the config file before restarting.


## How It Works

Online deletion works by creating two databases: at any given time, there is an "old" database, which is read-only, and a "current" database, which is writable. The `rippled` server can read objects from either database, so current ledger versions may contain objects in either one. If an object in a ledger does not change from ledger version to ledger version, only one copy of that object remains in the database, so the server does not store redundant copies of that object. When a new ledger version modifies an object, the server stores the modified object in the "new" database, while the previous version of the object (which is still used by previous ledger versions) remains in the "old" database.

When it comes time for online deletion, the server first walks through the oldest ledger version to keep, and copies all objects in that ledger version from the read-only "old" database into the "current" database. This guarantees that the "current" database now contains all objects used in the chosen ledger version and all newer versions. Then, the server deletes the "old" database, and changes the existing "current" database to become "old" and read-only. The server starts a new "current" database to contain any newer changes after this point.

<figure><a href="img/online-deletion-process.svg" title="Diagram showing how online deletion uses two databases"><svg color-interpolation="auto" color-rendering="auto" fill="black" fill-opacity="1" font-family="'Dialog'" font-size="12px" font-style="normal" font-weight="normal" height="100%" image-rendering="auto" shape-rendering="auto" stroke="black" stroke-dasharray="none" stroke-dashoffset="0" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10" stroke-opacity="1" stroke-width="1" text-rendering="auto" viewBox="0 10 800 920" width="800" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!--Generated by the Batik Graphics2D SVG Generator--><defs id="img/online-deletion-process.svg__genericDefs"/><g><defs id="img/online-deletion-process.svg__defs1"><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath1"><path d="M0 0 L2147483647 0 L2147483647 2147483647 L0 2147483647 L0 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath2"><path d="M0 0 L0 150 L260 150 L260 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath3"><path d="M0 0 L0 30 L200 30 L200 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath4"><path d="M0 0 L0 70 L110 70 L110 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath5"><path d="M0 0 L0 70 L150 70 L150 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath6"><path d="M0 0 L0 120 L170 120 L170 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath7"><path d="M0 0 L0 20 L20 20 L20 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath8"><path d="M0 0 L0 190 L180 190 L180 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath9"><path d="M0 0 L0 70 L140 70 L140 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath10"><path d="M0 0 L0 80 L170 80 L170 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath11"><path d="M0 0 L0 40 L210 40 L210 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath12"><path d="M0 0 L0 100 L160 100 L160 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath13"><path d="M0 0 L0 60 L30 60 L30 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath14"><path d="M0 0 L0 180 L280 180 L280 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath15"><path d="M0 0 L0 40 L70 40 L70 0 Z"/></clipPath><clipPath clipPathUnits="userSpaceOnUse" id="img/online-deletion-process.svg__clipPath16"><path d="M0 0 L0 70 L120 70 L120 0 Z"/></clipPath></defs><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(520,40)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath2)" height="148.5" stroke="none" width="258.5" x="0.5" y="0.5"/></g><g transform="translate(520,40)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath2)" fill="none" height="148.5" width="258.5" x="0.5" y="0.5"/><text clip-path="url(#img/online-deletion-process.svg__clipPath2)" font-family="sans-serif" font-size="14px" stroke="none" x="104" xml:space="preserve" y="18.1094">Legend</text><path clip-path="url(#img/online-deletion-process.svg__clipPath2)" d="M1 24.1094 L259 24.1094" fill="none"/></g><g font-family="sans-serif" font-size="14px" font-weight="bold" transform="translate(40,690)"><text clip-path="url(#img/online-deletion-process.svg__clipPath3)" stroke="none" x="5" xml:space="preserve" y="18.1094">After online deletion</text></g><g fill="blue" font-family="sans-serif" font-size="14px" stroke="blue" transform="translate(420,620)"><text clip-path="url(#img/online-deletion-process.svg__clipPath4)" stroke="none" x="5" xml:space="preserve" y="18.1094">"Current" DB</text><text clip-path="url(#img/online-deletion-process.svg__clipPath4)" stroke="none" x="5" xml:space="preserve" y="34.2188">becomes</text><text clip-path="url(#img/online-deletion-process.svg__clipPath4)" stroke="none" x="5" xml:space="preserve" y="50.3281">"Old" DB</text></g><g fill="blue" font-family="sans-serif" font-size="14px" stroke="blue" transform="translate(470,780)"><text clip-path="url(#img/online-deletion-process.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="18.1094">New "Current" DB</text><text clip-path="url(#img/online-deletion-process.svg__clipPath5)" stroke="none" x="5" xml:space="preserve" y="34.2188">begins empty</text></g><g fill="blue" font-family="sans-serif" font-size="14px" stroke="blue" transform="translate(280,360)"><text clip-path="url(#img/online-deletion-process.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="18.1094">Online deletion</text><text clip-path="url(#img/online-deletion-process.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="34.2188">copies objects to the</text><text clip-path="url(#img/online-deletion-process.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="50.3281">"current" database if</text><text clip-path="url(#img/online-deletion-process.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="66.4375">those objects are still</text><text clip-path="url(#img/online-deletion-process.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="82.5469">being used by current</text><text clip-path="url(#img/online-deletion-process.svg__clipPath6)" stroke="none" x="5" xml:space="preserve" y="98.6562">ledgers.</text></g><g transform="translate(160,600)"><path clip-path="url(#img/online-deletion-process.svg__clipPath7)" d="M0.5 0.5 L19 19" fill="none"/><path clip-path="url(#img/online-deletion-process.svg__clipPath7)" d="M19 0.5 L0.5 19" fill="none"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(280,720)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" height="188.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(280,720)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" fill="none" height="188.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/online-deletion-process.svg__clipPath8)" font-family="sans-serif" font-size="14px" stroke="none" x="7" xml:space="preserve" y="18.1094">"Current" DB (Writable)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,830)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(180,830)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,830)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(160,830)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,830)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(140,830)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(120,830)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(120,830)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(240,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(240,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(160,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,830)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(100,830)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(100,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(220,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(220,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(200,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(180,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(140,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(120,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(120,810)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(140,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(240,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(240,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(240,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(240,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(220,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(220,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(220,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(220,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(200,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(200,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(180,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(180,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(160,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(160,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(140,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(140,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(120,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(120,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(120,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(120,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(100,750)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(100,770)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(100,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(120,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(120,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(160,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(200,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(180,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(220,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(220,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(240,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(240,790)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(90,720)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" height="188.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" transform="translate(90,720)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" fill="none" height="188.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/online-deletion-process.svg__clipPath8)" font-family="sans-serif" font-size="14px" stroke="none" x="16" xml:space="preserve" y="18.1094">"Old" DB (Read-only)</text></g><g fill="blue" font-family="sans-serif" font-size="14px" stroke="blue" transform="translate(20,570)"><text clip-path="url(#img/online-deletion-process.svg__clipPath9)" stroke="none" x="5" xml:space="preserve" y="18.1094">Online deletion</text><text clip-path="url(#img/online-deletion-process.svg__clipPath9)" stroke="none" x="5" xml:space="preserve" y="34.2188">drops entire</text><text clip-path="url(#img/online-deletion-process.svg__clipPath9)" stroke="none" x="5" xml:space="preserve" y="50.3281">"Old" DB</text></g><g fill="blue" font-family="sans-serif" font-size="14px" stroke="blue" transform="translate(490,210)"><text clip-path="url(#img/online-deletion-process.svg__clipPath10)" stroke="none" x="5" xml:space="preserve" y="18.1094">The "current" DB can</text><text clip-path="url(#img/online-deletion-process.svg__clipPath10)" stroke="none" x="5" xml:space="preserve" y="34.2188">contain outdated</text><text clip-path="url(#img/online-deletion-process.svg__clipPath10)" stroke="none" x="5" xml:space="preserve" y="50.3281">objects, but it's less</text><text clip-path="url(#img/online-deletion-process.svg__clipPath10)" stroke="none" x="5" xml:space="preserve" y="66.4375">likely to.</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(550,470)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(550,470)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(530,470)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(530,470)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(510,470)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(510,470)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(490,470)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(490,470)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(610,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(610,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(530,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(530,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(470,470)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(470,470)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(470,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(470,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(590,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(590,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(570,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(570,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(550,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(550,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(510,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(510,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(490,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(490,450)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(400,500)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(400,500)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(400,520)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(400,520)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(360,520)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(360,520)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(340,520)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(340,520)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(420,500)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(420,500)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(400,500)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(400,500)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(320,500)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(320,500)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(280,500)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(280,500)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(400,480)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(400,480)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(380,480)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(380,480)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(360,480)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(360,480)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(320,480)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(320,480)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(300,480)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="lime" stroke="lime" transform="translate(300,480)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(510,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(510,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(330,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(330,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,440)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(200,440)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(220,440)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(220,440)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,440)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(180,440)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(240,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(240,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,440)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(140,440)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(160,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(180,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(160,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,440)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(160,440)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(100,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(240,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(240,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(220,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(220,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(200,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(140,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(120,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(120,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(100,420)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(220,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(220,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(200,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(180,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(140,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(120,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(120,400)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(90,360)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" height="188.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" transform="translate(90,360)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" fill="none" height="188.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/online-deletion-process.svg__clipPath8)" font-family="sans-serif" font-size="14px" stroke="none" x="16" xml:space="preserve" y="18.1094">"Old" DB (Read-only)</text></g><g font-family="sans-serif" font-size="14px" font-weight="bold" transform="translate(40,330)"><text clip-path="url(#img/online-deletion-process.svg__clipPath3)" stroke="none" x="5" xml:space="preserve" y="18.1094">During online deletion</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(610,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(610,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(610,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(610,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(590,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(590,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(590,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(590,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(570,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(570,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(570,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(570,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(550,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(550,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(550,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(550,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(530,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(530,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(530,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(530,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(510,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(510,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(510,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(510,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(490,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(490,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(490,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(490,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(470,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(470,390)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(470,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(470,410)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(470,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(470,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(490,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(490,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(530,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(530,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(570,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(570,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(550,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(550,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(590,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(590,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(610,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(610,430)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(460,360)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" height="188.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(460,360)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" fill="none" height="188.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/online-deletion-process.svg__clipPath8)" font-family="sans-serif" font-size="14px" stroke="none" x="7" xml:space="preserve" y="18.1094">"Current" DB (Writable)</text></g><g font-family="sans-serif" font-size="14px" font-weight="bold" transform="translate(30,30)"><text clip-path="url(#img/online-deletion-process.svg__clipPath3)" stroke="none" x="5" xml:space="preserve" y="18.1094">Before online deletion</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(310,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(310,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(290,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(290,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(430,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(430,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(410,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(410,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(390,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(390,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(370,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(370,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(350,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(350,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(430,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(430,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(430,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(430,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(290,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(290,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(410,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(410,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(410,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(410,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(390,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(390,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(390,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(390,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(370,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(370,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(370,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(370,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(330,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(330,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(310,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(310,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(350,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(350,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(350,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(350,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(330,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(330,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(310,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(310,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(290,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(290,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g font-family="sans-serif" font-size="14px" transform="translate(560,130)"><text clip-path="url(#img/online-deletion-process.svg__clipPath11)" stroke="none" x="5" xml:space="preserve" y="18.1094">Objects included in recent</text><text clip-path="url(#img/online-deletion-process.svg__clipPath11)" stroke="none" x="5" xml:space="preserve" y="34.2188">ledger version(s)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(540,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(540,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g font-family="sans-serif" font-size="14px" transform="translate(560,70)"><text clip-path="url(#img/online-deletion-process.svg__clipPath11)" stroke="none" x="5" xml:space="preserve" y="18.1094">Objects not used in any</text><text clip-path="url(#img/online-deletion-process.svg__clipPath11)" stroke="none" x="5" xml:space="preserve" y="34.2188">recent ledger version</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(540,80)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(540,80)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(200,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(220,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(220,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(180,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(240,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(240,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(140,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(160,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(180,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(160,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(160,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(160,140)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(100,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(240,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(240,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(220,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(220,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(200,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(140,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(120,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(120,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(100,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(100,120)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(220,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(220,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(200,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(200,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(180,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(180,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(140,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(140,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(120,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" height="18.5" stroke="none" width="18.5" x="0.5" y="0.5"/></g><g transform="translate(120,100)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath7)" fill="none" height="18.5" width="18.5" x="0.5" y="0.5"/></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(280,60)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" height="188.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g transform="translate(280,60)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" fill="none" height="188.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/online-deletion-process.svg__clipPath8)" font-family="sans-serif" font-size="14px" stroke="none" x="7" xml:space="preserve" y="18.1094">"Current" DB (Writable)</text></g><g fill="rgb(255,255,255)" fill-opacity="0" stroke="rgb(255,255,255)" stroke-opacity="0" transform="translate(90,60)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" height="188.5" stroke="none" width="178.5" x="0.5" y="0.5"/></g><g fill="rgb(120,120,120)" stroke="rgb(120,120,120)" transform="translate(90,60)"><rect clip-path="url(#img/online-deletion-process.svg__clipPath8)" fill="none" height="188.5" width="178.5" x="0.5" y="0.5"/><text clip-path="url(#img/online-deletion-process.svg__clipPath8)" font-family="sans-serif" font-size="14px" stroke="none" x="16" xml:space="preserve" y="18.1094">"Old" DB (Read-only)</text></g><g fill="blue" stroke="blue" stroke-dasharray="1,2" stroke-linecap="butt" stroke-miterlimit="5" transform="translate(340,160)"><path clip-path="url(#img/online-deletion-process.svg__clipPath12)" d="M10.5 10.5 L140.5 80.5" fill="none"/></g><g transform="translate(160,550)"><path clip-path="url(#img/online-deletion-process.svg__clipPath13)" d="M10.5 39.5 L10.5 10.5" fill="none"/><path clip-path="url(#img/online-deletion-process.svg__clipPath13)" d="M17 28.7417 L10.5 40 L4 28.7417 Z" stroke="none"/><path clip-path="url(#img/online-deletion-process.svg__clipPath13)" d="M17 28.7417 L10.5 40 L4 28.7417 Z" fill="none"/></g><g transform="translate(230,550)"><path clip-path="url(#img/online-deletion-process.svg__clipPath14)" d="M11.3575 159.9855 L260.5 10.5" fill="none"/><path clip-path="url(#img/online-deletion-process.svg__clipPath14)" d="M23.9269 160.0241 L10.9287 160.2428 L17.2385 148.8767 Z" stroke="none"/><path clip-path="url(#img/online-deletion-process.svg__clipPath14)" d="M23.9269 160.0241 L10.9287 160.2428 L17.2385 148.8767 Z" fill="none"/></g><g transform="translate(440,490)"><path clip-path="url(#img/online-deletion-process.svg__clipPath15)" d="M49.5299 10.7425 L10.5 20.5" fill="none"/><path clip-path="url(#img/online-deletion-process.svg__clipPath15)" d="M37.5163 7.0459 L50.0149 10.6213 L40.6692 19.6577 Z" stroke="none"/><path clip-path="url(#img/online-deletion-process.svg__clipPath15)" d="M37.5163 7.0459 L50.0149 10.6213 L40.6692 19.6577 Z" fill="none"/></g><g transform="translate(170,460)"><path clip-path="url(#img/online-deletion-process.svg__clipPath16)" d="M99.5862 50.0939 L10.5 10.5" fill="none"/><path clip-path="url(#img/online-deletion-process.svg__clipPath16)" d="M92.395 39.7847 L100.0431 50.2969 L87.1152 51.6643 Z" stroke="none"/><path clip-path="url(#img/online-deletion-process.svg__clipPath16)" d="M92.395 39.7847 L100.0431 50.2969 L87.1152 51.6643 Z" fill="none"/></g></g></svg></a></figure>

## See Also

- **Concepts:**
    - [Ledgers](ledgers.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Capacity Planning](capacity-planning.html)
    - [Configure `rippled`](configure-rippled.html)
        - [Configure Online Deletion](configure-online-deletion.html)
        - [Configure Advisory Deletion](configure-advisory-deletion.html)
        - [Configure History Sharding](configure-history-sharding.html)
        - [Configure Full History](configure-full-history.html)
- **References:**
    - [ledger method][]
    - [server_info method][]
    - [ledger_request method][]
    - [can_delete method][]
    - [ledger_cleaner method][]


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
