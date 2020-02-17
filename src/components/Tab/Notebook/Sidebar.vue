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
            <Field name="Wildcard">
                <Input
                    maxlength="1"
					class="char-input"
                    @input="renameWildcard($event)"
                    :value="global.notebook.wildcard"
					v-selectOnFocus
                />
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

export default Vue.extend({
	data() {
		return {
			selectedModel: global.model,
			global,
		}
	},
	methods: {
		deleteNotebook() {
			if (confirm(`This action will PERMANENTLY delete your current notebook ${global.notebook.name}.`)) {
				global.resetNotebook()
			}
		},
		renameWildcard(newWildcard) {
			global.notebook.wildcard = newWildcard || undefined
		},
		loadClick() {
			this.$refs.input.click()
		},
		load(e) {
			if (!confirm(`This action will OVERRIDE your current notebook.\nNotebook "${global.notebook.name}" will be LOST.`)) {
					return
				}

			let fr = new FileReader()
			fr.onload = e => {
				global.notebook = Notebook.unserialize((e.target as any).result)
			}
			fr.readAsText(e.target.files[0])
		},
		selectModel(e) {
			this.selectedModel = this.models[e.target.selectedIndex]
		},
		displayName(model) {
			return global.notebook.modelUniqueName(model)
		},
		add() {
			let newModel = exampleModel()
			newModel.name = "New Model"
			global.notebook.models.push(newModel)
			this.selectedModel = newModel 
		},
		copy() {
			let copyModel = _.cloneDeep(this.selectedModel)
			global.notebook.models.push(copyModel)
			this.selectedModel = copyModel
		},
		remove() {
			if (this.models.length > 1) {
				global.notebook.models = _.without(this.models, this.selectedModel)
			    this.selectedModel = global.model = _.last(this.models)
			}
		}
	},
	computed: {
		notebook: () => global.notebook,
		models: () => global.notebook.models,
		downloadFile: ()  => global.notebook.name + ".json", 
		downloadHref() {
			let fileName = this.notebook.name
			let data = "data:text/json;charset=utf-8," + encodeURIComponent(
				global.notebook.serialize()
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