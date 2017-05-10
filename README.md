PeerGraderJS
------------
**PeerGradersJS** is an accessible process to allow peer grading activities among a class of users, collect dozens or hundreds evaluations, and calculates grades received from other peers, from teachers, as well as the seriousness of the grades given to other peers. The system is Open Source and Open License.

### Technical side
**Version:** v.0.2.2.<br>
**Stack:** Google Forms, Google SpreadSheet, TableTop.js, JQuery, D3js, Github pages.

#### Code structure
```
 + index.html
 +-- ./js/
   - ./script.js
 +-- ./css/
   - ./style.css
   - ./bootstrap.css
```

**Note:** don't change anything if you are not a web developer. 
To hack this process, collaborate with a junior or senior Javascript developer.

### Activity / Teaching side
#### Basic scheme
The current version helps to collect all the evaluations' datum, to process them, and to provide to the teacher.s the students' final grades. The activity set up is still to organize by the teaching team by other means. In an ideal case with a class of 30 students, 10 groups of 3 presenting their work, the students dispatch on the cycle 1/6 would looks like below : 
<p align="center">
  <img width="400px" src="https://github.com/CyberCRI/PeerGradersJS/blob/master/img/PeerGraderJS-Class10-ani-900px-legend.gif?raw=true" alt="Schematic image"/>
</p>

... in addition of which each teacher also evaluate one work. 

This rotation occurs with a minor shift for *n* cycles, the shift allows everyone to move to an other work.

#### Vocabulary
* **Class** : your cohort of students or users.
* **Group** : association of students providing one single item to others, to be graded. Groups can have 1 to n members.
* **Student** : the learning users, students' judgment have normal credibility.
* **Professor** : the authoritative users, professors' judgment have higher credibility.
* **Work/item** : the object being graded, it can be a poster, a PowerPoint presentation, a speech by one or several students, a drawing, an invention, etc.
* **Cycle** : a cycle is, by default, a period made of presentation time, Q&A time, evaluation time, and move-around time. Students either present to graders or walk towar others to grades the work of a presenting group.

#### Results
* **Grading system** : `[0-20]`. 0 is worst score, 20 is best.
* **PeerGrades** : grades a student receives from all his/her peer(s), averaged.
* **ProfGrades** : grades a student receives from all his/her professor(s), averaged. If no professor specifically graded the student, the student inherit professor's grade from its group.
* **Normalness** (aka seriousness as grader): compare the student A's grades given to others students with others similar gradings. If the grades is too far off, the students was not a normal teacher, and his/her normalness score get lower. If distance from the mean grade is 1pts : normalness is 20/20, 2pts : 18, 4pts : 16, 8pts : 10, more 0/20. So, if student B receive a mean evaluation of 16/20, but A gives 15/20, A get a normalness of 20/20. If student B receive a mean evaluation of 16/20 from others, but A gives 7/20, A is a very strange teacher and A get a normalness of 0/20.
* **FinalScore** : the final grade of the student for this workshop. The default calculation being : `FinalScore = PeerGrades * 0.25 + ProfGrades * 0.50 + Normalness * 0.25`.

To hack this process, collaborate with a junior or senior Javascript developer.

### How to run a Peer Grading workshop with PeerGradersJS ?
#### Requirements
For out of the box usage:
* teaching experience
* Google drive account
Better with :
* experience with google drives / forms
* understanding that columns titles and variables doesn't accept the slightess orthographic error
* minor JS understanding and hacking habilities

To hack this process, collaborate with a junior or senior Javascript developer.

### How to set the things up (default)
By default, we assume you have X students, organized in 6 cycles.

1. Open [this google form](http://tinyurl.com/biomedpeers ) > duplicate it : you now own a copy<br>> Go to the spreadsheet > Publish to the web > copy this long Google spreadsheet hash code
3. Open [this webcode](https://cybercri.github.io/PeerGradersJS/) > Fork it[1] > Save the URL
4. Enter your long Google spreadsheet hash code > Your workshop data should get displayed

#### Students' guide (template)

> Today's program will let you display your work and evaluate other students' works.<br>
> Today's class will be divided into *6 cyles* of 20 minutes, from #1 to #6.<br>
> You will evaluate other people's works for 4 sessions.<br>
> And you will present your work for 2 sessions.
> 
> *Your personal planning*, group ID, and personnal id will be provided by the teaching team.<br>
> PLEASE WRITE YOUR TEAM CODENAME AT THE TOP (RIGHT) OF YOUR WALL, in BIG.<br>
> Then, at each session's start, follow your planning and take notes such as (example) :
> 
> Session 1. I grade group G03, grade given 16/20.<br>
> Session 2. I grade group G05, grade given 14/20.<br>
> Session 3. I present.<br>
> Session 4. I present..<br>
> Session 5. I grade group G07, grade given 12/20.<br>
> Session 6. I grade group G09, grade given 17/20.
> 
> Then, go to the questionnaire and fill the evaluations as needed.<br>
> Questionnaire url :  ```http://tinyurl.com/{shortlinkToGoogleForm}```

#### Evaluation forms
Give the student a basic, scaled grading guideline, so they can methodically grade their peers.

#### TEST IT !
Before the workshop, test this process. Answer 6 times to your questionnaire,
* once as student `G01a` of group `G01` grading `G02a` in cycle #1,
* once as student `G01b` of group `G01` grading `G02b` in cycle #2,
* once as student `G02a` of group `G02` grading `G01a` in cycle #1,
* once as student `G02b` of group `G02` grading `G01b` in cycle #2,
* once as Professor `Prof1` of group `Profs` grading `G01a` in cycle #1.
* once as Professor `Prof1` of group `Profs` grading `G02a` in cycle #2.
 The webpage of point 3. should displays relevant grades and averages.
 Students G01b and G02b, never specifically graded by any professor, will inherit professor's grade from their group.

### Hacking
The code is open source and open license, thus hackable. As of v.0.2.2 the stack is basic, a junior Javascript developer can clone and edit it.

### License
CC-BY-SA-NC-4.0 -- Lopez Hugo, Center for Research in Interdisciplinarity (@CRIparis)

A system developed under the benevolent guidance of Antoine Taly and the CRI.

<!-- 
A [Pen](http://codepen.io/hugolpz/pen/BpLPQb) by [Lopez Hugo](http://codepen.io/hugolpz) on [CodePen](http://codepen.io/).
[License](http://codepen.io/hugolpz/pen/BpLPQb/license). -->
