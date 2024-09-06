### API Endpoints

1. Create a File

   - URL: `/create-file`
   - Method: `POST`
   - Description: Creates a new text file with the current timestamp in the `files` directory. The file name is based on the current date and time in the IST timezone.
   - Response: Returns the name of the created file.

2. List All Files

   - URL: `/list-files`
   - Method: `GET`
   - Description: Lists all `.txt` files in the `files` directory.
   - Response: Returns an array of filenames.


