import cloudinary from "cloudinary";
import { IncomingForm } from "formidable";

// 👇 CHANGE THESE TO REFLECT YOUR CLOUDINARY SETTINGS 👇
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method === "POST") {
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm();

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const file = data?.fields.inputFile;
    const type = file.split(";")[0].split(":")[1].split("/")[0];

    if (!file) return;

    try {
      const response = await cloudinary.v2.uploader.upload(file, {
        resource_type: type,
        public_id: data.fields.public_id,
      });
      return res.json(response);
    } catch (error) {
      console.log("Error:", error);
      return res.json(error);
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    console.log(id);
    try {
      const response = await cloudinary.v2.uploader.destroy(
        id,
        function (result) {
          return result;
        }
      );
      console.log(response);
      return res.json(response);
    } catch (error) {
      console.log("Error:", error);
      return res.json(error);
    }
  }
};
