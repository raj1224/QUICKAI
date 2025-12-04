// import express from "express";
// import multer from "multer";
// import FormData from "form-data";

// import { auth } from "../middlewares/auth.js";
// import { 
//   generateArticle, 
//   generateBlogTitle, 
//   generateImage, 
//   removeImageBackground,
//   removeImageObject,
//   resumeReview 
// } from "../controllers/aiController.js";

// // Initialize multer
// const upload = multer({ storage: multer.memoryStorage() });

// const aiRouter = express.Router();

// aiRouter.post('/generate-article', auth, generateArticle);
// aiRouter.post('/generate-blog-title', auth, generateBlogTitle);
// aiRouter.post('/generate-image', auth, generateImage);

// aiRouter.post('/remove-image-background', auth, upload.single('image'), removeImageBackground);
// aiRouter.post('/generate-image-object', auth, upload.single('image'), removeImageObject);
// aiRouter.post('/resume-review', auth, upload.single('resume'), resumeReview);

// export default aiRouter;


import express from "express";
import { upload } from "../middlewares/upload.js";
import { auth } from "../middlewares/auth.js";

import { 
  generateArticle, 
  generateBlogTitle, 
  generateImage, 
  removeImageBackground,
  removeImageObject,
  resumeReview 
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle);
aiRouter.post('/generate-blog-title', auth, generateBlogTitle);
aiRouter.post('/generate-image', auth, generateImage);

aiRouter.post('/remove-image-background', auth, upload.single('image'), removeImageBackground);
aiRouter.post('/remove-image-object', auth, upload.single('image'), removeImageObject);
aiRouter.post('/resume-review', auth, upload.single('resume'), resumeReview);

export default aiRouter;
