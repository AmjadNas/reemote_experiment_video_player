<script setup>
import { ref, watch, onMounted } from 'vue';
import VideoPlayer from './Video.vue'
import EndScreen from './EndScreen.vue';
import data from '../js/videos';

const { onUpload } = defineProps(['onUpload']);

const allVideos = ref({});
const category = ref(0);
const videos = ref([]);
const videoIndex = ref(0);
const n_variants = ref(0);
const done = ref(false);

const categories = ["viewing", "walking", "basketball"];


onMounted(() => {
    const obj = {}

    for (const cat of categories) {
        const videoNames = data[cat];
        obj[cat] = {}
        for (const video of Object.keys(videoNames)) {
            const variations = videoNames[video].map((innerObj) => {
                return innerObj.name;
            });
            obj[cat][video] = variations.map(variation => {
                return {
                    name: variation,
                    selected: false,
                    elapsed: 0.0,
                    replays: 0
                }
            })
        }

    }
    allVideos.value = obj;
    const oldList = data[categories[category.value]];
    const keys = Object.keys(oldList);
    const length = keys.length;
    const index = 0;

    videos.value = oldList[keys[index]].map(obj => obj.link);
    n_variants.value = oldList[keys[index]].length;
});

watch(videoIndex, () => {

    const oldList = data[categories[category.value]];
    const keys = Object.keys(oldList);
    const length = keys.length;
    const index = videoIndex.value;
    
    if (index < length){
        n_variants.value = oldList[keys[index]].length;
        videos.value = oldList[keys[index]].map(obj => obj.link);
    }else {
        category.value = category.value + 1;
        done.value = true;
    }

});


watch(category, () => {

    const tempCategory = category.value;
    if (tempCategory == categories.length) {
        onUpload(allVideos.value);

        //onLogout();
    }
});

const resetDone = () => {

    done.value = false;
    videoIndex.value = 0;
}

const finished = (picked, replayNum, elapsed) => {
    const tempVideoIndex = videoIndex.value;
    const tempCategory = categories[category.value];
    const keys = Object.keys(allVideos.value[tempCategory]);
    const currentKey = keys[tempVideoIndex];

    const newNestedObj = { ...allVideos.value[tempCategory] }
    const vartiations = newNestedObj[currentKey];
    
    for(let index = 0; index < elapsed.length; index++){
        vartiations[index].replays = replayNum[index] ? replayNum[index] : 0;
        vartiations[index].elapsed = elapsed[index] ? elapsed[index] : 0;

    }
    vartiations[picked].selected = true;

    allVideos.value = { ...allVideos.value, [tempCategory]: newNestedObj };
    videoIndex.value = tempVideoIndex + 1;
}

</script>


<template>
    <div>
        <EndScreen v-if="done" :resetDone="resetDone" />
        <VideoPlayer v-else :length={n_variants} :videos=(videos) :onFinished="finished" />

    </div>
</template>


<style>
.container {
  display: flex;
  justify-content:flex-start;
  align-items:start;
  height: 100vh;
}

iframe {
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100vh; /* Full viewport height */
  object-fit: cover;
}



  @media (max-width: 1080px) { /* For small screens */
    iframe {
      height: 50vh; /* Adjust height to fit */
    }
  }
</style>