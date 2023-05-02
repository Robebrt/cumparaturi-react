import React from "react";
import Card from "./Card";
import { useCallback } from 'react'
function CardList({ products, quantityAdd, quantitySubstract, statusChange, moveCard, BigProducts }) {

    const renderCard = useCallback((product, index, statusIndex) => {
        return (
            <Card
                id={product.id}
                moveCard={moveCard}
                key={product.id}
                statusIndex={statusIndex}
                name={product.name}
                index={index}
                quantity={product.quantity}
                status={product.status}
                onQuantityAdd={() => quantityAdd(product.id)}
                onQuantitySubstract={() => quantitySubstract(product.id)}
                onStatusChange={() => { statusChange(product.id) }}
            />

        )
    }, []);
    return (
        <>
            <div >{products.map((product, i) => {
                const statusIndex = BigProducts.indexOf(product);
                return renderCard(product, i, statusIndex)
            })}
            </div>
        </>
    )
}
export default CardList;