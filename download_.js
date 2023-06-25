const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user to enter the destination folder
rl.question('Enter the destination folder path: ', (destinationFolderPath) => {
  // Close the readline interface
  rl.close();

  // Define the source file path
  const sourceFilePath = 'output/output_clip.ts';

  // Extract the filename from the source file path
  const filename = path.basename(sourceFilePath);

  // Create the destination folder if it doesn't exist
  if (!fs.existsSync(destinationFolderPath)) {
    fs.mkdirSync(destinationFolderPath, { recursive: true });
  }

  // Create a readable stream for the source file
  const readStream = fs.createReadStream(sourceFilePath);

  // Create a writable stream for the destination file
  const destinationPath = path.join(destinationFolderPath, filename);
  const writeStream = fs.createWriteStream(destinationPath);

  // Pipe the data from the source file to the destination file
  readStream.pipe(writeStream);

  // Listen to the 'finish' event when the file download is complete
  writeStream.on('finish', () => {
    console.log('File download complete!');
  });

  // Listen to the 'error' event in case any errors occur during the download
  writeStream.on('error', (err) => {
    console.error('An error occurred during the file download:', err);
  });
});
