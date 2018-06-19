import axios from 'axios';
import router from '../../router'

export default {
    namespaced : true,
    state : {
        activityId: 0,
        activityUrlId : 0,
        participants : []
    },
    actions : {
        getParticipants(context,activityId){
            axios.get('http://localhost:5001/activity/'+activityId+'/participants').then(function(response){
                if(response.data.success){
                    context.commit('setParticipants',response.data.participants);
                }
            });
        },
        setActivityId(context,activityId){
            context.commit('setActivityId',activityId);
        },
        setActivityUrlId(context,activityUrlId){
            context.commit('setActivityUrlId',activityUrlId);
        },
        setParticipants(context,participants){
            context.commit('setParticipants',participants);
        }
    },
    getters : {
    },
    mutations : {
        setActivityId(state,activityId){
            state.activityId = activityId;
        },
        setActivityUrlId(state,activityUrlId){
            state.activityUrlId = activityUrlId;
        },
        setParticipants(state,participants){
            state.participants = participants;
        }
    }
};