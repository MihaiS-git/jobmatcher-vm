import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AuthUserDTO } from "../../types/UserDTO";
import { setCredentials } from "../../features/authSlice";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080/api/v0";

const OAuthRedirectHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (token && refreshToken) {
      fetch(`${API_URL}/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch user data");
          const user: AuthUserDTO = await res.json();
          dispatch(setCredentials({ user, token, refreshToken }));
          navigate("/");
        })
        .catch((err) => {
          console.error(err);
          navigate("/auth");
        })
        .finally(() => setLoading(false));
    } else {
      console.error("No token in URL");
      navigate("/auth");
    }
  }, [dispatch, navigate]);

  if (loading){
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Signing in...</h1>
    </div>
  );
};

export default OAuthRedirectHandler;
