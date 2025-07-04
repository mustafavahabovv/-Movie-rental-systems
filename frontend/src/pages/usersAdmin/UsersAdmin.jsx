import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  setAdmin,
  deleteUser,
} from "../../redux/features/userSlice";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const UsersAdmin = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const allUser = users.users;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(allUser);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(allUser);
  }, [allUser]);


  const handleSearch = () => {
    setFilteredUsers(
      allUser.filter((user) => {
        const isUsernameMatch = user.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return isUsernameMatch;
      })
    );
  };

  const handleSetAdmin = (userId) => {
    dispatch(setAdmin(userId));
    toast.success("User role changed successfully!");
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
    toast.success("User deleted successfully!");
  };

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyUp={handleSearch}
        />
      </div>

      <Table striped bordered hover responsive="lg">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers &&
            filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "Admin" : "Not Admin"}</td>
                <td className="d-flex gap-2">
                  <Button
                    variant={user.isAdmin ? "warning" : "success"}
                    onClick={() => handleSetAdmin(user._id)}
                  >
                    {user.isAdmin ? "Remove Admin" : "Make Admin"}
                  </Button>

                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersAdmin;
