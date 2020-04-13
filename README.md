# neighborhood-o
Google apps script code for creating neighborhood O answer sheets and quiz forms.

Given a set of control descriptions in the "Controls" tab of the spreadsheet, it copies a template (example) form and doc for each course in order to create answer sheets.

The IDs and URLs of the doc, pdf and form versions of the answer sheet are stored back in another tab in the spreadsheet ("ControlCourses").

The data from the ControlCourses tab should be copied over to the manually curated CuratedCourses tab.

Another function, calculateResults, retrieves all responses from the forms in CuratedCourses, and writes the results to the Results tab.

Roadmap:

- Include the Runner or Team Name in the results.
- Instead of over-writing the answer quiz form, update it, so that previous responses are not lost.
- Indicate which courses need to be updated.
- Add course sequence and course length (optional) into the original Controls spreadsheet.
