const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

// Function to handle hello response
const sayhello = async (req, res, next) => {
  try {
    res.json({ msg: "hello" });
  } catch (error) {
    next(error);
  }
};

// Function to generate a PDF certificate with a background image
async function generateCertificate(name, course, date, outputPath) {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Load the JPG image
    const backgroundImagePath = path.join(__dirname, 'input2.jpg');
    const imageBytes = await fs.readFile(backgroundImagePath);
    const image = await pdfDoc.embedJpg(imageBytes);

    // Add a new page
    const page = pdfDoc.addPage();

    // Set the page size to match the image size
    const { width, height } = image.scale(1);
    page.setSize(width, height);

    // Draw the background image
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });

    // Define font size and color
    const fontSize = 28;
    const nameFontSize = 130;
    const color = rgb(0, 0, 0);

    // Embed standard fonts
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const cursiveFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

    // Calculate the width and height of the name text
    const nameWidth = cursiveFont.widthOfTextAtSize(name, nameFontSize);
    const nameHeight = cursiveFont.heightAtSize(nameFontSize);

    // Calculate the x and y positions to center the name
    const nameX = (page.getWidth() - nameWidth) / 2;
    const nameY = (page.getHeight() + nameHeight) / 2; // Center vertically

    // Draw the name text centered
    page.drawText(name, {
      x: nameX,
      y: nameY -100,
      size: nameFontSize,
      color,
      font: cursiveFont,
    });

    // Draw the course text
    const courseWidth = regularFont.widthOfTextAtSize(course, fontSize + 10);
    const courseX = (page.getWidth() - courseWidth) / 2;
    const courseY = nameY - 60; // Adjust position below the name

    page.drawText(course, {
      x: courseX -20 ,
      y: courseY- 200 ,
      size: fontSize ,
      color,
      font: regularFont,
    });

    // Draw the date text
    const dateWidth = regularFont.widthOfTextAtSize(`on ${date}`, fontSize);
    const dateX = (page.getWidth() - dateWidth) / 2;
    const dateY = courseY - 30; // Adjust position below the course

    page.drawText(`${date}`, {
      x: dateX + 195 ,
      y: dateY- 170,
      size: fontSize,
      color,
      font: regularFont,
    });

    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();

    // Ensure the directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    // Write the PDF to a file
    await fs.writeFile(outputPath, pdfBytes);

    console.log('Certificate generated successfully!');
  } catch (error) {
    console.error('Error generating certificate:', error);
  }
}

// Handler to generate a certificate
const generateCertificateHandler = async (req, res, next) => {
  try {
    const { name, course, date } = req.query; // Extract query parameters
    if (!name || !course || !date) {
      return res.status(400).json({ error: 'Missing required query parameters: name, course, or date' });
    }

    const outputPath = path.join(__dirname, 'certificates', `${name}-${date}.pdf`);

    await generateCertificate(name, course, date, outputPath);

    res.json({ msg: 'Certificate generated successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sayhello, generateCertificateHandler };
