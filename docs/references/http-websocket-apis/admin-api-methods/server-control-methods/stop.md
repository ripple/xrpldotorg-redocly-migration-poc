---
html: stop.html
parent: server-control-methods.html
blurb: Shut down the rippled server.
labels:
  - Core Server
---
# stop
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Stop.cpp "Source")

Gracefully shuts down the server.

*The `stop` method is an [admin method](admin-api-methods.html) that cannot be run by unprivileged users!*

### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "id": 0,
    "command": "stop"
}
```

*JSON-RPC*

```json
{
    "method": "stop",
    "params": [
        {}
    ]
}
```

*Commandline*

```sh
#Syntax: stop
rippled stop
```

<!-- MULTICODE_BLOCK_END -->

The request includes no parameters.

### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```json
{
   "result" : {
      "message" : "ripple server stopping",
      "status" : "success"
   }
}
```

*Commandline*

```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "message" : "ripple server stopping",
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                          |
|:----------|:-------|:-------------------------------------|
| `message` | String | `ripple server stopping` on success. |

### Possible Errors

* Any of the [universal error types][].

<!--{# common link defs #}-->
{% partial file="/_snippets/_rippled-api-links.md" /%}
{% partial file="/_snippets/_tx-type-links.md" /%}
{% partial file="/_snippets/_rippled_versions.md" /%}
