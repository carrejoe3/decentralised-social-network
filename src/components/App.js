import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json';
import Main from './Main';
import Navbar from './Navbar';

class App extends Component {

  constructor (props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: null,
      posts: [],
      loading: true
    }
  }

  async componentWillMount () {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3 () {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error(error)
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData () {
    const web3 = window.web3

    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]

    if (networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })

      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })

      // Load posts
      for (let i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }

      this.setState({ loading: false })
    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }

  render () {
    return (
      <div>
        <Navbar account={ this.state.account } />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5">
              <p>Loading...</p>
            </div>
          : <Main posts={ this.state.posts } />
        }
      </div>
    );
  }
}

export default App;
