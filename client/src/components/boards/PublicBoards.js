import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Board from './Board'; 
import { AuthConsumer } from '../../providers/AuthProvider';

const PublicBoards = (props) => {
  const [pubBoards, setPubBoards] = useState([])

  useEffect(() => {
    axios.get(`/api/boards`)
    .then(res => {
      setPubBoards(res.data.filter(board => board.public == true))
    })
    .catch(badRes => {
      console.log(badRes)
    })
  }, [])

  const renderPublicBoards = () => {
    return pubBoards.map(board => (
      <>
        <Board
          key={board.id}
          {...board}
          editBoard={editBoard}
          removeBoard={removeBoard}
          unfollowBoard={unfollowBoard}
        />
       </>
    ))
  }

  const unfollowBoard = (boardId) => {
    axios.delete(`/api/user_boards/unfollow/${boardId}`)
    .then((res) => {
      console.log("unfollowed")
    }).catch((err) => {
      console.log("fail!")
    })
  }

  const removeBoard = (id) => {
    axios.delete(`/api/boards/${id}`)
      .then((res) => {
      setPubBoards(pubBoards.filter(board => board.id !== id))
    })
  }

  const editBoard = (id, board) => { 
    let data = new FormData()
    data.append('file', board.file)
    axios.put(`/api/boards/${id}?name=${board.name}&description=${board.description}&public=${board.public}`, data)
      .then(res => {
        const updateBoard = pubBoards.map(board => {
          if (board.id === id) 
            return res.data 
          return board 
        })
        setPubBoards(updateBoard) 
      })
  }

  return (
    <>
    {renderPublicBoards()}
    </>
  )
  
}

const ConnectedPublicBoards = (props) => {
	return <AuthConsumer>{(auth) => <PublicBoards {...props} auth={auth} />}</AuthConsumer>;
};

export default ConnectedPublicBoards;