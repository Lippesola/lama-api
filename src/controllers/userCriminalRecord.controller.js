import userModel from '../models/user.model.js'
import { createDocument, getHeader, getCriminalRecordContent, getSidebar } from './document.controller.js';

export async function findOne (req, res) {

  if (!req.params || !req.params.uuid) {
    res.status(400).send('bad request')
		return;
	}  
  
  const user = await userModel.findByPk(req.params.uuid);
  if (!user) {
    res.status(404).send('not found')
    return;
  }
  
  let buffers = [];
  let doc = createDocument();
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    let pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(pdfData),
      'Content-Type': 'application/pdf',
      'Content-disposition': 'attachment;filename=test.pdf',})
    .end(pdfData);
  });
  getHeader(doc, 'Zur Vorlage bei der zuständigen Meldebehörde')
  getCriminalRecordContent(doc, user)
  await getSidebar(doc)
  doc.end();
}
