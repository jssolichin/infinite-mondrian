/**
 * Created by Jonathan on 12/14/2014.
 */

var peer = new Peer('controller', {host: 'localhost', port: 3000, path: '/peerjs'});
var conn = peer.connect('receiver');

conn.on('open', function() {
    // Send messages
    conn.send('Hello!');
});


