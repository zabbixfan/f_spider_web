<template>
  <el-cascader
  :options="options"
  v-model="selectedCategory"
  :props="defaultProps"
  expand-trigger="click"
  :show-all-levels="false"
  filterable
  placeholder="请输入分类搜索"
  :change-on-select="true">
 </el-cascader>
</template>

<script>
    import * as http from '@/http'
    import api from '@/api'
    export default {
        data() {
        return {
            options: [],
            defaultProps: {
                children: 'children',
                label: 'name',
                value: 'id'
            },
            middle_value: []
        }
    },
    props: {
        value: ''
    },
    computed: {
      selectedCategory: {
            get() {
                return this.middle_value
            },
            set(newvalue) {
                this.middle_value = newvalue
                this.$emit('input', newvalue[newvalue.length - 1])
            }
        }
    },
    methods: {
        loadCategoryTree() {
            http.fetch(api.categoryTree, {
                show_all: 1
            }).then(res => {
                this.options = res.data
            })
        }
    },
    created() {
        this.loadCategoryTree()
        if (this.value) {
            http.fetch(api.category(this.value)).then(res => {
                res.data.path.push(res.data.id)
                this.middle_value = res.data.path
            })
        }
    },
    watch: {
        value() {
            if (this.value) {
                http.fetch(api.category(this.value)).then(res => {
                    res.data.path.push(res.data.id)
                    this.middle_value = res.data.path
                })
            } else {
                this.middle_value = []
            }
        }
    }
  }
</script>
