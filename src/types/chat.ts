export interface Chat {
    id: string
    title: string
    model: Model
    messages: ChatMessage[]
    created_at: string
    updated_at: string
}
export interface ChatMessage {
    id: string
    role: string
    content: string
    created_at: string
    updated_at: string
}

export interface Model {
    id: string
    name: string
    key: string
    type: string
    api_key: string
    api_base: string
    temperature: number
    max_tokens: number
    top_p: number
    frequency_penalty: number
    presence_penalty: number
    description: string
    created_at: string
    updated_at: string
}
