import type { AdminUser } from "../types";
import "./UserList.css";

type UserListProps = {
  users: AdminUser[];
};

function formatDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

export function UserList({ users }: UserListProps) {
  return (
    <div className="user-table-wrap">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Auth ID</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="user-id" title={user.id}>
                {user.id.slice(0, 8)}…
              </td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>@{user.username}</td>
              <td className="user-auth">{user.authId}</td>
              <td className="user-created">{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
