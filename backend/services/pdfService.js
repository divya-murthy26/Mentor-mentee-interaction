const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateFeedbackPDF = (feedback, interaction) => {
  return new Promise((resolve, reject) => {
    try {
      const uploadDir = path.join(__dirname, '../uploads/pdfs');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `feedback_${feedback._id}_${Date.now()}.pdf`;
      const filePath = path.join(uploadDir, fileName);
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header bar - deep teal
      doc.rect(0, 0, doc.page.width, 110).fill('#0d4f6c');
      doc.fillColor('white')
        .font('Helvetica-Bold')
        .fontSize(22)
        .text('Fund a Child India', 50, 28);
      doc.fillColor('#a8d8ea')
        .font('Helvetica')
        .fontSize(13)
        .text('Mentoring Session Feedback Report', 50, 56);
      doc.fillColor('rgba(255,255,255,0.7)')
        .fontSize(9)
        .text(`Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`, 50, 82);

      doc.fillColor('#1a1a1a');
      let y = 130;

      // Session Details block
      doc.rect(50, y, doc.page.width - 100, 145).fill('#f0f7fb').stroke('#b0d4e8');
      doc.fillColor('#0d4f6c').font('Helvetica-Bold').fontSize(13).text('Session Details', 65, y + 12);

      const details = [
        ['Mentor Name', feedback.mentorName || '—'],
        ['Mentee Name', feedback.menteeName || '—'],
        ['Session Date', feedback.sessionDate ? new Date(feedback.sessionDate).toLocaleDateString('en-IN', { dateStyle: 'long' }) : '—'],
        ['Topic', feedback.topic || '—'],
        ['Hours of Interaction', `${feedback.hoursOfInteraction || 1} hour(s)`],
        ['Session Type', interaction?.sessionType ? interaction.sessionType.charAt(0).toUpperCase() + interaction.sessionType.slice(1) : '—']
      ];

      details.forEach(([label, value], i) => {
        const row = y + 35 + i * 19;
        doc.fillColor('#0d4f6c').font('Helvetica-Bold').fontSize(10).text(label + ':', 65, row, { continued: true, width: 150 });
        doc.fillColor('#333').font('Helvetica').text('  ' + value, { width: 320 });
      });

      y += 165;

      // Points Discussed
      doc.fillColor('#0d4f6c').font('Helvetica-Bold').fontSize(13).text('Points Discussed', 50, y);
      y += 18;
      const pdHeight = Math.max(70, Math.ceil((feedback.pointsDiscussed || '').length / 85) * 14 + 20);
      doc.rect(50, y, doc.page.width - 100, pdHeight).fill('#f9f9f9').stroke('#dde');
      doc.fillColor('#333').font('Helvetica').fontSize(10)
        .text(feedback.pointsDiscussed || 'No points recorded.', 62, y + 10, {
          width: doc.page.width - 124, lineGap: 3
        });
      y += pdHeight + 18;

      // Description
      doc.fillColor('#0d4f6c').font('Helvetica-Bold').fontSize(13).text('Session Description', 50, y);
      y += 18;
      const descHeight = Math.max(70, Math.ceil((feedback.description || '').length / 85) * 14 + 20);
      doc.rect(50, y, doc.page.width - 100, descHeight).fill('#f9f9f9').stroke('#dde');
      doc.fillColor('#333').font('Helvetica').fontSize(10)
        .text(feedback.description || 'No description provided.', 62, y + 10, {
          width: doc.page.width - 124, lineGap: 3
        });
      y += descHeight + 28;

      // Signature line
      doc.moveTo(50, y).lineTo(200, y).stroke('#999');
      doc.fillColor('#666').font('Helvetica').fontSize(9).text('Mentee Signature', 50, y + 5);
      doc.moveTo(350, y).lineTo(500, y).stroke('#999');
      doc.text('Mentor Signature', 350, y + 5);

      // Footer
      const footerY = doc.page.height - 50;
      doc.rect(0, footerY - 10, doc.page.width, 60).fill('#0d4f6c');
      doc.fillColor('#a8d8ea').font('Helvetica').fontSize(9)
        .text('Fund a Child India | Mentoring Program | Confidential', 50, footerY, { align: 'center' });

      doc.end();
      stream.on('finish', () => resolve({ filePath: `/uploads/pdfs/${fileName}`, fileName }));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateFeedbackPDF };
