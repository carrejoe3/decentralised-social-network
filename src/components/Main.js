import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {
  render () {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <form onSubmit={(event) => {
                event.preventDefault()
                this.props.createPost(this.postContent.value)
              }}>
                <div className="form-group">
                  <input
                    id="postContent"
                    ref={(input) => { this.postContent = input }}
                    type="text"
                    className="form-control"
                    placeholder="What's on your mind?"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Share</button>
              </form>
              <p>&nbsp;</p>

              { this.props.posts.map((post, key) => {
                return (
                  <div className="card mb-4" key={ key }>
                    <div className="card-header">
                      <img
                        className="mr-2"
                        width="30"
                        height="30"
                        src={ `data:image/png;base64,${new Identicon(post.author, 30).toString()}` }
                        alt="Profile icon"
                      />
                      <small className="text-muted">{ post.author }</small>
                    </div>
                    <ul id="postList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p>{ post.content }</p>
                      </li>
                      <li key={ key } className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          { window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            this.props.tipPost(post.id, tipAmount)
                          }}
                        >
                          <span>TIP 0.1 ETH</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;