<template lang="html">
  <v-tabs id="mobile-tabs-5" fixed light centered>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>Gump</v-toolbar-title>
    </v-toolbar>
    <v-card flat class="grey lighten-3 mt-2 pa-2">
      <v-expansion-panel>
        <v-expansion-panel-content v-for="item in functionList">
          <div v-bind:style="{width:'100%'}" slot="header" class="subheading">{{item.path}}</div>
            <v-card flat dense class="grey lighten-3 mt-2">
              <v-layout row wrap>
                <v-flex d-flex xs12 sm6 md6 v-for="(item2, index) in item.params">
                  <v-card class="mx-2 my-2">
                    <v-toolbar flat class="white" dense>
                      <v-toolbar-title class="text-xs-center">{{item2.id}}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn icon @click="deleteParams(item.params, index)">
                        <v-icon>close</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <div class="pa-2">
                      <multiselect class="mt-2" select-label="" deselect-label="" v-model="item2.validation" :options="validationList" :multiple="true" :close-on-select="true" :clear-on-select="false" :hide-selected="true" :preserve-search="true" placeholder="Choose validation" label="text" track-by="id"></multiselect>
                    </div>
                    <div class="pa-3">
                      <v-text-field 
                        v-model="input.value"
                        v-for="input in item2.validation" 
                        v-if="input.id=='max_len'||input.id=='max_len'||input.id=='min_len'||input.id=='exact_len'||input.id=='contains'||input.id=='regex'" 
                        v-bind:name="input.id" 
                        v-bind:label="input.text"
                      ></v-text-field>
                    </div>
                  </v-card>
                </v-flex>
                <v-flex d-flex xs12 sm6 md6>
                  <v-card class="mx-2 my-2">
                    <v-toolbar flat class="white" dense>
                      <v-toolbar-title class="text-xs-center">Add New Parameter</v-toolbar-title>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <div class="pa-2">
                      <v-text-field
                        box
                        label="Name"
                        v-model="newParams.id"
                      ></v-text-field>
                      <multiselect class="mt-2" select-label="" deselect-label="" v-model="newParams.validation" :options="validationList" :multiple="true" :close-on-select="true" :clear-on-select="false" :hide-selected="true" :preserve-search="true" placeholder="Choose validation" label="text" track-by="id"></multiselect>
                    </div>
                    <div class="my-3">
                      <v-btn primary @click="addNewParams(item)">Add</v-btn>
                    </div>
                  </v-card>
                </v-flex>
                <v-flex xs12>
                  <div class="px-2">
                    <v-btn block success @click="saveParams(item.path)">Save</v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card>
  </v-tabs>
</template>

<script>
export default {
  data() {
    return {
      input: {
        name: "",
        validation: ""
      },
      state: {
        isEdit: false
      },
      dialog: false,
      columns: [
        {
          text: "Permission Access",
          value: "path",
          align: "left",
          sortable: false
        }
      ],
      roleList: [],
      moduleList: [],
      functionList: [],
      functionModel: {},
      newParams: {
        id: "",
        validation: []
      },
      validationList: [
        {
          id: "required",
          text: "Required"
        },
        {
          id: "valid_email",
          text: "Valid Email"
        },
        {
          id: "min_len",
          text: "Minimal Length"
        },
        {
          id: "max_len",
          text: "Maximal Length"
        },
        {
          id: "exact_len",
          text: "Exact Length"
        },
        {
          id: "alpha",
          text: "Alpha"
        },
        {
          id: "alpha_numeric",
          text: "Alpha Numeric"
        },
        {
          id: "alpha_dash",
          text: "Alpha Dash"
        },
        {
          id: "alpha_space",
          text: "Alpha Space"
        },
        {
          id: "numeric",
          text: "Numeric"
        },
        {
          id: "integer",
          text: "Integer"
        },
        {
          id: "boolean",
          text: "Boolean"
        },
        {
          id: "float",
          text: "Float"
        },
        {
          id: "valid_url",
          text: "Valid URL"
        },
        {
          id: "url_exists",
          text: "URL Exists"
        },
        {
          id: "valid_ip",
          text: "Valid IP"
        },
        {
          id: "valid_ipv4",
          text: "Valid IPV4"
        },
        {
          id: "valid_ipv6",
          text: "Valid IPV6"
        },
        {
          id: "valid_name",
          text: "Valid Name"
        },
        {
          id: "contains",
          text: "Contains"
        },
        {
          id: "date",
          text: "Date"
        },
        {
          id: "regex",
          text: "Regex"
        },
        {
          id: "valid_json_string",
          text: "Valid JSON String"
        }
      ]
    };
  },
  methods: {
    addNewParams(item) {
      if (this.newParams.id != "") {
        item.params.push({
          id: this.newParams.id,
          validation: this.newParams.validation
        });
        this.newParams = {
          id: "",
          validation: []
        };
      }
    },
    deleteParams(item, index) {
      this.$modal
        .confirm({
          message: "Are you sure you want to delete this param?"
        })
        .then(response => {
          item.splice(index, 1);
        })
        .catch(error => {});
    },
    saveParams(path) {
      path = path.split(".");
      let module = path[0];
      let controller = path[1];
      this.$http
        .post("params/updateParams", {
          module: module,
          controller: controller,
          validation: this.allParams[module][controller]
        })
        .then(response => {
          if (response.data.success_message) {
            this.$toasted.show("Successfully saved", {
              type: "success",
              theme: "primary",
              position: "top-center",
              duration: 2000
            });
          }
        });
    }
  },
  created() {
    this.$http.post("params/getParams").then(response => {
      if (!response.data.error_message) {
        let moduleList = [];
        response.data.project.forEach(module => {
          response.data.controller[module].forEach(controller => {
            let newModule = {
              moduleName: module,
              controllerName: controller,
              functionList: response.data.function[controller]
            };
            moduleList.push(newModule);

            newModule.functionList.forEach(functionName => {
              let newParams = [];
              let validation = [];
              if (response.data.params[module][controller]) {
                if (response.data.params[module][controller][functionName]) {
                  if (
                    response.data.params[module][controller][functionName][
                      "validation"
                    ]
                  ) {
                    for (const item in response.data.params[module][controller][
                      functionName
                    ]["validation"]) {
                      validation = response.data.params[module][controller][
                        functionName
                      ]["validation"][item].split("|");
                      let validationNew = [];
                      validation.forEach(validationItem => {
                        let validationObjSplit = validationItem.split(",");
                        let validationFind = _.find(this.validationList, {
                          id: validationObjSplit[0]
                        });
                        if (!validationFind)
                          validationFind = {
                            id: validationObjSplit[0],
                            text: validationObjSplit[0]
                          };
                        validationNew.push({
                          id: validationObjSplit[0],
                          text: validationFind.text,
                          value: validationObjSplit[1] || false
                        });
                      });
                      newParams.push({
                        id: item,
                        validation: validationNew
                      });
                    }
                  }
                }
              }
              this.functionList.push({
                path: module + "." + controller + "." + functionName,
                params: newParams
              });
            });
          });
        });
        this.moduleList = moduleList;
      }
    });
  },
  computed: {
    allParams: function() {
      let newParams = {};
      this.moduleList.forEach(item => {
        if (!newParams[item.moduleName]) {
          newParams[item.moduleName] = {};
        }
        if (!newParams[item.moduleName][item.controllerName]) {
          newParams[item.moduleName][item.controllerName] = {};
        }
        item.functionList.forEach(item2 => {
          let validationItem = _.find(this.functionList, {
            path: item.moduleName + "." + item.controllerName + "." + item2
          });
          let validationItemObj = {};
          validationItem["params"].forEach(item3 => {
            let validationValue = [];
            item3.validation.forEach(item4 => {
              let val = "";
              if (item4.value) {
                val = "," + item4.value;
              }
              validationValue.push(item4.id + val);
            });
            if (!validationItemObj[item3.id])
              validationItemObj[item3.id] = validationValue.join("|");
          });
          newParams[item.moduleName][item.controllerName][item2] = {
            validation: validationItemObj
          };
        });
      });
      return newParams;
    }
  }
};
</script>

<style lang="css">
body > .multiselect__content-wrapper {
  z-index: 99999;
}
</style>
