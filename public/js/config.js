/**
 * Created by Jonathan on 1/24/2015.
 * 2026: use the page's own host so the phone controller works behind nginx/HTTPS
 * (the old value, jssolichin.com:3000, points at an expired domain).
 */
var config = {
    server: {
        host: window.location.hostname,
        port: window.location.port || (window.location.protocol === 'https:' ? 443 : 80)
    }
};
