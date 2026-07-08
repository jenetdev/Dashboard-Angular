## ⚙️ Tech Stack & Architecture

- **Framework:** [Angular]
- **Styling:** [Tailwind CSS v4+]
- **Iconography:** [Angular Material Icons]


### 1. Install Dependencies
npm install

### 2. Run the Development Server
npm start

The application will spin up and run at `http://localhost:3000`.

### 3. Build for Production
To package the app for optimal static deployment:

npm run build

The compiled output will be generated inside the `dist/` directory.

## AWS S3 Setup
1. **Create S3 Bucket:** Create a bucket (e.g., `dashboard-angular-bucket`) and uncheck **Block *all* public access**.
2. **Enable Static Hosting:** Go to **Properties** > **Static website hosting** -> **Enable**. Set **Index document** and **Error document** to `index.html`.
3. **Set Bucket Policy:** Under **Permissions** > **Bucket policy**, add the following:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::dashboard-angular-bucket/*"
       }
     ]
   }
   ```

## GitHub Secrets Setup
Add these credentials to your GitHub Repository under **Settings** > **Secrets and variables** > **Actions** > **Repository Secrets**:
- `AWS_ACCESS_KEY_ID`: Your AWS access key.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key.
- `AWS_S3_BUCKET_NAME`: `dashboard-react-bucket`
- `AWS_REGION`: `eu-north-1`

## Deploy
Push your updated files to your repository:
git add .
git commit -m "Deploy to AWS"
git push origin main

Your pipeline triggers automatically, builds the project, and uploads it to S3.

