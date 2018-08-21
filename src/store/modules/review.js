import axios from 'axios';
import router from '../../router'
//in the end just delete the schema, its actually useless and makes us miserable & also look miserable
export default {
    namespaced : true,
    state : {
       review : {
            grader : {
                email : '',
                role  : '',
                group : '',
                reviewed : [{
                    urlId : '',
                    name : '',
                    role : '',
                    graded : false,
                    group : '',
                    skills : [{
                        name : '',
                        totalPossiblePoints : 0,
                        skillDescriptors : [{
                            content : '',
                            possiblePoints : 0,
                            percentageAcquired : 0,
                            acquired : false
                        }]
                    }]
                }], 
            },
            activityUrlId : '',
            urlId : '',
            reviewed : ''
       },
       hasPushedSave : false,
       hasReview : false,
       showNotificationSave : true,
       isReviewStarted : false,
    },
    actions : {
        setIsReviewStarted(context,isReviewStarted){
            context.commit('setIsReviewStarted',isReviewStarted);
        },
        setShowNotificationSave(context,showNotificationSave){
            context.commit('setShowNotificationSave',showNotificationSave);
        },
        setHasReview(context,hasReview){
            context.commit('setHasReview',hasReview);
        },
        lookForReviewFromParticipant(context,review){
            //might have to try with weird  caracters in mail 
            return axios.get('/api/activity/'+review.activityUrlId+'/review/grader/'+review.grader.email).then(response=>{
                if(response.data.hasReview){
                    console.log('getReviewFromParticipant')
                    context.commit('setReview',response.data.review);
                    context.commit('setHasReview',true);
                     router.push({path:'/activity/'+response.data.review.activityUrlId+'/review/'+response.data.review.urlId});
                    //return new Promise((resolve,reject)=>resolve({hasReview:true}));
                    console.log('there ASS')

                } else {
                    //return Promise.resolve({hasReview:false});
                    console.log('here MOFO')
                    context.commit('setHasReview',false);
                    //return new Promise((resolve,reject)=>resolve({hasReview:false}));
                }
            });
        },
        setHasPushedSave(context,hasPushedSave){
            context.commit('setHasPushedSave',hasPushedSave);
        },
        lookForReview(context,review){

            return axios.get('/api/activity/'+review.activityUrlId+'/review/'+review.urlId).then((response)=>{
                if(response.data.success){
                   console.log('getReview');
                   console.log(response.data.review)
                   context.dispatch('setReview',response.data.review);
                }
            }).catch(error=>{
                console.log('error',error);
            });
        },
        setReview(context,review){
            context.commit('setReview',review);

            if(context.state.hasPushedSave){
                if(!review.urlId){
                    console.log(review.activityUrlId);
                    return axios.post('/api/activity/'+review.activityUrlId+'/review',{review:review}).then(response=>{
                        if(response.data.success){

                            context.commit('setReview',response.data.review);
                            context.dispatch('setHasPushedSave',false);
                            
                            if(context.state.showNotificationSave){
                                this._vm.$notify({
                                    group : 'notifications',
                                    title : 'Review saved',
                                    text :  'Review is saved nice and smooth',
                                    type :  'success'
                                });
                                context.dispatch('setShowNotificationSave',true);
                            }

                            
                            router.push({path:'/activity/'+response.data.review.activityUrlId+'/review/'+response.data.review.urlId});
                            
                        }
                    });
                } else {
                    axios.put('/api/activity/'+review.activityUrlId+'/review/'+review.urlId,{review:review}).then(response=>{
                        
                        context.dispatch('setHasPushedSave',false);
                        context.commit('setReview',response.data.review);

                        if(response.data.success){
                            this._vm.$notify({
                                group: 'notifications',
                                title:'Review updated',
                                text: 'This review have been updated with success.',
                                type : 'success'
                            });

                           
                        }
                    });
                }
            }
       },
       resetReview(context,review){
            context.dispatch('setReview',{
                grader : {
                    email : '',
                    role  : '',
                    group : '',
                    reviewed : [{
                        urlId : '',
                        name : '',
                        role : '',
                        graded : false,
                        group : '',
                        skills : [{
                            name : '',
                            totalPossiblePoints : 0,
                            skillDescriptors : [{
                                content : '',
                                possiblePoints : 0,
                                percentageAcquired : 0,
                                acquired : false
                            }]
                        }]
                    }], 
                },
                activityUrlId : '',
                urlId : '',
                reviewed : ''
           });
       }
    },
    getters : {
    },
    mutations : {
        setIsReviewStarted(state,isReviewStarted){
            state.isReviewStarted = isReviewStarted;
        },
        setShowNotificationSave(state,showNotificationSave){
            state.showNotificationSave = showNotificationSave;
        },
        setHasReview(state,hasReview){
            state.hasReview = hasReview;
        },
        setHasPushedSave(state,hasPushedSave){
            state.hasPushedSave = hasPushedSave;
        },
       setReview(state,review){
            state.review = review;
       }
    }
};