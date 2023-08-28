import React from 'react';
import styles from './Main.module.scss';
import axios from "axios";
import usePlayers from "../../hooks/usePlayers";
import { CONST_VALS } from '../../components/Const/const';
import ShowCard from '../../components/ShowCard';
import PlayersContext, { PlayersProvider } from '../../context/PlayersProvider';
import { Player } from '../../context/PlayersProvider';


const LOOKUP_CARD_VAL: {[index: string]: number} = {
    '0' : 0,
    'A' : 1,
    '2' : 2,
    '3' : 3,
    '4' : 4,
    '5' : 5,
    '6' : 6,
    '7' : 7,
    '8' : 8,
    '9' : 9,
    'J' : 10,
    'Q' : 10,
    'K' : 10,
  }
function isIterable(obj: any) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === "function";
}
function calculateThreeCardVal(card_str: string){
  let cards = card_str.split(',');
  let sum = 0;
  cards.forEach(function (item){
    let val_card = item[0];
    sum += LOOKUP_CARD_VAL[val_card];
  })
  return sum%10;
}

const card_img_link = 'https://deckofcardsapi.com/static/img/';
const defaut_card_url = card_img_link + 'back.png';

function checkUserAvailable(user_list: any[]){
  if(user_list.length <= 1){
    alert('Not enough player to play. Please hit Reset');
    return false;
  }
  return true;
}

function Main() {
  const [inGameStat, setInGameStat] = React.useState(JSON.parse(sessionStorage.getItem(CONST_VALS.LIST_OF_CURRENT_PLAYERS) || "[]"));
  const [loading, setLoading] = React.useState<boolean>(false);
  const [reveal, setReveal] = React.useState<boolean>(false);
  const [draw, setDraw] = React.useState<boolean>(false);
  const deck_info = JSON.parse(sessionStorage.getItem(CONST_VALS.DECK_INFO)|| "[]");

  const [deck, setDeck] = React.useState({
    deck_id: deck_info ? deck_info.deck_id: '', 
    remaining: deck_info ? deck_info.remaining: ''
  });


  React.useEffect(()=>{
    let deck_info = JSON.parse(sessionStorage.getItem(CONST_VALS.DECK_INFO)|| "[]");
    if(deck_info !== ""){
      setDeck({...deck_info});
    }
  }, [sessionStorage])

  const fetchNewDeck = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1", {
        timeout: CONST_VALS.TIMEOUT,
      });
      if (res != null) {
        
        const deck_detail = {deck_id: res.data?.deck_id, remaining: res.data?.remaining}
        sessionStorage.setItem(CONST_VALS.DECK_INFO, JSON.stringify(deck_detail));
        window.dispatchEvent(new Event("storage")); 
        setDeck({...deck_detail});
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  React.useEffect(() => {
    if(!sessionStorage.getItem(CONST_VALS.DECK_INFO)){
      console.log('No deck');
      fetchNewDeck();
    }
  }, []);
  // function getDeckInfo(){
  //   let deck_info = JSON.parse(sessionStorage.getItem(CONST_VALS.DECK_INFO)|| "");
  //   if(deck_info === ""){
  //     return null;
  //   }
  //   return deck_info;
  // }

  function DrawHandler(){
    setReveal(false);
    setDraw(true);
    if(!checkUserAvailable(inGameStat)) {return;}

    const requiredNumOfCards = inGameStat.length * 3;
    axios({
      url: `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/`,
      params:{
        count: requiredNumOfCards,
      },
      timeout: CONST_VALS.TIMEOUT,
    }).then((res)=>{
      if (res != null) {

        let card_list = res.data?.cards;
        if(card_list === null){
          return;
        }
        else if(card_list.length < requiredNumOfCards){
          setDraw(false);
          alert('Not enough card, please shuffle the deck');
          return;
        }
       
        let afterDrawPlayers = inGameStat.map((item: any, id: any) => {
          let newPlayer = {...item};
          let receivedCards = 
            card_list[id].code + ',' + 
            card_list[id + inGameStat.length].code + ',' + 
            card_list[id + inGameStat.length * 2].code
          newPlayer.card = receivedCards;
          
          return newPlayer;
        });
        sessionStorage.setItem(CONST_VALS.LIST_OF_CURRENT_PLAYERS, JSON.stringify(afterDrawPlayers));
        window.dispatchEvent(new Event("storage")); 
        console.log('newplayer', afterDrawPlayers);

        const deck_detail = {deck_id: res.data?.deck_id, remaining: res.data?.remaining};
        sessionStorage.setItem(CONST_VALS.DECK_INFO, JSON.stringify(deck_detail));
        setDeck({...deck, remaining: res.data?.remaining});
        

        setInGameStat(afterDrawPlayers);
      }})
  }
  
  function ShuffleHandler(){
    setReveal(false);

    axios({
      url: `https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`,
      timeout: CONST_VALS.TIMEOUT,
    }).then((res)=>{
      if (res != null && res.data?.success) {
        
        const deck_detail = {deck_id: res.data?.deck_id, remaining: res.data?.remaining};
        sessionStorage.setItem(CONST_VALS.DECK_INFO, JSON.stringify(deck_detail));
        window.dispatchEvent(new Event("storage")); 
        
        setDeck({...deck, remaining: res.data?.remaining});
      }
    });
    const defaultPlayers = inGameStat.map((player: any) => {
      player.card = '';
      return player;
    });
    setInGameStat(defaultPlayers);
  }

  function RevealHandler(){
    setReveal(true);
    setDraw(false);

    const players_score = inGameStat.map((item: any, id: any)=>{
      return(calculateThreeCardVal(item.card));
    })
    const max_val = Math.max(...players_score);

    let afterRevealPlayers = inGameStat.map((item: any, id:any)=>{
      let player = {...item};
      if(players_score[id] < max_val){
        player.coin -= CONST_VALS.COINS_LOSS_PER_ROUND;
      }
      return player;
    })
    console.log('All players', afterRevealPlayers);

    setInGameStat(afterRevealPlayers);
  }

  function ContinueHandler(){
    const emptyCardPlayers = inGameStat.map((player: any) => {
      player.card = '';
      return player;
    });
    
    let availablePlayers = emptyCardPlayers.filter((item: any) => 
      {return item.coin >= CONST_VALS.COINS_LOSS_PER_ROUND});

    sessionStorage.setItem(CONST_VALS.LIST_OF_CURRENT_PLAYERS, JSON.stringify(availablePlayers));
    window.dispatchEvent(new Event("storage")); 
    
    
    setInGameStat(availablePlayers);
    setReveal(false);
  }

  function ResetHandler(){
    setReveal(false);
    setDraw(false);
    

    axios({
      url: `https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`,
      timeout: CONST_VALS.TIMEOUT,
    }).then((res)=>{
      if (res != null && res.data?.success) {
        const deck_detail = {deck_id: res.data?.deck_id, remaining: res.data?.remaining};
        sessionStorage.setItem(CONST_VALS.DECK_INFO, JSON.stringify(deck_detail));
        window.dispatchEvent(new Event("storage")); 

        setDeck({...deck, remaining: res.data?.remaining});
      }
    })
    const defaultPlayers = JSON.parse(sessionStorage.getItem(CONST_VALS.LIST_OF_PLAYERS) || "[]");
    if(!defaultPlayers){
      console.log('No value in LIST_OF_PLAYERS session storage');
    }
    sessionStorage.setItem(CONST_VALS.LIST_OF_CURRENT_PLAYERS, JSON.stringify(defaultPlayers));
    window.dispatchEvent(new Event("storage")); 

    setInGameStat(defaultPlayers);
  }


  function Dealer(){
    return(
      <div className={styles.dealer}>
        <p>Dealer</p>
        <p>Deck Card {deck.remaining}</p>
        <div className={styles.func}>
          <button onClick={ShuffleHandler}>Shuffle</button>
          <button onClick={DrawHandler} disabled={reveal}>Draw</button>
          <button onClick={RevealHandler} disabled={!draw}>Reveal</button>
          <button onClick={ResetHandler}>Reset</button>
        </div>
        {reveal ? 
          <button 
            className= {styles.next_round}
            onClick={ContinueHandler}>
              NEXT ROUND
          </button> : <></>}
      </div>)
  }

  const PlayerList = isIterable(inGameStat) ? (
    
    inGameStat.map((item : any, id: any) => {
      const backCardList = Array(3).fill(defaut_card_url);
      
      const cardList = item.card.split(',');
      let realCardList = [];
      
      if(cardList.length !== 0){
        realCardList = cardList.map((item: string)=>{
          let img_link = card_img_link + item + '.png';
          return(img_link);
        })
      }
      

      return (
        <div key={id} className={styles[`player${id + 1}`]}>
          <strong>Player {id+1}: {item.username}</strong>
          <p>Coin: {item.coin}</p>
          {reveal && <p>Point: {calculateThreeCardVal(item.card)}</p>}
          {/* <p>Cards: {item.card} </p> */}
          <div className={styles.wrapper}>
            { draw && <ShowCard list_of_img={backCardList}/> }
            { reveal && <ShowCard list_of_img={realCardList}/>}
          </div>
        </div>
      );
    })
  )
  : (<></>);
  return (
    
    <div className={styles.background}>
      {PlayerList}
      <Dealer />
    </div>
    
  )
}

export default Main