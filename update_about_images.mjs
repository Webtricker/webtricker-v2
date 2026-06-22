import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const MONGODB_URI = process.env.MONGODB_URI;

// Define the AboutPage schema just to update the document
const AboutPageSchema = new mongoose.Schema({}, { strict: false });
const AboutPage = mongoose.models.About || mongoose.model('About', AboutPageSchema, 'abouts');

async function uploadImage(filePath) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'webtricker/about',
    format: 'webp',
    quality: 'auto'
  });
  return result.secure_url;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  console.log('Uploading images...');
  const bannerUrl = await uploadImage('C:\\Users\\LaptopAid\\.gemini\\antigravity-ide\\brain\\d5c3c50e-4b08-46b5-82f4-46bebcbc59e8\\about_banner_1782154039042.png');
  const teamUrl = await uploadImage('C:\\Users\\LaptopAid\\.gemini\\antigravity-ide\\brain\\d5c3c50e-4b08-46b5-82f4-46bebcbc59e8\\about_us_team_1782154050121.png');
  const tabletUrl = await uploadImage('C:\\Users\\LaptopAid\\.gemini\\antigravity-ide\\brain\\d5c3c50e-4b08-46b5-82f4-46bebcbc59e8\\about_gallery_tablet_1782154059496.png');
  const monitorUrl = await uploadImage('C:\\Users\\LaptopAid\\.gemini\\antigravity-ide\\brain\\d5c3c50e-4b08-46b5-82f4-46bebcbc59e8\\about_gallery_monitor_1782154070267.png');
  const phoneUrl = await uploadImage('C:\\Users\\LaptopAid\\.gemini\\antigravity-ide\\brain\\d5c3c50e-4b08-46b5-82f4-46bebcbc59e8\\about_gallery_phone_1782154081448.png');

  console.log('Images uploaded:');
  console.log({ bannerUrl, teamUrl, tabletUrl, monitorUrl, phoneUrl });

  // Update the About page data
  const aboutDoc = await AboutPage.findOne();
  if (aboutDoc) {
    aboutDoc.set('bannerBackgroundImage', bannerUrl);
    aboutDoc.set('aboutUsImage', teamUrl);
    aboutDoc.set('introImages', [tabletUrl, monitorUrl, phoneUrl]);
    await aboutDoc.save();
    console.log('About page updated successfully!');
  } else {
    console.log('About page not found in DB!');
    
    // Create it if it doesn't exist just in case
    await AboutPage.create({
      bannerBackgroundImage: bannerUrl,
      aboutUsImage: teamUrl,
      introImages: [tabletUrl, monitorUrl, phoneUrl]
    });
    console.log('About page created with new images!');
  }

  await mongoose.disconnect();
}

run().catch(console.error);
