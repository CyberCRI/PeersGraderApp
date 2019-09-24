import router from '../../router'
/* TO DO 
getAuthActivity : make password check only on server side
*/
export default {
    namespaced : true,
    state : {
        activity : {
            sessions : 0,
            title : '',
            participants:[{
                email : '',
                token : '',
                group: '',
                name : '',
                role : '',
                invitationSent : false,
                reviewed:[]
            }],
            rubrics:[{
                name:'',
                points:0,
                descriptors:[{
                    content:'',
                    level:'',
                    points:0
                }]
            }],
            basis:20,
            guidelines : '',
        },
        isAdmin : false,
        withId : false,
        modifyWill : false, 
        shifts : []
    },
    actions : {
        isRubricEmpty(){
            return this.state.activity.activity.rubrics.length == 1 && this.state.activity.activity.rubrics[0].name == '' 
                    && this.state.activity.activity.rubrics[0].points == 0 && this.state.activity.activity.rubrics[0].descriptors.length == 1 
                    && this.state.activity.activity.rubrics[0].descriptors[0].content == 0 
                    && this.state.activity.activity.rubrics[0].descriptors[0].points == 0;
        },
        sendInvitations(context,invitationSpecifier){
            return this._vm.$axios.post('/api/activity/sendInvitations',{
                activity: invitationSpecifier.activity,
                destinators : invitationSpecifier.destinators,
                message : invitationSpecifier.message
            }).then(response=>{
                if(response.data.success)
                    return new Promise((resolve,reject)=>resolve({sent:true}));
                else return new Promise((resolve,reject)=>reject({
                    sent:false,
                    participant:response.data.participant,
                    who:response.data.who}));
            });
        },
        setModifyWill(context,modifyWill){
            context.commit('setModifyWill',modifyWill);
        },
        setShifts(context,shifts){
            context.commit('setShifts',shifts);
        },
        setIsAdmin(context,isAdmin){
            context.commit('setIsAdmin',isAdmin);
        },
        setUserSession(context,userSession){
            context.commit('setUserSession',userSession);
        },
        setCanReadOnly(context,canReadOnly){
            context.commit('setCanReadOnly',canReadOnly)
        },
        setWithId(context,withId){
            context.commit('setWithId',withId)
        },
        getAuthActivity(context,specifier){//check wether or not passwords provided matches the password/ to do in back end only
            return this._vm.$axios.get('/api/activity/'+specifier.urlId).then((response)=>{
                if(response.data.success){
                    console.log('auth activity')
                    if(specifier.pwd == response.data.activity.teacherPwd){
                        context.commit('setActivity',response.data.activity);
                        console.log(response.data.activity)
                        context.commit('setIsAdmin',true);
                        return new Promise((resolve,reject)=>resolve({granted:true}));
                    } else {
                        return new Promise((resolve,reject)=>resolve({granted:false}));
                    }
                }
            }).catch(error=>{
                return new Promise((resolve,reject)=>resolve({granted:false}));
                console.log('error',error);
            });
        },
        lookForActivity(context,key){ 
            return this._vm.$axios.get('/api/activity/'+key).then((response)=>{
                if(response.data.success){
                    console.log('found smthg')
                    console.log(response.data.activity);
                    context.state.userSession = false;
                    context.commit('setActivity',response.data.activity);
                    //router.push({path:'/activity/'+response.data.activity.urlId});
                    return new Promise((resolve,reject)=>resolve({url:response.data.activity.urlId}));
                }
            });
        },
        deleteActivity(context,activityId){
            
            this._vm.$axios.delete('/api/activity/'+activityId).then(response=>{
                if(response.data.success){

                    this._vm.$notify({
                        group: 'notifications',
                        title:'Activity deleted',
                        text: `This activity ${response.data.activity.title} have been deleted with success.`,
                        type : 'success'
                    });
                    console.log('there there')
                    context.dispatch('resetActivitySession');
                    this.showStep = 1;
                    router.push({path:'/activity'})
                }
            });
            
        },
        resetActivitySession(context,activity){

            console.log('resetting');

            context.commit('setActivity',{
                presentations:0,
                sessions : 0,
                title : '',
                teacherEmail : '',
                teacherName : '',
                participants:[{
                    email : '',
                    token : '',
                    name : '',
                    group: '',
                    //cohort : 0,
                    //ine : '',
                    role : '',
                    reviewed:[]
                }],
                rubrics:[{
                    name:'',
                    points:0,
                    descriptors:[{
                        content:'',
                        level:'',
                        points:0
                    }]
                }],
                basis : 20,
                guidelines : '',
                invitationsSent : true
            });

            context.commit('setIsAdmin',false);

            context.commit('setWithId',false);
        },
        setActivity(context){
            if(context.state.activity.urlId) //if activity got an urlId, means the admin wants to modify an existing activity
                return this._vm.$axios.put('/api/activity/'+activity.urlId,{activity:context.state.activity}).then((response)=>{
                    if(response.data.success){
                        this._vm.$notify({
                            group: 'notifications',
                            title:'Activity updated',
                            text: 'This activity have been updated with success.',
                            type : 'success'
                        });
                        
                        context.state.activity = response.data.activity;
                        context.state.userSession = true;

                    }
                }); // otherwise creates it
            else return this._vm.$axios.post('/api/activity',{activity:context.state.activity}).then((response)=>{
                    console.log('here')

                    if(response.data.success){
                        this._vm.$notify({
                            group: 'notifications',
                            title:'Activity saved',
                            text: 'This activity have been saved with success.',
                            type : 'success'
                        });

                        context.state.activity = response.data.activity;
                        console.log('logger')
                        console.log(context.state.activity)

                        context.state.userSession = true;
                        //router.push({path:'/activity/'+response.data.activity.urlId});
                        return new Promise((resolve,reject)=>resolve({teacherPwd:response.data.activity.teacherPwd}));
                    }
                });
        },
        getPlanningFinal(context){
            var vm = this._vm,
                groups = {
                    observators : [],
                    students : {},
                    teachers : []                    
                },
                studentPositionShift = -1,
                nbStudents = 0,
                nbTeachers,
                nbObservators,
                maxStudents = 0;

            function getGroups(groups){
                return context.state.activity.participants.reduce((a,c)=>{
                    
                    if(c.role=='Student'){
                        a.students[c.group] = a.students[c.group] || [];
                        c.presentationCount = 0;
                        c.gradingCount = 0;
                        c.positionShift = Object.keys(a.students).length - 1;//la place de l'étudiant dans le planning
                        a.students[c.group].push(c);
                    } else if(c.role=='Teacher'){
                        c.gradingCount = 0;
                        a.teachers.push(c);
                    }
                    else if(c.role=='Observator'){
                        c.gradingCount = 0;
                        a.observators.push(c);
                    }
                    return a;
                },groups);
            }

            groups = getGroups(groups);

            console.log('groups')
            console.log(groups)

            let groupsLabel = Object.keys(groups.students);

            for(let group of groupsLabel){
                nbStudents += groups.students[group].length;
                 if(groups.students[group].length>maxStudents){
                    maxStudents = groups.students[group].length;
                }
            }

            nbTeachers = groups.teachers.length;
            nbObservators = groups.observators.length;

            var shifts = {},
                nbShifts = maxStudents*context.state.activity.sessions;

            shifts['students'] = new Array(nbShifts),
            shifts['teachers'] = new Array(nbShifts),
            shifts['observators'] = new Array(nbShifts);
     
            let shiftsLabel = Object.keys(shifts);

            for(let entity of shiftsLabel){
                for(var i=0;i<shifts[entity].length;i++){
                    if(entity==='students')
                        shifts[entity][i] = new Array(Object.keys(groups.students).length).fill().map(x=>({presenter:{},graders:[]}));
                    else if(entity==='teachers')
                        shifts[entity][i] = new Array(groups.teachers.length).fill().map(x=>({student:{}}));
                    else
                       shifts[entity][i] = new Array(groups.observators.length).fill().map(x=>({student:{}}));
               }
            }

            function isShiftOkToPresent(student,indexShift){

                let ok = true;

                //si la case du planning a déjà un étudiant qui présente
                if(shifts.students[indexShift][student.positionShift].presenter){
                    //si l'étudiant de la case est le même que celui passé en argument ou du même groupe
                    if(shifts.students[indexShift][student.positionShift].presenter.email != student.email && shifts.students[indexShift][student.positionShift].presenter.group == student.group){
                      ok = false;//on peut pas insérer ici
                    }
                }
                
                console.log(ok)
                return ok; //sinon oui
            }

            function getParticipant(email){
                return context.state.activity.participants.find(x=>x.email == email);//renvoie l'objet participant correspondant au participant de l'email
            }

            for(let i=0;i<groupsLabel.length;i++){
                while(groups.students[groupsLabel[i]].every(student=>
                    student.presentationCount < context.state.activity.sessions)){

                    for(var j=0,groupStudents=groups.students[groupsLabel[i]];j<groupStudents.length;j++){
                        if(groupStudents[j].presentationCount < context.state.activity.sessions){
                            let indexShift = 0,i=0;
                                
                                while(groupStudents[j].presentationCount < context.state.activity.sessions){
                                    
                                    if(groupStudents[j].presentationCount < context.state.activity.sessions){
                                        if(isShiftOkToPresent(groupStudents[j],indexShift)){
                                            shifts.students[indexShift][groupStudents[j].positionShift].presenter = {
                                                group : groupStudents[j].group,
                                                email : groupStudents[j].email
                                            }



                                            groupStudents[j].presentationCount = groupStudents[j].presentationCount+1;
                                            

                                            var participant = getParticipant(groupStudents[j].email);

                                            if(participant){
                                                if(participant.reviewed.length == 0){
                                                    participant.reviewed = new Array(nbShifts);
                                                }
                                                
                                                participant.reviewed[indexShift] = {
                                                    reviewedId : groupStudents[j]._id,
                                                    email : groupStudents[j].email,
                                                    group : groupStudents[j].group,
                                                    role : groupStudents[j].role,
                                                    session : indexShift+1
                                                };
                                            }
                                        } 

                                        indexShift++;
                                    }
                                    
                                }
                        }
                    }
                }
            }

            function getConstraints(priority){

                var priorityConstraints = [],
                    priorityOrderedConstraints = Object.keys(constraints).sort((a,b)=>constraints[b].priority-constraints[a].priority);

                for(let i=0,prioritySum = 0;prioritySum < priority && i<priorityOrderedConstraints.length;i++){
                    priorityConstraints.push(priorityOrderedConstraints[i]);
                    prioritySum += constraints[priorityConstraints[i]].priority;
                }

                return priorityConstraints;
            }

            var constraints = {
                isGraderAlreadyGrading : {
                    check : function(specifier){


                        let student = specifier.student,
                            gradersShift = shifts.students[specifier.indexShift].reduce((a,p)=>a.concat(p.graders),[]),
                            ok = gradersShift.map(x=>x.email).includes(student.email);
                            console.log('gradersShift',gradersShift)
                    console.log('isGraderAlreadyGrading return',!ok);
                    return !ok;
                    },
                    priority : 50
                },
                isGraderAlreadyPresenting : {
                    check : function (specifier) {
                        
                        let student = specifier.student,
                            ok = false,
                            t =shifts.students[specifier.indexShift].reduce((a,p)=>a.concat(p.presenter),[]);
                            console.log('t',t)
                        if(shifts.students[specifier.indexShift].reduce((a,p)=>a.concat(p.presenter),[]).map(x=>x.email).includes(student.email))
                            ok = false;
                        else ok = true;

                        console.log('isGraderAlreadyPresenting return',ok);
                        return ok;
                    },
                    priority : 45
                },
                isGradersFull : {
                    check : function (specifier){
                        let graders = shifts.students[specifier.indexShift][specifier.indexPool].graders,
                            ok = false;

                        

                        if(graders.length < maxStudents - 1)
                            ok = true;
                        
                        console.log('isGradersFull return',ok)
                        return ok;
                    },
                    priority : 40
                },
                isGradingDone : {
                    check : function(specifier){
                        let student = specifier.student,
                            ok = false;


                        if(student.gradingCount < nbGrading){
                            ok = true;
                        } 
                        
                        console.log('isGradingDone return',ok);
                        return ok;

                    },
                    priority : 35
                },
                isPresentersGroupDifferent : { 
                    check : function (specifier){
                    
                        let student = specifier.student,
                            ok = false;

                        if(shifts.students[specifier.indexShift][specifier.indexPool].presenter.group == student.group)
                            ok = false;
                        else ok = true;

                        console.log('isPresentersGroupDifferent return',ok);
                        
                        return ok;
                    },
                    priority : 20
                },
                isGradersGroupDifferent : {
                    check : function(specifier){

                        let ok = !shifts.students[specifier.indexShift][specifier.indexPool].graders.map(x=>x.group).includes(specifier.student.group);

                        console.log('isGradersGroupDifferent return',ok);
                    },
                    priority : 15
                },
                isThereABuddy : {
                    check : function(specifier){

                        let student = specifier.student,
                            ok = false;

                        if(specifier.indexShift > 0){
                            ok = shifts.students[specifier.indexShift][specifier.indexPool].//chacun de ces graders n'est pas buddy avec student.email
                                                                graders.every(x=>!getParticipant(x.email).reviewed.map(c=>c.email).includes(specifier.student.email));

                        } else ok = true;
                        
                        console.log('isThereABuddy return',!ok);
                        return !ok;

                    },
                    priority : 25
                },
                isThereABuddyPreviousSession : {
                    check : function (specifier){
                        var ok = true;

                         if(specifier.indexShift > 0){
                            
                            ok = shifts.students[specifier.indexShift][specifier.indexPool].//chacun de ces graders n'est pas buddy avec student.email
                                                                graders.every(x=>!getParticipant(x.email).reviewed.filter((c,i)=>i==specifier.indexPool-1).map(x=>x.email).includes(specifier.student.email));
                        } 

                        console.log('isThereABuddyPreviousSession return',!ok);

                        return !ok;
                    },
                    priority : 30
                },
                isPresenterGroupReviewedAlready : {
                    check : function(specifier){
                        
                        let student = specifier.student,
                            indexShift = specifier.indexShift,
                            indexPool = specifier.indexPool,
                            ok = student.reviewed.reduce((a,g)=>a.concat(g.group),[]).filter(x=>x=!student.group).includes(shifts.students[specifier.indexShift][specifier.indexPool].presenter.group);

                        console.log('isPresenterGroupReviewedAlready return',ok);
                        return !ok;
                    },
                    priority : 30
                },
                isPresenterPersonReviewedAlready : {
                    check : function (specifier){

                         let student = specifier.student,
                            indexShift = specifier.indexShift,
                            indexPool = specifier.indexPool,
                            ok = student.reviewed.reduce((a,g)=>a.concat(g.email),[]).filter(x=>x=!student.email).includes(shifts.students[specifier.indexShift][specifier.indexPool].presenter.email);

                        console.log('isPresenterPersonReviewedAlready return',!ok)
                        return !ok;
                    },
                    priority : 25
                }
            };

            console.log('getConstraints',getConstraints(315));
            console.log('shifts');
            console.log(shifts);
        },
        getPlanningV2(context){
            var vm = this._vm,
                groups = {
                    observators : [],
                    students : {},
                    teachers : []                    
                },
                studentPositionShift = -1,
                nbStudents = 0,
                nbTeachers,
                nbObservators,
                maxStudents = 0;

            function getGroups(groups){
                return context.state.activity.participants.reduce((a,c)=>{
                    
                    if(c.role=='Student'){
                        a.students[c.group] = a.students[c.group] || [];
                        c.presentationCount = 0;
                        c.gradingCount = 0;
                        console.log('a.students',a.students);
                        c.positionShift = Object.keys(a.students).length - 1;
                        a.students[c.group].push(c);
                    } else if(c.role=='Teacher'){
                        c.gradingCount = 0;
                        a.teachers.push(c);
                    }
                    else if(c.role=='Observator'){
                        c.gradingCount = 0;
                        a.observators.push(c);
                    }

                    return a;
                },groups);
            }


            groups = getGroups(groups);

            let groupsLabel = Object.keys(groups.students);

            for(let group of groupsLabel){
                nbStudents += groups.students[group].length;
                 if(groups.students[group].length>maxStudents){
                    maxStudents = groups.students[group].length;
                }
            }

            nbTeachers = groups.teachers.length;
            nbObservators = groups.observators.length;

            var shifts = {},
                nbShifts = maxStudents*context.state.activity.sessions;

            shifts['students'] = new Array(nbShifts),
            shifts['teachers'] = new Array(nbShifts),
            shifts['observators'] = new Array(nbShifts);
     
            let shiftsLabel = Object.keys(shifts);

            for(let entity of shiftsLabel){
                for(var i=0;i<shifts[entity].length;i++){
                    if(entity==='students')
                        shifts[entity][i] = new Array(Object.keys(groups.students).length).fill().map(x=>({presenter:{},graders:[]}));
                    else if(entity==='teachers')
                        shifts[entity][i] = new Array(groups.teachers.length).fill().map(x=>({student:{}}));
                    else
                       shifts[entity][i] = new Array(groups.observators.length).fill().map(x=>({student:{}}));
               }
            }

            function isShiftOkToPresent(student,indexShift){

                let ok = true;

                //si la case du planning a déjà un étudiant qui présente
                if(shifts.students[indexShift][student.positionShift].presenter){
                    //si l'étudiant de la case est le même que celui passé en argument ou du même groupe
                    if(shifts.students[indexShift][student.positionShift].presenter.email != student.email && shifts.students[indexShift][student.positionShift].presenter.group == student.group){
                      ok = false;//on peut pas insérer ici
                    }
                }
                
                console.log(ok)
                return ok; //sinon oui
            }

            function getParticipant(email){
                return context.state.activity.participants.find(x=>x.email == email);//renvoie l'objet participant correspondant au participant de l'email
            }

            for(let i=0;i<groupsLabel.length;i++){
                while(groups.students[groupsLabel[i]].every(student=>
                    student.presentationCount < context.state.activity.sessions)){

                    for(var j=0,groupStudents=groups.students[groupsLabel[i]];j<groupStudents.length;j++){
                        if(groupStudents[j].presentationCount < context.state.activity.sessions){
                            let indexShift = 0,i=0;
                                
                                while(groupStudents[j].presentationCount < context.state.activity.sessions){
                                    
                                    if(groupStudents[j].presentationCount < context.state.activity.sessions){
                                        if(isShiftOkToPresent(groupStudents[j],indexShift)){
                                            shifts.students[indexShift][groupStudents[j].positionShift].presenter = {
                                                group : groupStudents[j].group,
                                                email : groupStudents[j].email
                                            }



                                            groupStudents[j].presentationCount = groupStudents[j].presentationCount+1;
                                            

                                            var participant = getParticipant(groupStudents[j].email);

                                            if(participant){
                                                if(participant.reviewed.length == 0){
                                                    participant.reviewed = new Array(nbShifts);
                                                }
                                                
                                                participant.reviewed[indexShift] = {
                                                    reviewedId : groupStudents[j]._id,
                                                    email : groupStudents[j].email,
                                                    group : groupStudents[j].group,
                                                    role : groupStudents[j].role,
                                                    session : indexShift+1
                                                };
                                            }
                                        } 

                                        indexShift++;
                                    }
                                    
                                }
                        }
                    }
                }
            }

            //var nbGrading = Math.round((context.state.activity.participants.length - groupsLabel.length)/groupsLabel.length)//really ? still not convinced here ... yeah definitely BS,

            var nbGrading = nbShifts - context.state.activity.sessions, 
                constraints = {
                    isGraderAlreadyGrading : {
                        check : function(specifier){


                            let student = specifier.student,
                                gradersShift = shifts.students[specifier.indexShift].reduce((a,p)=>a.concat(p.graders),[]),
                                ok = gradersShift.map(x=>x.email).includes(student.email);
                                console.log('gradersShift',gradersShift)
                        console.log('isGraderAlreadyGrading return',!ok);
                        return !ok;
                        },
                        priority : 50
                    },
                    isGraderAlreadyPresenting : {
                        check : function (specifier) {
                            
                            let student = specifier.student,
                                ok = false,
                                t =shifts.students[specifier.indexShift].reduce((a,p)=>a.concat(p.presenter),[]);
                                console.log('t',t)
                            if(shifts.students[specifier.indexShift].reduce((a,p)=>a.concat(p.presenter),[]).map(x=>x.email).includes(student.email))
                                ok = false;
                            else ok = true;

                            console.log('isGraderAlreadyPresenting return',ok);
                            return ok;
                        },
                        priority : 45
                    },
                    isGradersFull : {
                        check : function (specifier){
                            let graders = shifts.students[specifier.indexShift][specifier.indexPool].graders,
                                ok = false;

                            

                            if(graders.length < maxStudents - 1)
                                ok = true;
                            
                            console.log('isGradersFull return',ok)
                            return ok;
                        },
                        priority : 40
                    },
                    isGradingDone : {
                        check : function(specifier){
                            let student = specifier.student,
                                ok = false;


                            if(student.gradingCount < nbGrading){
                                ok = true;
                            } 
                            
                            console.log('isGradingDone return',ok);
                            return ok;

                        },
                        priority : 35
                    },
                    isPresentersGroupDifferent : { 
                        check : function (specifier){
                        
                            let student = specifier.student,
                                ok = false;

                            if(shifts.students[specifier.indexShift][specifier.indexPool].presenter.group == student.group)
                                ok = false;
                            else ok = true;

                            console.log('isPresentersGroupDifferent return',ok);
                            
                            return ok;
                        },
                        priority : 20
                    },
                    isGradersGroupDifferent : {
                        check : function(specifier){

                            let ok = !shifts.students[specifier.indexShift][specifier.indexPool].graders.map(x=>x.group).includes(specifier.student.group);

                            console.log('isGradersGroupDifferent return',ok);
                        },
                        priority : 15
                    },
                    isThereABuddy : {
                        check : function(specifier){

                            let student = specifier.student,
                                ok = false;

                            if(specifier.indexShift > 0){
                                ok = shifts.students[specifier.indexShift][specifier.indexPool].//chacun de ces graders n'est pas buddy avec student.email
                                                                    graders.every(x=>!getParticipant(x.email).reviewed.map(c=>c.email).includes(specifier.student.email));

                            } else ok = true;
                            
                            console.log('isThereABuddy return',!ok);
                            return !ok;

                        },
                        priority : 25
                    },
                    isThereABuddyPreviousSession : {
                        check : function (specifier){
                            var ok = true;

                             if(specifier.indexShift > 0){
                                
                                ok = shifts.students[specifier.indexShift][specifier.indexPool].//chacun de ces graders n'est pas buddy avec student.email
                                                                    graders.every(x=>!getParticipant(x.email).reviewed.filter((c,i)=>i==specifier.indexPool-1).map(x=>x.email).includes(specifier.student.email));
                            } 

                            console.log('isThereABuddyPreviousSession return',!ok);

                            return !ok;
                        },
                        priority : 30
                    },
                    isPresenterGroupReviewedAlready : {
                        check : function(specifier){
                            
                            let student = specifier.student,
                                indexShift = specifier.indexShift,
                                indexPool = specifier.indexPool,
                                ok = student.reviewed.reduce((a,g)=>a.concat(g.group),[]).filter(x=>x=!student.group).includes(shifts.students[specifier.indexShift][specifier.indexPool].presenter.group);

                            console.log('isPresenterGroupReviewedAlready return',ok);
                            return !ok;
                        },
                        priority : 30
                    },
                    isPresenterPersonReviewedAlready : {
                        check : function (specifier){

                             let student = specifier.student,
                                indexShift = specifier.indexShift,
                                indexPool = specifier.indexPool,
                                ok = student.reviewed.reduce((a,g)=>a.concat(g.email),[]).filter(x=>x=!student.email).includes(shifts.students[specifier.indexShift][specifier.indexPool].presenter.email);

                            console.log('isPresenterPersonReviewedAlready return',!ok)
                            return !ok;
                        },
                        priority : 25
                    }
                };
            

            function getConstraints(priority){

                var priorityConstraints = [],
                    priorityOrderedConstraints = Object.keys(constraints).sort((a,b)=>constraints[b].priority-constraints[a].priority);

                for(let i=0,prioritySum = 0;prioritySum < priority && i<priorityOrderedConstraints.length;i++){
                    priorityConstraints.push(priorityOrderedConstraints[i]);
                    prioritySum += constraints[priorityConstraints[i]].priority;
                }

                return priorityConstraints;
            }

            var priority = 315;

            console.log('shifts');
            console.dir(shifts);
            console.log('groups');
            console.dir(groups);
            console.log('participants');
            console.dir(context.state.activity.participants);
            console.log('nbGrading',nbGrading);

            console.log('after initialisation');

            for(var i=0;i<groupsLabel.length;i++){
                while(groups.students[groupsLabel[i]][0].gradingCount < nbGrading){

                    for(var j=0,groupStudents=groups.students[groupsLabel[i]];j<1;j++){

                            for(var indexShift = 0; indexShift < shifts.students.length; indexShift++){
                                for(var indexPool = 0; indexPool < shifts.students[indexShift].length; indexPool++){
                                    let priorityConstraints = getConstraints(priority);

                                    console.log('Testing to insert',groupStudents[j].email,'at',indexShift,indexPool);
                                    console.log('shifts',shifts.students[indexShift][indexPool]);
                               
                                    if(priorityConstraints.every(x=>{console.log('constrainst',x);return constraints[x].check({
                                        student : groupStudents[j],
                                        indexShift : indexShift,
                                        indexPool : indexPool
                                    })==true})){

                                        console.log('INSERTED',indexShift,indexPool)
                                        shifts.students[indexShift][indexPool].graders.push({
                                            reviewedId : groupStudents[j]._id,
                                            email : groupStudents[j].email,
                                            group : groupStudents[j].group,
                                            role : groupStudents[j].role,
                                            session : indexShift+1
                                        });

                                        groupStudents[j].gradingCount += 1;

                                        var participant = getParticipant(groupStudents[j].email);

                                            if(participant){
                                                if(participant.reviewed.length == 0){
                                                    participant.reviewed = new Array(nbShifts);
                                                }
                                       
                                                var presenterParticipant = getParticipant(shifts.students[indexShift][indexPool].presenter.email);
                                                
                                                if(participant.reviewed[indexShift] == undefined){
                                                    participant.reviewed[indexShift] = {
                                                        reviewedId : presenterParticipant._id,
                                                        email : presenterParticipant.email,
                                                        group : presenterParticipant.group,
                                                        role : presenterParticipant.role,
                                                        session : indexShift+1
                                                    };

                                                    
                                                }
                                            }

                                    }
                                }
                            }
                    }
                    
                }
            }
            
            console.log('shifts');
            console.log(shifts);
            console.log('groups');
            console.log(groups)
            console.log('participants')
            console.log(context.state.activity.participants)
            console.log('nbGrading',nbGrading)
        },
        getPlanning(context){

            var vm = this._vm,
                nbrStudents = 0,
                groups = getGroups(),
                nbStudents = nbrStudents,
                nameGroups = Object.keys(groups),
                nbGroups = nameGroups.length,
                shifts = [{
                    pools: new Array(nbGroups).fill().map(x=>({presenter:'',graders:[]}))
                }],
                sizePool = maxSizePool(groups),
                presenters=[],
                indexShift = 0,
                indexPool = 0,
                countHack=0;
            

            function maxSizePool(groups){
                var nameGroups = Object.keys(groups),
                        max=-1;
                for(let group of nameGroups)max = groups[group].length > max ? groups[group].length : max;
                
                return max;
            }
            //this.resetPlanning();
            context.commit('setShifts',[]);
            context.state.activity.participants.map(c=>{c.reviewed=[];return c});

            function isIn(table,key,value){
                return table.find(e=>e[key]==value)
            }
            function getGroups(){
                return context.state.activity.participants.reduce((a,c)=>{
                    a[c.group] = a[c.group] || [];
                    if(c.role=='Student'){
                        a[c.group].push(c);
                        nbrStudents++;
                    }
                    return a;
                },{});
            }
            function setFirstShift(){
                console.log('getGroups')
                console.log(groups)
                while(nameGroups.some(e=>groups[e].length > 0)){
                    for(let group of nameGroups){
                    
                        let participant = groups[group].shift();
                        distributeParticipantsFirstShift(participant)   
                    }
                }
            }
            /*
            ajoute à un reviewer à un participant
            */
            function addReviewed(indexShift,indexPool,participant){
                if(shifts[indexShift].pools[indexPool].presenter!=''){
                    let indexParticipant = context.state.activity.participants.findIndex(e=>e.email==participant.email),
                    presenter = shifts[indexShift].pools[indexPool].presenter;
                    context.state.activity.participants[indexParticipant].reviewed.push({
                        reviewedId : presenter._id,
                        email : presenter.email,
                        group : presenter.group,
                        role : presenter.role,
                        session : indexShift+1
                    });
                }
            }
            /*  
                ajoute à tous les graders présents dans la poule le groupe de review du présentateur, dans le cas où
                le participant est ajouté après les graders
            */
            function addReviewers(indexShift,indexPool){
                if(shifts[indexShift].pools[indexPool].graders.length>0){
                    for(let grader of shifts[indexShift].pools[indexPool].graders){
                        let indexParticipant = context.state.activity.participants.findIndex(e=>e.email==grader.email),
                            presenter = shifts[indexShift].pools[indexPool].presenter;
                    
                        context.state.activity.participants[indexParticipant].reviewed.push({
                            reviewedId : presenter._id,
                            email : presenter.email,
                            group : presenter.group,
                            role : presenter.role,
                            session : indexShift+1
                        });
                    }
                }
            }
            function distributeParticipantsFirstShift(participant){
                if(indexPool>=nbGroups)indexPool = 0;
                if(participant){
                    do{//le participant est ajouté à la poule courante si ...
                            if( shifts[indexShift].pools[indexPool].presenter == ''//pas de présentateur déjà existant  
                                        && !isIn(presenters,'group',participant.group)){ // & pas un qui a déjà présenté
                                shifts[indexShift].pools[indexPool].presenter = participant;
                                presenters.push(participant)
                                addReviewed(indexShift,indexPool,participant);
                                addReviewers(indexShift,indexPool);
                                indexPool++;
                                participant = null;
                            } else if (!shifts[indexShift].pools[indexPool].graders.find(e=>e.group==participant.group)
                                    && shifts[indexShift].pools[indexPool].presenter.group != participant.group 
                                    && shifts[indexShift].pools[indexPool].graders.length < sizePool-1){
                                //si dans les graders de la poule il n'y pas déjà un étudiant du même groupe
                                //si le présentateur a une groupe différent du participant à insérer dans les graders
                                shifts[indexShift].pools[indexPool].graders = shifts[indexShift].pools[indexPool].graders 
                                                                                                                                || [];
                                shifts[indexShift].pools[indexPool].graders.push(participant);
                                addReviewed(indexShift,indexPool,participant);
                                participant = null;
                            } else {
                                indexPool++;
                                if(indexPool>=nbGroups)indexPool = 0;
                                    if( shifts[indexShift].pools[indexPool].presenter == '' 
                                                && !isIn(presenters,'group',participant.group)){
                                        shifts[indexShift].pools[indexPool].presenter = participant;
                                        presenters.push(participant)
                                        addReviewed(indexShift,indexPool,participant);
                                        addReviewers(indexShift,indexPool)
                                        participant = null;
                                    }
                                    else if (!shifts[indexShift].pools[indexPool].graders.find(e=>e.group==participant.group)
                                        && shifts[indexShift].pools[indexPool].presenter.group != participant.group 
                                        && shifts[indexShift].pools[indexPool].graders.length < sizePool-1){
                                        shifts[indexShift].pools[indexPool].graders = shifts[indexShift].pools[indexPool].graders 
                                                                                                                                        || [];
                                        shifts[indexShift].pools[indexPool].graders.push(participant);
                                        
                                        addReviewed(indexShift,indexPool,participant);
                                        participant = null;
                                    }
                            }
                        
                        }while(participant!=null)
                    }
            }
            function getGraders(indexShift){
                return shifts[indexShift].pools.reduce((a,c,i)=>{a=a||[];a.push(c.graders);return a;},[]);
            }
            function setOtherShift(groups){

                while(nameGroups.some(e=>groups[e].length > 0)){
                    for(let group of nameGroups){
                        
                        let participant = groups[group].shift();
                        
                        distributeParticipantsShift(participant)    
                    }
                }
                function distributeParticipantsShift(participant){
                    let count = 0;
                    if(participant){
                        do{ 
                                if(indexPool>=nbGroups)indexPool = 0;
                                if(shifts[indexShift].pools[indexPool].presenter == '' 
                                    && !isIn(presenters,'email',participant.email) 
                                    && !isIn(shifts[indexShift].pools[indexPool].graders,'group',participant.group)
                                    && !shifts[indexShift].pools[indexPool].graders.reduce((a,c)=>a.concat(c.reviewed.reduce((t,x)=>x.group!=c.group?t.concat(x.group):t,[])),[]).includes(participant.group)){
                                    //&& !shifts[indexShift].pools[indexPool].graders.reduce((a,c)=>a.concat(c.reviewed.filter(x=>x.group!=c.group).reduce((t,x)=>t.concat(x.group),[])),[]).includes(participant.group)){
                                    //si les graders on déjà évalué le participant on zappe
                                    shifts[indexShift].pools[indexPool].presenter = participant;
                                    presenters.push(participant);
                                    addReviewed(indexShift,indexPool,participant);
                                    addReviewers(indexShift,indexPool)
                                    indexPool++;
                                    participant = null;
                                } else if(!shifts[indexShift].pools[indexPool].graders.find(e=>e.group==participant.group) 
                                    && shifts[indexShift].pools[indexPool].presenter.group != participant.group 
                                     && !shifts[indexShift].pools[indexPool].graders.some(x=>x.reviewed.reduce((a,c)=>c.group!=x.group?a.concat(c.group):a,[]).includes(participant.reviewed[indexShift-1].group))
                                     //&& !shifts[indexShift].pools[indexPool].graders.some(x=>x.reviewed.filter(c=>c!=x.group).includes(participant.reviewed[indexShift-1]))
                                      && !participant.reviewed.filter(x=>x!=participant.group).includes(shifts[indexShift].pools[indexPool].presenter.group)
                                        && shifts[indexShift].pools[indexPool].graders.length < sizePool-1){
                                        
                                        //si dans les graders il n'y a pas déjà un étudiant avec qui le participant a évalué un groupe au tour précédent
                                        //si le participant n'a pas déjà évalué le même groupe 
                                        //si la poule n'est pas remplie
                                        
                                        shifts[indexShift].pools[indexPool].graders.push(participant);
                                        addReviewed(indexShift,indexPool,participant);
                                        participant = null;
                                } else {
                                    indexPool++;
                                    if(indexPool>=nbGroups)indexPool = 0;
                                    if(shifts[indexShift].pools[indexPool].presenter == '' 
                                        && !isIn(presenters,'email',participant.email) 
                                        && !isIn(shifts[indexShift].pools[indexPool].graders,'group',participant.group)
                                        && !shifts[indexShift].pools[indexPool].graders.reduce((a,c)=>a.concat(c.reviewed.reduce((t,x)=>x.group!=c.group?t.concat(x.group):t,[])),[]).includes(participant.group)){
                                        shifts[indexShift].pools[indexPool].presenter = participant;
                                        presenters.push(participant);
                                        addReviewed(indexShift,indexPool,participant);
                                        addReviewers(indexShift,indexPool)
                                        indexPool++;
                                        participant = null;
                                    } else if(!shifts[indexShift].pools[indexPool].graders.find(e=>e.group==participant.group) 
                                    && shifts[indexShift].pools[indexPool].presenter.group != participant.group 
                                    && !shifts[indexShift].pools[indexPool].graders.some(x=>x.reviewed.reduce((a,c)=>c.group!=x.group?a.concat(c.group):a,[]).includes(participant.reviewed[indexShift-1].group))
                                      && !participant.reviewed.filter(x=>x!=participant.group).includes(shifts[indexShift].pools[indexPool].presenter.group)
                                        && shifts[indexShift].pools[indexPool].graders.length < sizePool-1){
                                        
                                    
                                        shifts[indexShift].pools[indexPool].graders.push(participant);
                                        addReviewed(indexShift,indexPool,participant);
                                        participant = null;
                                    }
                                }
                                //ugly hack, find math reason behind it. figure out in which condition you can/ cannot apply each constraint
                                if(count>nbGroups){
                                    console.log("j'ai mal à mon code, enfin bcp plus mal, genre c'était possible ? ah ouais oaui WAI WE" );
                                    if(shifts[indexShift].pools[indexPool].presenter==''){
                                        shifts[indexShift].pools[indexPool].presenter = participant;
                                        presenters.push(participant);
                                        addReviewed(indexShift,indexPool,participant);
                                        addReviewers(indexShift,indexPool,participant);
                                        participant = null;
                                    } else {
                                        if(shifts[indexShift].pools[indexPool].graders.length < sizePool-1){
                                                shifts[indexShift].pools[indexPool].graders.push(participant);
                                                addReviewed(indexShift,indexPool,participant);
                                                participant = null;
                                        }
                                    }
                                
                                    
                                }               
                                count++;
                        }while(participant!=null)
                    }
                }
            }
        
            setFirstShift();
            indexShift++;
            indexPool = 0;
            
            var sessions = 0;
            do{

                sessions++;

                while(presenters.length < nbStudents ){
                    shifts.push({
                            pools: new Array(nbGroups).fill().map(x=>({presenter:'',graders:[]}))
                    });
                    groups = getGroups();
                    setOtherShift(groups)
                    indexShift++;
                    indexPool = 0;
                }
                presenters = [];
            }while(sessions < context.state.activity.sessions);
            
            
            console.log('shifts over')
            console.log(shifts)

            context.commit('setShifts',shifts);

        }
    },
    getters : {
    },
    mutations : {
        setModifyWill(state,modifyWill){
            state.modifyWill = modifyWill;
        },
        setShifts(state,shifts){
            state.shifts = shifts;
        },
        setIsAdmin(state,isAdmin){
            state.isAdmin = isAdmin;
        },
        resetUserSession(state,userSession) {
            state.userSession = userSession;
        },
        setActivity(state,activity){
            state.activity = activity;
        },
        setWithId(state,withId){
            state.withId = withId;
        }
    }
};

