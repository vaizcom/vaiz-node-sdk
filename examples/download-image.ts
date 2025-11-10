import { VaizClient } from '../src';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Initialize client
const client = new VaizClient({
  apiKey: process.env.VAIZ_API_KEY!,
  spaceId: process.env.VAIZ_SPACE_ID!,
});

/**
 * Example: Download an image from a task attachment for analysis
 */
async function downloadTaskImage() {
  try {
    // 1. Get a task with attachments
    const taskSlug = 'TASK-123'; // Replace with your task slug
    const taskResponse = await client.getTask(taskSlug);

    console.log(`Task: ${taskResponse.task.name}`);
    console.log(`Files: ${taskResponse.task.files?.length || 0}`);

    // 2. Check if task has image attachments
    if (taskResponse.task.files && taskResponse.task.files.length > 0) {
      const imageFile = taskResponse.task.files.find(
        (file) =>
          file.type?.startsWith('image/') ||
          (file.ext && ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(file.ext.toLowerCase()))
      );

      if (imageFile) {
        console.log(`\nFound image: ${imageFile.name}`);
        console.log(`URL: ${imageFile.url}`);

        // 3. Download the image to a temporary location
        const localPath = path.join('/tmp', `downloaded-${imageFile.name}`);
        const downloadedPath = await client.downloadImage(imageFile.url, localPath);

        console.log(`\n✅ Image downloaded successfully!`);
        console.log(`Saved to: ${downloadedPath}`);
        console.log(
          `\nYou can now analyze this image using vision models or image processing tools.`
        );

        // 4. Clean up the temporary file after analysis
        // Important: Always delete temporary files after use
        const fs = await import('fs/promises');
        await fs.unlink(downloadedPath);
        console.log(`🗑️  Temporary file deleted: ${downloadedPath}`);
      } else {
        console.log('\nNo image attachments found in this task.');
      }
    } else {
      console.log('\nNo files attached to this task.');
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example: Download an image from any URL
 */
async function downloadImageFromUrl() {
  try {
    const imageUrl = 'https://example.com/image.png'; // Replace with actual URL
    const localPath = '/tmp/downloaded-image.png';

    console.log(`Downloading image from: ${imageUrl}`);
    const downloadedPath = await client.downloadImage(imageUrl, localPath);

    console.log(`\n✅ Image downloaded successfully!`);
    console.log(`Saved to: ${downloadedPath}`);

    // Perform your analysis here...
    // ...

    // Clean up after analysis
    const fs = await import('fs/promises');
    await fs.unlink(downloadedPath);
    console.log(`🗑️  Temporary file deleted: ${downloadedPath}`);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// Run examples
async function main() {
  console.log('=== Example 1: Download image from task attachment ===\n');
  await downloadTaskImage();

  console.log('\n\n=== Example 2: Download image from URL ===\n');
  // Uncomment to test:
  // await downloadImageFromUrl();
}

main();
