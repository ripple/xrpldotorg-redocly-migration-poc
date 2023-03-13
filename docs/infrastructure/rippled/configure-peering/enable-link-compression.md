---
html: enable-link-compression.html
parent: configure-peering.html
blurb: Save bandwidth by compressing peer-to-peer communications.
labels:
  - Core Server
---
# Enable Link Compression

The `rippled` server can save bandwidth by compressing its peer-to-peer communications, at a cost of greater CPU usage. If you enable link compression, the server automatically compresses communications with peer servers that also have link compression enabled.

## Steps

To enable link compression on your server, complete the following steps:

### 1. Edit your `rippled` server's config file.

```sh
$ vim /etc/opt/ripple/rippled.cfg
```

The [recommended installation](../installation/index.mdx) uses the config file `/etc/opt/ripple/rippled.cfg` by default. Other places you can put a config file include `$HOME/.config/ripple/rippled.cfg` (where `$HOME` is the home directory of the user running `rippled`), `$HOME/.local/ripple/rippled.cfg`, or the current working directory from where you start `rippled`.

### 2. In the config file, add or uncomment the `[compression]` stanza.

To enable compression:

```text
[compression]
true
```

Use `false` to disable compression (the default).

### 3. Restart the `rippled` server

```sh
$ sudo systemctl restart rippled.service
```

After the restart, your server automatically uses link compression with other peers that also have link compression enabled.

## See Also

- [Capacity Planning](../installation/capacity-planning.md)
- [Peer Protocol](../../peer-protocol.md)

<!--{# common link defs #}-->
<!-- {% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %} -->
