import Claude from "@/components/icons/claude.vue";
import Midjourney from "@/components/icons/midjourney.vue";
import Openai from "@/components/icons/openai.vue";

export function modelIcon(model: string) {
  if (model.includes("gpt")) {
    return Openai;
  }
  if (model.includes("claude")) {
    return Claude;
  }
  if (model.includes("mj")) {
    return Midjourney;
  }
  return Openai;
}