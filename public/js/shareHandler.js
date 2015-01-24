/**
 * Created by Jonathan on 1/2/2015.
 */
var currentId = 0;
var shareSettings = function (data){
    return {
        networks: {
            facebook: {
				load_sdk: true,
					app_id: '817816641608595'
            },
            google_plus:{
            },
            twitter:{
                description: 'I made a mondrian!', //needs own description because char limit
                url: url.origin+'/'+data.img
            },
            pinterest: {
            },
            email:{
            }
        },
        image: url.origin+'/'+data.img,
        url: url.origin+'/'+data.img,
        title: 'Check out this Mondrian Work I captured!',
        description: 'I tapped into my inner artist and went into the world DeStjil #infinitemondrian'
    }
};
