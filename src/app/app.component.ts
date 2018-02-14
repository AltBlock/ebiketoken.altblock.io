import { HostListener, Component, NgZone, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MessageDialogComponent } from './shared-module/messagedialog/message.dialog';
import { MatSnackBar } from '@angular/material';
import { AirDropDialogComponent } from './shared-module/airdrop-dialog-component';
import { SnackBarTemplateComponent } from './shared-module/snackbar-template-component';
import { filter } from 'rxjs/operators';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

declare var require: any;
declare var window: any;

const Web3 = require('web3');
const contract = require('truffle-contract');

const crowdsaleArtifacts = require('../../build/contracts/YourTokenCrowdsale.json');
const chainArtifacts = require('../../build/contracts/YourToken.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  crowsaleInstance: any;
  YourTokenInstance: any;

  Crowdsale = contract(crowdsaleArtifacts);
  YourToken = contract(chainArtifacts);

  err:boolean = false;
  notconnected:boolean = false;
  network:string = 'local';

  walletInstance: any;

  account: any;

  // balance check pending after transaction
  // usually network is slow so need to run a timeout loop to constantly check the balance
  balancePending:number = 0;
  intervalCheckId:any;

  // default participation amount
  defaultamount: any;

  crowdsaleAccount: any;
  web3: any;
  balance: number = 0;
  ethBalance: number;
  status: string;
  contractYTCBalance: number;
  contractAddress: string;
  rate: string;
  totalSupply: number;

  messageDialogRef: MatDialogRef<MessageDialogComponent>;

  airDropDialogRef: MatDialogRef<AirDropDialogComponent>;

  constructor(private _ngZone: NgZone, private dialog: MatDialog, public snackBar: MatSnackBar){

  }

  @HostListener('window:load')
  windowLoaded() {

    // Bootstrap the YourToken abstraction for Use.
    this.Crowdsale.setProvider(this.web3.currentProvider);
    this.YourToken.setProvider(this.web3.currentProvider);

    this.onReady();
  }

  notifyError(message) {
    if (message.indexOf(' at') > 0) {
    this.openMessageDialog(message.substring(0, message.indexOf(' at')));
    } else {
      this.openMessageDialog(message);
    }
  }

  airDropToken() {
    this.airDropDialogRef = this.dialog.open(AirDropDialogComponent, {
      data: {
        amount: this.defaultamount ? this.defaultamount : ''
      }
    });

    this.airDropDialogRef.afterClosed().pipe(
      filter(amount => amount)
    ).subscribe(
      amount => {
        this.Crowdsale.deployed().then(inst => {
            inst.sendTransaction({ from: this.account.toString(), value: this.web3.toWei(amount, "ether")})
            .then((receipt) => {
              console.log(receipt);
              const message = 'Your transaction successful.  '
              + '  TxId: ' + receipt.tx
              + '  Block: ' + receipt.receipt.blockNumber;
              this.openMessageDialog(message);
              // flag to check balance update on UI can be slight delay due to blockchain network latency
              this.balancePending = 1;
              this.snackBar.openFromComponent(SnackBarTemplateComponent, {
                duration: 5000,
                data: {
                  message: 'Please wait, you balance being updated.'
                }
              });
              // trigger a Interval check to update the balance from blockchain every 1 sec
              this.intervalCheckId = setInterval(() => {
                this.refreshBalance();
              }, 1000);
            }).catch((err) => {
              // trigger dialog to display error
              this.notifyError(err.message);
            });
          }
        );

    });
  }

/**
 * Assign Contract Address for YTC
 * @param addr
 */
assignContractAddress(addr) {
  this.contractAddress = addr;
  return addr;
}

assignSupply(supply) {
  this.totalSupply = supply;
}
/**
 * Get contract YTC Balance
 */
getContractYTCBalance() {
   const YourTokenInstance = this.YourToken.at(this.contractAddress);
   YourTokenInstance.balanceOf(this.account).then(balance => {
    console.log('Balance: ' + balance.toString(10));
    this.contractYTCBalance = balance;
    return balance.toString(10);
   });
   YourTokenInstance.totalSupply().then((supply) => this.assignSupply(supply));
}

/**
 * Assign Crowsale contract Instance for YTC
 * @param instance
 */
assignCrowSaleInstance(instance:any) {
    this.crowsaleInstance = instance;
    console.log(instance);
    // YourTokenCrowdsale.deployed().then(inst => inst.sendTransaction({ from: account1, value: web3.toWei(5, "ether")}))
   return instance.token().then(
      (addr) => this.assignContractAddress(addr)
   );
}

/**
 * Assign YourToken Token Wallet Instance
 * @param addr
 */
assignYourTokenInstance(addr) {
    this.YourTokenInstance = this.YourToken.at(addr);
    return this.YourTokenInstance;
}

/**
 * Get YTC Balance of current wallet
 * @param YTCInstance
 */
YTCBalance(YTCInstance) {
  // get current account YTC Balance
  YTCInstance.balanceOf(this.account).then(balance => {
     console.log('Balance: ' + balance.toString(10));
     console.log(this.web3.fromWei(balance,'ether') +' ==? '+ this.balance);
     // check if the balance is unchanged
     if (this.web3.fromWei(balance,'ether').toString() === this.balance.toString()) {
       console.log('.. SAME BALANCE !!');
       this.balancePending = 1;
     } else {
      this.balancePending = 0;
      this.balance = this.web3.fromWei(balance, 'ether');
     }
     return this.web3.fromWei(balance, 'ether');
   });
}

/**
 * Assign Eth Balance in Eth readable format from Wei
 * @param bal
 * @param err
 */
assignEthBalance(bal, err) {
  if (bal != null) {
     // check if the balance is unchanged
    if (this.web3.fromWei(bal,'ether') === this.ethBalance) {
      this.balancePending = 1;
    } else {
      this.balancePending = 0;
      // response is returned in BigNumber BigNumber { s: 1, e: 0, c: [ 0 ] }
      this.ethBalance = this.web3.fromWei(bal, 'ether');
     }
  }
}

/**
 * Get eth balance in Ether from Wei
 * @param address
 */
getEthBalance(address) {
  console.log('getting balance of ' + address);
  this.web3.eth.getBalance(address.toString(), (err, bal) => this.assignEthBalance(bal, err));
}

/**
 * Refresh All Balances
 *
 */
refreshBalance = () => {
    console.log('refreshing balance');
    // getting buyers ether balance
    this.getEthBalance(this.account);

    const that = this;
    this.Crowdsale.deployed().then(
      (instance) => this.assignCrowSaleInstance(instance)
    ).then(
      (addr) => this.assignYourTokenInstance(addr)
    ).then(
      (YTCInstance) => this.YTCBalance(YTCInstance)
    );

    if (this.balancePending === 0) {
      console.log('Clearing interval cos system thinks .. balance updated .. because balance pending = '+this.balancePending);
      this.snackBar.openFromComponent(SnackBarTemplateComponent, {
        duration: 2000,
        data: {
          message: 'Your balance has been updated.'
        }
      });
      clearInterval(this.intervalCheckId);
    }

}

  setStatus = message => {
    this.status = message;
  }

  ngOnInit() {
    console.log('window init');
  }

  ngAfterViewInit() {
    this.checkAndInstantiateWeb3();
  }

  ngAfterViewChecked() {

  }

  openMessageDialog(message: string) {
    this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        message: message
      }
    });
  }


  checkAndInstantiateWeb3 = () => {
    // Checking if web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {

      // trigger dialogbox to notify user that the dapp is using MetaMask or Mist
      // Use Mist/MetaMask's provider
       this.web3 = new Web3(window.web3.currentProvider);
       console.warn('Using web3 detected from external source');
       this.network = 'remote';

      // enable following if developing without metamask or to connect to
      // testrpc blockchain testnet
      /*
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
      console.warn('Falling back to testrpc');
      this.network = 'local';
      */

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

    // Get the initial account balance so it can be displayed
    this.web3.eth.getAccounts(( err, accs) => {
      if (err != null) {
        this.err = true;
      } else if ((typeof accs !== undefined) && accs.length === 0) {
        this.err = true;
      } else {

        // if array use the array value with key 1 by default
        if (this.network === 'local') {
          this.account = accs[1];
        } else {
          this.account = accs;
        }
      }
      // This is run from window:load and ZoneJS is nto aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() => {
        // Initial loading of UI
        // Load balances or whatever
        // this.web3.eth.getBalance((bal) => this.assignEthBalance(bal));

        // doublecheck if error or not conected
        if (err) {
          this.openMessageDialog('There was an error fetching your accounts. Error connecting to Blockchain.');
        } else if (this.notconnected) {
          this.openMessageDialog(
            'You are not connected to an Ethereum client. '
             + 'Your can still browse the data, but you will'
             + ' not be able to perform transactions.'
          );
        } else {
          console.log('connected ' + this.account);
          if (typeof this.account === 'undefined') {
            this.openMessageDialog(
              'It seems that your are not logged in to MetaMask. '
               + 'Please unlock your MetaMask wallet to be able to buy or transact.'
            );
          } else {
            this.refreshBalance();
          }
        }

      });
    });
  }

}
