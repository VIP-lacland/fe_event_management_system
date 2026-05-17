import api from "./api";


export const getUser = async () => {
    try {
        return await api.get("/api/user")
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

export async function createUser(user) {
  try {
    return await api.post("/api/users", user);
  } catch (error) {
    console.log("Error posting user data: ", error);
    throw error;
  }
}


export async function getUserById(id) {
    try {
        return await api.get(`/api/user/${id}`);
    } catch (error) {
        console.error('Error fetching student data:', error);
        throw error;
    }
}