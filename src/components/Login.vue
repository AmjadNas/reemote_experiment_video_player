<script setup>
import { ref, onMounted} from 'vue';
import Service from '../js/Service'
// import { VueRecaptcha } from 'vue-recaptcha';

const {login} = defineProps(['login'])

const name = ref("");
const username = ref('');
const password = ref('');
const error = ref('');
const captchaVerified = ref(false);
const captchaToken = ref(null);



const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
    captchaToken.value = await grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: 'login' });
  } catch (err) {
    error.value = 'Failed to verify CAPTCHA. Please try again.';
    console.error('CAPTCHA Error:', err);
    return;
  }

  if (!captchaToken.value) {
    error.value = 'Please complete the CAPTCHA';
    return;
  }

    const content =
    {
      username: username.value,
      password: password.value
    };
    try {
      const response = await Service.login(content);
      
      
      if (response == 200) {
        login(`${username.value}_${name.value}`);
      } else {
        error.value = 'Invalid username or password';
      }
    } catch (err){
      console.error('Login error:', err);
      error.value = err || 'An unexpected error occurred';
    }
};

onMounted(()=>{
  const captchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY; // Get the site key from env file

  // Dynamically load reCAPTCHA API script
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?render=${captchaSiteKey}`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    console.log('reCAPTCHA script loaded successfully');
    // reCAPTCHA is ready to use
    grecaptcha.ready(() => {
      console.log('reCAPTCHA is ready');
      // Now you can execute the reCAPTCHA token when needed
      grecaptcha.execute(captchaSiteKey, { action: 'login' }).then((token) => {
        captchaToken.value = token;  // Save the token for submission
        captchaVerified.value = true; // Mark the CAPTCHA as verified
      });
    });
  };
  document.head.appendChild(script);  // Append script to the head
  }
) 
</script>

<template>
    <div class="login">
        <h2>Login</h2>
        <form >
            <div>
                <label>Name:</label>
                <input type="text" role='name' aria-label='full name' v-model="name" />
            </div>
            <div>
                <label>Username:</label>
                <input type="text" role='username' aria-label='user name' v-model="username" />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" role='password' aria-label='password' v-model="password" />
            </div>
            <p v-if="error" style='color: red'>{{ error }}</p>
            <button :disabled="!captchaVerified" type="submit" @click="handleLogin">Login</button>
        </form>
    </div>
</template>
