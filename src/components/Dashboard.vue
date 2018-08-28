<template>
	<div class="pg-container">
		<activity-header/>
		<div class="columns is-multiline">
			<div class="column is-12">
				<h1>Settings</h1>
			</div>
			<div class="column is-12">
				<table class="table">
					<thead class="thead">
						<tr><th></th><th>By profs</th><th>By peers</th><th>"as prof"</th><th>Final</th></tr>
					</thead>
					<tbody>
						<tr>
							<td>Weights</td>
							<td><input min="0" :max="isOver100 ? computedProfCoef :100" v-model="profCoef" type="number" class="control"></td>
							<td><input min="0" :max="isOver100 ? computedPeerCoef :100" v-model="peerCoef" type="number" class="control"></td>
							<td><input min="0" :max="isOver100 ? computedObserverCoef :100" v-model="observerCoef" type="number" class="control"></td>
							<td>{{Number(profCoef)+Number(peerCoef)+Number(observerCoef)}}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="column is-12">
				<vue-good-table
					class="table"
				  :columns="columns"
				  :rows="summaryRows">
				</vue-good-table>
			</div>
		</div>
	</div>
</template>

<script>
	import ActivityHeader from '@/components/ActivityHeader';
	import {mapState,mapActions} from 'vuex'
	import { VueGoodTable } from 'vue-good-table';

	export default {
		name : 'Dashboard',
		components : {
			'activity-header' : ActivityHeader,
			'vue-good-table': VueGoodTable
		},
		data(){
			return {
				profCoef : 50,
				peerCoef : 25,
				observerCoef : 25,
				columns : [
										{
											label : 'Name',
											field : 'name',
											filterable : true
										},
										{
											label : 'by profs',
											field : 'teachersGrade',
											filterable : true
										},
										{
											label : 'by peers',
											field : 'peersGrade',
											filterable : true
										},
										{
											label : 'as profs',
											field : 'observersGrade',
											filterable : true
										},
										{
											label : 'Final',
											field : 'finalGrade',
											filterable : true
										}
									],
								rows : []
			};
		},
		computed : {
			...mapState('activity',{
				activity:'activity'
			}),
			...mapState('dashboard',{
				summaryRows : 'summaryRows'
			}),
			computedProfCoef (){
				return Number(this.profCoef);
			}, 
			computedPeerCoef (){
				return Number(this.peerCoef);
			}, 
			computedObserverCoef (){
				return Number(this.observerCoef);
			},
			isOver100(){
				return (this.computedProfCoef + this.computedPeerCoef + this.computedObserverCoef) >= 100;
			}
		},
		methods : {
			...mapActions('dashboard',{
				getSummaryRows: 'getSummaryRows',
				setSummaryRows : 'setSummaryRows'
			}),
			updateSummaryRows(){
				for(var i= 0;i<this.summaryRows.length;i++){
					this.summaryRows[i].finalGrade = (this.summaryRows[i].teachersGrade * this.profCoef + this.summaryRows[i].peersGrade* this.peerCoef + this.summaryRows[i].observersGrade *this.observerCoef)/100; 
				}
			}
		},
		watch : {
			profCoef : function(o,n){
				this.updateSummaryRows();
			},
			peerCoef : function(o,n){
				this.updateSummaryRows();
			},
			observerCoef : function(o,n){
				this.updateSummaryRows();
			}
		},
		beforeRouteEnter(to,from,next){
			console.log('here beforeRouteEnter')
			next(vm=>{
				vm.getSummaryRows({
					activityUrlId : to.params.id,
					coefs : {
						profs : vm.profCoef,
						peers : vm.peerCoef,
						observers : vm.observerCoef
					}
				})
			});
		}
	};
</script>

<style

></style>