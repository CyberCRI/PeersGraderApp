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
				  :rows="rows">
				</vue-good-table>
			</div>
		</div>
	</div>
</template>

<script>
	import ActivityHeader from '@/components/ActivityHeader'
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
									]
			};
		},
		computed : {
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
			
		}
	};
</script>

<style

></style>