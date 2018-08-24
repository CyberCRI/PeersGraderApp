import axios from 'axios';

export default {
	namespace : true,
	state : {
		summaryRows : []
	},
	actions : {
		setSummaryRows(context,summaryRows){
			context.commit('setSummaryRows',summaryRows);
		},
		getSummaryRows(context,specifier){

			return axios.get('/api/activity/'+specifier.activityUrlId+'/admin').then((response)=>{
        if(response.data.success){
            /*console.log('auth activity')
            if(specifier.pwd == response.data.activity.teacherPwd){
                context.commit('setActivity',response.data.activity);
                console.log(response.data.activity)
                context.commit('setIsAdmin',true);
                return new Promise((resolve,reject)=>resolve({granted:true}));
            }*/
        }
	    }).catch(error=>{
	       /* return new Promise((resolve,reject)=>resolve({granted:false}));
	        console.log('error',error);*/
	    });
		}
	},
	getters : {},
	mutations : {
		setSummaryRows(state,summaryRows){
			state.summaryRows = summaryRows;
		}
	}
}