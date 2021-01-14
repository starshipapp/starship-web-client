import React from "react";
import IForum from "../../../types/IForum";
import IPlanet from "../../../types/IPlanet";

interface IForumThreadProps {
  planet: IPlanet,
  componentId: string,
  postId: string,
  page: string,
  forum: IForum
}

function ForumThread(props: IForumThreadProps): JSX.Element {
  return (
    <div className="ForumThread">
      <div className="ForumThread-name">{this.props.post && this.props.post.name}</div>
      <div className="ForumThread-container">
        {this.props.post && (this.props.page ? Number(this.props.page) : 1) === 1 && <ForumThreadItem post={this.props.post} planet={this.props.planet} isParent={true} addQuote={this.addQuote}/>}
        {/* <ForumThreadItemContainer page={this.props.page ? Number(this.props.page) : 1} addQuote={this.addQuote} planet={this.props.planet} postId={this.props.postId}/>*/}
      </div>
      {this.props.post && this.props.post.replyCount > 25 && <ReactPaginate
        previousLabel="<"
        nextLabel=">"
        breakLabel="..."
        breakClassName="bp3-button bp3-disabled pagination-button"
        pageCount={Math.ceil(this.props.post.replyCount / 25)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.changePage}
        initialPage={Number(this.props.page) - 1}
        disableInitialCallback={true}
        containerClassName="pagination bp3-button-group"
        activeClassName="bp3-button bp3-disabled pagination-button"
        pageClassName="bp3-button pagination-button"
        previousClassName="bp3-button pagination-button"
        nextClassName="bp3-button pagination-button"
        pageLinkClassName="pagination-link"
        nextLinkClassName="pagination-link"
        previousLinkClassName="pagination-link"
        breakLinkClassName="pagination-link"
      />}
      {this.props.post && Meteor.userId() && (!this.props.post.locked || checkWritePermission(Meteor.userId(), this.props.planet)) && <div className="ForumThread-reply-editor">
        <div className="ForumThread-reply">Reply</div>
        <SimpleMDE
          onChange={this.handleChange} 
          getMdeInstance={this.getInstance} 
          value={this.state.editingContent} 
          options={editorOptions}/>
        <Button text="Post" className="ForumEditor-button" onClick={this.postThread}/>
      </div>}
    </div>
  );
}

export default ForumThread;