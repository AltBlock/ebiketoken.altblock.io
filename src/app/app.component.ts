import { HostListener, Component, NgZone, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MessageDialogComponent } from './shared-module/messagedialog/message.dialog';
import {FileNameDialogComponent} from './shared-module/file-name-dialog-component';
import { filter } from 'rxjs/operators';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';

declare var require: any;
declare var window: any;

const Web3 = require('web3');
const contract = require('truffle-contract');

const coinArtifacts = require('../../build/contracts/Migrations.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked{
  coinInstance: any;
  title = 'app';
  Coin = contract(coinArtifacts);

  account: any;
  accounts: any = 0;
  web3: any;
  balance: number = 0;
  status: string;

  messageDialogRef: MatDialogRef<MessageDialogComponent>;
  fileNameDialogRef: MatDialogRef<FileNameDialogComponent>;

  constructor(private _ngZone: NgZone, private dialog: MatDialog){

  }

  files = [
    { name: 'foo.js', content: ''},
    { name: 'bar.js', content: ''}
  ];

  @HostListener('window:load')
  windowLoaded() {
    // Bootstrap the SudCoin abstraction for Use.
    this.Coin.setProvider(this.web3.currentProvider);
    var err = false;
    var notconnected = false;
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
              console.log('connected');
              this.refreshBalance();
            }
            
          });
    });    
  }

  refreshBalance = () => {
    let meta;
    this.Coin
      .deployed()
      .then(instance => {        
        meta = instance;
        //console.log(meta);
        /*
        console.log(meta.getBalance.call(this.account, {
          from: this.account
        }));*/
        //console.log(meta.getBalance(this.account));
        return meta.getBalance.call(this.account, {from: this.account});
        //alert('ddd');
        //return 2;
        /*
        return meta.getBalance.call(this.account, {
          from: this.account
        });*/
        
      })
      .then(value => {
        
        this.balance = value;
        
      })
      .catch((e) => {
        //console.log(e);
        this.setStatus('Error getting balance; see log.');
      });
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
    console.log('dddd');
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
    this.Coin.setProvider(this.web3.currentProvider);

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
