import React from 'react'
import './TextContainer.css'
import onlineIcon from './../../icons/onlineIcon.png'
export const TextContainer = ({users}) => {
    return (
        <div className="textContainer">
        <div>
          <h1>Realtime Chat Application <span role="img" aria-label="emoji">💬</span></h1>
          <h2>Created with React, Express, Node and Socket.IO By Med Said Raoudh<span role="img" aria-label="emoji">❤️</span></h2>
        </div>
        {
          users
            ? (
              <div>
                <h1>People currently chatting in this room:</h1>
                <div className="activeContainer">
                  <h2>
                    {users.map(({name}) => (
                      <div key={name} className="activeItem">
                        {name}
                        <img alt="Online Icon" src={onlineIcon}/>
                      </div>
                    ))}
                  </h2>
                </div>
              </div>
            )
            : null
        }
      </div>
    )
}
