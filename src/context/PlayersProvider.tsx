import React, {ReactNode} from "react";
import { CONST_VALS } from "../components/Const/const";


interface Props {
    children?: ReactNode
    // any props that come into the component
}

export type Player = {
  username: string,
  coin: number,
  card: string,
}
export interface PlayersContextInterface{
  players: Player[],
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>
}

const PlayersContext = React.createContext<PlayersContextInterface|null>(null);

export const PlayersProvider: React.FC<Props> = ({ children }) => {
  console.log('rerendered');
  let list_of_player = JSON.parse(sessionStorage.getItem(CONST_VALS.LIST_OF_PLAYERS) || "[]");
  const [players, setPlayers] = React.useState<Player[]>(list_of_player);

  return (
    <PlayersContext.Provider value={{ players, setPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
};

export default PlayersContext;
