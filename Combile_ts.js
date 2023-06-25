const fs = require('fs');
const path = require('path');

const outputFolderName = 'output';
const inputFolderName = '.target';
const outputFile = 'output_clip.ts';

// Get the absolute paths of the input and output folders
const inputFolderPath = path.join(__dirname, inputFolderName);
const outputFolderPath = path.join(__dirname, outputFolderName);

function comBile_(){
    // Create the output folder if it doesn't exist
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }

    // Array to hold the file paths of the input files
    const inputFiles = [];

    // Loop through the file numbers from 0 to 300
    for (let i = 0; i <= 692; i++) {
      const inputFile = path.join(inputFolderPath, `${i}.TS`);

      // Check if the input file exists
      if (fs.existsSync(inputFile)) {
        inputFiles.push({ frame: i, path: inputFile });
      }
    }

    // Sort the input files based on the frame number in ascending order
    inputFiles.sort((a, b) => a.frame - b.frame);

    // Create a write stream for the output file
    const outputStream = fs.createWriteStream(path.join(outputFolderPath, outputFile));

    // Function to recursively append files to the output stream
    function appendFiles(index) {
      if (index >= inputFiles.length) {
        // All files have been appended, close the output stream
        outputStream.end('End of clip');
        console.log('Clip creation completed!');
        return;
      }

      const inputFile = inputFiles[index].path;

      // Read the input file and append its contents to the output stream
      fs.createReadStream(inputFile)
        .on('end', () => {
          console.log(`Appended ${inputFile}`);
          appendFiles(index + 1); // Recursively append the next file
        })
        .pipe(outputStream, { end: false }); // Append without closing the output stream
    }
    console.log('Creating clip...');
    appendFiles(0);
}

module.exports = comBile_;