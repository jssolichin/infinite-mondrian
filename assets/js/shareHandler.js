/**
 * Created by Jonathan on 1/2/2015.
 * 2026: pictures are no longer uploaded anywhere, so there is no public URL to
 * post to social networks. Offer a download, plus the device's own share sheet
 * (Web Share API) where it can share image files.
 */
var currentId = 0;
var addShareButtons = function ($container, dataUrl){
    var filename = 'infinite-mondrian-' + Date.now() + '.png';
    $container.className = 'share-actions';

    var $save = document.createElement('a');
    $save.href = dataUrl;
    $save.download = filename;
    $save.textContent = 'Save';
    $container.appendChild($save);

    if (!navigator.canShare)
        return;

    fetch(dataUrl).then(function (res) { return res.blob(); }).then(function (blob) {
        var file = new File([blob], filename, {type: 'image/png'});
        if (!navigator.canShare({files: [file]}))
            return;

        var $share = document.createElement('button');
        $share.textContent = 'Share';
        $share.addEventListener('click', function () {
            navigator.share({
                files: [file],
                title: 'Check out this Mondrian Work I captured!',
                text: 'I tapped into my inner artist and went into the world DeStjil #infinitemondrian'
            }).catch(function () {});
        });
        $container.appendChild($share);
    });
};
