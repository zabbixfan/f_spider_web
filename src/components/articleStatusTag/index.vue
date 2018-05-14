<template>
    <el-tag :type="statusType(status)">{{transferStatus(status)}}</el-tag>
</template>

<script>
    export default {
        data: function () {
            return {}
        },
        computed: {
            status() {
                return this.value
            }
        },
        props: {
            value: {
                type: Number,
                default: 1
            }
        },
        methods: {
            transferStatus(status) {
                switch (status) {
                    case 1:
                        return '待发布'
                    case 2:
                        return '已发布'
                    case 0:
                        return '驳回'
                }
            },
            statusType(status) {
                switch (status) {
                    case 1:
                        return 'warning'
                    case 2:
                        return 'success'
                    case 0:
                        return 'danger'
                }
            }
        }
    }

</script>

<style scoped>


</style>
