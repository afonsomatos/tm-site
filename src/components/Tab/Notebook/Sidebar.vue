<template>
	<div>
		<Section>
			<Field name="Notebook">
				<Input title="Display name" v-model="notebook.name" />
			</Field>
		</Section>
		<Section>
			<Field name="machines" />
			<div class="model-list">
				<select @change="selectModel">
					<option
						v-for="(model, i) in models"
						:key="i"
						:selected="model == selectedModel">
						{{ displayName(model) }}
					</option>
				</select>
				<IconBtn title="Add a new machine" class="icon" icon="add" @click="add"/>
			</div>
			<Field name="name">
				<Input v-model="selectedModel.name" />
			</Field>
			<Field name="action">
				<div class="actions">
					<IconBtn class="icon" title="Duplicate selected machine" icon="copy" @click="copy" />
					<IconBtn class="icon" title="Delete selected machine (irreversible)" icon="delete" @click="remove" />
				</div>
			</Field>
		</Section>	
		<Section>
			<Field name="load">
				<input ref="input" style="display: none;" type="file" @change="load" />
				<IconBtn title="Upload a JSON file" class="icon" icon="upload" @click="loadClick" />
			</Field>
			<Field name="save">
				<a title="Download as a JSON file" :href="downloadHref" :download="downloadFile"> 
					<IconBtn ref="save" class="icon" icon="download"/>
				</a>
			</Field>
		</Section>
		<Section>
			<Field name="load emulator machines">
				<input ref="inputEm" style="display: none;" type="file" @change="loadEm" multiple />
				<IconBtn title="Upload emulator machines" class="icon" icon="upload" @click="loadEmClick" />
			</Field>
		</Section>
		<Section>
			<Field name="delete">
				<IconBtn title="Delete notebook" class="icon" icon="delete" @click="deleteNotebook" />
			</Field>
		</Section>
	</div>
</template>

<script lang="ts">

import _ from "lodash"

import Vue from "vue"
import Section from "@/components/SideBar/Section.vue"
import Field from "@/components/SideBar/Field.vue"
import Input from "@/components/Input.vue"
import IconBtn from "@/components/IconBtn.vue"

import global from "@/store/global"
import exampleModel from "@/shared/model/example"
import exampleNotebook from "@/shared/notebook/example"
import Notebook from "@/shared/notebook"

import { parseFromEmulator } from "@/shared/model/emulatorMedium"
import { store } from "@/shared/app/store"
import { app } from "../../../shared/app"

export default Vue.extend({
	data() {
		return {
			selectedModel: global.model,
			global,
		}
	},
	methods: {
		deleteNotebook() {
			if (confirm(`This action will PERMANENTLY delete your current notebook ${store.notebook.notebook.name}.`)) {
				app.notebookService.reset()
			}
		},


		
		loadEm(e) {
			for (let file of e.target.files) {
				let fileReader = new FileReader()
				fileReader.onload = e => {
					let model = parseFromEmulator((e.target as any).result)
					model.name = file.name
					store.notebook.notebook.models.push(model)
					app.notebookService.save()
				}
				fileReader.readAsText(file)
			}
		},

		loadEmClick() {
			this.$refs.inputEm.click()
		},

		loadClick() {
			this.$refs.input.click()
		},
		load(e) {
			if (!confirm(`This action will OVERRIDE your current notebook.\nNotebook "${store.notebook.notebook.name}" will be LOST.`)) {
					return
				}

			let fr = new FileReader()
			fr.onload = e => {
				app.notebookService.setNotebook(Notebook.unserialize((e.target as any).result))
			}
			fr.readAsText(e.target.files[0])
		},
		selectModel(e) {
			this.selectedModel = this.models[e.target.selectedIndex]
		},
		displayName(model) {
			return store.notebook.notebook.modelUniqueName(model)
		},
		add() {
			let newModel = exampleModel()
			newModel.name = "New Model"
			store.notebook.notebook.models.push(newModel)
			this.selectedModel = newModel 
		},
		copy() {
			let copyModel = _.cloneDeep(this.selectedModel)
			store.notebook.notebook.models.push(copyModel)
			this.selectedModel = copyModel
		},
		remove() {
			if (this.models.length > 1) {
				store.notebook.notebook.models = _.without(this.models, this.selectedModel)
			    this.selectedModel = global.model = _.last(this.models)
			}
		}
	},
	computed: {
		notebook: () => store.notebook.notebook,
		models: () => store.notebook.notebook.models,
		downloadFile: ()  => store.notebook.notebook.name + ".json", 
		downloadHref() {
			let fileName = this.notebook.name
			let data = "data:text/json;charset=utf-8," + encodeURIComponent(
				store.notebook.notebook.serialize()
			)
			return `data:${data}`
		}
	},
	components: { Section, Field, Input, IconBtn}
})

</script>

<style lang="scss" scoped>

.icon {
	font-size: 23px;
}

.actions {
	display: inline-grid;
	grid-auto-flow: column;
	grid-gap: 10px;
}

.char-input {
    box-sizing: content-box;
    text-align: center;
    width: 1em;
}

.model-list {
	display: flex;
	padding: 10px 0px;

	> select { width: 100%; margin-right: 10px; }
}

</style>