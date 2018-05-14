<template>
    <div class="panel">
        <panel-title title="Title"></panel-title>
        <div class="panel-body">
            <!--主体内容-->
        </div>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import panelTitle from '@/components/panelTitle'
    import bottomToolBar from '@/components/bottomToolBar'
    import checkRole from '@/assets/js/checkRole'
    import * as http from '@/http'
    import api from '@/api'
    export default {
        data() {
            return {}
        },
        components: {
            panelTitle,
            bottomToolBar
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
