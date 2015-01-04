/**
 * Created by Jonathan on 1/2/2015.
 */
var currentId = 0;
var shareSettings = function (data){
    return {
        networks: {
            facebook: {

            },
            google_plus:{

            },
            twitter:{

            },
            pinterest: {

            },
            email:{

            }
        },
        image: 'http://localhost:3000/'+data.img,
        url: 'http://localhost:3000/'+data.img,
        title: 'Check out this Mondrian Work I captured!',
        description: 'I tapped into my inner artist and went into the world DeStjil #infinitemondrian'
    }
};
