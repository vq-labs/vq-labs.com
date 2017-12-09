# What is it?
Source files for the VQ-Labs web page vq-labs.com.

# What is used?
bootstrap 3, npm, gulp with html/css/js/json/img minify + uglify

# How to use it?
All the html sources can be found in the "src" folder. Modify the files in there and run "gulp build" in the root folder to get all the dependencies and minified versions of your CSS/JS/HTML files generated for you.
Images, css and other files that do not require pre-processing you will find in the "public" folder.

# How to start?
```
git clone https://github.com/vq-labs/vq-labs.com 

cd vq-labs.com

npm install

npm start
```
# Development
This will listen for changes under the src/ and will build automatically:
```
gulp watch
```

You can then start a server with for example:
```
live-server ./public
```

@todo: to make the above two in one command

# Deployment
Make sure that you have s3-deploy installed globally:
```
npm install s3-deploy --g
```

The following command will prepare, build and deploy the app to S3 bucket:
```
gulp deploy
```

# License?
Apache 2.0