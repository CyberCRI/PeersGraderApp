import axios from 'axios';
import router from '../../router'

export default {
    namespaced : true,
    state : {
        activity : {
            presentations:0,
            sessions : 0,
            title : '',
            participants:[{
                firstname : '',
                name : '',
                email : '',
                role : ''
            }],
            guidelines : ''
        },
        userSession : false,
        showPassword : true,
        canReadOnly : false,
        withId : false
    },
    actions : {
        setUserSession(context,userSession){
            context.commit('setUserSession',userSession);
        },
        setShowPassword(context,showPassword){
            context.commit('setShowPassword',showPassword)
        },
        setCanReadOnly(context,canReadOnly){
            context.commit('setCanReadOnly',canReadOnly)
        },
        setWithId(context,withId){
            context.commit('setWithId',withId)
        },
        getAuthActivity(context,pwd){//certainement refacto les bails ici
            axios.get('http://localhost:5001/activity/'+pwd).then((response)=>{
                if(response.data.success){
                    console.log('auth activity')
                    console.log(response.data.activity)
                    context.state.activity = response.data.activity;
                    if(pwd.length==20) context.dispatch('setCanReadOnly',false);
                    else if (pwd.length == 10) context.dispatch('setCanReadOnly',true);

                    context.dispatch('setShowPassword',false);
                    context.dispatch('setUserSession',true);
                }
            });
        },
        lookForActivity(context,key){
            axios.get('http://localhost:5001/activity/'+key).then((response)=>{
                if(response.data.success){
                    console.log('find smthg')
                    console.log(response.data.activity);
                    context.state.userSession = false;
                    router.push({path:'/activity/'+response.data.activity.urlId});
                }
            });
        },
        deleteActivity(context,activity){
            console.log('lol')
            console.log(activity)
            
        },
        resetActivitySession(context,activity){

            console.log('resetting');

            context.commit('saveActivity',{
                presentations:0,
                sessions : 0,
                title : '',
                participants:[{
                    firstname : '',
                    name : '',
                    email : '',
                    role : ''
                }],
                guidelines : ''
            });

            context.commit('resetUserSession',false);
        },
        saveActivity(context,activity){
            if(activity.urlId)
                axios.put('http://localhost:5001/activity/'+activity.urlId,{activity:context.state.activity}).then((response)=>{
                    console.log('there');   
                    console.log(response)
                    if(response.data.success){
                        this._vm.$notify({
                            group: 'activity',
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
                            group: 'activity',
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
        resetUserSession(state,userSession) {
            state.userSession = userSession;
        },
        saveActivity(state,activity){
            state.activity = activity;
        },
        setUserSession(state,userSession){
            state.userSession = userSession;
        },
        setShowPassword(state,showPassword){
            state.showPassword = showPassword;
        },
        setCanReadOnly(state,canReadOnly){
            state.canReadOnly = canReadOnly;
        },
        setWithId(state,withId){
            state.withId = withId;
        }
    }
};