/**
 * Created by Jonathan on 1/24/2015.
 * 2026: static version. There is no app server any more; PeerJS only needs a
 * signalling server to pair the phone controller with the desktop.
 */
var config = {
    // Options passed to `new Peer()`. Empty uses PeerJS's free public server (0.peerjs.com).
    // To run your own PeerServer instead: {host: 'peer.example.com', port: 443, path: '/', secure: true}
    peer: {},

    // Prefix for peer ids, so ours don't collide with other apps on the shared public server.
    idPrefix: 'infinitemondrian-'
};
