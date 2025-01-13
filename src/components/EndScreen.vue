<script setup>

import { onMounted, onUnmounted } from 'vue';

const { resetDone } = defineProps(['resetDone']);

const handleKeyDown = (event) => {

    if (event.code === 'Enter') {

        resetDone();
    }

}


onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);


});
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);

});

</script>

<template>
    <div>
        <div style="display: flex; text-align: center; height: 100vh; font-size: 15vh; align-items: center; text-align: center; justify-content: center;"><b>Questions</b></div>
    </div>
</template>
