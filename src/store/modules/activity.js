import axios from 'axios';
import router from '../../router'

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
                //cohort : 0,
                //ine : '',
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
            return axios.post('/api/activity/sendInvitations',{
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
        getAuthActivity(context,specifier){//certainement refacto les bails ici
            return axios.get('/api/activity/'+specifier.urlId).then((response)=>{
                if(response.data.success){
                    console.log('auth activity')
                    if(specifier.pwd == response.data.activity.teacherPwd){
                        context.commit('setActivity',response.data.activity);
                        console.log(response.data.activity)
                        context.commit('setIsAdmin',true);
                        return new Promise((resolve,reject)=>resolve({granted:true}));
                    }
                }
            }).catch(error=>{
                return new Promise((resolve,reject)=>resolve({granted:false}));
                console.log('error',error);
            });
        },
        lookForActivity(context,key){
            return axios.get('/api/activity/'+key).then((response)=>{
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
            
            axios.delete('/api/activity/'+activityId).then(response=>{
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
        setActivity(context,activity){
            if(activity.urlId)
                return axios.put('/api/activity/'+activity.urlId,{activity:context.state.activity}).then((response)=>{
                    console.log('there');   
                    console.log(response)
                    if(response.data.success){
                        this._vm.$notify({
                            group: 'notifications',
                            title:'Activity updated',
                            text: 'This activity have been updated with success.',
                            type : 'success'
                        });
                        console.log('there there')
                        context.state.activity = response.data.activity;
                        context.state.userSession = true;
                    }



                });
            else return axios.post('/api/activity',{activity:context.state.activity}).then((response)=>{
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
                        email : presenter.email,
                        group : presenter.group,
                        role : presenter.role
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
                            email : presenter.email,
                            group : presenter.group,
                            role : presenter.role
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
                                    /*if(countHack>nbGroups){
                                        console.log("j'ai mal à mon code, enfin bcp plus mal, genre c'était possible ? ah ouais oaui WAI WE" );
                                        if(shifts[indexShift].pools[indexPool].presenter=='' ){
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
                                        countHack = 0;
                                    } else {
                                        groups[participant.group].push(participant);
                                        participant = null;
                                        countHack++;    
                                    }*/
                                    
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