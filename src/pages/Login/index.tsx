import React from "react";
import styles from "./Login.module.scss";
import { Player } from "../../context/PlayersProvider";
import { CONST_VALS } from "../../components/Const/const";


import usePlayers from "../../hooks/usePlayers";
import { useNavigate } from "react-router-dom";

type User = {
  username: string,
}
type NewUserProps = {
  user: User,
  handleChange: React.ChangeEventHandler,
  handleSubmit: React.FormEventHandler,
  index: number,
}

function NewUser({user, handleChange, handleSubmit, index}:NewUserProps){
  if(index + 1 > CONST_VALS.NUM_OF_PLAYERS){
    return(
      <></>
    )
  }
  return(
    <form className={styles.login} onSubmit={handleSubmit}>
      <div className={styles.header}>What should we call you, player {index + 1} ?</div>
      <div className={styles.edit_area}>
        <input
          key="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
          name="username"
          value={user.username}
          onFocus={(e) => e.target.select()}
          id="user_name"
          className={styles.input_box}
        />
        
      </div>
      <div className={styles.footer}>
        <button
          className={styles.send_button}
          disabled={user.username === ""}
          type="submit"
        >
          Confirm
        </button>
      </div>
    </form>
  )
}

export default function Login() {
  const { players,  setPlayers } = usePlayers();
  const [user, setUser] = React.useState({ username: ""});

  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log('Submit');
    
    
    let newPlayer: Player = {
      username: user.username,
      coin: CONST_VALS.DEFAULT_COINS,
      card: '',
    }

    let newPlayerList = [...players, newPlayer];

    setPlayers(oldPlayers => [...oldPlayers, newPlayer]);
    sessionStorage.setItem(CONST_VALS.LIST_OF_PLAYERS, JSON.stringify([...newPlayerList]));
    sessionStorage.setItem(CONST_VALS.LIST_OF_CURRENT_PLAYERS, JSON.stringify([...newPlayerList]));
    window.dispatchEvent(new Event("storage")); 

    console.log("Player stat", players);
    setUser({ username: ""});
  }
  function handleChange(event: React.FormEvent<EventTarget>) {
    const { name, value, type, checked } = event.target as HTMLFormElement;
    setUser({ ...user, [name]: value });
  }

  function Lobby(){
    interface PlayerProps {
      index: number,
    }
    function PlayerArea(props:PlayerProps){
      return(
        <div className={styles.player_area}>
          {players?.[props.index] ? players[props.index].username : 'No user'}
        </div>
      )
    }
    return(
      <div className={styles.lobby}>
      <PlayerArea index={0}/>
      <PlayerArea index={1}/>
      <PlayerArea index={2}/>
      <PlayerArea index={3}/>
    </div>
    );  
  }
  
  function ToGame(){
    return(
      <div className={styles.togame}>
        <button
          disabled={players.length < 2}
          type="button"
          onClick={()=>{navigate('/home')}}
        >
          Play
        </button>
      </div>
    )
  }
  return (
    <div className={styles.background}>
      <div className={styles.left_column}>
        <NewUser user={user} handleChange={handleChange} handleSubmit={handleSubmit} index={players.length}/>
        <ToGame />
      </div>
      <div className={styles.right_column}>
        <Lobby />
      </div>
    </div>
  );
}
