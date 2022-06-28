starability.css -star rating css

cloudinary - store photos

on mongo - form urlencoded
must change enctype to multipart/form-data if has input of type:file
handling file upload
MULTER

form enctype="multipart/form-data"

npm i multer

npm i dotenv

> > > > multer storage cloudinary

npm i cloudinary
npm i multer-storage-cloudinary

> > > file picker input

## DESIGNING FILE INPUT

> > > bs-custom-file-input **_ update _** not working with bootstarap 5

- add .custom-file-label
- add .custom-file
- to bootstrap input:file control to use this js

> > > NOT WORKING ON BOOTSTRAP 5 SO I ADDED THIS SCRIPT AT THE END OF NEW.EJS

<script>
  document
    .querySelector(".custom-file-input")
    .addEventListener("change", function (e) {
      var files = document.getElementById("customFileInput").files;
      var nextSibling = e.target.nextElementSibling;

      var filenames = "";
      for (let f of files) {
        filenames += f.name + ", ";
      }
      if (files && files.length > 1) {
        nextSibling.innerText = filenames;
      } else {
        nextSibling.innerText = "";
      }
    });
</script>

## MAPS

## MAPBOX

npm install @mapbox/mapbox-sdk

Mapbox GL JS
https://docs.mapbox.com/mapbox-gl-js/api/
render maps

section 58
ep 556

npm i express-mongo-sanitize

const mongoSanitize = require("express-mongo-sanitize");.

app.use(mongoSanitize());
app.use(
mongoSanitize({
replaceWith: "\_",
})
);

npm i sanitize-html
used alongside joi to escape htmlcharacters
reflected on schemas.js
