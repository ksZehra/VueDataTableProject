/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";
import CpToolbar from "@/components/CpToolbar.vue"; //Global tanımlama

// Composables
import { createApp } from "vue";

const app = createApp(App);

registerPlugins(app);

app.component("cp-toolbar",CpToolbar);
app.mount("#app");
