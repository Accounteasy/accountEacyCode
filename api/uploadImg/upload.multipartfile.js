module.exports = function(app){
	const multer = require('multer');
	
	var storage = multer.diskStorage({
		destination: (req, file, cb) => {
		  cb(null, __basedir + '/uploads/')
		},
		filename: (req, file, cb) => {
		  cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
		}
	});
	
	var upload = multer({storage: storage});
	
	app.post('/api/uploadImg', upload.single("profile_image"), (req, res) => {
	  //console.log(req.file);
	  res.json({'status': true, 'message': 'File uploaded successfully!', 'data': req.file});
	});
}