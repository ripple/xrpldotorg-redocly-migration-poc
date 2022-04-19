# validators
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Validators.cpp "Source")

The `validators` command returns human readable information about the current list of published and [trusted validators](intro-to-consensus.html#trust-based-validation) used by the server. [New in: rippled 0.80.1][]

*The `validators` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users!*

### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "validators_example",
  "command": "validators"
}
```

*JSON-RPC*

```json
{
    "method": "validators",
    "params": [
        {}
    ]
}
```

*Commandline*

```sh
#Syntax: validators
rippled validators
```

<!-- MULTICODE_BLOCK_END -->

The request includes no parameters.

### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "validators_example",
  "result": {
    "local_static_keys": [],
    "publisher_lists": [
      {
        "available": true,
        "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
        "list": [
          "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
          "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
          "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
          "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
          "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
          "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
          "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
          "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
          "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
          "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
          "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
          "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
          "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
          "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
          "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
          "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
          "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
          "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA",
          "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
          "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
          "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
          "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
          "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
          "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
          "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
          "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
          "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
          "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
          "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
          "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
          "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
          "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
          "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
          "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj"
        ],
        "pubkey_publisher": "ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734",
        "seq": 70,
        "uri": "https://vl.ripple.com",
        "version": 1
      }
    ],
    "signing_keys": {
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA": "n9KeTQ3UyMtaJJD78vT7QiGRMv1GcWHEnhNbwKfdbW2HfRqtvUUt",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr": "n9MfeCuZK2ra5eJtFDtuCTnvxfsi85k4J3GXJ1TvRVr2o4EQeHMF",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm": "n9KhsMP6jKFQPpjJ9VwqyZSwrL4shdX9YknRwmsAVL1RNVrx4jLm",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec": "n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9": "n9KnrcCmL5psyKtk2KWP6jy14Hj4EXuZDg7XMdQJ9cSDoFSp53hu",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE": "n9LCf7NtwcyXVc5fYB6UVByRoQZqJDhrMUoKnr3GQB6mFqpcmMzg",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz": "n9Jk38y9XCznqiLq53UjREJQbZWnz4Pvmph55GP5ofUPg3RG8eVr",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj": "n9MSTcx1fmfyKpaDTtpXucugcqM7yxpaggmwRxcyA3Nr4pE1pN3x",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za": "n9Kb81J9kqGgYkrNDRSPT3UCgz8Bei1CPHGMt85yxz9mUSvuzV5k",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA": "n9K2FpCqZftM1xXXaWXFPVbEimLX6MEjrmQywfSutkdK1PRvqDb2",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji": "n9MhLZsK7Av6ny2gV5SAGLDsnFXE9p85aYR8diD8xvuvuucqad85",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT": "n9JtY9MqUcwKWenHp8WoRobFRmB2mmBEJd1ruJmhKGKAwtFQkQjb",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn": "n9Km4Xz53K9kcTaVn3mYAHsXqNuAo7A2HazSr34SFufvNwBxYGLn",
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW": "n9Lqr4YZxk7WYRDTBZjjmoAraikLCjAgAswaPaZ6LaGW6Q4Y2eoo",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p": "n9LMfcjE6dMyshCqiftLFXpB9K3Mnd2r5bG7K8osmrkFpHUoR3c1",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC": "n9MZ7EVGKypqdyNguP31xSqhFqDBF4V5FESLMmLiGrBJ3khP2AzQ",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF": "n9Lq9bekeVhCsW8dwqzfvKsqUiu9Qxvwk9YmF2hxkBJjNrGNL5Fw",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz": "n9LLqqH1cVFPjEnQYFQ6DooxuhHPQxwXgMjDGrpJ6pb1WGDoi76Q",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C": "n9J1GJHtua77TBEzir3FvsgWX68xBFeC8os3s5TkCg97E1cwxKfH",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw": "n9McDrz9tPujrQK3vMXJXzuEJv1B8UG3opfZEsFA8t6QxdZh1H6m",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5": "n9M2UqXLK25h9YEQTskmCXbWPGhQmB1pFVqeXia38UwLaL838VbG",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn": "n9LkAv98aaGupypuLMH5ogjJ3rTEX178s9EnmRvmySL9k3cVuxTu",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw": "n9L3GcKLGWoz79RPfYq9GjEVyh57vpe1wM45i2tdczJ9u15ajAFB",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy": "n9KVcHedX11X6vCFNaZSGT2pUdbnd8PUpNGYP6BPutvYxQQy8DKo",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW": "n9KSXAVPy6ac8aX88fRsJN6eSrJ2gEfGrfskUVJJ7XkopGsKNg9X",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ": "n94RkpbJYRYQrWUmL8PAVQ1XTVKtfyKkLm8C6SWzWPcKEbuNb6EV",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp": "n9LbDLg9F7ExZCeMw1QZqsd1Ejs9uYpwd8bPUStF5hBJdd6B5aWj",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK": "n9JebyUXwBa5GoYJQ6AbupoMKyE2zaiR3FTfDTMkxpMMv1KPmQEn",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam": "n9LFSE8fQ6Ljnc97ToHVtv1sYZ3GpzrXKpT94eFDk8jtdbfoBe7N",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz": "n9Ls4GcrofTvLvymKh1wCqxw1aLzXUumyBBD9fAtbkk9WtdQ4TUH",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK": "n943ozDG74swHRmAjzY6A4KVFBhEirF4Sh1ACqvDePE3CZTgkMqn",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR": "n9KAE7DUEB62ZQ3yWzygKWWqsj7ZqchW5rXg63puZA46k7WzGfQu",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y": "n9JkSnNqXxEct1t78dwVZDjq7PsznXtukxjyGvGJr4TdwVSbd7DJ",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H": "n9KQ2DVL7QhgovChk81W8idxm7wDsYzXutDMQzwUBKuxb9WTWBVG",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C": "n9KY4JZY11ndNbg55dThnoQdU9dii5q3egzoESVXw4Z7hu3maCba"
    },
    "trusted_validator_keys": [
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA"
    ],
    "validation_quorum": 28,
    "validator_list": {
      "count": 1,
      "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
      "status": "active"
    }
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
200 OK

{
  "result": {
    "local_static_keys": [],
    "publisher_lists": [
      {
        "available": true,
        "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
        "list": [
          "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
          "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
          "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
          "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
          "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
          "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
          "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
          "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
          "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
          "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
          "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
          "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
          "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
          "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
          "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
          "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
          "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
          "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA",
          "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
          "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
          "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
          "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
          "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
          "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
          "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
          "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
          "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
          "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
          "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
          "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
          "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
          "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
          "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
          "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj"
        ],
        "pubkey_publisher": "ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734",
        "seq": 70,
        "uri": "https://vl.ripple.com",
        "version": 1
      }
    ],
    "signing_keys": {
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA": "n9KeTQ3UyMtaJJD78vT7QiGRMv1GcWHEnhNbwKfdbW2HfRqtvUUt",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr": "n9MfeCuZK2ra5eJtFDtuCTnvxfsi85k4J3GXJ1TvRVr2o4EQeHMF",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm": "n9KhsMP6jKFQPpjJ9VwqyZSwrL4shdX9YknRwmsAVL1RNVrx4jLm",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec": "n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9": "n9KnrcCmL5psyKtk2KWP6jy14Hj4EXuZDg7XMdQJ9cSDoFSp53hu",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE": "n9LCf7NtwcyXVc5fYB6UVByRoQZqJDhrMUoKnr3GQB6mFqpcmMzg",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz": "n9Jk38y9XCznqiLq53UjREJQbZWnz4Pvmph55GP5ofUPg3RG8eVr",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj": "n9MSTcx1fmfyKpaDTtpXucugcqM7yxpaggmwRxcyA3Nr4pE1pN3x",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za": "n9Kb81J9kqGgYkrNDRSPT3UCgz8Bei1CPHGMt85yxz9mUSvuzV5k",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA": "n9K2FpCqZftM1xXXaWXFPVbEimLX6MEjrmQywfSutkdK1PRvqDb2",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji": "n9MhLZsK7Av6ny2gV5SAGLDsnFXE9p85aYR8diD8xvuvuucqad85",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT": "n9JtY9MqUcwKWenHp8WoRobFRmB2mmBEJd1ruJmhKGKAwtFQkQjb",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn": "n9Km4Xz53K9kcTaVn3mYAHsXqNuAo7A2HazSr34SFufvNwBxYGLn",
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW": "n9Lqr4YZxk7WYRDTBZjjmoAraikLCjAgAswaPaZ6LaGW6Q4Y2eoo",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p": "n9LMfcjE6dMyshCqiftLFXpB9K3Mnd2r5bG7K8osmrkFpHUoR3c1",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC": "n9MZ7EVGKypqdyNguP31xSqhFqDBF4V5FESLMmLiGrBJ3khP2AzQ",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF": "n9Lq9bekeVhCsW8dwqzfvKsqUiu9Qxvwk9YmF2hxkBJjNrGNL5Fw",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz": "n9LLqqH1cVFPjEnQYFQ6DooxuhHPQxwXgMjDGrpJ6pb1WGDoi76Q",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C": "n9J1GJHtua77TBEzir3FvsgWX68xBFeC8os3s5TkCg97E1cwxKfH",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw": "n9McDrz9tPujrQK3vMXJXzuEJv1B8UG3opfZEsFA8t6QxdZh1H6m",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5": "n9M2UqXLK25h9YEQTskmCXbWPGhQmB1pFVqeXia38UwLaL838VbG",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn": "n9LkAv98aaGupypuLMH5ogjJ3rTEX178s9EnmRvmySL9k3cVuxTu",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw": "n9L3GcKLGWoz79RPfYq9GjEVyh57vpe1wM45i2tdczJ9u15ajAFB",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy": "n9KVcHedX11X6vCFNaZSGT2pUdbnd8PUpNGYP6BPutvYxQQy8DKo",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW": "n9KSXAVPy6ac8aX88fRsJN6eSrJ2gEfGrfskUVJJ7XkopGsKNg9X",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ": "n94RkpbJYRYQrWUmL8PAVQ1XTVKtfyKkLm8C6SWzWPcKEbuNb6EV",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp": "n9LbDLg9F7ExZCeMw1QZqsd1Ejs9uYpwd8bPUStF5hBJdd6B5aWj",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK": "n9JebyUXwBa5GoYJQ6AbupoMKyE2zaiR3FTfDTMkxpMMv1KPmQEn",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam": "n9LFSE8fQ6Ljnc97ToHVtv1sYZ3GpzrXKpT94eFDk8jtdbfoBe7N",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz": "n9Ls4GcrofTvLvymKh1wCqxw1aLzXUumyBBD9fAtbkk9WtdQ4TUH",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK": "n943ozDG74swHRmAjzY6A4KVFBhEirF4Sh1ACqvDePE3CZTgkMqn",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR": "n9KAE7DUEB62ZQ3yWzygKWWqsj7ZqchW5rXg63puZA46k7WzGfQu",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y": "n9JkSnNqXxEct1t78dwVZDjq7PsznXtukxjyGvGJr4TdwVSbd7DJ",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H": "n9KQ2DVL7QhgovChk81W8idxm7wDsYzXutDMQzwUBKuxb9WTWBVG",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C": "n9KY4JZY11ndNbg55dThnoQdU9dii5q3egzoESVXw4Z7hu3maCba"
    },
    "status": "success",
    "trusted_validator_keys": [
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA"
    ],
    "validation_quorum": 28,
    "validator_list": {
      "count": 1,
      "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
      "status": "active"
    }
  }
}
```

*Commandline*

```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result": {
    "local_static_keys": [],
    "publisher_lists": [
      {
        "available": true,
        "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
        "list": [
          "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
          "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
          "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
          "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
          "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
          "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
          "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
          "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
          "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
          "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
          "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
          "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
          "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
          "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
          "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
          "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
          "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
          "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA",
          "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
          "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
          "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
          "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
          "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
          "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
          "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
          "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
          "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
          "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
          "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
          "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
          "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
          "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
          "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
          "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj"
        ],
        "pubkey_publisher": "ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734",
        "seq": 70,
        "uri": "https://vl.ripple.com",
        "version": 1
      }
    ],
    "signing_keys": {
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA": "n9KeTQ3UyMtaJJD78vT7QiGRMv1GcWHEnhNbwKfdbW2HfRqtvUUt",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr": "n9MfeCuZK2ra5eJtFDtuCTnvxfsi85k4J3GXJ1TvRVr2o4EQeHMF",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm": "n9KhsMP6jKFQPpjJ9VwqyZSwrL4shdX9YknRwmsAVL1RNVrx4jLm",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec": "n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9": "n9KnrcCmL5psyKtk2KWP6jy14Hj4EXuZDg7XMdQJ9cSDoFSp53hu",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE": "n9LCf7NtwcyXVc5fYB6UVByRoQZqJDhrMUoKnr3GQB6mFqpcmMzg",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz": "n9Jk38y9XCznqiLq53UjREJQbZWnz4Pvmph55GP5ofUPg3RG8eVr",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj": "n9MSTcx1fmfyKpaDTtpXucugcqM7yxpaggmwRxcyA3Nr4pE1pN3x",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za": "n9Kb81J9kqGgYkrNDRSPT3UCgz8Bei1CPHGMt85yxz9mUSvuzV5k",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA": "n9K2FpCqZftM1xXXaWXFPVbEimLX6MEjrmQywfSutkdK1PRvqDb2",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji": "n9MhLZsK7Av6ny2gV5SAGLDsnFXE9p85aYR8diD8xvuvuucqad85",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT": "n9JtY9MqUcwKWenHp8WoRobFRmB2mmBEJd1ruJmhKGKAwtFQkQjb",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn": "n9Km4Xz53K9kcTaVn3mYAHsXqNuAo7A2HazSr34SFufvNwBxYGLn",
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW": "n9Lqr4YZxk7WYRDTBZjjmoAraikLCjAgAswaPaZ6LaGW6Q4Y2eoo",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p": "n9LMfcjE6dMyshCqiftLFXpB9K3Mnd2r5bG7K8osmrkFpHUoR3c1",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC": "n9MZ7EVGKypqdyNguP31xSqhFqDBF4V5FESLMmLiGrBJ3khP2AzQ",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF": "n9Lq9bekeVhCsW8dwqzfvKsqUiu9Qxvwk9YmF2hxkBJjNrGNL5Fw",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz": "n9LLqqH1cVFPjEnQYFQ6DooxuhHPQxwXgMjDGrpJ6pb1WGDoi76Q",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C": "n9J1GJHtua77TBEzir3FvsgWX68xBFeC8os3s5TkCg97E1cwxKfH",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw": "n9McDrz9tPujrQK3vMXJXzuEJv1B8UG3opfZEsFA8t6QxdZh1H6m",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5": "n9M2UqXLK25h9YEQTskmCXbWPGhQmB1pFVqeXia38UwLaL838VbG",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn": "n9LkAv98aaGupypuLMH5ogjJ3rTEX178s9EnmRvmySL9k3cVuxTu",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw": "n9L3GcKLGWoz79RPfYq9GjEVyh57vpe1wM45i2tdczJ9u15ajAFB",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy": "n9KVcHedX11X6vCFNaZSGT2pUdbnd8PUpNGYP6BPutvYxQQy8DKo",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW": "n9KSXAVPy6ac8aX88fRsJN6eSrJ2gEfGrfskUVJJ7XkopGsKNg9X",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ": "n94RkpbJYRYQrWUmL8PAVQ1XTVKtfyKkLm8C6SWzWPcKEbuNb6EV",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp": "n9LbDLg9F7ExZCeMw1QZqsd1Ejs9uYpwd8bPUStF5hBJdd6B5aWj",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK": "n9JebyUXwBa5GoYJQ6AbupoMKyE2zaiR3FTfDTMkxpMMv1KPmQEn",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam": "n9LFSE8fQ6Ljnc97ToHVtv1sYZ3GpzrXKpT94eFDk8jtdbfoBe7N",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz": "n9Ls4GcrofTvLvymKh1wCqxw1aLzXUumyBBD9fAtbkk9WtdQ4TUH",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK": "n943ozDG74swHRmAjzY6A4KVFBhEirF4Sh1ACqvDePE3CZTgkMqn",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR": "n9KAE7DUEB62ZQ3yWzygKWWqsj7ZqchW5rXg63puZA46k7WzGfQu",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y": "n9JkSnNqXxEct1t78dwVZDjq7PsznXtukxjyGvGJr4TdwVSbd7DJ",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H": "n9KQ2DVL7QhgovChk81W8idxm7wDsYzXutDMQzwUBKuxb9WTWBVG",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C": "n9KY4JZY11ndNbg55dThnoQdU9dii5q3egzoESVXw4Z7hu3maCba"
    },
    "status": "success",
    "trusted_validator_keys": [
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA"
    ],
    "validation_quorum": 28,
    "validator_list": {
      "count": 1,
      "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
      "status": "active"
    }
  }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                  | Type   | Description                              |
|:-------------------------|:-------|:-----------------------------------------|
| `local_static_keys`      | Array  | Array of public keys for validators explicitly trusted in the config file. |
| `publisher_lists`        | Array  | Array of **Publisher List** objects. (See below for details.) |
| `signing_keys`           | Object | Mapping from master public key to current ephemeral public key for all currently-trusted validators. Excludes validators that don't use an ephemeral signing key. |
| `trusted_validator_keys` | Array  | Array of master public keys of all currently trusted validators. |
| `validation_quorum`      | Number | Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations. |
| `validator_list_expires` | String | The human readable time when the current validator list will expire. There are two special cases: the string `unknown` if the server has not yet loaded a published validator list, or the string `never` if the server uses a static validator list. |

Each member of the `publisher_lists` array is a **Publisher List** object with the following fields:

| `Field`            | Type             | Description                          |
|:-------------------|:-----------------|:-------------------------------------|
| `available`        | Boolean          | If `false`, the validator keys in `list` may no longer be supported by this publisher. |
| `expiration`       | String           | The human readable time when this published list is scheduled to expire. |
| `list`             | Array            | Array of published validator keys in the list.   |
| `pubkey_publisher` | String           | Ed25519 or ECDSA public key of the list publisher, as hexadecimal. |
| `seq`              | Unsigned Integer | The sequence number of this published list. |
| `version`          | Unsigned Integer | The version of the list format.      |

### Possible Errors

- Any of the [universal error types][].
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.

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
