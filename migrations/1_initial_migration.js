var EbikeToken = artifacts.require("./ebiketoken.sol");

module.exports = function(deployer) {
  deployer.deploy(EbikeToken);
};
