pragma solidity ^0.4.17;

import '../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract YourToken is MintableToken {
  string public name = "YourToken";
  string public symbol = "YTC";
  uint8 public decimals = 18;
}
