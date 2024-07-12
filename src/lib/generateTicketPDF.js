import puppeteer from 'puppeteer';

export const generatePdfFromHtml = async (htmlContent) => {
    let browser;

    try {

        if (process.env.NODE_ENV === 'development') {
            browser = await puppeteer.launch();
        }
        else {
            browser = await puppeteer.launch({
                executablePath: '/usr/bin/google-chrome', // Adjust the path as necessary
  });
        }


        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'load' });

        const pdfBuffer = await page.pdf({
            format: 'Legal',
            printBackground: true,
        });

        return pdfBuffer;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};


// ----------------------------- Using pdf make -----------------------------

// import pdf from 'html-pdf';
// import fs from 'fs';
// import path from 'path';

// // Function to generate PDF from HTML using html-pdf
// export const generatePdfFromHtml = async (pdfHtml) => {
//     return new Promise((resolve, reject) => {
//         // Define options for pdf generation (adjust as needed)
//         const options = {
//             format: 'Letter', // Letter size pdf
//             border: {
//                 top: '0.5in',
//                 right: '0.5in',
//                 bottom: '0.5in',
//                 left: '0.5in'
//             }
//         };

//         // Generate PDF from html
//         pdf.create(pdfHtml, options).toBuffer((err, buffer) => {
//             if (err) {
//                 console.error('Error generating PDF:', err);
//                 reject(err);
//             } else {
//                 resolve(buffer);
//             }
//         });
//     });
// };

