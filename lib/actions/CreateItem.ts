"use server"

import {
    createItem as createItemFn,
    editItem as editItemFn,
    MenuItemPayload,
} from "@/lib/actions/ItemActions"

export async function createItem(data: MenuItemPayload) {
    return createItemFn(data)
}

export async function editItem(id: string, data: MenuItemPayload) {
    return editItemFn(id, data)
}

export type { MenuItemPayload as CreateItemPayload }
