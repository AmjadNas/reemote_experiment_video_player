<script setup>
import { ref } from 'vue';
import VidoesPlayerApp from './components/VideoApp.vue';
import Login from './components/Login.vue';
import Service from './js/Service';

const isLoggedIn = ref(false);
const uploaded = ref(false);
const name = ref('');

const handleLogin = (newName) => {
  name.value = newName;
  isLoggedIn.value = true;
};

const handleLogout = () => {
  Service.logOut();
  isLoggedIn.value = false;
  
};

const onUpload =  (allVideos) => {
  
  const postData = async () => {
    try {
      const dataToSend =   {
          name:name.value,
          date: Date.now(),
          data: {
            ...allVideos
          }
        };
      uploaded.value = true;
      const response = await Service.sendData(dataToSend, name.value);
      uploaded.value = false;
      if (response == 200){
        uploaded.value = false;
        handleLogout();
      }
    } catch (error) {
      console.error("couldn't send data!");
    }
  }
   postData();
}
</script>


<template>
 
    <VidoesPlayerApp v-if="isLoggedIn" :onUpload="onUpload"  />
    <Login v-else :login="handleLogin"/>
    <div v-if="uploaded" class="modal">
      <div class="modal-content">
        <div class="spinner"></div>
        <p>Uploading... Please wait.</p>
      </div>
    </div>
</template>



<style src="normalize.css/normalize.css"></style>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Spinner Styles */
.spinner {
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
