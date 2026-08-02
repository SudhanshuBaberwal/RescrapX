const createPhoto=(

upload:any,
file:Express.Multer.File

)=>({

path:upload.path,

originalName:file.originalname,

mimeType:file.mimetype,

size:file.size,

uploadedAt:new Date()

});

export default createPhoto;