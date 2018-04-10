pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract EbikeToken is StandardToken {
  string public name = 'EbikeToken';
  string public symbol = 'EBT';
  uint8 public decimals = 2;
  uint public INITIAL_SUPPLY = 21000000;

  function EbikeToken() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }
}
