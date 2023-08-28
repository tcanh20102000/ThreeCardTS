import React, {ReactNode} from "react";

interface Props {
    children?: ReactNode
    // any props that come into the component
}
export type Card = {
  card: string,
  point: number,
}
export function CardToPoint(card_type: string){
  let upperCaseCard = card_type.toUpperCase();
}