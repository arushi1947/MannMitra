from fastapi import APIRouter, UploadFile, File
import cloudinary.uploader
import cloudinary_config

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    try:

        if file.content_type == "application/pdf":

            result = cloudinary.uploader.upload(
                file.file,
                resource_type="raw",
                folder="mannmitra/journals/pdfs"
            )

        elif file.content_type.startswith("image/"):

            result = cloudinary.uploader.upload(
                file.file,
                resource_type="image",
                folder="mannmitra/journals/images"
            )

        elif file.content_type.startswith("audio/"):

            result = cloudinary.uploader.upload(
                file.file,
                resource_type="video",
                folder="mannmitra/journals/audio"
            )

        return {
            "url": result["secure_url"],
            "name": file.filename,
            "type": file.content_type
        }

    except Exception as e:

        return {
            "error": str(e)
        }