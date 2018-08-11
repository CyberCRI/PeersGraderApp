# Install
Edit the .env with a working email and password.

```
#Build setup
npm install
npm run-script build     # formerly npm run build
#Run 
sudo service mongod start&
sudo mongo --host 127.0.0.1:27017&
npm start&
node server.js&
```
