import multer, { diskStorage } from "multer";

const store=multer.diskStorage({
    destination: function(Req,file,cb){
        cb(null,"public")
    },
    filename: function(req,file,cb){
        const filename = Date.now() + "_" + file.originalname;
        cb(null,filename)
    }
})
export const upload = multer ({
    storage:store,
    limits:{fileSize: 5*1024*1024},
});