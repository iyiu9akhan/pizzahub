import { getManagedUsers } from "@/lib/api/users"
import ManageUsers from "@/components/dashboard/admin/users/ManageUsers"
import { requireRole } from "@/lib/core/server"

export const dynamic = "force-dynamic"

const ManageUsersPage = async () => {
  await requireRole("admin")
  const users = await getManagedUsers()
  const usersKey = users.map((u) => `${u.id}-${u.role}-${u.restricted}`).join(";")
  return <ManageUsers key={usersKey} users={users} />
}

export default ManageUsersPage
