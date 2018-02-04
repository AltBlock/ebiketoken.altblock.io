import { HostListener, Component, NgZone, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MessageDialogComponent } from './shared-module/messagedialog/message.dialog';
import { FileNameDialogComponent } from './shared-module/file-name-dialog-component';
import { AirDropDialogComponent } from './shared-module/airdrop-dialog-component';
import { filter } from 'rxjs/operators';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

declare var require: any;
declare var window: any;

const Web3 = require('web3');
const contract = require('truffle-contract');

const crowdsaleArtifacts = require('../../build/contracts/StudentChainCrowdsale.json');
const chainArtifacts = require('../../build/contracts/StudentChain.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked{
  crowsaleInstance: any;
  walletInstance: any;
  title = 'app';
  Crowdsale = contract(crowdsaleArtifacts);
  StudentChain = contract(chainArtifacts);

  account: any;
  accounts: any = 0;
  defaultamount: any;
  crowdsaleAccount: any;
  web3: any;
  balance: number = 0;
  status: string;

  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  fileNameDialogRef: MatDialogRef<FileNameDialogComponent>;
  airDropDialogRef: MatDialogRef<AirDropDialogComponent>;

  constructor(private _ngZone: NgZone, private dialog: MatDialog){

  }

  files = [
    { name: 'foo.js', content: ''},
    { name: 'bar.js', content: ''}
  ];

  @HostListener('window:load')
  windowLoaded() {
    // Bootstrap the SudCoin abstraction for Use.
    this.Crowdsale.setProvider(this.web3.currentProvider);
    this.StudentChain.setProvider(this.web3.currentProvider);
    var err = false;
    var notconnected = false;
    //console.log(this.web3.eth.accounts[1]);
    // Get the initial account balance so it can be displayed
    this.web3.eth.getAccounts((err, accs) => {
          if (err != null){
            err = true;
          } else if ((typeof accs != undefined) && accs.length === 0){
            err = true;
          }
          else {
            console.log(accs);
            this.accounts = accs;
            this.account = this.accounts[0];            
          }
          // This is run from window:load and ZoneJS is nto aware of it we
          // need to use _ngZone.run() so that the UI updates on promise resolution
          this._ngZone.run(() => {
            // Initial loading of UI
            // Load balances or whatever
            //doublecheck if error or not conected 
            if (err){
              this.openMessageDialog('There was an error fetching your accounts. Error connecting to Blockchain.');
            }else if(notconnected) {
              this.openMessageDialog('You are not connected to an Ethereum client. Your can still browse the data, but you will not be able to perform transactions.');
            }else{
              console.log('connected '+this.account);
              this.refreshBalance();
            }
            
          });
    });    
  }

  notifyError(message){
    this.openMessageDialog(message.substring(0,message.indexOf(' at')));
  }

  airDropToken(){
    this.airDropDialogRef = this.dialog.open(AirDropDialogComponent, {
      data: {
        amount: this.defaultamount ? this.defaultamount : ''
      }
    });

    this.airDropDialogRef.afterClosed().pipe(
      filter(amount => amount)
    ).subscribe(amount => {
      this.crowsaleInstance
          .sendTransaction({ from: this.account, value: this.web3.toWei(amount, "ether")})
          .then((receipt) => {
            console.log(receipt);
            var message = 'Your transaction successful.  '
            + '  TxId: '+receipt.tx 

            + '  Block: '+receipt.receipt.blockNumber;
            this.openMessageDialog(message);
          }).catch((err) => {                                
            console.log(err.message);
            this.notifyError(err.message);
          })
      this.refreshBalance();
    });    
  }

  assignInstance(instance:any){
    this.crowsaleInstance = instance;
    console.log(instance);   
    //GustavoCoinCrowdsale.deployed().then(inst => inst.sendTransaction({ from: account1, value: web3.toWei(5, "ether")}))    
    return instance.token().then(
      function(addr){
        return addr;
      }
    );
  }

  assignWalletInstance(addr){
    this.walletInstance = this.StudentChain.at(addr);    
    return this.walletInstance;
  }
  
  walletBalance(walletInstance){
    walletInstance.balanceOf(this.account).then(balance => {      
      console.log('Balance: '+balance.toString(10));
      this.balance = balance;
      return balance.toString(10);
    });
  }

  refreshBalance = () => {
    let meta;
    console.log('refreshing balance');
    let that = this;
    this.Crowdsale.deployed().then(
      (instance) => this.assignInstance(instance)
    ).then(
      (addr) => this.assignWalletInstance(addr)
    ).then(
      (walletInstance) => this.walletBalance(walletInstance)
    );
  };

  setStatus = message => {
    this.status = message;
  };

  ngOnInit() {
    //this.checkAndInstantiateWeb3();
    //this.onReady();
    console.log('window init');
  }

  ngAfterViewInit(){
    this.checkAndInstantiateWeb3();
    //this.onReady();
  }

  ngAfterViewChecked(){

  }

  openMessageDialog(message: string) {    
    this.messageDialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        message: message
      }
    });
  }

  openFileDialog(file?) {
    this.fileNameDialogRef = this.dialog.open(FileNameDialogComponent, {
      data: {
        filename: file ? file.name : ''
      }
    });

    this.fileNameDialogRef.afterClosed().pipe(
      filter(name => name)
    ).subscribe(name => {
      if (file) {
        const index = this.files.findIndex(f => f.name == file.name);
        if (index !== -1) {
          this.files[index] = { name, content: file.content }
        }
      } else {
        this.files.push({ name, content: ''});
      }
    });
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined'){
      
      // trigger dialogbox to notify user that the dapp is using MetaMask or Mist
      // Use Mist/MetaMask's provider
      //this.web3 = new Web3(window.web3.currentProvider);
      //console.warn('Using web3 detected from external source');


      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );      
      console.warn('Falling back to testrpc');
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
    this.Crowdsale.setProvider(this.web3.currentProvider);

    // Get the initial account balance so it can be displayed
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null){
        //trigger material dialog instead
        this.openMessageDialog('There was an error fetching your accounts. Error connecting to Blockchain.');
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
      //this._ngZone.run(() => {
        // Initial loading of UI
        // Load balances or whatever
      //});
    });
  }

}
