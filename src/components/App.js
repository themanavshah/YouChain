import React, { Component } from 'react';
import YouChain from '../abis/YouChain.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //Load accounts
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    //Add first account the the state
    this.setState({
      account: accounts[0]
    })
    //Get network ID
    //Get network data
    //Check if net data exists, then
    const networkId = await web3.eth.net.getId()
    const networkData = YouChain.networks[networkId]
    if (networkData) {
      console.log(networkData.address);
      const contract = new web3.eth.Contract(YouChain.abi, networkData.address)
      //console.log(contract);
      this.setState({ contract })

      //Assign YouChain contract to a variable
      //Add YouChain to the state

      //Check videoAmounts
      const videoCount = await contract.methods.videoCount().call()
      //Add videAmounts to the state
      this.setState({
        videoCount
      })


      //Iterate throught videos and add them to the state (by newest)
      for (var i = videoCount; i >= 1; i--) {
        const video = await contract.methods.videos(i).call()
        this.setState({
          videos: [...this.state.videos, video]
        })
      }

      //Set latest video and it's title to view as default 
      const latest = await contract.methods.videos(videoCount).call()
      this.setState({
        currentHash: latest.hash,
        currentTitle: latest.title
      })
      //Set loading state to false
      this.setState({
        loading: false
      })

      //If network data doesn't exisits, log error


    } else {
      window.alert('Contract is not yet deployed')
    }
  }

  //Get video
  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new Window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  //Upload video
  uploadVideo = title => {

  }

  //Change Video
  changeVideo = (hash, title) => {

  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      account: '0x0'
      //set states

    }

    //Bind functions
  }

  render() {
    return (
      <div>
        <Navbar
          //Account
          account={this.state.account}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
          //states&functions
          />
        }
      </div>
    );
  }
}

export default App;