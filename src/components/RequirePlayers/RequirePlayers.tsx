import { useLocation, Navigate, Outlet } from "react-router-dom";
import React from "react";
import usePlayers from "../../hooks/usePlayers";


//import axios from "axios";


const RequirePlayers = () => {
  const { players, setPlayers } = usePlayers();
  
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = React.useState(false);

//   const fetchPosts = async (username, password) => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:4000/authorize/log_in", {
//         data: JSON.stringify({ username: username, password: password }),
//         timeout: TIMEOUT,
//       });
//       if (res != null) {
//         console.log("res.data", res.data);
//         setAuth({ ...auth, authorize: res.data.valid, mess: res.data.mess });
//       }
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       console.log(err);
//       setAuth({ ...auth, authorize: false });
//     }
//   };

//   React.useEffect(() => {
//     if (auth?.username && auth?.password) {
//       fetchPosts(auth.username, auth.password);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [auth?.username]);

  return players 
        && players?.length >= 1 ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default RequirePlayers;
