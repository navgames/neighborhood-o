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
 * Creates quizes form with multiple choice questions
 * Note: refer to https://stackoverflow.com/questions/44508280/programmatically-allow-view-score-in-quiz-in-google-apps-scripts
 *   to see how to programmatically configure to immedaitely after each submission by a trick.
 *
 * Assumptions: 
 * columns - COURSE (3) | ORDER (4) | POINTS (5) | QUESTION (6) | CORRECT (7) | INCORRECT1 (8) | INCORRECT2 (9) | INCORRECT3 (10)
 * - ORDER is preordered
 *
 * @param {array} input The data to use to create the form
 * @customfunction
 */

function createMultipleChoiceQuizForms() {  
  // Get the sheet named "Controls"
  input = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Controls').getDataRange().getValues();
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
  
  for (var quizName in quizzes) {
    Logger.log(quizName);
    var quiz = quizzes[quizName]; // This returns an array of controls for that course
    var coursename = quiz[0].shortname;
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
      var pointvalue = qdata.points;
      Logger.log('pointvalue is ' + pointvalue);
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
   
    } // end of going through the controls for this course
    
    // FINISH UP THE FORM 
    // multi-line "text area" 
    item = "Comments";  
    form.addParagraphTextItem()  
        .setTitle(item)  
        .setRequired(false);  
  } // end of creating this course's form and doc
  return(true);  
}

/**
 * Creates quizzes answer sheets with multiple choice questions
 * Note: refer to https://stackoverflow.com/questions/44508280/programmatically-allow-view-score-in-quiz-in-google-apps-scripts
 *   to see how to programmatically configure to immedaitely after each submission by a trick.
 *
 * @param {array} input The data to use to create the form
 * @customfunction
 */

function createMultipleChoiceQuizAnswerDocs() {  
  input = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  var quizzes = {};
  
  // Read the data
  for (var i = 1; i < input.length; i++) {
    var row = input[i];
    var map = row[0].trim();
    var course = row[3].trim();
    var order = row[4];
    var points = row[5];
    var question = row[6].trim();
    var correct = row[7];
    var incorrect1 = row[8];
    var incorrect2 = row[9];
    var incorrect3 = row[10];
    var startloc = row[14];
    var locale = row[15];
    var mapcourse = locale + ' - ' + course;
    
    if (!quizzes[mapcourse]) {
      quizzes[mapcourse] = new Array()
    }
    
    quizzes[mapcourse].push({
      course: course,
      order: order,
      points: points,
      question: question,
      correct: correct,
      incorrect1: incorrect1,
      incorrect2: incorrect2,
      incorrect3: incorrect3,
      map: map,
      mapcourse: mapcourse,
      startloc: startloc,
      locale: locale
    });
  }
  
  var templateFile = DriveApp.getFileById('14bfIrpy73cBbmXOWP0HuhExx7KAm3WhLi-XGyX5V2nM');
  
  for (var quizName in quizzes) {
    Logger.log(quizName);
    var quiz = quizzes[quizName];
    var formname = quiz[0].mapcourse;
    Logger.log('Name of doc is ' + formname);

    // Create a copy of the form
    var file = templateFile.makeCopy();
    file.setName(formname);
    var doc = DocumentApp.openById(file.getId());
    var body = doc.getBody();

    body.appendParagraph('Course: ' + formname);
    body.appendParagraph('Start:  ' + startloc);
    body.appendParagraph('');
    
    // Create the multiple choice questions
    Logger.log('quiz is ' + quiz);
    for (var i=0; i<quiz.length; i++) {
      qdata = quiz[i];
      Logger.log("QUIZ QUESTION");
      var pointvalue = qdata.points;
      var question = qdata.question;
      var allanswers = [qdata.correct, qdata.incorrect1, qdata.incorrect2, qdata.incorrect3]; 
      var myorder = shuffle(getsequence0(4));
      var control = qdata.order;
      var questionnumber = 'Control ' + control;
      Logger.log(questionnumber);
    
      // construct the choices with createChoice(value, isCorrect)
      // Could also have done (x, index) => createChoice(allanswers[x], index==0
      body.appendParagraph(questionnumber + '. ' + question);
      for (j =0; j < 4; j++) {
        var answer = allanswers[myorder[j]];
        body.appendListItem(answer);
        Logger.log(answer);
      }
      body.appendParagraph('');
    }
    doc.saveAndClose();
    // create PDF
    pdfName = formname + '.pdf';
    var theBlob = doc.getBlob().getAs('application/pdf').setName(pdfName);
    var newFile = DriveApp.createFile(theBlob);
 
  } // end of creating this doc
  return true;
   
}

/* Run specific thing because can't run from the spreadsheet due to not having createform permissions there */
function testCreateForm() {
  var paramRange = SpreadsheetApp.getActiveSheet().getRange('D1:J9');
  var paramValues = paramRange.getValues();
  createMultipleChoiceQuizForm(paramValues)
}

function createForm() {  
   // create & name Form  
   var item = "Speaker Information Form 2";  
   var form = FormApp.create(item)  
       .setTitle(item);  
   
   // single line text field  
   item = "Name, Title, Organization";  
   form.addTextItem()  
       .setTitle(item)  
       .setRequired(true);  
   
   // multi-line "text area"  
   item = "Short biography (4-6 sentences)";  
   form.addParagraphTextItem()  
       .setTitle(item)  
       .setRequired(true);  
   
   // radiobuttons  
   item = "Handout format";  
   var choices = ["1-Pager", "Stapled", "Soft copy (PDF)", "none"];  
   form.addMultipleChoiceItem()  
       .setTitle(item)  
       .setChoiceValues(choices)  
       .setRequired(true);  
   
   // (multiple choice) checkboxes  
   item = "Microphone preference (if any)";  
   choices = ["wireless/lapel", "handheld", "podium/stand"];  
   form.addCheckboxItem()  
       .setTitle(item)  
       .setChoiceValues(choices);  
 };
