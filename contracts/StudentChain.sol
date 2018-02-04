pragma solidity ^0.4.17;

import '../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract StudentChain is MintableToken {
  string public name = "StudentChain";
  string public symbol = "STC";
  uint8 public decimals = 18;
}