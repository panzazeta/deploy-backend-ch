import multer from "multer"

//CONFIGURACIÓN DE MULTER PARA EL ALMACENAMIENTO DE ARCHIVOS E IMAGENES
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        let uploadPath = ''

        if(file.fieldname === 'profileImage'){
            uploadPath = 'src/public/uploads/profiles'
        } else if (file.fieldname === 'productImage'){
            uploadPath = 'src/public/uploads/products'
        } else {
            uploadPath = 'src/public/uploads/documents'
        }

        cb(null, uploadPath)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
})

export const upload = multer({ storage: storage });