/*
The MIT License (MIT)

Copyright (c) 2015 Ethan Perez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


/**
 * Returns the value of the paramater from a URL
 * @param  {string} name Parameter name
 * @return {string}      Parameter value
 *
 * jQuery function to strip search string of args
 * Courtesy of http://www.sitepoint.com/url-parameters-jquery/
 */
function getURIParam(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null){
    return null;
  } else {
    return results[1] || 0;
  }
}

/**
 * Returns the UT department from the Course Schedule URL
 * @param  {string} uri Course schedule URL
 * @return {string}     Three character department identifier
 */
function getDeptFromURI(uri) {
  // Get the department param, check 'em
  var dept = getURIParam(uri);
  // Stubborn 2 letter departments
  if (dept.length == 1) {
  dept = dept + "++";
  }
  return dept;
}

// Assign department to global
var dept = getDeptFromURI('fos_fl');

/**
 * Returns the UT course number from
 * @param  {string} text String that contains the course name, number, and description
 * @return {[type]}      [description]
 */
function getCourseNumber(text) {
  var spacedText = text.split(/\s+/)

  // Now, check to see where the c# starts
  var courseNumber;
  if (isNaN(spacedText[1].charAt(0)) == false) {
    return spacedText[1];
  } else {
    return spacedText[3];
  }
}

/**
 * Capitalizes the first letter of each word
 * @return {string} Capitalized string
 *
 * Capitalizes the beginning of each word
 *   http://stackoverflow.com/questions/4878756
 *   javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
 */
String.prototype.capitalize = function(){
  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

// Figure out what the course number is
// 
// Condition 1: the course number starts after
// either the second or third space
// 
// Condtiion 2: the course number, even it has a 
// letter at the end, can be identifed as a block,
// i.e., there are no spaces
// 
// Algo: check the 1st index from split: if number,
// proceed, else, take block 2. (This is because 
// of the two lettered depts i.e., CS == C S)
$("td.course_header h2").each(function() {
  // Get the OG text
  var ogText = $(this).text();
  // Parse it for the course number
  
  var courseNumber = getCourseNumber(ogText);

  // Set the link
  $(this).append('<a href="https://utdirect.utexas.edu/apps/student/coursedocs' +
                 '/nlogon/?semester=&department=' + 
                 dept + 
                 '&course_number=' + 
                 courseNumber + 
                 '&course_title=&unique=&instructor_first=&instructor_last=' + 
                 '&course_type=In+Residence&search=Search" target="_blank">View Syllabi and CVs</a>');
});

// Add link to CIS
$('td[data-th="Instructor"]').each(function() {
  var plainUriName = $(this).text().toLowerCase().capitalize();
  if (plainUriName !== "") {
    // Get the prof's name
    var profName = plainUriName.split(", ");
    // Get the prof's URI
    var uriName = encodeURIComponent(plainUriName).replace(/%20/, '+');
    // Change the name into a link
    $(this).append(' (<a href="https://utdirect.utexas.edu/ctl/ecis/results' +
                   '/search.WBX?s_in_search_type_sw=N&s_in_max_nbr_return=10&' +
                   's_in_search_name=' +
                   uriName +
                   '" target="_blank">Surveys</a>');
  }
});

// Identify the header tds
$('td.course_header').each(function() {
  $(this).parent().addClass('ch');
});

// Add syllabus link
$('.ch').each(function() {
  var header = $(this).text();
  var sections = $(this).nextUntil('tr.ch').children('td[data-th="Instructor"]').each(function() {
    // Set the prof's name
    var profName = $(this).text()
    if (profName !== "") {
      // Split the name
      var splitProfName = profName.split(", ")
      // Set the link
      $(this).append('/<a href="https://utdirect.utexas.edu/apps/student/coursedocs' +
                     '/nlogon/?semester=&department=' + 
                     dept + 
                     '&course_number=' + 
                     getCourseNumber(header) + 
                     '&course_title=&unique=&instructor_first=&instructor_last=' +
                     splitProfName[0] +
                     '&course_type=In+Residence&search=Search" target="_blank">Syllabi</a>)');  
    }
  });
});