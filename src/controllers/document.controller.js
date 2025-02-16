import path from 'path'
import PDFDocument from 'pdfkit'
import { fileURLToPath } from 'url';
import moment from 'moment';
import settingModel from '../models/setting.model.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const leftWidth = 0.66;
const primaryColor = '#0098d9';
const secondaryColor = '#B1CC3C';

export function createDocument() {
  const doc = new PDFDocument({size: 'A4'});

  doc.registerFont('medium', path.resolve(__dirname + '/../assets/fonts/Rubik-Medium.ttf'))
  doc.registerFont('light', path.resolve(__dirname + '/../assets/fonts/Rubik-Light.ttf'))
  doc.registerFont('regular', path.resolve(__dirname + '/../assets/fonts/Rubik-Regular.ttf'))
  doc.registerFont('signature', path.resolve(__dirname + '/../assets/fonts/Calligraffitti-Regular.ttf'))

  doc.font('regular')
  return doc;
}

export function getHeader(doc, receiver) {
  doc.fontSize(8).font('light').text('Sommerlager in Lippe c/o Gemeinde am Grasweg e.V. | Grasweg 5 | 32657 Lemgo', 50, 100, {width: doc.page.width * leftWidth}).moveDown(0.5);
  doc.fontSize(10).font('medium').text(receiver, {width: 100}).moveDown(5);
  
  doc.font('regular').text('Lemgo, den ' + new moment().format('DD.MM.YYYY'), {width: doc.page.width * leftWidth, align: 'right'}).moveDown(0.5);
}

export function getCriminalRecordContent(doc, user) {
    doc.font('medium').text('Bestätigung für die Beantragung eines privaten erweiterten Führungszeugnisses gem. § 30 a Abs. 2 Bundeszentralregistergesetz (BZRG) für ' + (user.gender === 'm' ? 'Herr ' : 'Frau ') + user.firstName + ' ' + user.lastName , {width: doc.page.width * 0.45}).moveDown();

    doc.font('regular').text('Sehr geehrte Damen und Herren,', {width: doc.page.width * leftWidth}).moveDown();

    doc.text( (user.gender === 'm' ? 'Herr ' : 'Frau ') + user.firstName + ' ' + user.lastName + ' (geb. am ' + new moment(user.birthday).format("DD.MM.YYYY") + ', Anschrift: ' + user.street + ', ' + user.zipCode + ' ' + user.city + ') möchte im kommenden Sommer ehrenamtlich bei unserem erlebnispädagogischen Sommerzeltlager "SOLA" mitarbeiten. ' + (user.gender === 'm' ? 'Er' : 'Sie') + ' wird hiermit gebeten, ein privates, erweitertes polizeiliches Führungszeugnis nach § 30 a BZRG zur Einsicht vorzulegen.', {width: doc.page.width * leftWidth, align: 'justify'}).moveDown();
    doc.text('Hiermit wird bestätigt, dass die seitlich genannten Träger der freien Jugendhilfe entsprechend § 72a SGB VIII die persönliche Eignung von ehrenamtlichen Mitarbeitern zum Zwecke der Betreuung von Minderjährigen an Hand eines erweiterten Führungszeugnisses gem. § 30a Abs. 1 Nr. 2a BZRG zu überprüfen haben.', {width: doc.page.width * leftWidth, align: 'justify'}).moveDown();
    doc.text('Wir bestätigen hiermit gemäß Bundeszentralregistergesetz §30a Absatz 2, dass die Voraussetzungen des BZRG §30a Absatz 1 Satz 2 vorliegen.', {width: doc.page.width * leftWidth, align: 'justify'}).moveDown();
    doc.text('Wir bitten um Übermittlung des privaten erweiterten polizeilichen Führungszeugnis an ' + (user.gender === 'm' ? 'den Antragsteller' : 'die Antragstellerin') + '. Da die Mitarbeit ehrenamtlich und ohne Zahlung eines Entgeltes erfolgt, wird hiermit gleichzeitig die Gebührenbefreiung beantragt.', {width: doc.page.width * leftWidth, align: 'justify'}).moveDown();
    doc.text('Mit freundlichen Grüßen,', {width: doc.page.width * leftWidth}).moveDown(0.3);
    doc.text('im Auftrag', {width: doc.page.width * leftWidth}).moveDown(1.5);
    doc.font('signature').fontSize(12).text('Michell Malolepzy', {width: doc.page.width * leftWidth}).moveDown(0.5);
    doc.font('regular').fontSize(8).text('Dieses Schreiben wurde im Rahmen unserer Online-Mitarbeiteranmeldung maschinell erstellt und ist daher auch mit Faksimile-Unterschrift gültig.', {width: doc.page.width * leftWidth}).moveDown();
}

export function getParticipatorConfirmation(doc, participator) {
    doc.font('medium').text('Anmeldebestätigung für ' + participator.firstName + ' ' + participator.lastName, {width: doc.page.width * 0.45}).moveDown();

    doc.font('regular').text('Liebe Familie ' + participator.lastName + ',', {width: doc.page.width * leftWidth}).moveDown();

    doc.text('hiermit bestätigen wir Ihnen gerne die Anmeldung Ihres Kindes ' + participator.firstName + ' ' + participator.lastName + ' (geb. am ' + new moment(participator.birthday).format('DD.MM.YYYY') + ' ) am SOLA. Die Anmeldung erreichte uns am ' + new moment(participator.createdAt).format('DD.MM.YYYY'), {width: doc.page.width * leftWidth, align: 'justify'}).moveDown();
    doc.text('Der Teilnahmebeitrag beträgt bei der Anmeldung für das erste teilnehmende Kind einer Familie 160,00 €, für das zweite 140,00 € und für jedes weitere Kind 80,00 €.', {width: doc.page.width * leftWidth, align: 'justify'}).moveDown();
    doc.text('Rechtzeitig vor Beginn des Sommerlagers senden wir Ihnen alle weiteren Infounterlagen (Packliste, Wegbeschreibungen, etc.) zu.', {width: doc.page.width * leftWidth, align: 'justify'}).moveDown();
    doc.text('Mit freundlichen Grüßen,', {width: doc.page.width * leftWidth}).moveDown(0.3);
    doc.text('im Auftrag', {width: doc.page.width * leftWidth}).moveDown(1.5);
    doc.font('signature').fontSize(12).text('Ihr SOLA-Team', {width: doc.page.width * leftWidth}).moveDown(0.5);
    doc.font('regular').fontSize(8).text('Dieses Schreiben wurde im Rahmen unserer Teilnehmeranmeldung maschinell erstellt und ist daher auch mit Faksimile-Unterschrift gültig.', {width: doc.page.width * leftWidth}).moveDown();
}

export async function getSidebar(doc) {
  const year = (await settingModel.findByPk('currentYear')).value;
  const columnWidth = doc.page.width * (1 - leftWidth) - 80;
  doc.font('medium').fontSize(9).fillColor(primaryColor).text("Sommerlager in Lippe", doc.page.width * leftWidth + 65, 50, {width: columnWidth}).moveDown()
  doc.fontSize(7).text('Postanschrift für Schriftverkehr', {width: columnWidth}).moveDown(0.1);
  doc.font('light').fillColor('black').text('Sommerlager in Lippe', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('c/o Gemeinde am Grasweg e.V.', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('Grasweg 5', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('32657 Lemgo', {width: columnWidth}).moveDown();

  doc.font('medium').fillColor(primaryColor).text('Kontaktmöglichkeiten', {width: columnWidth}).moveDown(0.1);
  doc.font('light').fillColor('black').text('05261 / 8086821', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('0176 / 51643759', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('sola' + year + '@lippesola.de', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('www.lippesola.de', {width: columnWidth}).moveDown();

  doc.font('medium').fillColor(primaryColor).text('Veranstalter', {width: columnWidth}).moveDown(0.1);
  doc.font('medium').fillColor(secondaryColor).text('Gemeinde am Grasweg e.V.', {width: columnWidth}).moveDown(0.1);
  doc.font('light').fillColor('black').text('Evangelisch freikirchliche Gemeinde', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('Grasweg 5, 32657 Lemgo', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('Anerkannt als Träger der freien Jugendhilfe gem. SGB 8 / KJHG §75 durch die Stadt Lemgo', {width: columnWidth}).moveDown();
  doc.font('medium').fillColor(secondaryColor).text('FeG Extertal', {width: columnWidth}).moveDown(0.1);
  doc.font('light').fillColor('black').text('Freie evangelische Gemeinde', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('Mühlenstraße 4, 32699 Extertal', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('Im Bund Freier evangelischer Gemeinden in Deutschland (Körperschaft des öffentlichen Rechts)', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('Träger der freien Jugendhilfe gem. SGB 8 / KJHG §75 (3)', {width: columnWidth}).moveDown();

  doc.font('medium').fillColor(primaryColor).text('Datenschutz', {width: columnWidth}).moveDown(0.1);
  doc.font('light').fillColor('black').text('www.lippesola.de/datenschutz', {width: columnWidth}).moveDown();

  doc.font('medium').fillColor(primaryColor).text('Michell Malolepzy', {width: columnWidth}).moveDown(0.1);
  doc.font('light').fillColor('black').text('Freizeitleitung', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('michell.malo@lippesola.de', {width: columnWidth}).moveDown();

  doc.font('medium').fillColor(primaryColor).text('Tabea Ostermeier', {width: columnWidth}).moveDown(0.1);
  doc.font('light').fillColor('black').text('Freizeitleitung', {width: columnWidth}).moveDown(0.1);
  doc.font('light').text('tabea.ostermeier@lippesola.de', {width: columnWidth}).moveDown();
}
