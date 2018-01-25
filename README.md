# What is it?
Source files for the VQ-Labs web page vq-labs.com.

# What is used?
bootstrap 3, npm, gulp with html/css/js/json/img minify + uglify

# How to use it?
All the html sources can be found in the "src" folder. Modify the files in there and run "gulp build" in the root folder to get all the dependencies and minified versions of your CSS/JS/HTML files generated for you.
Images, css and other files that do not require pre-processing you will find in the "public" folder.

# How to start?
Review .env file and make necessary changes first!

```
npm install

npm start
```
# Development
If your environment in .env file is not 'production', then npm start command will automatically watch changes for you.

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