<template>
	<div id="action-bar">
		<div class ="action-activity level">
			
				<a class="button is-small" @click="manageActivity">
			    <span class="icon is-medium">
			      <i class="fas fa-edit"></i>
			    </span>
			    <span>Modify</span>
			  </a>
			
			<!-- <div class="level-item">
				<a class="button is-small">
			    <span class="icon is-medium">
			      <i class="fas fa-book"></i>
			    </span>
			    <span>Rubric</span>
			  </a>
			</div> -->
			
				<a class="button is-small" @click="openInvite">
			    <span class="icon is-medium">
			      <i class="fas fa-share-square"></i>
			    </span>
			    <span>Send invitations</span>
			  </a>
			
		</div>
		<div v-if="showInvite" id="manage-message">
			<article class="message is-danger">
			  <div class="message-header">
			    <p>Invite participants via</p>
			    <button @click="closeInvite" class="delete" aria-label="delete"></button>
			  </div>
			  <div class="message-body">
				  <div class="tabs">
					  <ul>
					    <li  :class="{'is-active' : tab == 'link' , '' : tab=='email'}" @click="tabswitch" ><a class="button" data-tab="link">Link</a></li>
					    <li :class="{'is-active' : tab == 'email' , '' : tab=='link'}" @click="tabswitch"><a class="button" data-tab="email">Email</a></li>
					  </ul>
					</div>
					<div id="tab-content">
						<div :class="{'is-active' : tab == 'link' , '' : tab=='email'}" data-content="link">
							<div class="link-div"><p>Why are we sharing by link ? I don't know. Tell us !</p></div>
							<div class="field has-addons">
							  <div class="input-link control">
							    <input class="input" type="text" id="link-activity" :value="activityLink" disabled="disabled">
							  </div>
							  <div class="control">
							    <a @click="copyToClipboard(activityLink)" class="button is-ligth">
							      Copy
							    </a>
							  </div>
							</div>
						</div>
						<div :class="{'is-active' : tab == 'email','': tab =='link'}" data-content="email">
							<div id="tab-invite-content">
								<input-tag class="input invite pg-mailtag" placeholder="Emails" :tags.sync="invitationRecipients" validation="email"></input-tag>
								<textarea id="textarea" v-model="invitationMessage" class="textarea invite" placeholder="Message">
								</textarea>
								<a v-if="invitationRecipients.length>0" class="button invite">
							    <span class="icon">
							      <i class="fas fa-envelope"></i>
							    </span>
							    <span @click="invite">Send</span>
							  </a>
							  <a v-else disabled="disabled" class="button invite">
							    <span class="icon">
							      <i class="fas fa-envelope"></i>
							    </span>
							    <span>Send</span>
							  </a>
							</div>
						</div>
					</div>
			  </div>
			</article>
		</div>
		<div  v-if="manage" class="pg-activity">
			<pwd-activity></pwd-activity>
		</div>
		<div class="pg-activity">
			<div class="pg-activity-content">
				<div class="pg-level">
					<span class="pg-cell icon is-medium">
			      <i class="fas fa-pencil-alt"></i>
			    </span>
			    <h1 class="title pg-cell resume">{{activity.title}}</h1>
			  </div>
				<div class="pg-level">
					<span class="pg-cell icon is-medium">
			      <i class="fas fa-chalkboard-teacher"></i>
			    </span>
					<p class="pg-cell resume">{{activity.guidelines}}</p>
				</div>
				<div class="pg-level">
					<span class="pg-cell icon is-medium">
			      <i class="fas fa-stopwatch"></i>
			    </span>
					<p class="pg-cell resume-number">{{activity.sessions}}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import ActivityPassword from '@/components/ActivityPassword'
	import InputTag from 'vue-input-tag'

	export default {
		name : 'ActivityRead',
		data(){
			return {
				showInvite : true,
				manage : false,
				tab : 'link', 
				invitationRecipients : [],
				invitationMessage: ''
			};
		},	
		components:{
			'pwd-activity' : ActivityPassword,
			'input-tag' : InputTag
		},
		computed:{
			...mapState('activity',{
				activity:'activity'
			}),
			activityLink(){
				return 'https://peergraders.herokuapp.com/#/activity/'+this.activity.urlId;
			}
		},
		methods : {
			invite(){
				//if(!this.isRubricEmpty())
					this.sendInvitations({
						activity : this.activity,
						destinators : this.invitationRecipients,
						message : this.invitationMessage
					}).then(()=>{
						console.log('wtf')
						this.$notify({
							group:'notifications',
							title:'Invitations sent !',
							text : 'Invitations have been sent. In case you did not get it.',
							type : 'success'
						});

						this.showInvite = false;

					});
				//else console.log('efe')
			},
			openInvite(){
				this.showInvite = true;
			},
			copyToClipboard(str){
			  const el = document.createElement('textarea');  // Create a <textarea> element
			  el.value = str;                                 // Set its value to the string that you want copied
			  el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
			  el.style.position = 'absolute';                 
			  el.style.left = '-9999px';                      // Move outside the screen to make it invisible
			  document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
			  const selected =            
			    document.getSelection().rangeCount > 0        // Check if there is any content selected previously
			      ? document.getSelection().getRangeAt(0)     // Store selection if found
			      : false;                                    // Mark as false to know no selection existed before
			  el.select();                                    // Select the <textarea> content
			  document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
			  document.body.removeChild(el);                  // Remove the <textarea> element
			  if (selected) {                                 // If a selection existed before copying
			    document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
			    document.getSelection().addRange(selected);   // Restore the original selection
			  }
			},
			closeInvite(){
				this.showInvite = false;
			},
			tabswitch(e){
				var tab = e.target.getAttribute('data-tab');

				this.tab = tab;
			},
			noRedoNoFuckNo(){
				var container = document.getElementById('mainContainer'),
					actionBar = document.getElementById('action-bar'),
					containerPadding = parseInt(window.getComputedStyle(container, null).getPropertyValue('padding')),
					containerWidth = parseInt(window.getComputedStyle(container,null).getPropertyValue('width'));

				

				actionBar.style.position = 'relative';
				actionBar.style.width = `calc(100% + ${2*containerPadding}px)`
				actionBar.style.left = `${-containerPadding}px`;
				actionBar.style.top = `${-containerPadding}px`;
			},
			displayParticipant(participant){
				var a = ['name','group','role','token','reviewed','email','_id'],
						keys = Object.keys(participant).filter(c=>!a.includes(c)),
						info = [];

				for(var k of keys)
					info.push(participant[k]);

				return `${participant.group} ${participant.role} ${participant.name} ${info.join(' ')}`
			},
			manageActivity(){
				this.manage = true;
			},
			...mapActions('activity',{
				lookForActivity: 'lookForActivity',
				sendInvitations: 'sendInvitations',
				isRubricEmpty : 'isRubricEmpty'
			})
		},
		update(){
			this.noRedoNoFuckNo();
		},
		async mounted(){
			console.log('mounted')
			await this.lookForActivity(this.$router.history.current.params.id);
			this.invitationRecipients = this.activity.participants.reduce((a,c)=>{a.push(c.email);return a;},[]);
			this.noRedoNoFuckNo();	
		},
	};
</script>

<style scoped>
	.pg-mailtag{
		height: 8em;
		overflow-y: scroll;
	}
	#tab-invite-content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.invite{
		margin: 0.2em 0;
	}

	.input-link{
		width: 95%;
	}

	#link-activity{
		cursor: pointer;
	}

	.link-div{
		text-align: center;
		margin-bottom: 0.85em;
	}

	#manage-message{
		width: 95%;
		margin: 0 auto 0.5em auto;
	}

	.tabs ul{
		justify-content: center;
	}

	#tab-content > div {
	  display: none;
	}

	#tab-content > div.is-active {
	  display: block;
	}
	.pg-level{
		display: table;
	}

	.pg-cell{
		display: table-cell;
		vertical-align: middle;
	}

	.resume{
		text-align: justify;
	}

	.resume-number{
		text-align: center;
	}

	.pg-activity{
		border: solid 1px black;
		border-radius : 10px;
		padding: 0.5em;
		background: white;
		width: 95%;
		margin: 0.5em auto;
	}

	.pg-activity-content{
		margin : 0 auto;
		width: 80%;
	}

	.action-activity{
		display: flex!important;
		background:#434e57;
		justify-content: center;
	}

	.resume{
		margin-left: 15px;
	}
</style>