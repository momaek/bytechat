import Openai from "@/components/icons/openai.vue";
import type { Provider } from "@/types/chat";

export const providers: Provider[] = [
  {
    name: 'OpenAI',
    icon: Openai,
  },
  {
    name: "OpenAI Compatible",
    icon: Openai
  }
]