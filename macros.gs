/** @OnlyCurrentDoc */

function Test() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('L2:L4').activate();
  spreadsheet.getRange('L2').copyTo(spreadsheet.getActiveRange(), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
};

/**
 * useful information
 * array.indexOf(element) https://www.freecodecamp.org/forum/t/index-of-an-element-in-an-array/255345/2
 * Google Apps Script spreadsheet reference https://developers.google.com/apps-script/reference/spreadsheet
 * Get all data from current sheet https://stackoverflow.com/questions/18584081/defining-arrays-in-google-scripts
 * Get index of column by name https://gsuite-developers.googleblog.com/2012/05/insider-tips-for-using-apps-script-and.html
 * Test javascript https://js.do/
 * Forms reference from Google https://developers.google.com/apps-script/reference/forms
 * Working with all the data in current sheet https://webapps.stackexchange.com/questions/44128/how-to-specify-the-entire-sheet-as-range-in-google-sheets
 * Google Apps Script Forms createChoice reference https://developers.google.com/apps-script/reference/forms/multiple-choice-item
 * Example code with various google sheets functionality https://gist.github.com/nicobrx/2ecd6fc9ca733dcd883afebba5cf200e
 */

/**
 * https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
 *
 * @param {array} arra1 A one-d array to shuffle
 * @returns {array} the shuffled array
 * @customfunction
 */

function shuffle(arra1) {
    var ctr = arra1.length, temp, index;
// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

/**
 * return array from 1 to N sequentially
 * https://www.freecodecamp.org/news/https-medium-com-gladchinda-hacks-for-creating-javascript-arrays-a1b80cb372b/
 *
 * @param {number} N 
 * @returns {array} the array from 1 to N
 * @customfunction
 */
function getsequence1(N) {
  return(Array.from(Array(N), (x, index) => index + 1));
};

/**
 * return array from 0 to N-1 sequentially
 *
 * @param {number} N 
 * @returns {array} the array of numbers from 0 to N-1
 * @customfunction
 */
function getsequence0(N) {
  return(Array.from(Array(N), (x, index) => index));
};

function test1 () {
  getsequence0(4);
}

function logSomething() {
  Logger.log("hi there");
  console.log("hi there buddy");
};

/**
 * extract values in a column; returns -1 if the colname is not a header.
 *
 * @param {array} arr An array
 * @param {number} column A 0-based index
 */
function extractColumn(arr, column) {
  return arr.map(x => x[column])
}

/**
 * Get 0-based index of column by name
 *
 * @param {string} colname A string
 * @param {array} headers An array
 * @return {number} A number
 */
function colIndex(colname, headers) {
  return headers.indexOf(colname)
}

/** 
 * get 0-based column indices for a set of column names
 *
 * @param {array} colnames An array of strings
 * @param {array} header An array of strings
 * @return {object} An object named by colnames of numbers
 */
function colIndices(colnames, headers) {
  res = {};
  for (i=0; i<colnames.length; i++) {
    res[colnames[i]] = colIndex(colnames[i], headers);
  }
  return(res);
}

/**
 * write the courses information to the sheet
 *
 * @param {sheet} sheet The sheet to which we are writing
 * @param {data} Array of objects; names are header names.
 */
function writeCourseDataToSheet(sheet, data) {
  // Get headers from first element of data.
  header = [];
  firstRow = data[0];
  for (var colname in firstRow) {
    header.push(colname)
  }
  // Get data 
  out = new Array();
  for (var i=0; i<data.length; i++) {
    inrow = data[i];
    outrow = [];
    header.forEach(h => outrow.push(inrow[h]));
    out.push(outrow);
    Logger.log('outrow ' + i + ' is ' + outrow);
  }
  writeArrayToSheet(sheet, header, out);
}

/**
 * write the courses information to the sheet
 *
 * @param {sheet} sheet The sheet to which we are writing
 * @param {array} header The header for the data
 * @param {array} data The two-dimensional data (array of row arrays) that we are writing to the sheet
 */
function writeArrayToSheet(sheet, header, data) {
  sheet.appendRow(header);
  Logger.log('writeArrayToSheet: data has length ' + data.length);
  for (var i=0; i < data.length; i++) {
    Logger.log(i + ': data is ' + data[i]);
    sheet.appendRow(data[i]);
  }
}

/**
 * Adds one quiz question
 *
 * @param {array} qdata The data for this question
 * @param {form} form The form that we are adding to
 * @param {body} body The document body for Answers Sheet
 */
function addQuestionToFormAndDoc(qdata, form, body) {
  var pointvalue = qdata.points;
  var question = qdata.question;
  var allanswers = [qdata.correct, qdata.incorrect1, qdata.incorrect2, qdata.incorrect3]; 
  var myorder = shuffle(getsequence0(4));
  var control = qdata.order
  var questionnumber = 'Control ' + control;
    
  // construct the choices with createChoice(value, isCorrect)
  // Could also have done (x, index) => createChoice(allanswers[x], index==0
  item = form.addMultipleChoiceItem();
  var choices = []; // for form
  var questionnumber = 'Control ' + qdata.order; // for doc answer sheet    
  body.appendParagraph(questionnumber + '. ' + qdata.question);
      
  for (j =0; j < 4; j++) {
     // form
     var choice = item.createChoice(allanswers[myorder[j]], myorder[j] == 0);
     choices.push(choice);
     // doc
     var answer = allanswers[myorder[j]];
     body.appendListItem(answer);
   }  
      
   body.appendParagraph(''); // doc    
   // create the form question
   item.setTitle(questionnumber)  
       .setChoices(choices)  
       .setPoints(pointvalue)
       .setHelpText(question)
       .setRequired(true);
  
  return(true);
}

/**
 * Creates quizes form with multiple choice questions
 * Note: refer to https://stackoverflow.com/questions/44508280/programmatically-allow-view-score-in-quiz-in-google-apps-scripts
 *   to see how to programmatically configure to immedaitely after each submission by a trick.
 * Assumes specific column names.
 *
 * @param {array} input The data to use to create the form
 * @customfunction
 */

function createMultipleChoiceQuizForms() {  
  // Get the sheet named "Controls"
  ss = SpreadsheetApp.getActiveSpreadsheet();
  courseSheet = ss.getSheetByName("ControlCourses");
  if (courseSheet === null) {
    courseSheet = ss.insertSheet("ControlCourses");
  } else {
    courseSheet.clear(); // clear all content
  }
  input = ss.getSheetByName('Controls').getDataRange().getValues();
  header = input.shift();
//  Logger.log('input is ' + input);
  
  var quizzes = {}; // Create new object
  
  // Determine the column indices
  const colnames = ["Map", "Course", "Order", "Points", "Course", "Question", 
                    "Correct", "Incorrect1", "Incorrect2", "Incorrect3", "StartName", 
                    "ShortName", "Title", 
                    "Neighborhood"];
  const headeri = colIndices(colnames, header);
  Logger.log('Column indices are ' + headeri);
  
  // Read the data and put into array indexed by course.
  // Each array element is an array of control objects.
  for (var i = 0; i < input.length; i++) {
    var row = input[i];
    var shortname = row[headeri.ShortName];
    
    if (!quizzes[shortname]) {
      quizzes[shortname] = new Array()
    }
    
    quizzes[shortname].push({
      course: row[headeri.Course].trim(),
      order: row[headeri.Order],
      points: row[headeri.Points],
      question: row[headeri.Question].trim(),
      correct: row[headeri.Correct],
      incorrect1: row[headeri.Incorrect1],
      incorrect2: row[headeri.Incorrect2],
      incorrect3: row[headeri.Incorrect3],
      map: row[headeri.Map].trim(),
      shortname: row[headeri.ShortName],
      neighborhood: row[headeri.Neighborhood],
      startname: row[headeri.StartName],
      title: row[headeri.Title]
    });
  }
  
  // Starting with a template bc permissions to create a form from scratch is harder.
  var formTemplate = DriveApp.getFileById('1dVwgIvwlteUsaGjz6HhruxpwzaEvKIknZg44jvh45Eo');
  var docTemplate = DriveApp.getFileById('14bfIrpy73cBbmXOWP0HuhExx7KAm3WhLi-XGyX5V2nM');
  
  courses = new Array();
  for (var quizName in quizzes) {
    Logger.log(quizName);
    var quiz = quizzes[quizName]; // This returns an array of controls for that course
    var coursename = quiz[0].shortname;
    var totalPoints = 0;
    Logger.log('Name of form is ' + coursename);

    // Create a copy of the form template and set up the form
    var file = formTemplate.makeCopy();
    file.setName(coursename);
    var form = FormApp.openById(file.getId());
    form.setTitle(quiz[0].title)
        .setDescription('A neighborhood map activity from Navigation Games');
    form.addTextItem()  
      .setTitle("Runner or Team Name")  
      .setRequired(true);
    
    // Create a copy of the doc template
    var file = docTemplate.makeCopy();
    file.setName(coursename);
    var doc = DocumentApp.openById(file.getId());
    var body = doc.getBody();
    body.appendParagraph('Neighborhood: ' + quiz[0].neighborhood);
    body.appendParagraph('Course: ' + quiz[0].course);
    body.appendParagraph('Start:  ' + quiz[0].startname);
    body.appendParagraph('');
    
    // Create the multiple choice questions
    Logger.log('quiz (course) is ' + quizName);
    for (var i=0; i<quiz.length; i++) {
      qdata = quiz[i];
      Logger.log("QUIZ QUESTION");
      Logger.log(qdata);
      totalPoints = totalPoints + qdata.points;
      addQuestionToFormAndDoc(qdata, form, body); // separate function written in this file
    
    } // end of going through the controls for this course
    
    // FINISH UP THE FORM 
    // multi-line "text area" 
    item = "Comments";  
    form.addParagraphTextItem()  
        .setTitle(item)  
        .setRequired(false);  
    
    doc.saveAndClose();
    // create PDF
    pdfName = coursename + '.pdf';
    var theBlob = doc.getBlob().getAs('application/pdf').setName(pdfName);
    var newFile = DriveApp.createFile(theBlob);
    
    // Set up courses
    courses.push({
       ShortName: quizName, // short name
       TotalPoints: totalPoints,
       Neighborhood: quiz[0].neighborhood,
       Course: quiz[0].course,
       Map: quiz[0].map,
       Title: quiz[0].title,
       Start: quiz[0].startname,
       NQuestions: quiz.length,
       FormID: form.getId(),
       FormEditURL: form.getEditUrl(),
       FormResponseURL: form.getPublishedUrl(),
       FormShortResponseURL: form.shortenFormUrl(form.getPublishedUrl()),
       AnswerSheetID: doc.getId(),
       AnswerSheetUrl: doc.getUrl(),
       AnswerSheetPDFID: newFile.getId(),
       AnswerSheetPDFUrl: newFile.getUrl()
    })
  } // end of creating this course's form and doc
  // Update the courses sheet!
  writeCourseDataToSheet(courseSheet, courses);

  return(true);  
}

/**
 * Summarizes all results for the courses in the ControlCourses sheet. 
 * Assumes specific column names.
 * In responses, we care about Timestamp, Email Address, Score, Runner or Team Name and Comments.
 * Results are written to sheet "Results"
 * 
 * @customfunction
 */
function calculateResults() {
}
