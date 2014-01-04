cnote
=====

Secure note application. Build is Maven enabled with pom.xml files for the main and sub-projects.
* site-maven-plugin used to have github act as maven repo (github.com/p214c/artifacts)
  - updates as expected and doesn't overwrite what is present

cnote-app
---------
project contains the client code base. HTML5 / Javascript source for the note capture web application.

* maven prescribed directory structure directory structure
  - **src/main/webapp** - note capture HTML5 / Javascript application source

* packaged as war file

cnote-svr
---------
project contains the server code base. NodeJS javascript source for the web application server. 

* maven prescribed directory structure directory structure
 - **src/routes** - notes REST API  
   GET /notes - return all note resources  
   GET /notes/{id} - return note resource that matches {id}  
   POST /notes - add POST body as a new note resource. returns the note resource with generated id  
   PUT /notes/{id} - idempotent update of note resource that matches {id}  

 - **target/nodejs** staging for packaging and used as execution enivronment during development  
   **target/nodejs/node_modules** - generated using the package.json file with nodejs npm install. contains nodejs support modules like express and lodash  
   **target/nodejs/public** - package of static files to serve. seeded with cnote-app .war file  
   **target/nodejs/routes** - notes REST API files  
   **target/nodejs/sslcert** - SSL certificate store  

* packaged as zip
 * nodejs is staged to target/nodejs
  * used in development as the execution environment to launch the nodejs server (target/nodejs/nodejs server.js)
   * answers on https://localhost:8443/cnote - the note capture client using certificate stored in ./sslcert directory
   * answers on https://localhost:8443/notes - the REST API for the note resources using certificate stored in ./sslcert directory 
