import React from 'react';
import styles from './ShowCard.module.scss';

type List_Img = {
    list_of_img: string[]
}

function ShowCard({list_of_img} : List_Img) {
    if(list_of_img === null){
        return <></>;
    }
    const imgList = list_of_img.map((item, id)=>{
        return(<img src={item} alt='Should be img here' key={id}/>)
    })
    return (
        <div className={styles.frame}>{imgList}</div>
    )
}

export default ShowCard;