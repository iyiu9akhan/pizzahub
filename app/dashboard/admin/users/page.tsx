import { getManagedUsers } from "@/lib/api/users"
import ManageUsers from "@/components/dashboard/admin/users/ManageUsers"

export const dynamic = "force-dynamic"

const ManageUsersPage = async () => {
  const users = await getManagedUsers()
  return <ManageUsers users={users} />
}

export default ManageUsersPage