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
       hasReview : false
    },
    actions : {
        setHasReview(context,hasReview){
            context.commit('setHasReview',hasReview);
        },
        lookForReviewFromParticipant(context,review){
            //might have to try with weird  caracters in mail 
            return axios.get('/api/activity/'+review.activityUrlId+'/review/grader/'+review.grader.email).then(response=>{
                if(response.data.hasReview){
                    console.log('getReviewFromParticipant')
                    context.state.review.grader = response.data.grader;
                    context.commit('setReview',response.data.review);
                    context.commit('setHasReview',true);
                    //return Promise.resolve({hasReview:true});

                } else {
                    //return Promise.resolve({hasReview:false});
                    context.commit('setHasReview',false);
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
                    return axios.post('/api/activity/'+review.activityUrlId+'/review',{review:review}).then(response=>{
                        if(response.data.success){
                            this._vm.$notify({
                                group : 'notifications',
                                title : 'Review saved',
                                text :  'Review is saved nice and smooth',
                                type :  'success'
                            });

                            router.push({path:'/activity/'+response.data.review.activityUrlId+'/review/'+response.data.review.urlId});
                            context.commit('setReview',response.data.review);
                            context.dispatch('setHasPushedSave',false);
                        }
                    });
                } else {
                    axios.put('/api/activity/'+review.activityUrlId+'/review/'+review.urlId,{review:review}).then(response=>{
                        if(response.data.success){
                            this._vm.$notify({
                                group: 'notifications',
                                title:'Review updated',
                                text: 'This review have been updated with success.',
                                type : 'success'
                            });

                            context.dispatch('setHasPushedSave',false);
                            context.commit('setReview',response.data.review);
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