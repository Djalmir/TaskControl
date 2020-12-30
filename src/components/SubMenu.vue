<transition name="grow">
					<div class="subMenu" v-if="home.showingSubMenu == list.id">
						<button
							:class="{ deleteBtn: !home.renaming, cancelBtn: home.renaming }"
							@click="delOrCancel(list)"
						>
							<img :src="require('../assets/trash.svg')" v-if="!home.renaming" />
							<img :src="require('../assets/cancel.svg')" v-else />
						</button>
						<button
							:class="{ renameBtn: !home.renaming, saveBtn: home.renaming }"
							@click="renameOrSave(list)"
						>
							<img :src="require('../assets/edit.svg')" v-if="!home.renaming" />
							<img :src="require('../assets/done.svg')" v-else />
						</button>
					</div>
				</transition>