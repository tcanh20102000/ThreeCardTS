import PlayersContext, { PlayersContextInterface } from "../context/PlayersProvider";
import React from "react";

const usePlayers = () => {
  return React.useContext(PlayersContext) as PlayersContextInterface;
};
export default usePlayers;
