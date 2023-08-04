import React from 'react'

function Men({ menus }) {
    return (
        <div className="employees">
            <h4 className="name">{menus.title}</h4>
            <img src={menus.img} alt="" height='100' width='100' />
            <h4 className="empid">{menus.price} </h4>
            <p className="item-text">{menus.desc}</p>
        </div>
    )
}

export default Men

