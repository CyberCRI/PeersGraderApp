
export default {
	namespaced : true,
	state : {
		summaryRows : []
	},
	actions : {
		setSummaryRows(context,summaryRows){
			context.commit('setSummaryRows',summaryRows);
		},
		getSummaryRows(context,specifier){

			return this._vm.$axios.get('/api/activity/'+specifier.activityUrlId+'/admin',{params : {profs:specifier.coefs.profs,peers:specifier.coefs.peers,observers:specifier.coefs.observers}}).then((response)=>{
        if(response.data.rows){
        		console.log('here')
        	console.log(response.data.rows);

        	context.commit('setSummaryRows',response.data.rows);
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