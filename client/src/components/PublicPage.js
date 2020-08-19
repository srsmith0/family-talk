import React from "react"
import { Button, Dropdown, Modal } from "semantic-ui-react"
import AddBoard from "./user/AddBoard"
import AddPost from "./userPosts/AddPost"
import './userPosts/Explore.css'
import PublicBoards from "./boards/PublicBoards"

const PublicPage = () => {

  return (
    <>
      <h1 className="Header">Explore</h1>
      <div className="AddStuff">
      <Dropdown icon="pencil" >
        <Dropdown.Menu>
        <Modal size="mini" centered={true} trigger={<Button  color="grey">Add Board or Post</Button>}>
          <Modal.Content>
          <AddBoard />
        <br />
        <br />
           <AddPost />
            </Modal.Content>
          </Modal>
            </Dropdown.Menu>
            </Dropdown> 
    </div>
    <div className="ExploreView">
      <PublicBoards />
      </div>
    </>
  )
}
 
export default PublicPage;