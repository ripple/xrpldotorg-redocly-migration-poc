---
html: install-rippled-on-centos-rhel-with-yum.html
parent: install-rippled.html
blurb: Install a precompiled rippled binary on CentOS or Red Hat Enterprise Linux.
labels:
  - Core Server
---
# Install on CentOS/Red Hat with yum

This page describes the recommended instructions for installing the latest stable version of `rippled` on **CentOS 7** or **Red Hat Enterprise Linux 7**, using Ripple's [yum](https://en.wikipedia.org/wiki/Yellowdog_Updater,_Modified) repository.

These instructions install a binary that has been compiled by Ripple.


## Prerequisites

Before you install `rippled`, you must meet the [System Requirements](system-requirements.md).


## Installation Steps

1. Install the Ripple RPM repository:

    Choose the appropriate RPM repository for the stability of releases you want:

    - `stable` for the latest production release (`master` branch)
    - `unstable` for pre-release builds (`release` branch)
    - `nightly` for experimental/development builds (`develop` branch)

    <!-- MULTICODE_BLOCK_START -->

    *Stable*

        cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
        [ripple-stable]
        name=XRP Ledger Packages
        enabled=1
        gpgcheck=0
        repo_gpgcheck=1
        baseurl=https://repos.ripple.com/repos/rippled-rpm/stable/
        gpgkey=https://repos.ripple.com/repos/rippled-rpm/stable/repodata/repomd.xml.key
        REPOFILE

    *Pre-release*

        cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
        [ripple-unstable]
        name=XRP Ledger Packages
        enabled=1
        gpgcheck=0
        repo_gpgcheck=1
        baseurl=https://repos.ripple.com/repos/rippled-rpm/unstable/
        gpgkey=https://repos.ripple.com/repos/rippled-rpm/unstable/repodata/repomd.xml.key
        REPOFILE

    *Development*

        cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
        [ripple-nightly]
        name=XRP Ledger Packages
        enabled=1
        gpgcheck=0
        repo_gpgcheck=1
        baseurl=https://repos.ripple.com/repos/rippled-rpm/nightly/
        gpgkey=https://repos.ripple.com/repos/rippled-rpm/nightly/repodata/repomd.xml.key
        REPOFILE

    *XLS-20d*

        cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
        [xls20]
        name=xls20
        baseurl=https://repos.ripple.com/repos/rippled-rpm-test-mirror/xls20
        enabled=1
        gpgcheck=0
        repo_gpgcheck=1
        gpgkey=https://repos.ripple.com/repos/rippled-rpm-test-mirror/xls20/repodata/repomd.xml.key
        REPOFILE

    <!-- MULTICODE_BLOCK_START -->


2. Fetch the latest repo updates:

        sudo yum -y update

3. Install the new `rippled` package:

        sudo yum install rippled

4. Reload systemd unit files:

        sudo systemctl daemon-reload

5. Configure the `rippled` service to start on boot:

        sudo systemctl enable rippled.service

6. Start the `rippled` service:

        sudo systemctl start rippled.service


## Next Steps

It can take several minutes to sync with the rest of the XRP Ledger network, during which time the server outputs various warnings. For information about log messages, see [Understanding Log Messages](../troubleshooting/understanding-log-messages.md).

You can use the [`rippled` commandline interface](get-started-using-http-websocket-apis.html#commandline) to see if your server is synced with the network:

    /opt/ripple/bin/rippled server_info

If the `server_state` in the response is `full` or `proposing`, then your server is fully synced to the network. Otherwise, you may need to wait longer. Fresh servers usually sync within 15 minutes; servers that already have [ledger history](../../ledger-history/index.md) stored can take longer.

After your server has synchronized with the rest of the network, you have a fully functional XRP Ledger peer-to-peer server that you can use to submit transactions or get API access to the XRP Ledger. See [Client Libraries](../../../references/client-libraries.md) or [HTTP / WebSocket APIs](../../../references/http-websocket-apis/index.mdx) for different ways to communicate with the server.

If you use the XRP Ledger for your business or you just want to contribute to the stability of the network, you should run one server as a validator. For information about validating servers and why you might want to run one, see [Run rippled as a Validator](../configuration/run-rippled-as-a-validator.md).

Having trouble getting your server started? See [rippled Server Won't Start](../troubleshooting/server-wont-start.md).

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
