//Install express server
const express = require('express');
const path = require('path');
const cors = require('cors')
const webPush = require('web-push');
const bodyParser = require('body-parser');

//
const httpServer = require('http-server')

const app = express();

var __dirname = 'C://Users/10063079/git/gmart-web/src/main/resources';

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/static'));
app.use(cors());
app.use(bodyParser.json());

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

app.get('/', function(req,res) {
    
res.sendFile(path.join(__dirname+'/static/index.html'));
});
app.post('/notifications', (req, res) => {
    const subscription = req.body.notification;
const payload = JSON.stringify({
    notification: {
      title: 'Notifications are cool',
      body: 'Know how to send notifications through Angular with this article!',
      icon: 'https://www.shareicon.net/data/256x256/2015/10/02/110808_blog_512x512.png',
      vibrate: [100, 50, 100],
      data: {
        url: 'https://medium.com/@arjenbrandenburgh/angulars-pwa-swpush-and-swupdate-15a7e5c154ac'
      }
    }
  });

  webPush.sendNotification(subscription, payload)
  .catch(error => console.error(error));
});

// Start the app by listening on the default Heroku port
//app.listen(process.env.PORT || 5000);
app.set('port', process.env.PORT || 5000);

const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

httpServer.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World!');
    res.end();
  }).listen(4200);
