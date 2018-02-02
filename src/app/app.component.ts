import { HostListener, Component, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MessageDialogComponent } from './shared-module/messagedialog/message.dialog';

declare var require: any;
declare var window: any;

const Web3 = require('web3');
const contract = require('truffle-contract');

const coinArtifacts = require('../SudCoin.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  coinInstance: any;
  title = 'app';
  Coin = contract(coinArtifacts);

  account: any;
  accounts: any = 0;
  web3: any;

  messageDialogRef: MatDialogRef<MessageDialogComponent>;

  constructor(private _ngZone: NgZone, private dialog: MatDialog){

  }

  @HostListener('window:load')
  windowLoaded() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  openMessageDialog(message: string) {
    this.messageDialogRef = this.dialog.open(MessageDialogComponent);
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined'){
      console.warn('Using web3 detected from external source');
      // trigger dialogbox to notify user that the dapp is using MetaMask or Mist
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        'No web3 detected, falling back to Infura Ropsten'
        // 'No web3 detected. Falling back to http://localhost:8545.
        // You should remove this fallback when you deploy live, as it\'s
        // inherently insecure. Consider switching to Metamask for development.
        // More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
    }
  }

  onReady = () => {
    // Bootstrap the SudCoin abstraction for Use.
    this.Coin.setProvider(this.web3.currentProvider);

    // Get the initial account balance so it can be displayed
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null){
        //trigger material dialog instead
        this.openMessageDialog('There was an error fetching your accounts.');
      } else if ((typeof accs != undefined)){
        this.openMessageDialog('You are not connected to an Ethereum client. Your can still browse the data, but you will not be able to perform transactions.');
        return;
      }
      else {
        this.accounts = accs;
        this.account = this.accounts[0];
      }
      // This is run from window:load and ZoneJS is nto aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() => {
        // Initial loading of UI
        // Load balances or whatever
      });
    });
  }

}
