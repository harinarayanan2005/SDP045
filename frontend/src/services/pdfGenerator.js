// AkiVoice AI — Japanese Autumn Styled Analytical PDF Report Generator
import { jsPDF } from 'jspdf';

export function generatePdfReport(analysisData, transcriptText, recordingTitle = 'Speech Session Analysis') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  let currentY = 20;

  // 1. Header Banner (Warm Maple Crimson Gradient look)
  doc.setFillColor(192, 57, 43); // Maple Crimson
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AuraVoice AI — Speech & Sentiment Report', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(254, 226, 226);
  doc.text(`Generated: ${new Date().toLocaleString()} | Session: ${recordingTitle}`, margin, 22);

  currentY = 40;

  // 2. Executive Sentiment Score Card
  const { sentiment, emotions, speechDelivery } = analysisData || {};
  
  doc.setFillColor(250, 247, 242); // Washi Cream background
  doc.setDrawColor(217, 119, 6); // Ginkgo Gold border
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 34, 4, 4, 'FD');

  doc.setTextColor(192, 57, 43);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('POLARITY & OVERALL SENTIMENT', margin + 6, currentY + 9);

  doc.setTextColor(30, 34, 41);
  doc.setFontSize(15);
  doc.text(`${sentiment?.label || 'Balanced & Neutral'} (Confidence: ${sentiment?.confidence || 0}%)`, margin + 6, currentY + 18);

  doc.setFontSize(9);
  doc.setTextColor(86, 93, 109);
  doc.setFont('helvetica', 'normal');
  doc.text(`Raw Score: ${sentiment?.score || 0} | Comparative Polarity: ${sentiment?.comparative || 0} | Classification: ${sentiment?.polarity?.toUpperCase() || 'NEUTRAL'}`, margin + 6, currentY + 26);

  currentY += 44;

  // 3. Delivery Metrics Grid
  doc.setTextColor(30, 34, 41);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Speech Delivery & Pacing Telemetry', margin, currentY);
  currentY += 6;

  const colWidth = (pageWidth - (margin * 2) - 10) / 3;
  
  // Card 1: Words & WPM
  doc.setFillColor(244, 238, 227);
  doc.setDrawColor(217, 119, 6);
  doc.roundedRect(margin, currentY, colWidth, 24, 3, 3, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(86, 93, 109);
  doc.text('Words / Pacing', margin + 4, currentY + 7);
  doc.setFontSize(13);
  doc.setTextColor(192, 57, 43);
  doc.setFont('helvetica', 'bold');
  doc.text(`${speechDelivery?.totalWords || 0} words (${speechDelivery?.wpm || 0} WPM)`, margin + 4, currentY + 16);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(86, 93, 109);
  doc.text(`Pace: ${speechDelivery?.paceLabel || 'Normal'}`, margin + 4, currentY + 21);

  // Card 2: Fillers
  const col2X = margin + colWidth + 5;
  doc.setFillColor(244, 238, 227);
  doc.roundedRect(col2X, currentY, colWidth, 24, 3, 3, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(86, 93, 109);
  doc.text('Filler Words Detected', col2X + 4, currentY + 7);
  doc.setFontSize(13);
  doc.setTextColor(217, 119, 6);
  doc.setFont('helvetica', 'bold');
  doc.text(`${speechDelivery?.fillerCount || 0} (${speechDelivery?.fillerRatio || 0}%)`, col2X + 4, currentY + 16);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(86, 93, 109);
  doc.text('e.g. um, uh, like, you know', col2X + 4, currentY + 21);

  // Card 3: Readability & Diversity
  const col3X = col2X + colWidth + 5;
  doc.setFillColor(244, 238, 227);
  doc.roundedRect(col3X, currentY, colWidth, 24, 3, 3, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(86, 93, 109);
  doc.text('Readability Score', col3X + 4, currentY + 7);
  doc.setFontSize(13);
  doc.setTextColor(21, 128, 61);
  doc.setFont('helvetica', 'bold');
  doc.text(`${speechDelivery?.readability?.score || 0} / 100`, col3X + 4, currentY + 16);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(86, 93, 109);
  doc.text(speechDelivery?.readability?.level || 'Standard', col3X + 4, currentY + 21);

  currentY += 34;

  // 4. 6-Factor Emotion Breakdown
  doc.setTextColor(30, 34, 41);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('6-Factor Emotion Breakdown', margin, currentY);
  currentY += 8;

  const emotionList = [
    { name: 'Joy & Delight', val: emotions?.joy || 0, color: [21, 128, 61] },
    { name: 'Confidence', val: emotions?.confidence || 0, color: [192, 57, 43] },
    { name: 'Serenity & Calm', val: emotions?.serenity || 0, color: [15, 118, 110] },
    { name: 'Energy & Drive', val: emotions?.energy || 0, color: [234, 88, 12] },
    { name: 'Hesitation', val: emotions?.hesitation || 0, color: [217, 119, 6] },
    { name: 'Frustration', val: emotions?.frustration || 0, color: [185, 28, 28] }
  ];

  emotionList.forEach((emo, i) => {
    const rowY = currentY + (i * 9);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(emo.name, margin, rowY + 4);

    // Progress Bar Track
    const barX = margin + 45;
    const barWidth = 90;
    doc.setFillColor(235, 230, 222);
    doc.roundedRect(barX, rowY, barWidth, 5, 2, 2, 'F');

    // Progress Fill
    const fillWidth = Math.max(2, (barWidth * emo.val) / 100);
    doc.setFillColor(emo.color[0], emo.color[1], emo.color[2]);
    doc.roundedRect(barX, rowY, fillWidth, 5, 2, 2, 'F');

    // Value Label
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(emo.color[0], emo.color[1], emo.color[2]);
    doc.text(`${emo.val}%`, barX + barWidth + 6, rowY + 4);
  });

  currentY += 62;

  // 5. Full Speech Transcript
  doc.setTextColor(30, 34, 41);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Full Speech Transcript', margin, currentY);
  currentY += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 70, 70);
  
  const textLines = doc.splitTextToSize(transcriptText || 'No transcript text available for this session.', pageWidth - (margin * 2) - 8);
  
  doc.setFillColor(252, 250, 247);
  doc.setDrawColor(230, 220, 205);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), Math.min(65, textLines.length * 5 + 8), 3, 3, 'FD');
  
  doc.text(textLines.slice(0, 12), margin + 4, currentY + 6);

  // Footer stamp
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text('AuraVoice AI • Next-Gen Voice Intelligence Suite • All Rights Reserved', margin, pageHeight - 10);

  // Save file
  const safeFilename = `AuraVoice_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(safeFilename);
}
