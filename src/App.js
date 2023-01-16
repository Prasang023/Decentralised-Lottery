import web3 from './web3';
import lottery from './lottery';
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState({ 
    manager: '',
    players: [],
    balance: ''
  })
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const callManager = async () => {
      let tempmanager
      let tempplayers
      let tempbalance
        try 
        {
        tempmanager = await lottery.methods.manager().call();
        tempplayers = await lottery.methods.getPlayers().call();
        tempbalance = await web3.eth.getBalance(lottery.options.address);
        }
        catch(err){
          console.log(err)
        }
        setData({
          ...data,
          manager: tempmanager,
          players: tempplayers,
          balance: tempbalance
        })
    }

    callManager().catch(console.error)

  }, [data])

  async function onSubmit(event){
      event.preventDefault();
      const accounts = await web3.eth.getAccounts();

      setMessage('Entering Lottery')

      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      })

      setMessage('You have successfully entered')
  }

  async function onClick(){
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting for transaction to complete')

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })

    setMessage('Winner has been chosen')

  }

  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This is managed by {data.manager}</p>
      <p>There are currenty {(data.players).length} competing for {web3.utils.fromWei((data.balance), 'ether')} ethers</p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to participate?</h4>
        <div>
          <label>Amount of ether to enter: </label>
          <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <p>{message}</p>
      <hr />
      <h4>Ready to Pick a Winner?</h4>
      <button onClick={onClick}>Pick a Winner</button>
    </div>
  );
}

export default App;
