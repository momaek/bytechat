import Claude from "@/components/icons/claude.vue";
import Midjourney from "@/components/icons/midjourney.vue";
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
  },
  {
    name: "Midjourney",
    icon: Midjourney
  },
  {
    name: "Claude",
    icon: Claude
  }
]

export function getProviderByName(name: string) {
  return providers.find(provider => provider.name === name)
}