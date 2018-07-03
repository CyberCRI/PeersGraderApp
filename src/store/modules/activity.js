import axios from 'axios';
import router from '../../router'

export default {
    namespaced : true,
    state : {
        activity : {
            /*presentations:0,*/
            sessions : 0,
            title : '',
            participants:[{
                email : '',
                //name : '',
                group: '',
                cohort : 0,
                //ine : '',
                role : '',
                reviewed:[]
            }],
            rubrics:[{
                name:'',
                points:0,
                descriptors:[{
                    content:'',
                    level:-1,
                    points:0
                }]
            }],
            guidelines : ''
        },
        isAdmin : false,
        withId : false
    },
    actions : {
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
            axios.get('http://localhost:5001/activity/'+specifier.urlId).then((response)=>{
                if(response.data.success){
                    console.log('auth activity')
                    if(specifier.pwd.length==20 && specifier.pwd == response.data.activity.teacherPwd){
                        context.commit('setActivity',response.data.activity);
                        console.log(response.data.activity)
                        context.commit('setIsAdmin',true);
                        //router.push({path:'/activity/'+response.data.activity.urlId});
                    }    
                }
            }).catch(error=>{
                console.log('error',error);
            });
        },
        lookForActivity(context,key){
            return axios.get('http://localhost:5001/activity/'+key).then((response)=>{
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
            
            axios.delete('http://localhost:5001/activity/'+activityId).then(response=>{
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
                participants:[{
                    email : '',
                    //name : '',
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
                        level:-1,
                        points:0
                    }]
                }],
                guidelines : ''
            });

            context.commit('setIsAdmin',false);

            context.commit('setWithId',false);
        },
        setActivity(context,activity){
            if(activity.urlId)
                axios.put('http://localhost:5001/activity/'+activity.urlId,{activity:context.state.activity}).then((response)=>{
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
            else axios.post('http://localhost:5001/activity',{activity:context.state.activity}).then((response)=>{
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
                        router.push({path:'/activity/'+response.data.activity.urlId});
                        console.log('?')
                    }
                });
        }
    },
    getters : {
    },
    mutations : {
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