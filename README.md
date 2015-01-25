[Infinite Mondrian](http://infinitemondrian.com)
================================================
*"By virtue of the grid, [Mondrian's work] is presented as a mere fragment, a tiny piece arbitrarily cropped from an infinitely larger fabric." —Krauss. Infinite Mondrian marries the infinity supposed by computation and Mondrian.*

Infinite Mondrian is a multi-platform (desktop, mobile, desktop+mobile, [Google Cardboard VR](https://www.google.com/get/cardboard/)) web experiment that utilizes WebGL ([THREE.js](https://github.com/mrdoob/three.js)), WebRTC ([PeerJS](https://github.com/peers/peerjs)), and other new web API (gyroscope, device-orientation, fullscreen, pointerlock, etc.) to create a procedurally generated 3D world that resembles a Mondrian painting. Infinite Mondrian allows users to create their own "Mondrian painting" by taking a picture of a cross section of this infinite world then claim it as their own to share it with the social media world.

The present page talks more of the technical aspect of Infinite Mondrian. For the art aspect see the [blog post](http://jssolichin.com/infinite-mondrian/).

## Example shots taken in app
![Default shot](http://jssolichin.com/wp-content/uploads/2015/01/6-1024x575.png)
![Orthographic Camera](http://jssolichin.com/wp-content/uploads/2015/01/5-1024x575.png)
![Orthographic Camera Top View](http://jssolichin.com/wp-content/uploads/2015/01/3-1024x575.png)
![Perspective Camera with high FOV](http://jssolichin.com/wp-content/uploads/2015/01/2-1024x575.png)
![Google cardboard VR View](http://jssolichin.com/wp-content/uploads/2015/01/Screenshot-91.png)

## Usage
* On a desktop: use mouse to navigate the world, and keyboard keys to manipulate the camera (letters on the button below instructions).
* On a mobile device: use the phone's gyroscope to navigate the world.
* On a desktop + mobile: Open the app on a desktop, and access the url under *Use a Remote Controller* on a mobile device (use another tab to test if unavailable). The mobile device will remotely control the app on desktop; its gyroscope will navigate the world, the buttons on the mobile device will manipulate the camera. Requires Android (maybe one day other platform will support WebRTC). The mobile device acts as an avatar for a "real camera" into the world.
* On a Google Cardboard: On a mobile device, access the app and click the enable button. Make sure the device is in landscape mode.

## How it works
THREE.js is used to generate blocks and bars at random. A camera is placed within an object whose quaternion, referred here and in the code as the cameraman, can be manipulated by the mouse. The cameraman can also be modified through a mobile device's gyroscope. WebRTC, through PeerJS, is used to transfer a mobile device's gyroscope values with low latency in the case of a remote control.

 The cameraman is moved forward every frame in z-space, which is oriented by the aforementioned quaternion. Every frame, all blocks/bars (400) are checked against the position of the camera. If a block is behind the camera (based on the angle from camera's normal to block) and  is greater than some distance between the camera and beyond the fog, it is moved to a random space in fromt of the camera beyond the fog.

 Cardboard view is done using THREE.js' [stereo effect](http://threejs.org/examples/webgl_effects_stereo.html).

 Gyroscope control is done based on THREE.js' [device orientation](http://threejs.org/examples/#misc_controls_deviceorientation).

 Blurring is done using effect composer with vertical and horizontal blur based on this [StackOverflow](http://stackoverflow.com/questions/15354117/three-js-blur-the-frame-buffer) quesetion.

## Running your own
1. Download the files: `$ git clone https://github.com/jssolichin/infinite-mondrian`
2. Install dependencies: `$ npm install; bower install`.
4. Edit [public/js/config.js](public/js/config.js) and change host and port as necessary. Default should work fine on local machine.
4. Run the app: `$ node app.js`.

## Special Thanks
Originally done for [Jennifer Steinkamp](http://www.jsteinkamp.com/), with [John Brumley](http://johnbrumley.info/) as T.A, at [UCLA DMA](http://dma.ucla.edu/).


---------------------------------------
![Using Infinite Mondrian on Cardboard](http://jssolichin.com/wp-content/uploads/2015/01/peopleInfinite.png)
