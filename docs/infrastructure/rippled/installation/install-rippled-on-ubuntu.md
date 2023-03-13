---
html: install-rippled-on-ubuntu.html
parent: install-rippled.html
blurb: Install a precompiled rippled binary on Ubuntu Linux.
labels:
  - Core Server
---
# Install on Ubuntu or Debian Linux

This page describes the recommended instructions for installing the latest stable version of `rippled` on **Ubuntu Linux 18.04 or higher** or **Debian 10 or higher**, using the [`apt`](https://ubuntu.com/server/docs) utility.

These instructions install a binary that has been compiled by Ripple.


## Prerequisites

Before you install `rippled`, you must meet the [System Requirements](system-requirements.md).


## Installation Steps

1. Update repositories:

        sudo apt -y update

2. Install utilities:

        sudo apt -y install apt-transport-https ca-certificates wget gnupg

3. Add Ripple's package-signing GPG key to your list of trusted keys:

        sudo mkdir /usr/local/share/keyrings/
        wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | gpg --dearmor > ripple-key.gpg
        sudo mv ripple-key.gpg /usr/local/share/keyrings


4. Check the fingerprint of the newly-added key:

        gpg /usr/local/share/keyrings/ripple-key.gpg

    The output should include an entry for Ripple such as the following:

        gpg: WARNING: no command supplied.  Trying to guess what you mean ...
        pub   rsa3072 2019-02-14 [SC] [expires: 2026-02-17]
            C0010EC205B35A3310DC90DE395F97FFCCAFD9A2
        uid           TechOps Team at Ripple <techops+rippled@ripple.com>
        sub   rsa3072 2019-02-14 [E] [expires: 2026-02-17]


    In particular, make sure that the fingerprint matches. (In the above example, the fingerprint is on the third line, starting with `C001`.)

4. Add the appropriate Ripple repository for your operating system version:

        echo "deb [signed-by=/usr/local/share/keyrings/ripple-key.gpg] https://repos.ripple.com/repos/rippled-deb focal stable" | \
            sudo tee -a /etc/apt/sources.list.d/ripple.list

    The above example is appropriate for **Ubuntu 20.04 Focal Fossa**. For other operating systems, replace the word `focal` with one of the following:

    - `bionic` for **Ubuntu 18.04 Bionic Beaver**
    - `buster` for **Debian 10 Buster**
    - `bullseye` for **Debian 11 Bullseye**

    If you want access to development or pre-release versions of `rippled`, use one of the following instead of `stable`:

    - `unstable` - Pre-release builds ([`release` branch](https://github.com/ripple/rippled/tree/release))
    - `nightly` - Experimental/development builds ([`develop` branch](https://github.com/ripple/rippled/tree/develop))

    **Warning:** Unstable and nightly builds may be broken at any time. Do not use these builds for production servers.

5. Fetch the Ripple repository.

        sudo apt -y update

6. Install the `rippled` software package:

        sudo apt -y install rippled

7. Check the status of the `rippled` service:

        systemctl status rippled.service

    The `rippled` service should start automatically. If not, you can start it manually:

        sudo systemctl start rippled.service

    To configure it to start automatically on boot:

        sudo systemctl enable rippled.service

8. Optional: allow `rippled` to bind to privileged ports.

    This allows you to serve incoming API requests on port 80 or 443. (If you want to do so, you must also update the config file's port settings.)

        sudo setcap 'cap_net_bind_service=+ep' /opt/ripple/bin/rippled


## Next Steps

It can take several minutes to sync with the rest of the XRP Ledger network, during which time the server outputs various warnings. For information about log messages, see [Understanding Log Messages](../troubleshooting/understanding-log-messages.md).

You can use the [`rippled` commandline interface](get-started-using-http-websocket-apis.html#commandline) to see if your server is synced with the network:

    ./rippled server_info

If the `server_state` in the response is `full` or `proposing`, then your server is fully synced to the network. Otherwise, you may need to wait longer. Fresh servers usually sync within 15 minutes; servers that already have [ledger history](../../ledger-history/index.md) stored can take longer.

After your server has synchronized with the rest of the network, you have a fully functional XRP Ledger peer-to-peer server that you can use to submit transactions or get API access to the XRP Ledger. See [Client Libraries](client-libraries.html) or [HTTP / WebSocket APIs](../../../references/http-websocket-apis.html) for different ways to communicate with the server.

If you use the XRP Ledger for your business or you just want to contribute to the stability of the network, you should run one server as a validator. For information about validating servers and why you might want to run one, see [Run rippled as a Validator](run-rippled-as-a-validator.html).

Having trouble getting your server started? See [rippled Server Won't Start](server-wont-start.html).

### Additional Configuration

`rippled` should connect to the XRP Ledger with the default configuration. However, you can change your settings by editing the `rippled.cfg` file. For recommendations about configuration settings, see [Capacity Planning](capacity-planning.md).

The [recommended installation](index.mdx) uses the config file `/etc/opt/ripple/rippled.cfg` by default. Other places you can put a config file include `$HOME/.config/ripple/rippled.cfg` (where `$HOME` is the home directory of the user running `rippled`), `$HOME/.local/ripple/rippled.cfg`, or the current working directory from where you start `rippled`.

See [the `rippled` GitHub repository](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg) for a description of all configuration options.

You must restart `rippled` for any configuration changes to take effect:

        sudo systemctl restart rippled.service

If you change the `[debug_logfile]` or `[database_path]` sections, you may need to grant ownership of the new configured path to the user you run `rippled` as.


### Updates

You must update `rippled` regularly to remain synced with the rest of the XRP Ledger network. You can subscribe to the [rippled Google Group](https://groups.google.com/forum/#!forum/ripple-server) to receive notifications of new `rippled` releases.

The `rippled` package includes a script you can use to [enable automatic updates on Linux](update-rippled-automatically-on-linux.md). On other platforms, you must update manually.


## See Also

- **Understanding the XRPL:**
    - [The `rippled` Server](../../../concepts/understanding-xrpl/server/xrpl-servers.md)
    - [Consensus](../../../concepts/understanding-xrpl/xrpl/consensus.md)
- **XRPL Infrastructure:**
    - [Configure rippled](../configuration/index.mdx)
    - [Troubleshoot rippled](../troubleshooting/index.mdx)
- **Tutorials:**
    - [Get Started with the rippled API](get-started-using-http-websocket-apis.html)
- **API Reference:**
    - [HTTP / Websocket APIs](../../../references/http-websocket-apis/index.mdx)
        - [`rippled` Commandline Usage](../../../references/http-websocket-apis/commandline-usage.md)
        - [server_info method][]


<!--{# common link defs #}-->
<!-- {% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %} -->
