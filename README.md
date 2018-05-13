# kappa-chat

> p2p anarchist real-time communication protocol using append-only logs

- p2p: uses [kappa-core](https://github.com/noffle/kappa-core) for distributed
  data storage and replication; finds & replicates to peers on the local network
  and online
- anarchist: messages are not rigidly formatted, and anyone can add new message
  types or write clients that support them; no central or otherwise authorities
- real-time: using [hypercore](https://github.com/mafintosh/hypercore) for very
  fast replication over arbitrary data channels (websockets, webrtc, bluetooth,
  etc)

If you know what [scuttlebutt](http://scuttlebutt.nz) is, this is like a
cheap fast real-time version for exchanging data.

## Usage

```js
var chatdb = require('kappa-chat')

var db = chatdb('./db')

/*
var msg = {
  key: 'hexkeyofauthor',
  seq: 14,
  value: {
    type: 'chat/text',
    nick: 'noffle',
    text: 'hello p2p world'
  }
}
*/
db.on('message', function (msg) {
  var content = msg.value
  if (content.type !== 'chat/text') return
  var nick = content.nick || 'anomymous'
  console.log(nick + '> ' + content.text)
})

db.publish({
  type: 'chat/text',
  nick: 'foobar',
  channel: '#testing',
  text: 'hack the planet'
})
```

outputs

```
foobar> hack the planet
```

## API

```js
var chatdb = require('kappa-chat')
```

### var db = chatdb(storage)

Create a new chat database. `storage` is either a string (location on local disk
to store the db) or an instance of
[random-access-storage](https://github.com/random-access-storage/).

### db.publish(msg[, cb])

Publish a message. Messages can be structured any way you want. You and your
community can decide what works best for you, or you can discuss between
multiple collectives to agree upon common formats that serve you well.

A common `type` field can be useful for readily identifying the data. Here's an
example for an IRC-like textual chat message:

```js
{
  type: 'chat/text',
  nick: 'noffle',
  text: 'hello p2p world',
  timestamp: 1526236798000
}
```

### db.on('entry', function (entry) { ... })

When a new p2p log entry is received, this event is emitted. An entry has the
format

```js
{
  key: 'hexkeyofauthor',
  seq: 14,
  value: {  // message
    type: 'chat/text',
    nick: 'noffle',
    channel: '#testing',
    text: 'hello p2p world'
  }
}
```

`key` is the message author's public cryto key as a hexidecimal string, and
`seq` is the sequence number of the entry in their append-only log.

### var rs = db.createReadStream([opts])

todo

## Message Type Ideas

A common `type` field can be useful for readily identifying the data. Here's an
example for an IRC-like textual chat message:

```js
{
  type: 'chat/text',
  nick: 'noffle',
  text: 'hello p2p world',
  timestamp: 1526236798000
}
```

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install kappa-chat
```

## License

ISC

