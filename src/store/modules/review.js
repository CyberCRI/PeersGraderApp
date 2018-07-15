import axios from 'axios';
import router from '../../router'

export default {
    namespaced : true,
    state : {
       review : {
         grader : '',
         activityId : '',
         reviewed : '',
         skills: []
         /*skills :[{
            rubricId : 0,
            name:'',
            totalPossiblePoints: 0,
            descriptors:[{
                descriptorId : 0,
                possiblePoints: 0,
                acquired : false
            }]
        }]*/
       },
       hasPushedSave : false,
       hasReview : false
    },
    actions : {
        setHasPushedSave(context,hasPushedSave){
            context.commit('setHasPushedSave',hasPushedSave);
        },
        setHasReview(context,hasReview){
            context.commit('setHasReview',hasReview);
        },
        setReview(context,review){
            context.commit('setReview',review);
            
            if(context.state.hasPushedSave){
                console.log('review to send')
            console.log(review)
                if(!review._id){
                    return axios.post('http://localhost:5001/activity/'+review.activityUrlId+'/review',{review:review}).then(response=>{
                        if(response.data.success){
                            this._vm.$notify({
                                group : 'notifications',
                                title : 'Review saved',
                                text :  'Review is saved nice and smooth',
                                type :  'success'
                            });

                            router.push({path:'/activity/'+response.data.review.activityUrlId+'/review/'+response.data.review.urlId});
                            context.commit('setReview',response.data.review);
                            console.log('i m done')
                            context.commit('setHasPushedSave',false);
                        }
                    });
                } else {
                    axios.put('http://localhost:5001/activity/'+review.activityUrlId+'/review/'+review.urlId,{review:review}).then(response=>{
                        console.log('there like here');   
                        console.log(response)
                        if(response.data.success){
                            this._vm.$notify({
                                group: 'notifications',
                                title:'Review updated',
                                text: 'This review have been updated with success.',
                                type : 'success'
                            });
                            console.log('i m done there')
                            context.commit('setHasPushedSave',false);
                        }
                    });
                }
                console.log('i m done here')
            }
            console.log('i m done There')
        },
        lookForReviewFromParticipant(context,review){
            //might have to try with weird  caracters in mail 
            return axios.get('/activity/'+review.activityUrlId+'/review/grader/'+review.grader.email).then(response=>{
                if(response.data.hasReview){
                    console.log('getReviewFromParticipant')
                    context.state.review.grader = response.data.grader;
                    context.commit('setReview',context.state.review);
                    context.commit('setHasReview',true);
                    //return Promise.resolve({hasReview:true});

                } else {
                    //return Promise.resolve({hasReview:false});
                    context.commit('setHasReview',false);
                }
            });
        },
        lookForReview(context,review){

            return axios.get('/activity/'+review.activityUrlId+'/review/'+review.urlId).then((response)=>{
                if(response.data.success){
                   console.log('getReview');
                   context.commit('setReview',response.data.review);
                }
            }).catch(error=>{
                console.log('error',error);
            });
        },
        resetReview(context,review){
            console.log('reset review')
            context.commit('setReview',{
                grader : '',
                activityId : '',
                reviewed : '',
                skills: []
               /* skills :[{
                    rubricId : 0,
                    name:'',
                    totalPossiblePoints: 0,
                    descriptors:[{
                        descriptorId : 0,
                        possiblePoints: 0,
                        acquired : false
                    }]
                }]*/
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