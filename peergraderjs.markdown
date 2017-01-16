PeerGraderJS
------------
## PeerGraderJS

**PeerGradesJS** is an accessible process to allow peer grading activities among a class of users, collect dozens or hundreds evaluations, and calculates grades received from other peers, from teachers, as well as the seriousness of the grades given to other peers. The system is Open Source and Open License.

The current version (v.0.3) is based on Google Forms, Google SpreadSheet, Codepen.io, TableTop.js, D3js (v.3), JQuery and Javascript.

### Versions
* -- CURRENT

### Human requirements
For out of the box usage:
* teaching experience
* Google drive account
Better with :
* experience with google drives / forms
* understanding that columns titles and variables doesn't accept the slightess orthographic error
* minor JS hacking habilities

To truly hack this process, collaborate with a junior or senior Javascript developer.

### Vocabulary
* **Class** : your cohort of students or users.
* **Student** : the learning users, students' judgment have normal credibility.
* **Professor** : the authoritative users, professors' judgment have higher credibility.
* **Group** : association of students providing one single item to others, to be graded. Groups can have 1 to n members.
* **Item** : the object being graded, it can be a poster, a PowerPoint presentation, a speech by one or several students, a drawing, an invention, etc.
* **Cycle** : the default cycle is a period made of presentation time, Q&A time, evaluation time, and move-around time. Students either present to graders or grades a presenting group.

### How to set the things up (default)
By default, we assume you have X students, organized in 6 cycles.

1. Open [this google form]() > duplicate it : you now own a copy
2. > Publish to the web : copy this long hash code
3. Open [this webcode]() > Fork it[1] > Save the URL
4. Enter your hash code > Your workshop data should get displayed

[1]: don't change anything if you are not a web developer.

**TEST IT !**
Before the workshop, test this process. Answer 6 times to your questionnaire,
* once as student `G01a` of group `G01` grading `G02a` in cycle #1,
* once as student `G01b` of group `G01` grading `G02b` in cycle #2,
* once as student `G02a` of group `G02` grading `G01a` in cycle #1,
* once as student `G02b` of group `G02` grading `G01b` in cycle #2,
* once as Professor `Prof1` of group `Profs` grading `G01a` in cycle #1.
* once as Professor `Prof1` of group `Profs` grading `G02a` in cycle #2.
 The webpage of point 3. should displays relevant grades and averages.
 Students G01b and G02b, never specifically graded by any professor, will inherit professor's grade from their group.

**Results**
* **Grading system** : the default system is .../20. 20 is best score, 0 is worst.
* **PeerGrades** : grades a student receives from all his/her peer, averaged.
* **ProfGrades** : grades a student receives from all his/her professors, averaged. If no professor specifically graded the student, the student inherit professor's grade from its group.
* **Normalness** (aka seriousness as grader): compare the student A's grades given to others students with others similar gradings. If the grades is too far off, the students was not a normal teacher, and his/her normalness score get lower. If distance from the mean grade is 1pts : normalness is 20/20, 2pts : 18, 4pts : 16, 8pts : 10, more 0/20. So, if student B receive a mean evaluation of 16/20, but A gives 15/20, A get a normalness of 20/20. If student B receive a mean evaluation of 16/20 from others, but A gives 7/20, A is a very strange teacher and A get a normalness of 0/20.
* **FinalScore** : the final grade of the student for this workshop. The default calculation being : `FinalScore = (PeerGrades * 0.25 + ProfGrades * 0.50 + Normalness * 0.25)`.`

To hack this process, collaborate with a junior or senior Javascript developer.

### How to run a workshop? (default)


To hack this process, collaborate with a junior or senior Javascript developer.

### Hacking
The code is open source and open license, thus hackable.
The

### License
CC-BY-SA-4 -- Lopez Hugo, Center for Research in Interdisciplinarity (@CRIparis)

A system developed under the benevolent guidance of Antoine Taly and the CRI.


A [Pen](https://codepen.io/hugolpz/pen/BpLPQb) by [Lopez Hugo](http://codepen.io/hugolpz) on [CodePen](http://codepen.io/).

[License](https://codepen.io/hugolpz/pen/BpLPQb/license).