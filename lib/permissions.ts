export type UserRole = "admin" | "gestor" | "analista" | "visualizador"

export const PERMISSIONS = {
  admin: ["criar", "editar", "deletar", "exportar", "gerenciar"],
  gestor: ["criar", "editar", "exportar"],
  analista: ["criar", "editar", "exportar"],
  visualizador: ["visualizar"],
} as const

export function hasPermission(role: UserRole, action: string): boolean {
  return PERMISSIONS[role]?.includes(action) ?? false
}
