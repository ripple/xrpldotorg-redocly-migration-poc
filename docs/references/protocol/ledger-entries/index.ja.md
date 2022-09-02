---
html: ledger-data-formats.html
parent: protocol-reference.html
blurb: XRP Ledgerの共有状態を構成する個別のデータオブジェクトについて説明します。
labels:
  - データ保持
---
# レジャーのデータ型

XRP Ledgerに各レジャーバージョンは3つの要素で構成されています：

* **[レジャーヘッダー](ledger-header.html)**： このレジャーに関してメタデータです。
* **[トランザクションセット](transaction-formats.html)**： このレジャーの作成時に、直前のレジャーに適用されたトランザクション。
* **[状態データ](ledger-object-types.html)**： このバージョンのレジャーの設定、残高、オブジェクトを含むすべてのレジャーオブジェクト。


## 状態データ

{% include '_snippets/ledger-objects-intro.ja.md' %}

## レジャーオブジェクトID
<a id="sha512half"></a>

レジャーの状態ツリーのすべてのオブジェクトには一意のIDがあります。このフィールドは、オブジェクトの内容と同じレベルでJSONの`index`フィールドとして返されます。IDは、オブジェクトの重要な内容をハッシュし、[名前空間ID](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/LedgerFormats.h#L99)を使用して生成されます。[レジャーオブジェクトタイプ](ledger-object-types.html)により、使用する名前空間IDとハッシュに含める内容が決定します。これにより、すべてのIDが一意になります。ハッシュを計算するため、`rippled`はSHA-512を使用し、その結果を最初の256バイトで切り捨てます。**SHA-512ハーフ**と呼ばれるこのアルゴリズム出力は、SHA-256と同等のセキュリティで、64ビットプロセッサーでは実行にかかる時間が短くなります。

{{ include_svg("img/ledger-object-ids.ja.svg", "図: rippledによる、SHA-512ハーフを使用したレジャーオブジェクトIDの生成。スペースキーは、異なるオブジェクトタイプIDの競合を防止します。") }}

{% from '_snippets/macros/page-children.md' import page_children with context %}
{{ page_children(pages|selectattr("html", "eq", "ledger-object-types.html")|first, 1, 1, True) }}
