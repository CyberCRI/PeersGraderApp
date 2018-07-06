import axios from 'axios';
import router from '../../router'

export default {
    namespaced : true,
    state : {
       review : {
         grader : '',
         activityId : '',
         reviewed : '',
         skills :[{
            rubricId : 0,
            name:'',
            totalPossiblePoints: 0,
            descriptors:[{
                descriptorId : 0,
                possiblePoints: 0,
                acquired : false
            }]
        }]
       },
       hasPushedSave : false
    },
    actions : {
        setHasPushedSave(context,hasPushedSave){
            context.commit('setHasPushedSave',hasPushedSave);
        },
        setReview(context,review){
            context.commit('setReview',review);
            console.log('review to send')
            console.log(review)
            if(context.state.hasPushedSave){
                if(!review._id){
                    axios.post('http://localhost:5001/activity/'+review.activityUrlId+'/review',{review:review}).then(response=>{
                        if(response.data.success){
                            this._vm.$notify({
                                group : 'notifications',
                                title : 'Review saved',
                                text :  'Review is saved nice and smooth',
                                type :  'success'
                            });

                            router.push({path:'/activity/'+response.data.review.activityUrlId+'/review/'+response.data.review.urlId});
                            context.commit('setReview',response.data.review);

                            context.commit('setHasPushedSave',false);
                        }
                    });
                } else {
                    axios.put('http://localhost:5001/activity'+review.activityUrlId+'/review/'+review.urlId,{review:review}).then(response=>{
                        console.log('there like here');   
                        console.log(response)
                        if(response.data.success){
                            this._vm.$notify({
                                group: 'notifications',
                                title:'Review updated',
                                text: 'This review have been updated with success.',
                                type : 'success'
                            });

                            context.commit('setHasPushedSave',false);
                        }
                    });
                }
            }

        },
        getReview(context,review){
            axios.get('http://localhost:5001/activity/'+review.activityUrlId+'/'+review.urlId).then((response)=>{
                if(response.data.success){
                   
                }
            }).catch(error=>{
                console.log('error',error);
            });
        },
        resetReview(context,review){

            context.commit('setReview',{
                grader : '',
                activityId : '',
                reviewed : '',
                skills :[{
                    rubricId : 0,
                    name:'',
                    totalPossiblePoints: 0,
                    descriptors:[{
                        descriptorId : 0,
                        possiblePoints: 0,
                        acquired : false
                    }]
                }]
            });
        }
    },
    getters : {
    },
    mutations : {
        setHasPushedSave(state,hasPushedSave){
            state.hasPushedSave = hasPushedSave;
        },
        setReview(state,review){
            state.review = review;
        }
    }
};