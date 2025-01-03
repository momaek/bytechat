import type { Component } from "vue"

export interface Chat {
    id: string
    title: string
    model: Model
    messages: ChatMessage[]
    created_at: string
}
export interface ChatMessage {
    id: string
    role: string
    content: string
    created_at: string
}

export interface Model {
    id: string
    name: string
    key: string
    type: string
    api: API,
    temperature: number
    max_tokens: number
    top_p: number
    frequency_penalty: number
    presence_penalty: number
    description?: string
}

export interface API {
    base: string
    token: string
    provider: Provider
}

export interface Provider { 
    name: string
    icon: Component
}