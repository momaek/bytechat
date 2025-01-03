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
    key?: string
    api_base: string,
    api_key: string,
    temperature?: number
    max_tokens?: number
    top_p?: number
    frequency_penalty?: number
    presence_penalty?: number
    description?: string
}

export interface API {
    name: string
    base: string
    key: string
    provider: Provider
    models?: Model[]
}

export interface Provider { 
    name: string
    icon: Component
}