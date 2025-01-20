import type { Component } from "vue"

export interface Chat {
    id: string
    title: string
    model: Model
    prompt?: string
    temperature?: number
    max_tokens?: number
    top_p?: number
    frequency_penalty?: number
    presence_penalty?: number
    messages?: ChatMessage[]
    created_at: Date
}
export interface ChatMessage {
    id: string
    role: string
    content: string
    images?: string[]
    created_at: string
}

export interface Model {
    id: string
    name: string
    api_base: string,
    api_key: string,
    description?: string
}

export interface API {
    id: string
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